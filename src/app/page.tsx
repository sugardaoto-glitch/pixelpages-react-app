import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-pink-500 to-orange-400 p-4 text-white">
      <div className="text-center">
        <h1 className="mb-6 text-5xl font-bold md:text-7xl">
          Buat Halaman Web Indah
          <br />
          dalam Hitungan Menit
        </h1>
        <p className="mb-8 text-xl opacity-90 md:text-2xl">
          PixelPages membantu Anda membuat halaman web profesional tanpa perlu coding.
          <br />
          Pilih template, sesuaikan, dan publish.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/login">
            <Button size="lg" className="bg-white text-pink-500 hover:bg-gray-100">
              Mulai Sekarang
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              size="lg"
              variant="outline"
              className="border-white bg-transparent text-white hover:bg-white/10"
            >
              Daftar Gratis
            </Button>
          </Link>
          <Link href="/copywriting">
            <Button
              size="lg"
              variant="outline"
              className="border-white bg-transparent text-white hover:bg-white/10"
            >
              Copywriting Studio
            </Button>
          </Link>
          <Link href="/generator-kode">
            <Button
              size="lg"
              variant="outline"
              className="border-white bg-transparent text-white hover:bg-white/10"
            >
              Generator Kode AI
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-16 w-full max-w-4xl overflow-hidden rounded-xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 p-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/50" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
            <div className="h-3 w-3 rounded-full bg-green-500/50" />
          </div>
          <div className="flex-1 text-center text-xs opacity-50">pixelpages.io/editor</div>
        </div>
        <div className="relative aspect-video w-full bg-gray-900/50">
          <div className="flex h-full items-center justify-center text-white/20">
            <span className="text-sm">Editor Preview</span>
          </div>
        </div>
      </div>
    </div>
  );
}
