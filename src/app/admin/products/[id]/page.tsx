"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  getAdminProduct,
  deleteProduct,
  markProductSold,
  changeProductStatus,
} from "@/services/admin-product-service";
import type { AdminProduct } from "@/types/admin";
import { formatRupiah, getConditionLabel, getStatusBadge, formatMeasurementKey } from "@/lib/utils";
import {
  Edit3,
  Trash2,
  CheckCircle,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  Tag,
  Ruler,
  Calendar,
  Layers,
  Image as ImageIcon,
} from "lucide-react";

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = Number(params?.id);

  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      if (!productId || isNaN(productId)) {
        setErrorMsg("ID Produk tidak valid.");
        setLoading(false);
        return;
      }

      try {
        const data = await getAdminProduct(productId);
        setProduct(data);
        if (data.images && data.images.length > 0) {
          const primary = data.images.find((i) => i.is_primary) || data.images[0];
          setSelectedImage(primary.url);
        }
      } catch (err: any) {
        console.error("Failed to load product detail:", err);
        setErrorMsg(err.message || "Gagal memuat rincian produk.");
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

  const handleMarkSold = async () => {
    if (!product) return;
    setActionLoading(true);
    try {
      const updated = await markProductSold(product.id);
      setProduct(updated);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal memperbarui status ke Terjual.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!product) return;
    setActionLoading(true);
    const targetStatus = product.status === "available" ? "hidden" : "available";
    try {
      const updated = await changeProductStatus(product.id, targetStatus);
      setProduct(updated);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal mengubah visibilitas produk.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    setActionLoading(true);
    try {
      await deleteProduct(product.id);
      router.push("/admin/products");
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menghapus produk.");
      setActionLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <Loader2 className="w-8 h-8 text-[#1E3447] animate-spin mx-auto" />
        <p className="text-sm text-[#6B7280]">Memuat rincian produk...</p>
      </div>
    );
  }

  if (!product || errorMsg) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="text-lg font-medium text-[#1E3447]">Produk Tidak Ditemukan</h3>
        <p className="text-sm text-[#6B7280]">{errorMsg || "Data tidak dapat diakses."}</p>
        <Link
          href="/admin/products"
          className="inline-flex items-center px-4 py-2 bg-[#1E3447] text-white rounded-lg text-sm font-medium hover:bg-[#1E3447]/90"
        >
          Kembali ke Daftar Produk
        </Link>
      </div>
    );
  }

  const statusBadge = getStatusBadge(product.status);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={product.name}
        description={`ID: #${product.id} • Slug: ${product.slug}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Produk", href: "/admin/products" },
          { label: product.name },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/admin/products/${product.id}/edit`}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#E5E7EB] text-[#1F2937] hover:bg-slate-50 text-xs font-medium rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4 text-[#6B7280]" />
              Edit Produk
            </Link>

            {product.status !== "sold" && (
              <button
                onClick={handleMarkSold}
                disabled={actionLoading}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 text-white hover:bg-slate-900 text-xs font-medium rounded-lg disabled:opacity-50 transition-colors"
              >
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Tandai Terjual
              </button>
            )}

            {product.status !== "sold" && (
              <button
                onClick={handleToggleStatus}
                disabled={actionLoading}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#E5E7EB] text-[#1F2937] hover:bg-slate-50 text-xs font-medium rounded-lg disabled:opacity-50 transition-colors"
              >
                {product.status === "available" ? (
                  <>
                    <EyeOff className="w-4 h-4 text-amber-600" />
                    Sembunyikan
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 text-emerald-600" />
                    Tampilkan
                  </>
                )}
              </button>
            )}

            <button
              onClick={() => setDeleteDialogOpen(true)}
              disabled={actionLoading}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-medium rounded-lg disabled:opacity-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Hapus
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-3">
            <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-slate-100 border border-[#E5E7EB]">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#6B7280]">
                  <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                  <span className="text-xs">Tidak ada foto</span>
                </div>
              )}
              <span
                className={`absolute top-2 left-2 px-2.5 py-1 text-xs font-medium rounded-full border shadow-sm ${statusBadge.color}`}
              >
                {statusBadge.label}
              </span>
            </div>

            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.url)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === img.url
                        ? "border-[#1E3447] ring-2 ring-[#1E3447]/20"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                    {img.is_primary && (
                      <span className="absolute bottom-0 inset-x-0 bg-[#1E3447] text-white text-[9px] text-center font-medium py-0.5">
                        Utama
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Detailed Product Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Attributes */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 space-y-6">
            <div>
              <span className="text-xs font-semibold text-[#6B7F6B] uppercase tracking-wider">
                {product.category?.name || "Kategori Terhapus"}
              </span>
              <h2 className="text-2xl font-bold text-[#1E3447] mt-1">{product.name}</h2>
              <div className="text-2xl font-semibold text-[#1E3447] mt-2">
                {formatRupiah(product.price)}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E5E7EB]">
              <div>
                <span className="text-xs text-[#6B7280]">Ukuran</span>
                <p className="text-sm font-semibold text-[#1F2937]">{product.size_label}</p>
              </div>

              <div>
                <span className="text-xs text-[#6B7280]">Kondisi</span>
                <p className="text-sm font-semibold text-[#1F2937]">
                  {getConditionLabel(product.condition)}
                </p>
              </div>

              <div>
                <span className="text-xs text-[#6B7280]">Merek / Brand</span>
                <p className="text-sm font-semibold text-[#1F2937]">
                  {product.brand || "-"}
                </p>
              </div>
            </div>

            {product.condition_notes && (
              <div className="p-3 bg-amber-50/50 border border-amber-200/60 rounded-lg text-xs text-amber-900">
                <span className="font-semibold">Catatan Kondisi: </span>
                {product.condition_notes}
              </div>
            )}

            {product.description && (
              <div className="space-y-1.5 pt-4 border-t border-[#E5E7EB]">
                <h3 className="text-xs font-semibold text-[#1F2937] uppercase tracking-wider">
                  Deskripsi Produk
                </h3>
                <p className="text-sm text-[#1F2937]/90 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}
          </div>

          {/* Measurements */}
          {product.measurements && Object.keys(product.measurements).length > 0 && (
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-[#1E3447]">
                <Ruler className="w-4 h-4 text-[#6B7F6B]" />
                <h3 className="text-sm font-semibold">Dimensi / Ukuran Fisik</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(product.measurements).map(([key, val]) => (
                  <div key={key} className="p-2.5 bg-slate-50 border border-[#E5E7EB] rounded-lg">
                    <span className="text-xs text-[#6B7280] block">
                      {formatMeasurementKey(key)}
                    </span>
                    <span className="text-sm font-bold text-[#1E3447]">{val} cm</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#6B7280]">
            <div>
              <span className="block font-medium text-[#1F2937]">Tanggal Ditambahkan</span>
              <span>{new Date(product.created_at).toLocaleString("id-ID")}</span>
            </div>
            <div>
              <span className="block font-medium text-[#1F2937]">Terakhir Diperbarui</span>
              <span>{new Date(product.updated_at).toLocaleString("id-ID")}</span>
            </div>
            {product.sold_at && (
              <div>
                <span className="block font-medium text-emerald-700">Tanggal Terjual</span>
                <span className="text-emerald-700">
                  {new Date(product.sold_at).toLocaleString("id-ID")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Hapus Produk?"
        description={`Apakah Anda yakin ingin menghapus "${product.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus Produk"
        variant="danger"
        loading={actionLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
}
