export type Provider = "openai" | "gemini";

export interface ProviderConfig {
  provider: Provider;
  apiKey: string;
  model: string;
  baseUrl: string;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const DEFAULT_OPENAI_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_OPENAI_MODEL = "gpt-4o-mini";
const DEFAULT_GEMINI_BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta";
const DEFAULT_GEMINI_MODEL = "gemini-1.5-flash";

export class ProviderConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProviderConfigError";
  }
}

export function resolveProviderConfig(requested?: string): ProviderConfig {
  const envDefault = (
    process.env.COPYWRITING_PROVIDER ?? "openai"
  ).toLowerCase();
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
    baseUrl: (process.env.OPENAI_BASE_URL || DEFAULT_OPENAI_BASE_URL).replace(
      /\/$/,
      ""
    ),
  };
}

interface StreamMessagesArgs {
  config: ProviderConfig;
  system?: string;
  messages: ChatMessage[];
  signal?: AbortSignal;
}

interface StreamPromptArgs {
  config: ProviderConfig;
  prompt: string;
  signal?: AbortSignal;
}

export async function streamOpenAIMessages({
  config,
  system,
  messages,
  signal,
}: StreamMessagesArgs): Promise<Response> {
  const payloadMessages: ChatMessage[] = system
    ? [{ role: "system", content: system }, ...messages]
    : messages;

  return fetch(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
      Accept: "text/event-stream",
    },
    body: JSON.stringify({
      model: config.model,
      messages: payloadMessages,
      stream: true,
    }),
    signal,
  });
}

export async function streamGeminiMessages({
  config,
  system,
  messages,
  signal,
}: StreamMessagesArgs): Promise<Response> {
  const url =
    `${config.baseUrl.replace(/\/$/, "")}/models/${encodeURIComponent(
      config.model
    )}` + `:streamGenerateContent?alt=sse&key=${encodeURIComponent(config.apiKey)}`;

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify({
      ...(system
        ? {
            systemInstruction: {
              parts: [{ text: system }],
            },
          }
        : {}),
      contents: messages.map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: message.content }],
      })),
    }),
    signal,
  });
}

export async function streamCompletion({
  config,
  prompt,
  signal,
}: StreamPromptArgs): Promise<Response> {
  const messages: ChatMessage[] = [{ role: "user", content: prompt }];
  if (config.provider === "gemini") {
    return streamGeminiMessages({ config, messages, signal });
  }
  return streamOpenAIMessages({ config, messages, signal });
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
