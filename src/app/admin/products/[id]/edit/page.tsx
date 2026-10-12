"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getAdminCategories } from "@/services/admin-category-service";
import { getAdminProduct, updateProduct } from "@/services/admin-product-service";
import {
  uploadProductImages,
  setPrimaryImage,
  deleteProductImage,
} from "@/services/admin-image-service";
import type { AdminCategory, AdminProduct, AdminProductImage } from "@/types/admin";
import type { ConditionType } from "@/types";
import { ApiError } from "@/lib/api-client";
import { Loader2, Trash2, Upload, Star, AlertTriangle } from "lucide-react";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = Number(params?.id);

  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imageActionLoading, setImageActionLoading] = useState<number | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [brand, setBrand] = useState("");
  const [sizeLabel, setSizeLabel] = useState("");
  const [condition, setCondition] = useState<ConditionType>("good");
  const [conditionNotes, setConditionNotes] = useState("");
  const [measurements, setMeasurements] = useState<Record<string, number | "">>({});

  // Existing images from API
  const [images, setImages] = useState<AdminProductImage[]>([]);

  useEffect(() => {
    async function loadData() {
      if (!productId || isNaN(productId)) {
        setErrorMsg("ID Produk tidak valid.");
        setLoading(false);
        return;
      }

      try {
        const [catsData, prodData] = await Promise.all([
          getAdminCategories(),
          getAdminProduct(productId),
        ]);

        setCategories(catsData);
        setProduct(prodData);

        // Pre-fill form
        setName(prodData.name);
        setDescription(prodData.description || "");
        setPrice(prodData.price);
        setCategoryId(prodData.category_id);
        setBrand(prodData.brand || "");
        setSizeLabel(prodData.size_label);
        setCondition(prodData.condition);
        setConditionNotes(prodData.condition_notes || "");
        setImages(prodData.images || []);

        if (prodData.measurements) {
          const m: Record<string, number | ""> = {};
          Object.entries(prodData.measurements).forEach(([k, v]) => {
            m[k] = typeof v === "number" ? v : "";
          });
          setMeasurements(m);
        }
      } catch (err: any) {
        console.error("Failed to load product data:", err);
        setErrorMsg(err.message || "Gagal memuat data produk.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [productId]);

  const selectedCategory = categories.find((c) => c.id === Number(categoryId));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !productId) return;
    const files = Array.from(e.target.files);
    setUploadingImages(true);
    setErrorMsg(null);

    try {
      const updatedImages = await uploadProductImages(productId, files);
      setImages((prev) => [...prev, ...updatedImages]);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal mengunggah foto.");
    } finally {
      setUploadingImages(false);
      e.target.value = "";
    }
  };

  const handleSetPrimary = async (imageId: number) => {
    if (!productId) return;
    setImageActionLoading(imageId);
    try {
      await setPrimaryImage(productId, imageId);
      setImages((prev) =>
        prev.map((img) => ({
          ...img,
          is_primary: img.id === imageId,
        }))
      );
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal mengubah foto utama.");
    } finally {
      setImageActionLoading(null);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!productId) return;
    setImageActionLoading(imageId);
    try {
      await deleteProductImage(productId, imageId);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menghapus foto.");
    } finally {
      setImageActionLoading(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!productId) return;

    setSubmitting(true);
    setErrorMsg(null);
    setFieldErrors({});

    if (!categoryId) {
      setErrorMsg("Kategori wajib dipilih.");
      setSubmitting(false);
      return;
    }

    if (price === "" || Number(price) < 0) {
      setErrorMsg("Harga tidak valid.");
      setSubmitting(false);
      return;
    }

    // Clean measurements
    const cleanMeasurements: Record<string, number> = {};
    Object.entries(measurements).forEach(([k, v]) => {
      if (v !== "" && !isNaN(Number(v))) {
        cleanMeasurements[k] = Number(v);
      }
    });

    try {
      await updateProduct(productId, {
        category_id: Number(categoryId),
        name,
        description: description.trim() || undefined,
        price: Number(price),
        brand: brand.trim() || undefined,
        size_label: sizeLabel,
        condition,
        condition_notes: conditionNotes.trim() || undefined,
        measurements: Object.keys(cleanMeasurements).length > 0 ? cleanMeasurements : undefined,
      });

      router.push(`/admin/products/${productId}`);
    } catch (err: any) {
      if (err instanceof ApiError) {
        if (err.errors) {
          setFieldErrors(err.errors);
        }
        setErrorMsg(err.message || "Gagal memperbarui produk.");
      } else {
        setErrorMsg("Terjadi kesalahan yang tidak terduga.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin mx-auto" />
        <p className="text-sm text-brand-muted">Memuat data produk...</p>
      </div>
    );
  }

  if (!product && errorMsg) {
    return (
      <div className="bg-surface border border-brand-border rounded-xl p-8 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="text-lg font-medium text-brand-primary">Produk tidak ditemukan</h3>
        <p className="text-sm text-brand-muted">{errorMsg}</p>
        <Link
          href="/admin/products"
          className="inline-flex items-center px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary-hover"
        >
          Kembali ke Daftar Produk
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`Edit Produk: ${product?.name}`}
        description={`ID Produk: #${product?.id} • Dibuat: ${product?.created_at}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Produk", href: "/admin/products" },
          { label: product?.name || "Edit", href: `/admin/products/${productId}` },
          { label: "Edit" },
        ]}
      />

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Informasi Dasar */}
        <div className="bg-surface border border-brand-border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-brand-primary">Informasi Dasar</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1">
                Nama Produk <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm bg-background text-foreground"
              />
              {fieldErrors.name && (
                <p className="text-xs text-rose-500 mt-1">{fieldErrors.name[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Kategori <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm bg-surface text-foreground"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {fieldErrors.category_id && (
                <p className="text-xs text-rose-500 mt-1">{fieldErrors.category_id[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Merek / Brand</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm bg-background text-foreground"
              />
              {fieldErrors.brand && (
                <p className="text-xs text-rose-500 mt-1">{fieldErrors.brand[0]}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1">Deskripsi</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm bg-background text-foreground"
              />
              {fieldErrors.description && (
                <p className="text-xs text-rose-500 mt-1">{fieldErrors.description[0]}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Harga & Kondisi */}
        <div className="bg-surface border border-brand-border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-brand-primary">Harga & Kondisi</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Harga (Rp) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm bg-background text-foreground"
              />
              {fieldErrors.price && (
                <p className="text-xs text-rose-500 mt-1">{fieldErrors.price[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Ukuran (Size Label) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={sizeLabel}
                onChange={(e) => setSizeLabel(e.target.value)}
                className="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm bg-background text-foreground"
              />
              {fieldErrors.size_label && (
                <p className="text-xs text-rose-500 mt-1">{fieldErrors.size_label[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Kondisi <span className="text-rose-500">*</span>
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ConditionType)}
                className="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm bg-surface text-foreground"
              >
                <option value="like_new">Sangat Baik (Like New)</option>
                <option value="good">Bagus (Good)</option>
                <option value="fair">Layak Pakai (Fair)</option>
              </select>
              {fieldErrors.condition && (
                <p className="text-xs text-rose-500 mt-1">{fieldErrors.condition[0]}</p>
              )}
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-foreground mb-1">Catatan Kondisi</label>
              <input
                type="text"
                value={conditionNotes}
                onChange={(e) => setConditionNotes(e.target.value)}
                className="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm bg-background text-foreground"
              />
              {fieldErrors.condition_notes && (
                <p className="text-xs text-rose-500 mt-1">{fieldErrors.condition_notes[0]}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Ukuran Detail / Measurements */}
        {selectedCategory?.measurement_fields && selectedCategory.measurement_fields.length > 0 && (
          <div className="bg-surface border border-brand-border rounded-xl p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-brand-primary">Dimensi / Ukuran Fisik (cm)</h2>
              <p className="text-xs text-brand-muted">
                Spesifikasi ukuran detail untuk kategori {selectedCategory.name}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {selectedCategory.measurement_fields.map((field) => (
                <div key={field}>
                  <label className="block text-xs font-medium text-foreground capitalize mb-1">
                    {field.replace(/_/g, " ")} (cm)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={measurements[field] ?? ""}
                    onChange={(e) =>
                      setMeasurements({
                        ...measurements,
                        [field]: e.target.value === "" ? "" : Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm bg-background text-foreground"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Kelola Foto Produk */}
        <div className="bg-surface border border-brand-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-brand-primary">Kelola Foto Produk</h2>
              <p className="text-xs text-brand-muted">
                Atur foto utama, upload foto baru, atau hapus foto yang tidak digunakan.
              </p>
            </div>
            {uploadingImages && (
              <span className="flex items-center gap-1.5 text-xs text-brand-primary font-medium">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Mengunggah foto...
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="relative aspect-square rounded-lg border border-brand-border overflow-hidden group bg-background"
              >
                <img
                  src={img.url}
                  alt="Product Image"
                  className="w-full h-full object-cover"
                />

                {/* Status Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!img.is_primary && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(img.id)}
                      disabled={imageActionLoading === img.id}
                      className="p-2 bg-white/90 text-amber-600 rounded-full hover:bg-white transition-colors"
                      title="Jadikan Foto Utama"
                    >
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(img.id)}
                    disabled={imageActionLoading === img.id}
                    className="p-2 bg-white/90 text-rose-600 rounded-full hover:bg-white transition-colors"
                    title="Hapus Foto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {img.is_primary && (
                  <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-brand-primary text-white text-[10px] rounded font-medium shadow-sm">
                    Utama
                  </span>
                )}

                {imageActionLoading === img.id && (
                  <div className="absolute inset-0 bg-surface/70 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-brand-primary animate-spin" />
                  </div>
                )}
              </div>
            ))}

            <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-brand-border hover:border-brand-primary rounded-lg cursor-pointer bg-background hover:bg-brand-border/50 transition-colors">
              <Upload className="w-6 h-6 text-brand-muted mb-1" />
              <span className="text-xs text-brand-muted font-medium text-center px-2">
                Tambah Foto
              </span>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageUpload}
                disabled={uploadingImages}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-border">
          <Link
            href={`/admin/products/${productId}`}
            className="px-4 py-2 text-sm font-medium text-foreground hover:bg-background rounded-lg transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary-hover rounded-lg disabled:opacity-50 transition-colors"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Perubahan"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
