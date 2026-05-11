export type Provider = "openai" | "gemini";

export interface ProviderConfig {
  provider: Provider;
  apiKey: string;
  model: string;
  baseUrl: string;
}

const DEFAULT_OPENAI_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_OPENAI_MODEL = "gpt-4o-mini";
const DEFAULT_GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const DEFAULT_GEMINI_MODEL = "gemini-1.5-flash";

export class ProviderConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProviderConfigError";
  }
}

export function resolveProviderConfig(requested?: string): ProviderConfig {
  const envDefault = (process.env.COPYWRITING_PROVIDER ?? "openai").toLowerCase();
  const requestedNormalised = (requested ?? envDefault).toLowerCase();
  const provider: Provider =
    requestedNormalised === "gemini" ? "gemini" : "openai";

  if (provider === "gemini") {
    const apiKey = process.env.GEMINI_API_KEY ?? "";
    if (!apiKey) {
      throw new ProviderConfigError(
        "Gemini provider selected but GEMINI_API_KEY is not configured."
      );
    }
    return {
      provider,
      apiKey,
      model: process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL,
      baseUrl: process.env.GEMINI_BASE_URL || DEFAULT_GEMINI_BASE_URL,
    };
  }

  const apiKey = process.env.OPENAI_API_KEY ?? "";
  if (!apiKey) {
    throw new ProviderConfigError(
      "OpenAI-compatible provider selected but OPENAI_API_KEY is not configured."
    );
  }
  return {
    provider,
    apiKey,
    model: process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL,
    baseUrl: (process.env.OPENAI_BASE_URL || DEFAULT_OPENAI_BASE_URL).replace(/\/$/, ""),
  };
}

interface StreamArgs {
  config: ProviderConfig;
  prompt: string;
  signal?: AbortSignal;
}

export async function streamCompletion({
  config,
  prompt,
  signal,
}: StreamArgs): Promise<Response> {
  if (config.provider === "gemini") {
    return streamGemini({ config, prompt, signal });
  }
  return streamOpenAI({ config, prompt, signal });
}

async function streamOpenAI({
  config,
  prompt,
  signal,
}: StreamArgs): Promise<Response> {
  return fetch(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
      Accept: "text/event-stream",
    },
    body: JSON.stringify({
      model: config.model,
      messages: [{ role: "user", content: prompt }],
      stream: true,
    }),
    signal,
  });
}

async function streamGemini({
  config,
  prompt,
  signal,
}: StreamArgs): Promise<Response> {
  const url =
    `${config.baseUrl.replace(/\/$/, "")}/models/${encodeURIComponent(config.model)}` +
    `:streamGenerateContent?alt=sse&key=${encodeURIComponent(config.apiKey)}`;
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    }),
    signal,
  });
}

export function extractDelta(provider: Provider, rawData: string): string | null {
  try {
    const parsed = JSON.parse(rawData);
    if (provider === "gemini") {
      const candidate = parsed?.candidates?.[0];
      const parts = candidate?.content?.parts ?? [];
      const text = parts
        .map((part: { text?: string }) => part?.text ?? "")
        .join("");
      return text || null;
    }

    const choice = parsed?.choices?.[0];
    const delta = choice?.delta;
    if (!delta) return null;
    const content = delta.content;
    if (typeof content === "string") return content;
    return null;
  } catch {
    return null;
  }
}
