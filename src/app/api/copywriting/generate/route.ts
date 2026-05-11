import { NextRequest, NextResponse } from "next/server";

import { buildPrompt } from "@/lib/copywriting/prompts";
import { getToolBySlug } from "@/lib/copywriting/tools";
import {
  extractDelta,
  ProviderConfigError,
  resolveProviderConfig,
  streamCompletion,
} from "../providers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface GenerateRequestBody {
  tool: string;
  params?: Record<string, string>;
  provider?: string;
}

export async function POST(request: NextRequest) {
  let body: GenerateRequestBody;
  try {
    body = (await request.json()) as GenerateRequestBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { tool: toolSlug, params = {}, provider } = body;

  if (!toolSlug || typeof toolSlug !== "string") {
    return NextResponse.json(
      { error: "Missing required field: tool" },
      { status: 400 }
    );
  }

  const tool = getToolBySlug(toolSlug);
  if (!tool) {
    return NextResponse.json(
      { error: `Unknown tool: ${toolSlug}` },
      { status: 404 }
    );
  }

  const prompt = buildPrompt(toolSlug, params);
  if (!prompt) {
    return NextResponse.json(
      { error: `No prompt template available for tool: ${toolSlug}` },
      { status: 500 }
    );
  }

  let config;
  try {
    config = resolveProviderConfig(provider);
  } catch (error) {
    if (error instanceof ProviderConfigError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    throw error;
  }

  let upstream: Response;
  try {
    upstream = await streamCompletion({ config, prompt });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to call provider";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => "");
    return NextResponse.json(
      {
        error: `Provider error (${upstream.status})`,
        details: text.slice(0, 500),
      },
      { status: 502 }
    );
  }

  const provider_ = config.provider;
  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let separatorIndex = buffer.indexOf("\n\n");
          while (separatorIndex !== -1) {
            const eventBlock = buffer.slice(0, separatorIndex);
            buffer = buffer.slice(separatorIndex + 2);
            separatorIndex = buffer.indexOf("\n\n");

            for (const line of eventBlock.split("\n")) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data:")) continue;
              const data = trimmed.slice(5).trim();
              if (!data || data === "[DONE]") continue;
              const delta = extractDelta(provider_, data);
              if (delta) {
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ content: delta })}\n\n`
                  )
                );
              }
            }
          }
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
        controller.close();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Stream error";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`)
        );
        controller.close();
      }
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
