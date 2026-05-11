"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

import type { Tool } from "@/lib/copywriting/tools";
import { ToolForm } from "./ToolForm";
import { ToolResult } from "./ToolResult";

interface ToolDetailProps {
  tool: Tool;
}

export function ToolDetail({ tool }: ToolDetailProps) {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    values: Record<string, string>,
    language: string
  ) => {
    setOutput("");
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/copywriting/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: tool.slug,
          params: { ...values, language },
        }),
      });

      if (!response.ok || !response.body) {
        let message = `Request failed (${response.status})`;
        try {
          const body = await response.json();
          if (body?.error) message = body.error;
        } catch {
          /* ignore */
        }
        throw new Error(message);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
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
            if (!data) continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.error) {
                throw new Error(parsed.error);
              }
              if (typeof parsed.content === "string") {
                setOutput((prev) => prev + parsed.content);
              }
            } catch (parseErr) {
              if (parseErr instanceof Error && parseErr.message) {
                throw parseErr;
              }
            }
          }
        }
      }
      toast.success("Generation complete");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Generation failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pb-12">
      <header className="border-b border-slate-200 bg-white">
        <div className="main-container mx-auto px-4 py-5">
          <Link
            href="/copywriting"
            className="text-xs uppercase tracking-wide text-slate-500 hover:text-brand"
          >
            ← All tools
          </Link>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
            <span>{tool.category}</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
            {tool.name}
          </h1>
          <p className="text-sm text-slate-500">{tool.description}</p>
        </div>
      </header>

      <main className="main-container mx-auto grid grid-cols-1 gap-4 px-4 py-6 lg:grid-cols-2">
        <ToolForm tool={tool} onSubmit={handleSubmit} loading={loading} />
        <ToolResult
          toolName={tool.name}
          output={output}
          loading={loading}
          error={error}
        />
      </main>
    </div>
  );
}
