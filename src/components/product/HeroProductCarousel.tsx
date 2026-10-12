"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ArrowRight, MapPin } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import type { ProductListItem } from "@/types";

interface HeroProductCarouselProps {
  products: ProductListItem[];
  intervalMs?: number;
}

export function HeroProductCarousel({
  products,
  intervalMs = 4000,
}: HeroProductCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % products.length);
  }, [products.length]);

  useEffect(() => {
    if (products.length <= 1) return;
    const timer = setInterval(goToNext, intervalMs);
    return () => clearInterval(timer);
  }, [goToNext, intervalMs, products.length]);

  if (!products || products.length === 0) {
    return null;
  }

  const activeProduct = products[activeIndex];
  const imageUrl =
    activeProduct.primary_image?.url ||
    activeProduct.primary_image?.thumbnail_url ||
    null;

  return (
    <div className="relative w-full max-w-sm rounded-2xl border border-brand-border bg-surface shadow-xl overflow-hidden">
      <Link href={`/products/${activeProduct.slug}`} className="block group">
        {/* Photo box */}
        <div className="relative aspect-square w-full bg-background overflow-hidden">
          {imageUrl ? (
            <Image
              key={activeProduct.slug}
              src={imageUrl}
              alt={activeProduct.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 30vw"
              className="object-cover object-center transition-opacity duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-brand-muted text-xs">
              No Image
            </div>
          )}

          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface/90 backdrop-blur-xs flex items-center justify-center text-foreground shadow-xs">
            <Heart className="w-4 h-4" />
          </div>
        </div>

        {/* Info Card */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground line-clamp-1">
              {activeProduct.name}
            </h3>
          </div>

          <p className="text-base font-bold text-brand-primary">
            {formatRupiah(activeProduct.price)}
          </p>

          <div className="flex items-center gap-2">
            <span className="bg-background text-foreground text-xs font-medium px-3 py-1 rounded-full border border-brand-border">
              {activeProduct.condition === "like_new"
                ? "Like New"
                : "Good Condition"}
            </span>
            <span className="bg-brand-primary text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {activeProduct.size_label}
            </span>
          </div>

          <div className="pt-2 border-t border-brand-border flex items-center justify-between text-xs text-brand-muted">
            <span className="flex items-center gap-1 capitalize">
              <span>{activeProduct.category?.name || "Pakaian"}</span>
            </span>
            <ArrowRight className="w-4 h-4 text-brand-primary group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </Link>

      {/* Dots Indicator */}
      {products.length > 1 && (
        <div className="absolute bottom-26 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {products.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.preventDefault();
                setActiveIndex(idx);
              }}
              aria-label={`Lihat produk ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                idx === activeIndex
                  ? "w-5 bg-white"
                  : "w-1.5 bg-white/60 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}