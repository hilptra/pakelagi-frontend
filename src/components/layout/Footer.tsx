"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { PakeLagiLogo } from "@/components/ui/PakeLagiLogo";

export function Footer() {
  const pathname = usePathname();

  // Hide customer footer on admin routes and login page
  if (pathname.startsWith("/admin") || pathname === "/login") {
    return null;
  }

  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281234567890";
  const waClean = waNumber.replace(/[^0-9]/g, "");

  return (
    <footer className="w-full border-t border-[#E5E7EB] bg-white text-[#1F2937] text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 lg:gap-12">
          
          {/* Brand & Tagline */}
          <div className="space-y-3 max-w-sm">
            <Link href="/" className="inline-block">
              <PakeLagiLogo height={44} color="#1E3447" />
            </Link>
            <p className="text-sm font-medium text-[#1F2937]">
              Pakaian preloved, cerita baru.
            </p>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              PakeLagi adalah platform katalog dan penjualan pakaian preloved dengan pilihan terbaik untuk kamu.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 text-sm font-medium text-[#1F2937]">
            <Link href="/" className="hover:text-[#1E3447] transition-colors">
              Beranda
            </Link>
            <Link href="/products" className="hover:text-[#1E3447] transition-colors">
              Katalog
            </Link>
            <Link href="/products?category=outer" className="hover:text-[#1E3447] transition-colors">
              Kategori
            </Link>
            <Link href="/about" className="hover:text-[#1E3447] transition-colors">
              Tentang
            </Link>
          </div>

          {/* Social Icons matching sheet */}
          <div className="flex items-center gap-3">
            {/* Instagram SVG */}
            <a
              href="https://www.instagram.com/pakelagi.works/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram PakeLagi"
              className="p-2.5 rounded-full border border-[#E5E7EB] text-[#1F2937] hover:bg-[#F8F7F4] hover:text-[#1E3447] transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            {/* TikTok SVG */}
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok PakeLagi"
              className="p-2.5 rounded-full border border-[#E5E7EB] text-[#1F2937] hover:bg-[#F8F7F4] hover:text-[#1E3447] transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.525 2.17h3.023c.123 1.139.63 2.176 1.408 2.946.78.77 1.83 1.267 2.986 1.34v3.1c-1.573-.016-3.033-.538-4.246-1.43v7.48c0 3.902-3.18 7.063-7.103 7.063-3.923 0-7.103-3.16-7.103-7.063 0-3.902 3.18-7.063 7.103-7.063.42 0 .835.037 1.238.11v3.18a4.015 4.015 0 0 0-1.238-.196c-2.19 0-3.966 1.764-3.966 3.94 0 2.177 1.776 3.94 3.966 3.94 2.19 0 3.966-1.763 3.966-3.94V2.17z"/>
              </svg>
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${waClean}?text=${encodeURIComponent("Halo PakeLagi!")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp PakeLagi"
              className="p-2.5 rounded-full border border-[#E5E7EB] text-[#1F2937] hover:bg-[#F8F7F4] hover:text-[#1E3447] transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
            </a>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="mt-12 pt-8 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B7280]">
          <p>© 2025 PakeLagi. All rights reserved.</p>
          
          <div className="font-serif italic text-sm text-[#1E3447] tracking-wide font-medium">
            Good Clothes Better Stories
          </div>
        </div>
      </div>
    </footer>
  );
}
