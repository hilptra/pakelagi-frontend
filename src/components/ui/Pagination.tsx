"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ApiMeta } from "@/types";

interface PaginationProps {
  meta: ApiMeta;
}

export function Pagination({ meta }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = meta.current_page;
  const lastPage = meta.last_page;

  if (lastPage <= 1) return null;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `${pathname}?${params.toString()}`;
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (lastPage <= maxVisible) {
      for (let i = 1; i <= lastPage; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(lastPage - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < lastPage - 2) {
        pages.push("...");
      }

      if (!pages.includes(lastPage)) {
        pages.push(lastPage);
      }
    }

    return pages;
  };

  return (
    <nav className="flex items-center justify-between border-t border-zinc-200 pt-6 mt-8 text-xs">
      <div className="text-zinc-500 font-mono">
        Halaman {currentPage} dari {lastPage} ({meta.total} item)
      </div>

      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        {currentPage > 1 ? (
          <Link
            href={createPageUrl(currentPage - 1)}
            className="inline-flex items-center gap-1 px-3 py-1.5 border border-zinc-200 rounded-md text-zinc-700 hover:bg-zinc-100 transition-colors font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Sebelumnya</span>
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 border border-zinc-200 rounded-md text-zinc-300 cursor-not-allowed">
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Sebelumnya</span>
          </span>
        )}

        {/* Page numbers */}
        <div className="hidden sm:flex items-center gap-1">
          {getPageNumbers().map((page, idx) => {
            if (typeof page === "string") {
              return (
                <span key={`dots-${idx}`} className="px-2 py-1 text-zinc-400">
                  ...
                </span>
              );
            }

            const isCurrent = page === currentPage;
            return (
              <Link
                key={page}
                href={createPageUrl(page)}
                className={`min-w-8 h-8 flex items-center justify-center rounded-md font-mono text-xs transition-colors ${
                  isCurrent
                    ? "bg-zinc-950 text-white font-bold"
                    : "text-zinc-700 hover:bg-zinc-100 border border-transparent"
                }`}
              >
                {page}
              </Link>
            );
          })}
        </div>

        {/* Next Button */}
        {currentPage < lastPage ? (
          <Link
            href={createPageUrl(currentPage + 1)}
            className="inline-flex items-center gap-1 px-3 py-1.5 border border-zinc-200 rounded-md text-zinc-700 hover:bg-zinc-100 transition-colors font-medium"
          >
            <span className="hidden sm:inline">Selanjutnya</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 border border-zinc-200 rounded-md text-zinc-300 cursor-not-allowed">
            <span className="hidden sm:inline">Selanjutnya</span>
            <ChevronRight className="w-4 h-4" />
          </span>
        )}
      </div>
    </nav>
  );
}
