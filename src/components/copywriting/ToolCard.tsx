"use client";

import Link from "next/link";

import type { Tool } from "@/lib/copywriting/tools";

interface ToolCardProps {
  tool: Tool;
}

const iconForCategory: Record<string, string> = {
  Products: "P",
  Marketing: "M",
  "Customer Service": "C",
  Advertising: "A",
  Other: "O",
};

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link
      href={`/copywriting/${tool.slug}`}
      className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-dark text-lg font-bold text-white">
        {iconForCategory[tool.category] ?? tool.name.charAt(0)}
      </div>
      <div className="min-w-0">
        <div className="truncate text-base font-semibold text-slate-900">
          {tool.name}
        </div>
        <p className="ellipsis-multi-line mt-1 text-xs text-slate-500">
          {tool.description}
        </p>
      </div>
    </Link>
  );
}
