import Link from "next/link";
import Image from "next/image";
import { getCategories, getProducts } from "@/services/product-service";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ArrowRight, MessageSquare, ShieldCheck, Shirt, MapPin, Heart } from "lucide-react";
import { Suspense } from "react";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { PakeLagiLogo } from "@/components/ui/PakeLagiLogo";
import { UpcomingEventSection } from "@/components/events/UpcomingEventSection";

export const revalidate = 60; // ISR 60s

async function RecentProductsSection() {
  let products = null;
  try {
    const res = await getProducts({ per_page: 8, sort: "newest" });
    products = res.data;
  } catch {
    products = null;
  }

  if (!products) {
    return (
      <div className="p-8 text-center border border-[#E5E7EB] rounded-2xl bg-white text-[#6B7280] text-xs">
        Gagal memuat produk terbaru. Pastikan server backend aktif.
      </div>
    );
  }

  return (
    <ProductGrid
      products={products}
      emptyTitle="Belum Ada Produk Tersedia"
      emptyDescription="Koleksi produk terbaru sedang disiapkan. Silakan cek kembali nanti."
    />
  );
}

export default async function HomePage() {
  const categories = await getCategories().catch(() => []);
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281234567890";
  const waClean = waNumber.replace(/[^0-9]/g, "");

  return (
    <div className="flex flex-col gap-16 pb-20 bg-[#F8F7F4]">
      
      {/* FULL-SCREEN HERO SECTION BASED ON BRAND GUIDELINE SHEET */}
      <section className="relative w-full min-h-[calc(100vh-5rem)] flex items-center justify-center border-b border-[#E5E7EB] bg-[#F8F7F4] py-12 lg:py-0 overflow-hidden">
        
        {/* Soft background grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#E5E7EB60_1px,transparent_1px),linear-gradient(to_bottom,#E5E7EB60_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col items-start gap-6 text-left">
              
              {/* Brand Custom Logo Header */}
              <div className="mb-2">
                <PakeLagiLogo height={64} color="#1E3447" />
              </div>

              {/* Main Headline from Sheet */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1F2937] leading-[1.15]">
                Pakaian preloved, <br className="hidden sm:inline" />
                <span className="text-[#1E3447]">cerita baru.</span>
              </h1>

              {/* Description from Sheet */}
              <p className="text-base sm:text-lg text-[#6B7280] leading-relaxed max-w-xl font-normal">
                PakeLagi adalah platform katalog dan penjualan pakaian preloved dengan pilihan terbaik untuk kamu.
              </p>

              {/* Badges & Tags Row */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <span className="bg-[#6B7F6B] text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                  Preloved
                </span>
                <span className="bg-white text-[#1F2937] text-xs font-medium px-4 py-1.5 rounded-full border border-[#E5E7EB]">
                  Good Condition
                </span>
                <span className="bg-[#1E3447] text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                  All Sizes
                </span>
              </div>

              {/* Action Buttons Spec */}
              <div className="flex flex-wrap items-center gap-4 pt-4 w-full sm:w-auto">
                <a
                  href={`https://wa.me/${waClean}?text=${encodeURIComponent("Halo PakeLagi, saya tertarik dengan koleksi preloved.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#1E3447] hover:bg-[#162735] text-white font-medium text-sm px-8 py-4 rounded-full shadow-md transition-all active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Tanya via WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <Link
                  href="/products"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#1E3447] border border-[#1E3447] font-semibold text-sm px-7 py-4 rounded-full hover:bg-[#F8F7F4] transition-colors"
                >
                  <span>Lihat Katalog</span>
                </Link>
              </div>

            </div>

            {/* Right Side: Product Card Showcase Mockup matching Sheet */}
            <div className="lg:col-span-5 relative w-full flex items-center justify-center">
              <div className="relative w-full max-w-sm rounded-2xl border border-[#E5E7EB] bg-white shadow-xl overflow-hidden">
                
                {/* Photo box */}
                <div className="relative aspect-square w-full bg-[#F8F7F4]">
                  <Image
                    src="https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop"
                    alt="Vintage Denim Jacket"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 30vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#1F2937] shadow-xs">
                    <Heart className="w-4 h-4" />
                  </div>
                </div>

                {/* Info Card Spec */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-[#1F2937]">Vintage Denim Jacket</h3>
                  </div>
                  
                  <p className="text-base font-bold text-[#1E3447]">Rp 150.000</p>

                  <div className="flex items-center gap-2">
                    <span className="bg-[#F8F7F4] text-[#1F2937] text-xs font-medium px-3 py-1 rounded-full border border-[#E5E7EB]">
                      Good Condition
                    </span>
                    <span className="bg-[#1E3447] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      L
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#6B7280]">
                    <span className="flex items-center gap-1">
                      <span>Outerwear</span>
                      <span>•</span>
                      <MapPin className="w-3 h-3 text-[#6B7280]" />
                      <span>Jakarta</span>
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#1E3447]" />
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Category Discovery Pills */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                Pilih Berdasarkan Kategori
              </h2>
              <Link
                href="/products"
                className="text-xs font-semibold text-[#1E3447] hover:underline flex items-center gap-1"
              >
                <span>Lihat Semua Kategori</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/products?category=${cat.slug}`}
                  className="group flex flex-col p-5 rounded-2xl border border-[#E5E7EB] bg-white hover:border-[#1E3447] hover:shadow-sm transition-all"
                >
                  <span className="text-sm font-bold text-[#1F2937] group-hover:text-[#1E3447] transition-colors capitalize">
                    {cat.name}
                  </span>
                  <span className="text-xs text-[#6B7280] mt-1">
                    Koleksi {cat.name.toLowerCase()} terkurasi
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured / New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col gap-6">
          <div className="flex items-end justify-between border-b border-[#E5E7EB] pb-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#6B7F6B] font-bold">
                Koleksi Terkini
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937] mt-1">
                Baju Preloved Pilihan
              </h2>
            </div>

            <Link
              href="/products"
              className="text-xs font-semibold text-[#1E3447] hover:underline flex items-center gap-1.5"
            >
              <span>Lihat Katalog Lengkap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Suspense fallback={<ProductGridSkeleton count={8} />}>
            <RecentProductsSection />
          </Suspense>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] bg-white">
          
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-[#F8F7F4] border border-[#E5E7EB] text-[#1E3447] shrink-0">
              <Shirt className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#1F2937]">
                Deskripsi & Ukuran Jujur
              </h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Setiap pakaian dilengkapi detail kondisi nyata, foto presisi, dan tabel ukuran lingkar/panjang.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-[#F8F7F4] border border-[#E5E7EB] text-[#1E3447] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#1F2937]">
                Pakaian Bersih & Kurasi
              </h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Hanya produk layak pakai dengan standar kebersihan tinggi yang ditampilkan di katalog.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-[#E7DCC8]/40 border border-[#E7DCC8] text-[#1E3447] shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#1F2937]">
                Tanya Direct via WhatsApp
              </h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Langsung terhubung dengan admin untuk bertanya detail atau menyelesaikan transaksi dengan ramah.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Upcoming Events Editorial Section */}
      <UpcomingEventSection />

    </div>
  );
}
