import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center flex flex-col items-center justify-center min-h-[60vh] bg-[#fafafa]">
      <div className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-6 border border-zinc-200">
        <SearchX className="w-7 h-7" />
      </div>

      <h1 className="text-2xl font-bold text-zinc-950 mb-2">
        Halaman atau Produk Tidak Ditemukan
      </h1>

      <p className="text-xs sm:text-sm text-zinc-500 mb-8 leading-relaxed">
        Maaf, produk atau halaman yang kamu cari tidak tersedia atau mungkin sudah dihapus dari katalog.
      </p>

      <Link
        href="/products"
        className="inline-flex items-center gap-2 bg-zinc-950 text-white text-xs font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity shadow-xs"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Katalog Produk</span>
      </Link>
    </div>
  );
}
