import { ProductListItem } from "@/types";
import { ProductCard } from "./ProductCard";
import Link from "next/link";
import { RefreshCw, SearchX } from "lucide-react";

interface ProductGridProps {
  products: ProductListItem[];
  emptyTitle?: string;
  emptyDescription?: string;
  onResetFilters?: () => void;
}

export function ProductGrid({
  products,
  emptyTitle = "Belum ada produk yang ditemukan",
  emptyDescription = "Coba ubah kata kunci pencarian atau reset filter untuk melihat koleksi lainnya.",
  onResetFilters,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-brand-border rounded-xl bg-surface my-4 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center text-brand-muted mb-4">
          <SearchX className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-foreground mb-1">
          {emptyTitle}
        </h3>
        <p className="text-xs sm:text-sm text-brand-muted max-w-md mb-6 leading-relaxed">
          {emptyDescription}
        </p>
        {onResetFilters ? (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 text-xs font-semibold bg-brand-primary hover:bg-brand-primary-hover text-white px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Filter</span>
          </button>
        ) : (
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-semibold bg-brand-primary hover:bg-brand-primary-hover text-white px-4 py-2 rounded-lg transition-colors"
          >
            Lihat Semua Katalog
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {products.map((product, index) => (
        <ProductCard
          key={product.slug}
          product={product}
          priority={index < 4}
        />
      ))}
    </div>
  );
}
