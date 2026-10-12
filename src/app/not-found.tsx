import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center flex flex-col items-center justify-center min-h-[60vh] bg-background">
      <div className="w-14 h-14 rounded-full bg-surface flex items-center justify-center text-brand-muted mb-6 border border-brand-border">
        <SearchX className="w-7 h-7" />
      </div>

      <h1 className="text-2xl font-bold text-foreground mb-2">
        Halaman atau Produk Tidak Ditemukan
      </h1>

      <p className="text-xs sm:text-sm text-brand-muted mb-8 leading-relaxed">
        Maaf, produk atau halaman yang kamu cari tidak tersedia atau mungkin sudah dihapus dari katalog.
      </p>

      <Link
        href="/products"
        className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-xs"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Katalog Produk</span>
      </Link>
    </div>
  );
}
