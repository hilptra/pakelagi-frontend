"use client";

import { useSettings } from "@/contexts/SettingsContext";
import { MessageSquare, ArrowRight, AlertCircle } from "lucide-react";

export function HeroWhatsAppButton() {
  const { getCustomWhatsAppUrl, loading } = useSettings();
  const waUrl = getCustomWhatsAppUrl("Halo PakeLagi, saya tertarik dengan koleksi preloved.");

  if (!waUrl) {
    return (
      <button
        disabled
        title="Kontak WhatsApp admin belum dikonfigurasi."
        className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-brand-border/80 text-brand-muted font-medium text-sm px-8 py-4 rounded-full cursor-not-allowed shadow-xs"
      >
        <AlertCircle className="w-4 h-4" />
        <span>{loading ? "Memuat Kontak..." : "Kontak WhatsApp Belum Tersedia"}</span>
      </button>
    );
  }

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-brand-primary hover:bg-brand-primary-hover text-white font-medium text-sm px-8 py-4 rounded-full shadow-md transition-all active:scale-95"
    >
      <MessageSquare className="w-4 h-4" />
      <span>Tanya via WhatsApp</span>
      <ArrowRight className="w-4 h-4" />
    </a>
  );
}

