import type { Metadata } from "next";

import { CopywritingHome } from "@/components/copywriting/CopywritingHome";

export const metadata: Metadata = {
  title: "Copywriting Studio · PixelPages",
  description:
    "AI-powered e-commerce copywriting tools. Generate listings, ads, customer replies, and more.",
};

export default function CopywritingPage() {
  return <CopywritingHome />;
}
