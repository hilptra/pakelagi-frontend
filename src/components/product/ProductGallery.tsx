"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductImage } from "@/types";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const primaryIndex = images.findIndex((img) => img.is_primary);
  const initialIndex = primaryIndex !== -1 ? primaryIndex : 0;
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  if (images.length === 0) {
    return (
      <div className="aspect-square w-full bg-background rounded-xl flex flex-col items-center justify-center text-brand-muted p-6 text-center border border-brand-border">
        <span className="text-xs font-mono uppercase tracking-widest text-brand-muted">Tidak ada foto produk</span>
      </div>
    );
  }

  const selectedImage = images[selectedIndex] || images[0];

  return (
    <div className="flex flex-col gap-4">
      {/* Main Active Image Container */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-background border border-brand-border shadow-sm">
        <Image
          src={selectedImage.url}
          alt={`${productName} - Foto ${selectedIndex + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center transition-all duration-300"
        />
      </div>

      {/* Thumbnails list */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {images.map((img, index) => {
            const isSelected = index === selectedIndex;
            return (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`relative aspect-square w-16 sm:w-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                  isSelected
                    ? "border-brand-primary opacity-100 scale-95 shadow-xs"
                    : "border-transparent opacity-60 hover:opacity-95"
                }`}
              >
                <Image
                  src={img.thumbnail_url || img.url}
                  alt={`${productName} thumbnail ${index + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover object-center"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
