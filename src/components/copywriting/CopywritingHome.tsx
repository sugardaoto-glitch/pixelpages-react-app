"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { CATEGORIES, TOOLS, type Tool } from "@/lib/copywriting/tools";
import { CategoryTabs } from "./CategoryTabs";
import { ToolCard } from "./ToolCard";

const ALL = "All";

function matchesQuery(tool: Tool, query: string): boolean {
  if (!query) return true;
  const needle = query.toLowerCase();
  return (
    tool.name.toLowerCase().includes(needle) ||
    tool.description.toLowerCase().includes(needle) ||
    tool.category.toLowerCase().includes(needle)
  );
}

export function CopywritingHome() {
  const [activeCategory, setActiveCategory] = useState<string>(ALL);
  const [query, setQuery] = useState("");

  const grouped = useMemo(() => {
    const map = new Map<string, Tool[]>();
    for (const category of CATEGORIES) {
      const tools = TOOLS.filter(
        (tool) =>
          tool.category === category &&
          (activeCategory === ALL || activeCategory === category) &&
          matchesQuery(tool, query)
      );
      if (tools.length > 0) map.set(category, tools);
    }
    return map;
  }, [activeCategory, query]);

  const totalMatches = useMemo(
    () => Array.from(grouped.values()).reduce((sum, list) => sum + list.length, 0),
    [grouped]
  );

  return (
    <div className="min-h-screen bg-[#fafafa] pb-16">
      <header className="border-b border-slate-200 bg-white">
        <div className="main-container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-5">
          <div>
            <Link href="/" className="text-xs uppercase tracking-wide text-slate-500 hover:text-brand">
              ← Back to PixelPages
            </Link>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
              Copywriting Studio
            </h1>
            <p className="text-sm text-slate-500">
              AI-powered copywriting tools for e-commerce — generate listings, ads,
              replies, and more.
            </p>
          </div>
          <div className="text-xs text-slate-400">
            {TOOLS.length} tools available
          </div>
        </div>
      </header>

      <main className="main-container mx-auto px-4 py-6">
        <div className="mb-5 max-w-xl">
          <Input
            placeholder="Search tools by name or description..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <CategoryTabs active={activeCategory} onChange={setActiveCategory} />

        {totalMatches === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
            No tools match your search.
          </div>
        )}

        {Array.from(grouped.entries()).map(([category, tools]) => (
          <section key={category} className="mb-8">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
              {category}
            </h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
