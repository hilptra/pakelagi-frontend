"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getAdminCategories } from "@/services/admin-category-service";
import { createProduct } from "@/services/admin-product-service";
import { uploadProductImages } from "@/services/admin-image-service";
import type { AdminCategory } from "@/types/admin";
import type { ConditionType } from "@/types";
import { ApiError } from "@/lib/api-client";
import { ArrowLeft, Plus, Trash2, Upload, Loader2 } from "lucide-react";

export default function CreateProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
  const [status, setStatus] = useState<"available" | "hidden">("available");
  const [measurements, setMeasurements] = useState<Record<string, number | "">>({});

  // Image files to upload
  const [imageFiles, setImageFiles] = useState<{ file: File; preview: string }[]>([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getAdminCategories();
        setCategories(data);
        if (data.length > 0) {
          setCategoryId(data[0].id);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    }
    loadCategories();
  }, []);

  const selectedCategory = categories.find((c) => c.id === Number(categoryId));

  // Initialize/adjust measurements when category changes
  useEffect(() => {
    if (selectedCategory?.measurement_fields) {
      const initial: Record<string, number | ""> = {};
      selectedCategory.measurement_fields.forEach((field) => {
        initial[field] = measurements[field] ?? "";
      });
      setMeasurements(initial);
    } else {
      setMeasurements({});
    }
  }, [categoryId]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    const newItems = selected.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImageFiles((prev) => [...prev, ...newItems]);
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
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
      // Step 1: Create Product
      const product = await createProduct({
        category_id: Number(categoryId),
        name,
        description: description.trim() || undefined,
        price: Number(price),
        brand: brand.trim() || undefined,
        size_label: sizeLabel,
        condition,
        condition_notes: conditionNotes.trim() || undefined,
        measurements: Object.keys(cleanMeasurements).length > 0 ? cleanMeasurements : undefined,
        status,
      });

      // Step 2: Upload Images if any
      if (imageFiles.length > 0) {
        try {
          await uploadProductImages(
            product.id,
            imageFiles.map((item) => item.file)
          );
        } catch (imgErr) {
          console.error("Produk dibuat tetapi gagal mengupload gambar:", imgErr);
        }
      }

      router.push("/admin/products");
    } catch (err: any) {
      if (err instanceof ApiError) {
        if (err.errors) {
          setFieldErrors(err.errors);
        }
        setErrorMsg(err.message || "Gagal membuat produk.");
      } else {
        setErrorMsg("Terjadi kesalahan yang tidak terduga.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Tambah Produk Baru"
        description="Masukkan rincian pakaian preloved untuk ditambahkan ke katalog"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Produk", href: "/admin/products" },
          { label: "Tambah Produk" },
        ]}
      />

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Informasi Dasar */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-[#1E3447]">Informasi Dasar</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#1F2937] mb-1">
                Nama Produk <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Vintage Denim Jacket Levis 501"
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3447]/20 text-sm"
              />
              {fieldErrors.name && (
                <p className="text-xs text-rose-500 mt-1">{fieldErrors.name[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-1">
                Kategori <span className="text-rose-500">*</span>
              </label>
              {loadingCategories ? (
                <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
              ) : (
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3447]/20 text-sm bg-white"
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}
              {fieldErrors.category_id && (
                <p className="text-xs text-rose-500 mt-1">{fieldErrors.category_id[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-1">Merek / Brand</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Contoh: Levi's, Uniqlo, Nike"
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3447]/20 text-sm"
              />
              {fieldErrors.brand && (
                <p className="text-xs text-rose-500 mt-1">{fieldErrors.brand[0]}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#1F2937] mb-1">Deskripsi</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan detail bahan, kecacatan (jika ada), gaya, dll."
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3447]/20 text-sm"
              />
              {fieldErrors.description && (
                <p className="text-xs text-rose-500 mt-1">{fieldErrors.description[0]}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Harga & Kondisi */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-[#1E3447]">Harga & Kondisi</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-1">
                Harga (Rp) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="150000"
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3447]/20 text-sm"
              />
              {fieldErrors.price && (
                <p className="text-xs text-rose-500 mt-1">{fieldErrors.price[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-1">
                Ukuran (Size Label) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={sizeLabel}
                onChange={(e) => setSizeLabel(e.target.value)}
                placeholder="L, XL, 32, All Size"
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3447]/20 text-sm"
              />
              {fieldErrors.size_label && (
                <p className="text-xs text-rose-500 mt-1">{fieldErrors.size_label[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-1">
                Kondisi <span className="text-rose-500">*</span>
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ConditionType)}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3447]/20 text-sm bg-white"
              >
                <option value="like_new">Sangat Baik (Like New)</option>
                <option value="good">Bagus (Good)</option>
                <option value="fair">Layak Pakai (Fair)</option>
              </select>
              {fieldErrors.condition && (
                <p className="text-xs text-rose-500 mt-1">{fieldErrors.condition[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-1">Status Visibilitas</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "available" | "hidden")}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3447]/20 text-sm bg-white"
              >
                <option value="available">Tersedia (Tampil di Publik)</option>
                <option value="hidden">Tersembunyi (Draft)</option>
              </select>
              {fieldErrors.status && (
                <p className="text-xs text-rose-500 mt-1">{fieldErrors.status[0]}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#1F2937] mb-1">Catatan Kondisi</label>
              <input
                type="text"
                value={conditionNotes}
                onChange={(e) => setConditionNotes(e.target.value)}
                placeholder="Ada sedikit faded di bagian lengan kiri"
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3447]/20 text-sm"
              />
              {fieldErrors.condition_notes && (
                <p className="text-xs text-rose-500 mt-1">{fieldErrors.condition_notes[0]}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Ukuran Detail / Measurements (jika ada) */}
        {selectedCategory?.measurement_fields && selectedCategory.measurement_fields.length > 0 && (
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-[#1E3447]">Dimensi / Ukuran Fisik (cm)</h2>
              <p className="text-xs text-[#6B7280]">
                Masukkan ukuran detail dalam centimeter sesuai spesifikasi kategori {selectedCategory.name}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {selectedCategory.measurement_fields.map((field) => (
                <div key={field}>
                  <label className="block text-xs font-medium text-[#1F2937] capitalize mb-1">
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
                    placeholder="Contoh: 65"
                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3447]/20 text-sm"
                  />
                </div>
              ))}
            </div>
            {fieldErrors.measurements && (
              <p className="text-xs text-rose-500">{fieldErrors.measurements[0]}</p>
            )}
          </div>
        )}

        {/* Section 4: Foto Produk */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-[#1E3447]">Foto Produk</h2>
            <p className="text-xs text-[#6B7280]">
              Unggah gambar produk. Gambar pertama yang diunggah akan menjadi gambar utama. (Max 2MB per foto)
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {imageFiles.map((item, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded-lg border border-[#E5E7EB] overflow-hidden group bg-slate-50"
              >
                <img
                  src={item.preview}
                  alt={`Preview ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1 right-1 p-1.5 bg-rose-600 text-white rounded-full opacity-90 hover:opacity-100 transition-opacity"
                  title="Hapus gambar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                {idx === 0 && (
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-[#1E3447] text-white text-[10px] rounded font-medium">
                    Utama
                  </span>
                )}
              </div>
            ))}

            <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-[#E5E7EB] hover:border-[#1E3447] rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100/50 transition-colors">
              <Upload className="w-6 h-6 text-[#6B7280] mb-1" />
              <span className="text-xs text-[#6B7280] font-medium text-center px-2">
                Tambah Foto
              </span>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>
          </div>
          {fieldErrors.images && (
            <p className="text-xs text-rose-500">{fieldErrors.images[0]}</p>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
          <Link
            href="/admin/products"
            className="px-4 py-2 text-sm font-medium text-[#1F2937] hover:bg-slate-100 rounded-lg transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-[#1E3447] hover:bg-[#1E3447]/90 rounded-lg disabled:opacity-50 transition-colors"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Produk"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
