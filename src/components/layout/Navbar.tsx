"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, FormEvent, useEffect } from "react";
import { Search, Menu, X, MessageSquare, ArrowRight } from "lucide-react";
import { Category } from "@/types";
import { getCategories } from "@/services/product-service";
import { PakeLagiLogo } from "@/components/ui/PakeLagiLogo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

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

  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6289501085225";
  const waClean = waNumber.replace(/[^0-9]/g, "");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-brand-border bg-background/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          
          {/* Brand Logo (Desktop & Mobile) */}
          <div className="flex items-center gap-8">
            <Link 
              href="/" 
              className="flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <PakeLagiLogo height={38} className="text-brand-primary" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`transition-colors text-sm hover:text-brand-primary ${
                      isActive
                        ? "text-brand-primary font-semibold"
                        : "text-brand-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Categories dropdown */}
              {categories.length > 0 && (
                <div className="relative group py-2">
                  <span className="text-brand-muted group-hover:text-brand-primary cursor-pointer transition-colors flex items-center gap-1 text-sm font-medium">
                    Kategori
                  </span>
                  <div className="absolute top-full left-0 hidden group-hover:flex flex-col bg-surface border border-brand-border rounded-2xl shadow-lg py-2 min-w-42.5 z-50">
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/products?category=${cat.slug}`}
                        className="px-4 py-2.5 text-xs font-medium text-foreground hover:bg-background hover:text-brand-primary transition-colors capitalize"
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
          <div className="hidden sm:flex items-center gap-3 ml-auto justify-end">
            <form onSubmit={handleSearchSubmit} className="relative w-full max-w-50">
              <input
                type="search"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface text-foreground placeholder-brand-muted text-xs rounded-full pl-9 pr-4 py-2.5 border border-brand-border focus:border-brand-primary focus:outline-none transition-all shadow-2xs"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-muted" />
            </form>

            <a
              href={`https://wa.me/${waClean}?text=${encodeURIComponent("Halo PakeLagi, saya ingin bertanya tentang produk preloved.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-medium px-4 py-2.5 rounded-full transition-all shadow-sm whitespace-nowrap active:scale-95"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat via WhatsApp</span>
              <ArrowRight className="w-3 h-3" />
            </a>

            <ThemeToggle />
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 sm:hidden">
            <ThemeToggle />

            <a
              href={`https://wa.me/${waClean}?text=${encodeURIComponent("Halo PakeLagi, saya ingin bertanya seputar produk.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-brand-primary text-white rounded-full"
              aria-label="WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-foreground hover:text-brand-primary rounded-lg"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-brand-border py-4 space-y-4 bg-surface/95 backdrop-blur-md rounded-b-2xl px-2">
            <form onSubmit={handleSearchSubmit} className="relative px-2">
              <input
                type="search"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background text-foreground text-sm rounded-full pl-9 pr-4 py-2.5 border border-brand-border"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
            </form>

            <div className="flex flex-col space-y-1 px-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 text-sm rounded-xl font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-brand-primary text-white font-bold"
                      : "text-foreground hover:bg-background"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {categories.length > 0 && (
                <div className="pt-2 px-2">
                  <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
                    Kategori
                  </span>
                  <div className="mt-2 grid grid-cols-2 gap-1.5">
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/products?category=${cat.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-3 py-2 text-xs text-foreground bg-background rounded-lg hover:bg-brand-border font-medium capitalize"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-2 pt-2 border-t border-brand-border">
              <a
                href={`https://wa.me/${waClean}?text=${encodeURIComponent("Halo PakeLagi, saya ingin bertanya tentang produk preloved.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-medium py-3 rounded-full w-full transition-colors"
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
