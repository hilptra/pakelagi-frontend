"use client";

import { MessageSquare, ArrowRight, AlertCircle } from "lucide-react";
import { ProductDetail, ProductListItem } from "@/types";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { useSettings } from "@/contexts/SettingsContext";

interface WhatsAppButtonProps {
  product: ProductDetail | ProductListItem;
  sellerPhone?: string | null;
  className?: string;
}

export function WhatsAppButton({ product, sellerPhone, className = "" }: WhatsAppButtonProps) {
  const { whatsappNumber, loading } = useSettings();
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

  // Prioritaskan nomor seller jika tersedia, atau nomor WhatsApp admin dari settings
  const targetPhone = sellerPhone || (product as { seller_phone?: string }).seller_phone || whatsappNumber;
  const waUrl = targetPhone ? generateWhatsAppLink(product, targetPhone) : null;

  if (!waUrl) {
    return (
      <button
        disabled
        title="Kontak WhatsApp admin belum dikonfigurasi atau sedang tidak tersedia."
        className={`w-full flex items-center justify-center gap-2.5 bg-brand-border/80 text-brand-muted font-medium py-3.5 px-6 rounded-full text-sm cursor-not-allowed ${className}`}
      >
        <AlertCircle className="w-4 h-4 text-brand-muted" />
        <span>{loading ? "Memuat Kontak..." : "Kontak WhatsApp Belum Tersedia"}</span>
      </button>
    );
  }

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-full flex items-center justify-center gap-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white font-medium py-3.5 px-6 rounded-full shadow-md text-sm transition-all transform active:scale-95 ${className}`}
    >
      <MessageSquare className="w-4 h-4" />
      <span>Tanya via WhatsApp</span>
      <ArrowRight className="w-4 h-4 ml-0.5" />
    </a>
  );
}
