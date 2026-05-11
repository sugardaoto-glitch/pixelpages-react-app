import { NextRequest, NextResponse } from "next/server";

import {
  buildSystemPrompt,
  buildOptimizePromptInstruction,
  buildUpdateInstruction,
} from "@/lib/code-generator/prompts";
import {
  extractDelta,
  ProviderConfigError,
  resolveProviderConfig,
  streamGeminiMessages,
  streamOpenAIMessages,
  type ChatMessage,
} from "@/lib/ai/providers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RequestMode = "create" | "update" | "optimize";

interface GenerateRequestBody {
  mode: RequestMode;
  prompt: string;
  useShadcn?: boolean;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
  referenceText?: string;
  provider?: string;
}

function buildMessages(body: GenerateRequestBody): {
  system?: string;
  messages: ChatMessage[];
} {
  const { mode, prompt, useShadcn = true, history = [], referenceText } = body;

  if (mode === "optimize") {
    return {
      messages: [
        {
          role: "user",
          content: buildOptimizePromptInstruction(prompt),
        },
      ],
    };
  }

  const system = buildSystemPrompt(useShadcn);
  const previousMessages: ChatMessage[] = history.map((entry) => ({
    role: entry.role,
    content: entry.content,
  }));

  if (mode === "update") {
    previousMessages.push({
      role: "user",
      content: buildUpdateInstruction(prompt, referenceText),
    });
  } else {
    previousMessages.push({ role: "user", content: prompt });
  }

  return { system, messages: previousMessages };
}

export async function POST(request: NextRequest) {
  let body: GenerateRequestBody;
  try {
    body = (await request.json()) as GenerateRequestBody;
  } catch {
    return NextResponse.json(
      { error: "Body JSON tidak valid" },
      { status: 400 }
    );
  }

  if (!body.prompt || typeof body.prompt !== "string") {
    return NextResponse.json(
      { error: "Field 'prompt' wajib diisi" },
      { status: 400 }
    );
  }

  if (!["create", "update", "optimize"].includes(body.mode)) {
    return NextResponse.json(
      { error: `Mode tidak dikenali: ${body.mode}` },
      { status: 400 }
    );
  }

  let config;
  try {
    config = resolveProviderConfig(body.provider);
  } catch (error) {
    if (error instanceof ProviderConfigError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    throw error;
  }

  const { system, messages } = buildMessages(body);

  let upstream: Response;
  try {
    upstream =
      config.provider === "gemini"
        ? await streamGeminiMessages({ config, system, messages })
        : await streamOpenAIMessages({ config, system, messages });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal memanggil provider";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => "");
    return NextResponse.json(
      {
        error: `Provider mengembalikan kesalahan (${upstream.status})`,
        details: text.slice(0, 500),
      },
      { status: 502 }
    );
  }

  const provider = config.provider;
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
              const delta = extractDelta(provider, data);
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
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
        );
        controller.close();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Kesalahan streaming";
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


