"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  getAdminProducts,
  deleteProduct,
  markProductSold,
  changeProductStatus,
} from "@/services/admin-product-service";
import { formatRupiah, getConditionLabel, getStatusBadge } from "@/lib/utils";
import type { AdminProductListItem, AdminProductFilters } from "@/types/admin";
import type { ApiMeta } from "@/types";
import { ApiError } from "@/lib/api-client";
import {
  Plus,
  Search,
  Package,
  Eye,
  EyeOff,
  Trash2,
  Pencil,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  ShoppingBag,
} from "lucide-react";

type StatusFilter = "" | "available" | "sold" | "hidden";

export default function AdminProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State from URL params
  const initialPage = Number(searchParams.get("page")) || 1;
  const initialQ = searchParams.get("q") || "";
  const initialStatus = (searchParams.get("status") || "") as StatusFilter;

  const [products, setProducts] = useState<AdminProductListItem[]>([]);
  const [meta, setMeta] = useState<ApiMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState(initialQ);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(initialStatus);
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<AdminProductListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadProducts = useCallback(
    async (filters: AdminProductFilters) => {
      setIsLoading(true);
      setErrorMsg(null);
      try {
        const res = await getAdminProducts({
          page: filters.page || 1,
          per_page: 15,
          q: filters.q || undefined,
          status: filters.status || undefined,
          sort: filters.sort || undefined,
        });
        setProducts(res.data);
        setMeta(res.meta);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          router.replace("/admin/login");
          return;
        }
        setErrorMsg("Gagal memuat produk. Coba muat ulang halaman.");
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  // Sync URL params
  const updateUrl = useCallback(
    (page: number, q: string, status: StatusFilter) => {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (status) params.set("status", status);
      if (page > 1) params.set("page", String(page));
      const qs = params.toString();
      router.replace(`/admin/products${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router],
  );

  // Initial + filter change load
  useEffect(() => {
    loadProducts({ page: currentPage, q: searchInput, status: statusFilter || undefined });
    updateUrl(currentPage, searchInput, statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusFilter]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadProducts({ page: 1, q: searchInput, status: statusFilter || undefined });
    updateUrl(1, searchInput, statusFilter);
  };

  const handleStatusFilterChange = (status: StatusFilter) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const clearMessages = () => {
    setSuccessMsg(null);
    setErrorMsg(null);
  };

  // ── Actions ─────────────────────────────────────────────────────────

  const handleMarkSold = async (product: AdminProductListItem) => {
    clearMessages();
    try {
      await markProductSold(product.id);
      setSuccessMsg(`"${product.name}" ditandai terjual.`);
      loadProducts({ page: currentPage, q: searchInput, status: statusFilter || undefined });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal menandai terjual.");
    }
  };

  const handleToggleStatus = async (
    product: AdminProductListItem,
    newStatus: "available" | "hidden",
  ) => {
    clearMessages();
    try {
      await changeProductStatus(product.id, newStatus);
      const label = newStatus === "available" ? "ditampilkan" : "disembunyikan";
      setSuccessMsg(`"${product.name}" berhasil ${label}.`);
      loadProducts({ page: currentPage, q: searchInput, status: statusFilter || undefined });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal mengubah status.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    clearMessages();
    try {
      await deleteProduct(deleteTarget.id);
      setSuccessMsg(`"${deleteTarget.name}" berhasil dihapus.`);
      setDeleteTarget(null);
      loadProducts({ page: currentPage, q: searchInput, status: statusFilter || undefined });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal menghapus produk.");
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Status filter tabs ──────────────────────────────────────────────

  const statusTabs: { value: StatusFilter; label: string; activeClass: string }[] = [
    { value: "", label: "Semua", activeClass: "bg-[#1E3447] text-white" },
    { value: "available", label: "Tersedia", activeClass: "bg-emerald-700 text-white" },
    { value: "sold", label: "Terjual", activeClass: "bg-[#1E3447] text-white" },
    { value: "hidden", label: "Tersembunyi", activeClass: "bg-amber-700 text-white" },
  ];

  return (
    <>
      <AdminPageHeader
        title="Produk"
        description="Kelola katalog produk PakeLagi."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Produk" },
        ]}
        actions={
          <Link
            href="/admin/products/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#1E3447] hover:bg-[#162735] rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Produk
          </Link>
        }
      />

      {/* Feedback messages */}
      {errorMsg && (
        <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="mb-4 p-3 rounded-lg border border-[#A7BFA7] bg-[#A7BFA7]/20 text-[#1E3447] text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4 bg-white p-3 rounded-lg border border-[#E5E7EB]">
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <input
            type="search"
            placeholder="Cari nama, brand, atau deskripsi..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-[#F8F7F4] text-[#1F2937] text-xs rounded-lg pl-9 pr-4 py-2.5 border border-[#E5E7EB] focus:border-[#1E3447] focus:bg-white focus:outline-none transition-colors"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
        </form>

        <div className="flex items-center gap-1 overflow-x-auto">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleStatusFilterChange(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                statusFilter === tab.value
                  ? tab.activeClass
                  : "bg-[#F8F7F4] text-[#6B7280] hover:text-[#1F2937]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products table */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-6 h-6 border-2 border-[#1E3447] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-[#6B7280]">Memuat produk...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Package className="w-8 h-8 text-[#9CA3AF] mx-auto" />
            <p className="text-sm font-semibold text-[#1F2937]">
              Tidak ada produk ditemukan
            </p>
            <p className="text-xs text-[#6B7280]">
              {searchInput || statusFilter
                ? "Coba ubah kata kunci atau filter."
                : "Mulai dengan menambahkan produk pertama."}
            </p>
            {!searchInput && !statusFilter && (
              <Link
                href="/admin/products/create"
                className="inline-flex items-center gap-1.5 mt-2 px-4 py-2 text-xs font-semibold text-white bg-[#1E3447] rounded-lg hover:bg-[#162735]"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Produk
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F7F4] border-b border-[#E5E7EB] text-[#6B7280]">
                <tr>
                  <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wide">
                    Produk
                  </th>
                  <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wide">
                    Harga
                  </th>
                  <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wide hidden md:table-cell">
                    Ukuran / Kondisi
                  </th>
                  <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wide">
                    Status
                  </th>
                  <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wide text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {products.map((product) => {
                  const badge = getStatusBadge(product.status);
                  const imgUrl =
                    product.primary_image?.thumbnail_url ||
                    product.primary_image?.url ||
                    null;

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-[#F8F7F4]/60 transition-colors"
                    >
                      {/* Product */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-md overflow-hidden bg-[#F8F7F4] border border-[#E5E7EB] shrink-0">
                            {imgUrl ? (
                              <Image
                                src={imgUrl}
                                alt={product.name}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-4 h-4 text-[#9CA3AF]" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/admin/products/${product.id}`}
                              className="text-xs font-semibold text-[#1F2937] hover:text-[#1E3447] hover:underline truncate block"
                            >
                              {product.name}
                            </Link>
                            <span className="text-[11px] text-[#6B7280]">
                              {product.category?.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-semibold text-[#1F2937] whitespace-nowrap">
                        {formatRupiah(product.price)}
                      </td>

                      {/* Size / Condition */}
                      <td className="py-3 px-4 hidden md:table-cell">
                        <div className="flex items-center gap-1.5">
                          <span className="bg-[#1E3447] text-white font-bold text-[10px] px-2 py-0.5 rounded-full">
                            {product.size_label}
                          </span>
                          <span className="text-[11px] text-[#6B7280]">
                            {getConditionLabel(product.condition)}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badge.color}`}
                        >
                          {badge.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          {/* Edit */}
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="p-1.5 text-[#6B7280] hover:text-[#1E3447] hover:bg-[#F8F7F4] rounded-md transition-colors"
                            title="Edit produk"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Link>

                          {/* Mark Sold */}
                          {product.status === "available" && (
                            <button
                              onClick={() => handleMarkSold(product)}
                              className="p-1.5 text-[#6B7280] hover:text-[#1E3447] hover:bg-[#E7DCC8]/30 rounded-md transition-colors"
                              title="Tandai terjual"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Toggle visibility */}
                          {product.status === "available" && (
                            <button
                              onClick={() =>
                                handleToggleStatus(product, "hidden")
                              }
                              className="p-1.5 text-[#6B7280] hover:text-amber-700 hover:bg-amber-50 rounded-md transition-colors"
                              title="Sembunyikan"
                            >
                              <EyeOff className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {product.status === "hidden" && (
                            <button
                              onClick={() =>
                                handleToggleStatus(product, "available")
                              }
                              className="p-1.5 text-[#6B7280] hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                              title="Tampilkan"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteTarget(product)}
                            className="p-1.5 text-[#6B7280] hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Hapus produk"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="p-3 border-t border-[#E5E7EB] bg-[#F8F7F4] flex items-center justify-between text-xs text-[#6B7280]">
            <span>
              {meta.from}–{meta.to} dari {meta.total} produk
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-1.5 bg-white border border-[#E5E7EB] rounded-md disabled:opacity-40 hover:bg-[#F8F7F4] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-medium">
                {meta.current_page} / {meta.last_page}
              </span>
              <button
                disabled={currentPage >= meta.last_page}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-1.5 bg-white border border-[#E5E7EB] rounded-md disabled:opacity-40 hover:bg-[#F8F7F4] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        variant="danger"
        title="Hapus produk?"
        description={`Apakah kamu yakin ingin menghapus "${deleteTarget?.name}"? Semua foto produk juga akan dihapus. Tindakan ini tidak bisa dibatalkan.`}
        confirmLabel="Hapus"
        cancelLabel="Batal"
        loading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
