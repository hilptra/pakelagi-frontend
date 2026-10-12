import { Metadata } from "next";
import Link from "next/link";
import { MessageSquare, Shirt, ShieldCheck, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Tentang PakeLagi — Platform Katalog Preloved Terkurasi",
  description: "Pelajari bagaimana PakeLagi mengkurasi fashion secondhand berkualitas dan cara bertransaksi langsung via WhatsApp.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full space-y-12 bg-background">
      
      {/* Page Header */}
      <div className="space-y-4 text-center sm:text-left border-b border-brand-border pb-8">
        <span className="text-xs font-mono uppercase tracking-widest text-brand-secondary font-bold">
          About PakeLagi
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
          Fashion Preloved Berkualitas dengan Transparansi Penuh.
        </h1>
        <p className="text-sm sm:text-base text-brand-muted leading-relaxed max-w-2xl">
          PakeLagi hadir sebagai platform katalog terkurasi untuk pakaian bekas dan vintage terpilih. Kami percaya bahwa fashion berkualitas tidak harus baru.
        </p>
      </div>

      {/* Core Values / Curation Philosophy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-6 rounded-xl border border-brand-border bg-surface space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center text-foreground">
            <Shirt className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-foreground">
            Inspeksi Kondisi Nyata
          </h3>
          <p className="text-xs text-brand-muted leading-relaxed">
            Setiap produk diklasifikasikan dengan kondisi Like New, Good, atau Fair lengkap dengan catatan jika ada minus minor.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-brand-border bg-surface space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center text-foreground">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-foreground">
            Ukuran Presisi
          </h3>
          <p className="text-xs text-brand-muted leading-relaxed">
            Kami mengukur lebar dada, panjang baju, dan pinggang dalam centimeter agar pakaian yang kamu beli pas di badan.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-brand-border bg-surface space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-brand-secondary/15 flex items-center justify-center text-brand-secondary">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-foreground">
            Komunikasi WhatsApp Direct
          </h3>
          <p className="text-xs text-brand-muted leading-relaxed">
            Tanpa pendaftaran rumit atau keranjang belanja. Kamu bertransaksi langsung dengan admin/seller yang responsif.
          </p>
        </div>

      </div>

      {/* How Transaction Works */}
      <div className="space-y-6 pt-6">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          Bagaimana Cara Bertransaksi di PakeLagi?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2 p-5 rounded-xl border border-brand-border bg-surface shadow-xs">
            <span className="font-mono text-xs font-bold text-brand-secondary">LANGKAH 01</span>
            <h4 className="text-sm font-bold text-foreground">Pilih Produk di Katalog</h4>
            <p className="text-xs text-brand-muted leading-relaxed">
              Jelajahi berbagai pilihan pakaian, gunakan filter ukuran dan kategori yang sesuai dengan gaya kamu.
            </p>
          </div>

          <div className="flex flex-col gap-2 p-5 rounded-xl border border-brand-border bg-surface shadow-xs">
            <span className="font-mono text-xs font-bold text-brand-secondary">LANGKAH 02</span>
            <h4 className="text-sm font-bold text-foreground">Klik &quot;Tanya via WhatsApp&quot;</h4>
            <p className="text-xs text-brand-muted leading-relaxed">
              Pesan terformat otomatis akan berisi nama, harga, dan link produk sehingga seller langsung paham item yang kamu maksud.
            </p>
          </div>

          <div className="flex flex-col gap-2 p-5 rounded-xl border border-brand-border bg-surface shadow-xs">
            <span className="font-mono text-xs font-bold text-brand-secondary">LANGKAH 03</span>
            <h4 className="text-sm font-bold text-foreground">Konfirmasi & Pengiriman</h4>
            <p className="text-xs text-brand-muted leading-relaxed">
              Diskusikan opsi pengiriman dan pembayaran langsung via chat. Setelah deal, barang dikirim ke alamatmu.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action Box */}
      <div className="p-8 rounded-2xl bg-brand-primary text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-lg font-bold">Siap Menemukan Outfit Pilihanmu?</h3>
          <p className="text-xs text-white/80">
            Cek koleksi produk terbaru yang siap kirim hari ini.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-surface text-brand-primary font-bold text-xs px-5 py-3 rounded-lg hover:bg-background transition-colors"
          >
            <span>Buka Katalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
}
