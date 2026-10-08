"use client";

import { Category, ProductFilterParams } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, FormEvent } from "react";
import { Search, SlidersHorizontal, X, ArrowUpDown } from "lucide-react";

interface ProductFiltersProps {
  categories: Category[];
  currentParams: ProductFilterParams;
}

const SIZES = ["S", "M", "L", "XL", "XXL", "All size"];

export function ProductFilters({ categories, currentParams }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(currentParams.q || "");
  const [minPrice, setMinPrice] = useState(currentParams.min_price?.toString() || "");
  const [maxPrice, setMaxPrice] = useState(currentParams.max_price?.toString() || "");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [prevParams, setPrevParams] = useState(currentParams);

  if (
    currentParams.q !== prevParams.q ||
    currentParams.min_price !== prevParams.min_price ||
    currentParams.max_price !== prevParams.max_price
  ) {
    setPrevParams(currentParams);
    setSearch(currentParams.q || "");
    setMinPrice(currentParams.min_price?.toString() || "");
    setMaxPrice(currentParams.max_price?.toString() || "");
  }

  const updateFilters = (newParams: Record<string, string | number | null | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Reset page to 1 when changing filters
    params.set("page", "1");

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, value.toString());
      }
    });

    router.push(`/products?${params.toString()}`);
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateFilters({ q: search.trim() });
  };

  const handlePriceSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateFilters({
      min_price: minPrice ? parseInt(minPrice, 10) : "",
      max_price: maxPrice ? parseInt(maxPrice, 10) : "",
    });
  };

  const handleReset = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    router.push("/products");
  };

  const hasActiveFilters = Boolean(
    currentParams.category ||
    currentParams.size ||
    currentParams.min_price ||
    currentParams.max_price ||
    currentParams.q ||
    currentParams.sort
  );

  return (
    <div className="space-y-6">
      {/* Top Bar: Search + Filter Toggle + Sort */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-xl border border-zinc-200 shadow-xs">
        
        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <input
            type="search"
            placeholder="Cari judul, brand, atau warna..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-50 text-zinc-900 text-xs sm:text-sm rounded-lg pl-9 pr-4 py-2 border border-zinc-200 focus:border-zinc-400 focus:bg-white focus:outline-none"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        </form>

        <div className="flex items-center gap-2">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-white border border-zinc-200 rounded-lg text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter {hasActiveFilters && "•"}</span>
          </button>

          {/* Sort Dropdown */}
          <div className="relative flex items-center">
            <ArrowUpDown className="absolute left-3 pointer-events-none w-3.5 h-3.5 text-zinc-400" />
            <select
              value={currentParams.sort || "newest"}
              onChange={(e) => updateFilters({ sort: e.target.value })}
              className="bg-white text-zinc-900 text-xs rounded-lg pl-8 pr-8 py-2 border border-zinc-200 focus:border-zinc-400 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="newest">Terbaru</option>
              <option value="price_asc">Harga: Termurah</option>
              <option value="price_desc">Harga: Termahal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-zinc-400 font-mono text-[11px]">Active Filters:</span>
          
          {currentParams.q && (
            <span className="inline-flex items-center gap-1 bg-zinc-200 text-zinc-800 px-2.5 py-1 rounded-full">
              Pencarian: &quot;{currentParams.q}&quot;
              <button onClick={() => updateFilters({ q: "" })} aria-label="Hapus filter kata kunci">
                <X className="w-3 h-3 hover:text-red-600" />
              </button>
            </span>
          )}

          {currentParams.category && (
            <span className="inline-flex items-center gap-1 bg-zinc-200 text-zinc-800 px-2.5 py-1 rounded-full capitalize">
              Kategori: {categories.find(c => c.slug === currentParams.category)?.name || currentParams.category}
              <button onClick={() => updateFilters({ category: "" })} aria-label="Hapus filter kategori">
                <X className="w-3 h-3 hover:text-red-600" />
              </button>
            </span>
          )}

          {currentParams.size && (
            <span className="inline-flex items-center gap-1 bg-zinc-200 text-zinc-800 px-2.5 py-1 rounded-full">
              Ukuran: {currentParams.size}
              <button onClick={() => updateFilters({ size: "" })} aria-label="Hapus filter ukuran">
                <X className="w-3 h-3 hover:text-red-600" />
              </button>
            </span>
          )}

          {(currentParams.min_price || currentParams.max_price) && (
            <span className="inline-flex items-center gap-1 bg-zinc-200 text-zinc-800 px-2.5 py-1 rounded-full">
              Harga: Rp{currentParams.min_price || 0} - Rp{currentParams.max_price || "∞"}
              <button onClick={() => updateFilters({ min_price: "", max_price: "" })} aria-label="Hapus filter harga">
                <X className="w-3 h-3 hover:text-red-600" />
              </button>
            </span>
          )}

          <button
            onClick={handleReset}
            className="text-xs text-red-600 hover:underline font-medium ml-1"
          >
            Reset Semua
          </button>
        </div>
      )}

      {/* Desktop Filter Panel / Drawer */}
      <div className={`${showMobileFilters ? "block" : "hidden"} lg:block space-y-6 pt-2`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 sm:p-5 rounded-xl border border-zinc-200 bg-white shadow-xs">
          
          {/* Categories */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
              Kategori
            </h4>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => updateFilters({ category: "" })}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  !currentParams.category
                    ? "bg-zinc-950 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:text-zinc-950"
                }`}
              >
                Semua
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => updateFilters({ category: cat.slug })}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    currentParams.category === cat.slug
                      ? "bg-zinc-950 text-white"
                      : "bg-zinc-100 text-zinc-600 hover:text-zinc-950"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
              Ukuran
            </h4>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => updateFilters({ size: "" })}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  !currentParams.size
                    ? "bg-zinc-950 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:text-zinc-950"
                }`}
              >
                Semua
              </button>
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => updateFilters({ size })}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    currentParams.size === size
                      ? "bg-zinc-950 text-white"
                      : "bg-zinc-100 text-zinc-600 hover:text-zinc-950"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
              Rentang Harga (Rp)
            </h4>
            <form onSubmit={handlePriceSubmit} className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-zinc-50 text-zinc-900 text-xs rounded-md px-2.5 py-1.5 border border-zinc-200"
              />
              <span className="text-zinc-400 text-xs">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-zinc-50 text-zinc-900 text-xs rounded-md px-2.5 py-1.5 border border-zinc-200"
              />
              <button
                type="submit"
                className="bg-zinc-950 text-white text-xs px-3.5 py-1.5 rounded-md font-medium hover:opacity-90 transition-opacity"
              >
                Terapkan
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
