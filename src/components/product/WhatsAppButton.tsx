"use client";

import { MessageSquare, ArrowRight } from "lucide-react";
import { ProductDetail, ProductListItem } from "@/types";
import { generateWhatsAppLink } from "@/lib/whatsapp";

interface WhatsAppButtonProps {
  product: ProductDetail | ProductListItem;
  className?: string;
}

export function WhatsAppButton({ product, className = "" }: WhatsAppButtonProps) {
  const isSold = product.status === "sold";

  if (isSold) {
    return (
      <button
        disabled
        className={`w-full flex items-center justify-center gap-2 bg-brand-border text-brand-muted py-3.5 px-6 rounded-full font-semibold text-sm cursor-not-allowed ${className}`}
      >
        <span>Produk Sudah Terjual</span>
      </button>
    );
  }

  const waUrl = generateWhatsAppLink(product);

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-full flex items-center justify-center gap-2.5 bg-brand-primary hover:bg-[#162735] text-white font-medium py-3.5 px-6 rounded-full shadow-md text-sm transition-all transform active:scale-95 ${className}`}
    >
      <MessageSquare className="w-4 h-4" />
      <span>Tanya via WhatsApp</span>
      <ArrowRight className="w-4 h-4 ml-0.5" />
    </a>
  );
}
