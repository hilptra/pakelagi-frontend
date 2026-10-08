"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, FormEvent, useEffect } from "react";
import { Search, Menu, X, MessageSquare, ArrowRight } from "lucide-react";
import { Category } from "@/types";
import { getCategories } from "@/services/product-service";
import { PakeLagiLogo } from "@/components/ui/PakeLagiLogo";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const paramQ = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(paramQ);
  const [prevParamQ, setPrevParamQ] = useState(paramQ);
  const [categories, setCategories] = useState<Category[]>([]);

  if (paramQ !== prevParamQ) {
    setPrevParamQ(paramQ);
    setSearchQuery(paramQ);
  }

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  // Hide customer navbar on admin routes and login page
  if (pathname.startsWith("/admin") || pathname === "/login") {
    return null;
  }

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    } else {
      router.push("/products");
    }
  };

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/products", label: "Katalog" },
    { href: "/events", label: "Acara" },
    { href: "/about", label: "Tentang" },
  ];

  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281234567890";
  const waClean = waNumber.replace(/[^0-9]/g, "");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E5E7EB] bg-[#F8F7F4]/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          
          {/* Brand Logo (Desktop & Mobile) */}
          <div className="flex items-center gap-8">
            <Link 
              href="/" 
              className="flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <PakeLagiLogo height={38} color="#1E3447" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`transition-colors text-sm hover:text-[#1E3447] ${
                      isActive
                        ? "text-[#1E3447] font-semibold"
                        : "text-[#6B7280]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Categories dropdown */}
              {categories.length > 0 && (
                <div className="relative group py-2">
                  <span className="text-[#6B7280] group-hover:text-[#1E3447] cursor-pointer transition-colors flex items-center gap-1 text-sm font-medium">
                    Kategori
                  </span>
                  <div className="absolute top-full left-0 hidden group-hover:flex flex-col bg-white border border-[#E5E7EB] rounded-2xl shadow-lg py-2 min-w-[170px] z-50">
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/products?category=${cat.slug}`}
                        className="px-4 py-2.5 text-xs font-medium text-[#1F2937] hover:bg-[#F8F7F4] hover:text-[#1E3447] transition-colors capitalize"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </nav>
          </div>

          {/* Search Bar & Desktop Actions */}
          <div className="hidden sm:flex items-center gap-4 flex-1 max-w-sm ml-auto justify-end">
            <form onSubmit={handleSearchSubmit} className="relative w-full max-w-[220px]">
              <input
                type="search"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-[#1F2937] placeholder-[#9CA3AF] text-xs rounded-full pl-9 pr-4 py-2.5 border border-[#E5E7EB] focus:border-[#1E3447] focus:outline-none transition-all shadow-2xs"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF]" />
            </form>

            <a
              href={`https://wa.me/${waClean}?text=${encodeURIComponent("Halo PakeLagi, saya ingin bertanya tentang produk preloved.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#1E3447] hover:bg-[#162735] text-white text-xs font-medium px-5 py-2.5 rounded-full transition-all shadow-sm whitespace-nowrap active:scale-95"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat via WhatsApp</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-3 sm:hidden">
            <a
              href={`https://wa.me/${waClean}?text=${encodeURIComponent("Halo PakeLagi, saya ingin bertanya seputar produk.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-[#1E3447] text-white rounded-full"
              aria-label="WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#1F2937] hover:text-[#1E3447] rounded-lg"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-[#E5E7EB] py-4 space-y-4 bg-white/95 backdrop-blur-md rounded-b-2xl px-2">
            <form onSubmit={handleSearchSubmit} className="relative px-2">
              <input
                type="search"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F8F7F4] text-[#1F2937] text-sm rounded-full pl-9 pr-4 py-2.5 border border-[#E5E7EB]"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            </form>

            <div className="flex flex-col space-y-1 px-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 text-sm rounded-xl font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-[#1E3447] text-white font-bold"
                      : "text-[#1F2937] hover:bg-[#F8F7F4]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {categories.length > 0 && (
                <div className="pt-2 px-2">
                  <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                    Kategori
                  </span>
                  <div className="mt-2 grid grid-cols-2 gap-1.5">
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/products?category=${cat.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-3 py-2 text-xs text-[#1F2937] bg-[#F8F7F4] rounded-lg hover:bg-[#E5E7EB] font-medium capitalize"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-2 pt-2 border-t border-[#E5E7EB]">
              <a
                href={`https://wa.me/${waClean}?text=${encodeURIComponent("Halo PakeLagi, saya ingin bertanya tentang produk preloved.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#1E3447] hover:bg-[#162735] text-white text-sm font-medium py-3 rounded-full w-full transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat via WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
