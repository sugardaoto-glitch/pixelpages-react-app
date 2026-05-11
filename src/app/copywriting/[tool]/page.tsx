import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ToolDetail } from "@/components/copywriting/ToolDetail";
import { TOOLS, getToolBySlug } from "@/lib/copywriting/tools";

interface ToolPageProps {
  params: Promise<{ tool: string }>;
}

export function generateStaticParams() {
  return TOOLS.map((tool) => ({ tool: tool.slug }));
}

export async function generateMetadata(
  { params }: ToolPageProps
): Promise<Metadata> {
  const { tool: slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) {
    return { title: "Copywriting Studio · PixelPages" };
  }
  return {
    title: `${tool.name} · Copywriting Studio · PixelPages`,
    description: tool.description,
  };
}

export default async function CopywritingToolPage({ params }: ToolPageProps) {
  const { tool: slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) {
    notFound();
  }
  return <ToolDetail tool={tool} />;
}
