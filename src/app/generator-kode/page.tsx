import type { Metadata } from "next";

import { CodeGeneratorClient } from "@/components/code-generator/CodeGeneratorClient";

export const metadata: Metadata = {
  title: "Generator Kode AI · PixelPages",
  description:
    "Hasilkan komponen React lengkap dengan pratinjau langsung dari deskripsi bahasa Indonesia.",
};

export default function GeneratorKodePage() {
  return <CodeGeneratorClient />;
}
