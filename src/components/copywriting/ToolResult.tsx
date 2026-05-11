"use client";

import { useCallback } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";

interface ToolResultProps {
  toolName: string;
  output: string;
  loading: boolean;
  error?: string | null;
}

export function ToolResult({ toolName, output, loading, error }: ToolResultProps) {
  const handleCopy = useCallback(async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Copy failed");
    }
  }, [output]);

  return (
    <div className="flex h-full flex-col rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 p-4">
        <div>
          <div className="text-sm font-bold text-slate-900">Result</div>
          <div className="text-xs text-slate-500">{toolName}</div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopy}
          disabled={!output || loading}
        >
          Copy
        </Button>
      </div>
      <div className="min-h-[300px] flex-1 overflow-y-auto p-4 text-sm leading-relaxed text-slate-800">
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-red-700">
            {error}
          </div>
        )}
        {!error && !output && !loading && (
          <p className="text-slate-400">
            Fill in the form and click {`"`}Generate{`"`} to produce results here.
          </p>
        )}
        {!error && !output && loading && (
          <p className="text-slate-400">Generating...</p>
        )}
        {!error && output && (
          <pre className="whitespace-pre-wrap break-words font-sans">{output}</pre>
        )}
      </div>
    </div>
  );
}
