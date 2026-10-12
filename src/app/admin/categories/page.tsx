"use client";

import { useState, useEffect, type FormEvent } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/services/admin-category-service";
import type { AdminCategory } from "@/types/admin";
import { ApiError } from "@/lib/api-client";
import {
  Plus,
  Edit3,
  Trash2,
  Tag,
  Loader2,
  AlertTriangle,
  X,
  Layers,
  Ruler,
} from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalErrors, setModalErrors] = useState<Record<string, string[]>>({});

  // Form fields
  const [name, setName] = useState("");
  const [measurementFields, setMeasurementFields] = useState<string[]>([]);
  const [newFieldInput, setNewFieldInput] = useState("");

  // Delete Dialog State
  const [deletingCategory, setDeletingCategory] = useState<AdminCategory | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await getAdminCategories();
      setCategories(data);
    } catch (err: any) {
      console.error("Failed to fetch categories:", err);
      setErrorMsg(err.message || "Gagal mengambil daftar kategori.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName("");
    setMeasurementFields([]);
    setNewFieldInput("");
    setModalErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (category: AdminCategory) => {
    setEditingCategory(category);
    setName(category.name);
    setMeasurementFields(category.measurement_fields || []);
    setNewFieldInput("");
    setModalErrors({});
    setIsModalOpen(true);
  };

  const handleAddField = () => {
    const formatted = newFieldInput.trim().toLowerCase().replace(/\s+/g, "_");
    if (formatted && !measurementFields.includes(formatted)) {
      setMeasurementFields([...measurementFields, formatted]);
      setNewFieldInput("");
    }
  };

  const handleRemoveField = (index: number) => {
    setMeasurementFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveCategory = async (e: FormEvent) => {
    e.preventDefault();
    setModalSubmitting(true);
    setModalErrors({});
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          name,
          measurement_fields: measurementFields,
        });
        setSuccessMsg(`Kategori "${name}" berhasil diperbarui.`);
      } else {
        await createCategory({
          name,
          measurement_fields: measurementFields,
        });
        setSuccessMsg(`Kategori "${name}" berhasil ditambahkan.`);
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      if (err instanceof ApiError && err.errors) {
        setModalErrors(err.errors);
      } else {
        setErrorMsg(err.message || "Gagal menyimpan kategori.");
      }
    } finally {
      setModalSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;
    setDeleteLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await deleteCategory(deletingCategory.id);
      setSuccessMsg(`Kategori "${deletingCategory.name}" berhasil dihapus.`);
      setDeletingCategory(null);
      fetchCategories();
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menghapus kategori.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Kelola Kategori"
        description="Atur kategori pakaian dan bidang spesifikasi ukuran khusus"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Kategori" },
        ]}
        actions={
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Kategori
          </button>
        }
      />

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="text-rose-500 hover:text-rose-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm flex items-center justify-between">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-600 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-surface border border-brand-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-brand-primary animate-spin mx-auto" />
            <p className="text-sm text-brand-muted">Memuat daftar kategori...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Tag className="w-10 h-10 text-brand-muted mx-auto opacity-50" />
            <p className="text-foreground font-medium">Belum Ada Kategori</p>
            <p className="text-xs text-brand-muted">
              Klik tombol "Tambah Kategori" untuk membuat kategori produk pertama Anda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-brand-border text-xs font-semibold text-brand-muted uppercase tracking-wider">
                  <th className="py-3 px-4">Nama Kategori</th>
                  <th className="py-3 px-4">Slug API</th>
                  <th className="py-3 px-4">Spesifikasi Ukuran (Measurement Fields)</th>
                  <th className="py-3 px-4 text-center">Jumlah Produk</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border text-sm text-foreground">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-brand-primary">
                      {cat.name}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-brand-muted">
                      {cat.slug}
                    </td>
                    <td className="py-3.5 px-4">
                      {cat.measurement_fields && cat.measurement_fields.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {cat.measurement_fields.map((field) => (
                            <span
                              key={field}
                              className="px-2 py-0.5 bg-slate-100 text-foreground text-xs rounded border border-brand-border"
                            >
                              {field}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-brand-muted italic">Tidak ada</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center font-medium">
                      <span className="px-2.5 py-1 bg-slate-100 rounded-full text-xs font-semibold text-brand-primary">
                        {cat.products_count ?? 0}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="p-1.5 text-slate-600 hover:text-brand-primary hover:bg-slate-100 rounded-md transition-colors"
                        title="Edit Kategori"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingCategory(cat)}
                        className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        title="Hapus Kategori"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Add / Edit Category */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl border border-brand-border">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <h3 className="text-lg font-semibold text-brand-primary">
                {editingCategory ? "Edit Kategori" : "Tambah Kategori Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Nama Kategori <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Outerwear, Celana, Kaos"
                  className="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm"
                />
                {modalErrors.name && (
                  <p className="text-xs text-rose-500 mt-1">{modalErrors.name[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Bidang Spesifikasi Ukuran (Measurement Fields)
                </label>
                <p className="text-xs text-brand-muted mb-2">
                  Bidang ini akan muncul pada form produk dalam kategori ini (misal: chest, length, waist)
                </p>

                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newFieldInput}
                    onChange={(e) => setNewFieldInput(e.target.value)}
                    placeholder="Tambah bidang (cth: chest)"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddField();
                      }
                    }}
                    className="flex-1 px-3 py-1.5 border border-brand-border rounded-lg focus:outline-none text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddField}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-foreground font-medium text-xs rounded-lg transition-colors"
                  >
                    Tambah
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 min-h-8 p-2 bg-slate-50 border border-brand-border rounded-lg">
                  {measurementFields.length === 0 ? (
                    <span className="text-xs text-brand-muted italic">
                      Belum ada spesifikasi ukuran
                    </span>
                  ) : (
                    measurementFields.map((field, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-surface border border-brand-border text-foreground text-xs rounded font-mono"
                      >
                        {field}
                        <button
                          type="button"
                          onClick={() => handleRemoveField(idx)}
                          className="text-slate-400 hover:text-rose-600 ml-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
                {modalErrors.measurement_fields && (
                  <p className="text-xs text-rose-500 mt-1">
                    {modalErrors.measurement_fields[0]}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-foreground hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={modalSubmitting}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary/90 rounded-lg disabled:opacity-50 transition-colors"
                >
                  {modalSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Kategori"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(deletingCategory)}
        title="Hapus Kategori?"
        description={`Apakah Anda yakin ingin menghapus kategori "${deletingCategory?.name}"? Jika ada produk di kategori ini, penghapusan akan gagal.`}
        confirmLabel="Hapus Kategori"
        variant="danger"
        loading={deleteLoading}
        onConfirm={handleDeleteCategory}
        onCancel={() => setDeletingCategory(null)}
      />
    </div>
  );
}
