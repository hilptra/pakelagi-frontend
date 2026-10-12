import Image from "next/image";
import Link from "next/link";
import { ProductListItem } from "@/types";
import { formatRupiah, getConditionLabel } from "@/lib/utils";
import { Heart, ArrowRight } from "lucide-react";

interface ProductCardProps {
  product: ProductListItem;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const imageUrl = product.primary_image?.url || product.primary_image?.thumbnail_url || null;
  const isSold = product.status === "sold";

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col rounded-2xl border border-brand-border bg-surface overflow-hidden transition-all duration-300 hover:border-brand-primary hover:shadow-md"
    >
      {/* Product Image Box */}
      <div className="relative aspect-square w-full bg-background overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className={`object-cover object-center transition-transform duration-300 group-hover:scale-105 ${
              isSold ? "grayscale opacity-75" : ""
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-background text-brand-muted p-4 text-center">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-muted">No Image</span>
          </div>
        )}

        {/* Top Right Heart Action Icon */}
        <div className="absolute top-3 right-3 z-10">
          <div className="w-8 h-8 rounded-full bg-surface/90 backdrop-blur-xs flex items-center justify-center text-foreground hover:text-brand-primary
          
          transition-colors shadow-2xs">
            <Heart className="w-4 h-4" />
          </div>
        </div>

        {/* Status Overlay Badges */}
        {isSold && (
          <div className="absolute top-3 left-3 bg-foreground text-background text-[11px] font-semibold px-3 py-1 rounded-full shadow-xs">
            Terjual
          </div>
        )}
      </div>

      {/* Product Details Content */}
      <div className="p-4 flex flex-col flex-1 gap-2.5">
        
        {/* Title */}
        <h3 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-brand-primary transition-colors">
          {product.name}
        </h3>

        {/* Price */}
        <p className="text-base font-bold text-foreground">
          {formatRupiah(product.price)}
        </p>

        {/* Badges Row */}
        <div className="flex items-center gap-2 pt-1 flex-wrap">
          {/* Condition Badge */}
          <span className="inline-flex items-center gap-1 bg-background text-foreground text-[11px] font-medium px-2.5 py-1 rounded-full border border-brand-border">
            <span>{getConditionLabel(product.condition)}</span>
          </span>

          {/* Size Badge */}
          <span className="inline-flex items-center justify-center bg-brand-primary text-white text-[11px] font-semibold px-2.5 py-1 rounded-full min-w-6">
            {product.size_label}
          </span>
        </div>

        {/* Footer Category + Arrow */}
        <div className="mt-auto pt-3 border-t border-brand-border flex items-center justify-between text-xs text-brand-muted">
          <span className="capitalize font-medium text-[11px]">
            {product.category?.name || "Pakaian"}
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-brand-muted group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all" />
        </div>

      </div>
    </Link>
  );
}