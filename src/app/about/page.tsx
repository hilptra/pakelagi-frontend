import { Metadata } from "next";
import Link from "next/link";
import { MessageSquare, Shirt, ShieldCheck, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Tentang PakeLagi — Platform Katalog Preloved Terkurasi",
  description: "Pelajari bagaimana PakeLagi mengkurasi fashion secondhand berkualitas dan cara bertransaksi langsung via WhatsApp.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full space-y-12 bg-[#fafafa]">
      
      {/* Page Header */}
      <div className="space-y-4 text-center sm:text-left border-b border-zinc-200 pb-8">
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold">
          About PakeLagi
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 leading-tight">
          Fashion Preloved Berkualitas dengan Transparansi Penuh.
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-2xl">
          PakeLagi hadir sebagai platform katalog terkurasi untuk pakaian bekas dan vintage terpilih. Kami percaya bahwa fashion berkualitas tidak harus baru.
        </p>
      </div>

      {/* Core Values / Curation Philosophy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-6 rounded-xl border border-zinc-200 bg-white space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-900">
            <Shirt className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-zinc-950">
            Inspeksi Kondisi Nyata
          </h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Setiap produk diklasifikasikan dengan kondisi Like New, Good, atau Fair lengkap dengan catatan jika ada minus minor.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-zinc-200 bg-white space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-900">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-zinc-950">
            Ukuran Presisi
          </h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Kami mengukur lebar dada, panjang baju, dan pinggang dalam centimeter agar pakaian yang kamu beli pas di badan.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-zinc-200 bg-white space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-zinc-950">
            Komunikasi WhatsApp Direct
          </h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Tanpa pendaftaran rumit atau keranjang belanja. Kamu bertransaksi langsung dengan admin/seller yang responsif.
          </p>
        </div>

      </div>

      {/* How Transaction Works */}
      <div className="space-y-6 pt-6">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-950">
          Bagaimana Cara Bertransaksi di PakeLagi?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2 p-5 rounded-xl border border-zinc-200 bg-white shadow-xs">
            <span className="font-mono text-xs font-bold text-emerald-700">LANGKAH 01</span>
            <h4 className="text-sm font-bold text-zinc-950">Pilih Produk di Katalog</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Jelajahi berbagai pilihan pakaian, gunakan filter ukuran dan kategori yang sesuai dengan gaya kamu.
            </p>
          </div>

          <div className="flex flex-col gap-2 p-5 rounded-xl border border-zinc-200 bg-white shadow-xs">
            <span className="font-mono text-xs font-bold text-emerald-700">LANGKAH 02</span>
            <h4 className="text-sm font-bold text-zinc-950">Klik &quot;Tanya via WhatsApp&quot;</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Pesan terformat otomatis akan berisi nama, harga, dan link produk sehingga seller langsung paham item yang kamu maksud.
            </p>
          </div>

          <div className="flex flex-col gap-2 p-5 rounded-xl border border-zinc-200 bg-white shadow-xs">
            <span className="font-mono text-xs font-bold text-emerald-700">LANGKAH 03</span>
            <h4 className="text-sm font-bold text-zinc-950">Konfirmasi & Pengiriman</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Diskusikan opsi pengiriman dan pembayaran langsung via chat. Setelah deal, barang dikirim ke alamatmu.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action Box */}
      <div className="p-8 rounded-2xl bg-zinc-950 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-lg font-bold">Siap Menemukan Outfit Pilihanmu?</h3>
          <p className="text-xs text-zinc-400">
            Cek koleksi produk terbaru yang siap kirim hari ini.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-white text-zinc-950 font-bold text-xs px-5 py-3 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            <span>Buka Katalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
}
