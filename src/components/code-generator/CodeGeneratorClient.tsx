"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MESSAGES } from "@/lib/code-generator/messages";
import { cn, getLocalStorage, setLocalStorage } from "@/lib/utils";

import { CodeSandbox } from "./CodeSandbox";

const STORAGE_KEYS = {
  prompt: "code-generator:prompt",
  shadcn: "code-generator:use-shadcn",
};

type Status = "idle" | "creating" | "updating" | "ready" | "error";

type HistoryItem = { role: "user" | "assistant"; content: string };

interface StreamResult {
  text: string;
}

function stripCodeFence(text: string): string {
  let result = text.trim();

  // If a triple-backtick fence appears anywhere, extract the first fenced block.
  // The closing fence may not exist yet while streaming — treat everything after
  // the opening fence as code in that case.
  const openIdx = result.indexOf("```");
  if (openIdx !== -1) {
    const afterFence = result.slice(openIdx + 3);
    const nlIdx = afterFence.indexOf("\n");
    let inside = nlIdx !== -1 ? afterFence.slice(nlIdx + 1) : afterFence;
    const closeIdx = inside.lastIndexOf("```");
    if (closeIdx !== -1) {
      inside = inside.slice(0, closeIdx);
    }
    return inside.trim();
  }

  // No fences — strip any narration prefix before the first JS/TS-looking token.
  const codeStart = result.search(
    /(^|\n)\s*(import\s|const\s|let\s|var\s|export\s|function\s|class\s|"use\s|'use\s|\/\/|\/\*)/
  );
  if (codeStart > 0) {
    result = result.slice(codeStart).replace(/^\n+/, "");
  }

  return result.trim();
}

export function CodeGeneratorClient() {
  const [prompt, setPrompt] = useState("");
  const [updatePrompt, setUpdatePrompt] = useState("");
  const [useShadcn, setUseShadcn] = useState(true);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [optimizingCreate, setOptimizingCreate] = useState(false);
  const [optimizingUpdate, setOptimizingUpdate] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const savedPrompt = getLocalStorage(STORAGE_KEYS.prompt);
    if (savedPrompt) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPrompt(savedPrompt);
    }
    const savedShadcn = getLocalStorage(STORAGE_KEYS.shadcn);
    if (savedShadcn === "false") {
      setUseShadcn(false);
    }
  }, []);

  useEffect(() => {
    setLocalStorage(STORAGE_KEYS.prompt, prompt);
  }, [prompt]);

  useEffect(() => {
    setLocalStorage(STORAGE_KEYS.shadcn, String(useShadcn));
  }, [useShadcn]);

  const isWorking = status === "creating" || status === "updating";
  const hasCode = code.trim().length > 0;

  const streamRequest = useCallback(
    async (
      mode: "create" | "update" | "optimize",
      input: {
        prompt: string;
        history?: HistoryItem[];
      },
      onDelta?: (delta: string) => void
    ): Promise<StreamResult> => {
      const controller = new AbortController();
      abortRef.current = controller;

      const response = await fetch("/api/code-generator/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          prompt: input.prompt,
          useShadcn,
          history: input.history ?? [],
        }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        let message = `Permintaan gagal (${response.status})`;
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
      let collected = "";

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
                collected += parsed.content;
                onDelta?.(parsed.content);
              }
            } catch (err) {
              if (err instanceof Error && err.message) {
                throw err;
              }
            }
          }
        }
      }

      return { text: collected };
    },
    [useShadcn]
  );

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError(MESSAGES.emptyPromptError);
      return;
    }
    setError(null);
    setStatus("creating");
    setCode("");
    setView("preview");

    let accumulated = "";
    try {
      await streamRequest(
        "create",
        { prompt: prompt.trim() },
        (delta) => {
          accumulated += delta;
          setCode(stripCodeFence(accumulated));
        }
      );
      const finalCode = stripCodeFence(accumulated);
      setCode(finalCode);
      setHistory([
        { role: "user", content: prompt.trim() },
        { role: "assistant", content: finalCode },
      ]);
      setStatus("ready");
      toast.success(MESSAGES.generationSuccess);
    } catch (err) {
      const message = err instanceof Error ? err.message : MESSAGES.generationFailed;
      setError(message);
      setStatus("error");
      toast.error(message);
    } finally {
      abortRef.current = null;
    }
  };

  const handleUpdate = async () => {
    if (!updatePrompt.trim()) {
      toast.error(MESSAGES.emptyPromptError);
      return;
    }
    setError(null);
    setStatus("updating");

    let accumulated = "";
    try {
      await streamRequest(
        "update",
        {
          prompt: updatePrompt.trim(),
          history,
        },
        (delta) => {
          accumulated += delta;
          setCode(stripCodeFence(accumulated));
        }
      );
      const finalCode = stripCodeFence(accumulated);
      setCode(finalCode);
      setHistory((prev) => [
        ...prev,
        { role: "user", content: updatePrompt.trim() },
        { role: "assistant", content: finalCode },
      ]);
      setUpdatePrompt("");
      setStatus("ready");
      toast.success(MESSAGES.updateSuccess);
    } catch (err) {
      const message = err instanceof Error ? err.message : MESSAGES.generationFailed;
      setError(message);
      setStatus("error");
      toast.error(message);
    } finally {
      abortRef.current = null;
    }
  };

  const handleOptimize = async (target: "create" | "update") => {
    const value = target === "create" ? prompt : updatePrompt;
    if (!value.trim()) {
      toast.error(MESSAGES.emptyPromptError);
      return;
    }
    if (target === "create") setOptimizingCreate(true);
    else setOptimizingUpdate(true);

    try {
      let accumulated = "";
      await streamRequest(
        "optimize",
        { prompt: value.trim() },
        (delta) => {
          accumulated += delta;
          if (target === "create") setPrompt(accumulated);
          else setUpdatePrompt(accumulated);
        }
      );
      toast.success(MESSAGES.optimizeSuccess);
    } catch (err) {
      const message = err instanceof Error ? err.message : MESSAGES.optimizeFailed;
      toast.error(message);
    } finally {
      if (target === "create") setOptimizingCreate(false);
      else setOptimizingUpdate(false);
    }
  };

  const handleClear = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setCode("");
    setHistory([]);
    setStatus("idle");
    setError(null);
    setUpdatePrompt("");
  };

  const handleCopy = useCallback(async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      toast.success(MESSAGES.copySuccess);
    } catch {
      toast.error(MESSAGES.copyFailed);
    }
  }, [code]);

  const statusBanner = useMemo(() => {
    if (status === "creating") return MESSAGES.resultGenerating;
    if (status === "updating") return MESSAGES.resultUpdating;
    return null;
  }, [status]);

  return (
    <div className="min-h-screen bg-[#fafafa] pb-12">
      <header className="border-b border-slate-200 bg-white">
        <div className="main-container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-5">
          <div>
            <Link
              href="/"
              className="text-xs uppercase tracking-wide text-slate-500 hover:text-brand"
            >
              {MESSAGES.backToHome}
            </Link>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
              {MESSAGES.pageTitle}
            </h1>
            <p className="text-sm text-slate-500">{MESSAGES.pageSubtitle}</p>
          </div>
        </div>
      </header>

      <main className="main-container mx-auto grid grid-cols-1 gap-4 px-4 py-6 lg:grid-cols-[420px_minmax(0,1fr)]">
        <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
          <div className="space-y-1.5">
            <Label htmlFor="prompt">{MESSAGES.promptLabel}</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder={MESSAGES.promptPlaceholder}
              className="min-h-32"
              disabled={isWorking}
            />
            <p className="text-xs text-slate-500">{MESSAGES.promptHelp}</p>
          </div>

          <div className="flex items-start gap-2">
            <input
              id="use-shadcn"
              type="checkbox"
              checked={useShadcn}
              onChange={(event) => setUseShadcn(event.target.checked)}
              disabled={isWorking}
              className="mt-1 h-4 w-4 cursor-pointer accent-purple-600"
            />
            <div className="flex flex-col">
              <Label
                htmlFor="use-shadcn"
                className="cursor-pointer text-sm font-medium"
              >
                {MESSAGES.shadcnLabel}
              </Label>
              <p className="text-xs text-slate-500">{MESSAGES.shadcnHint}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={isWorking || !prompt.trim()}
            >
              {status === "creating" ? MESSAGES.generatingButton : MESSAGES.generateButton}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOptimize("create")}
              disabled={isWorking || optimizingCreate || !prompt.trim()}
            >
              {optimizingCreate
                ? MESSAGES.optimizingPromptButton
                : MESSAGES.optimizePromptButton}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleClear}
              disabled={isWorking && status === "creating"}
            >
              {MESSAGES.clearButton}
            </Button>
          </div>

          <div className="space-y-2 rounded-md border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {MESSAGES.examplePrompts}
            </p>
            <ul className="space-y-1.5">
              {MESSAGES.examples.map((example) => (
                <li key={example}>
                  <button
                    type="button"
                    onClick={() => setPrompt(example)}
                    disabled={isWorking}
                    className="text-left text-xs text-slate-700 hover:text-brand disabled:opacity-50"
                  >
                    {example}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {(hasCode || status === "ready") && (
            <div className="space-y-1.5 border-t border-slate-200 pt-4">
              <Label htmlFor="update-prompt">{MESSAGES.updatePromptLabel}</Label>
              <Input
                id="update-prompt"
                value={updatePrompt}
                onChange={(event) => setUpdatePrompt(event.target.value)}
                placeholder={MESSAGES.updatePromptPlaceholder}
                disabled={isWorking}
              />
              <div className="flex flex-wrap gap-2 pt-1">
                <Button
                  type="button"
                  onClick={handleUpdate}
                  disabled={isWorking || !updatePrompt.trim()}
                >
                  {status === "updating"
                    ? MESSAGES.updatingButton
                    : MESSAGES.updateButton}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOptimize("update")}
                  disabled={isWorking || optimizingUpdate || !updatePrompt.trim()}
                >
                  {optimizingUpdate
                    ? MESSAGES.optimizingPromptButton
                    : MESSAGES.optimizePromptButton}
                </Button>
              </div>
            </div>
          )}
        </section>

        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex overflow-hidden rounded-md border border-slate-200 bg-white">
              <button
                type="button"
                onClick={() => setView("preview")}
                className={cn(
                  "px-4 py-1.5 text-sm",
                  view === "preview"
                    ? "bg-brand text-white"
                    : "text-slate-700 hover:bg-slate-100"
                )}
              >
                {MESSAGES.tabPreview}
              </button>
              <button
                type="button"
                onClick={() => setView("code")}
                className={cn(
                  "px-4 py-1.5 text-sm",
                  view === "code"
                    ? "bg-brand text-white"
                    : "text-slate-700 hover:bg-slate-100"
                )}
              >
                {MESSAGES.tabCode}
              </button>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={!hasCode || isWorking}
            >
              {MESSAGES.copyButton}
            </Button>
          </div>

          {statusBanner && (
            <div className="rounded-md border border-brand bg-brand/5 px-3 py-2 text-sm text-brand">
              {statusBanner}
            </div>
          )}

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              <strong className="mr-1">{MESSAGES.resultErrorTitle}:</strong>
              {error}
            </div>
          )}

          <CodeSandbox code={code} useShadcn={useShadcn} activeView={view} />
        </section>
      </main>
    </div>
  );
}
