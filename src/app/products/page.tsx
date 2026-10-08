import { Metadata } from "next";
import { getCategories, getProducts } from "@/services/product-service";
import { ProductFilterParams } from "@/types";
import { ProductFilters } from "@/components/product/ProductFilters";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Pagination } from "@/components/ui/Pagination";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Katalog Pakaian Preloved Terkurasi",
  description: "Browse koleksi baju, outer, celana, dan aksesori secondhand terkurasi dengan kondisi transparan di PakeLagi.",
};

export const dynamic = "force-dynamic";

interface CatalogPageProps {
  searchParams: Promise<{
    category?: string;
    size?: string;
    min_price?: string;
    max_price?: string;
    q?: string;
    sort?: "newest" | "price_asc" | "price_desc";
    page?: string;
    per_page?: string;
  }>;
}

async function CatalogContent({ searchParams }: CatalogPageProps) {
  const resolvedSearchParams = await searchParams;

  const currentParams: ProductFilterParams = {
    category: resolvedSearchParams.category,
    size: resolvedSearchParams.size,
    min_price: resolvedSearchParams.min_price ? parseInt(resolvedSearchParams.min_price, 10) : undefined,
    max_price: resolvedSearchParams.max_price ? parseInt(resolvedSearchParams.max_price, 10) : undefined,
    q: resolvedSearchParams.q,
    sort: resolvedSearchParams.sort,
    page: resolvedSearchParams.page ? parseInt(resolvedSearchParams.page, 10) : 1,
    per_page: resolvedSearchParams.per_page ? parseInt(resolvedSearchParams.per_page, 10) : 12,
  };

  const [categories, productsResponse] = await Promise.all([
    getCategories().catch(() => []),
    getProducts(currentParams).catch((err) => {
      console.error("Error fetching products:", err);
      return null;
    }),
  ]);

  if (!productsResponse) {
    return (
      <div className="space-y-6">
        <ProductFilters categories={categories} currentParams={currentParams} />
        <div className="p-12 text-center border border-red-200 bg-red-50 rounded-xl text-red-700 text-sm">
          <p className="font-semibold">Gagal memuat data produk.</p>
          <p className="text-xs mt-1 text-red-600">
            Pastikan koneksi internet stabil dan server backend aktif.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ProductFilters categories={categories} currentParams={currentParams} />

      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
          <span>
            Menampilkan {productsResponse.meta.from || 0} - {productsResponse.meta.to || 0} dari {productsResponse.meta.total} produk
          </span>
        </div>

        <ProductGrid products={productsResponse.data} />
      </div>

      <Pagination meta={productsResponse.meta} />
    </div>
  );
}

export default function CatalogPage(props: CatalogPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full bg-[#fafafa]">
      <div className="space-y-6">
        {/* Catalog Header */}
        <div className="border-b border-zinc-200 pb-5">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950">
            Katalog Preloved
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-xl">
            Temukan fashion bekas terkurasi dengan kondisi jujur. Klik pada produk untuk melihat detail dan menghubungi penjual via WhatsApp.
          </p>
        </div>

        {/* Catalog Content with Skeletons */}
        <Suspense fallback={<ProductGridSkeleton count={12} />}>
          <CatalogContent searchParams={props.searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
