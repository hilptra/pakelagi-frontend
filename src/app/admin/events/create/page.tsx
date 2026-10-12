"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { createAdminEvent } from "@/services/event-service";
import { ApiError } from "@/lib/api-client";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Upload,
  Loader2,
  AlertCircle,
  FileText,
  CheckCircle,
} from "lucide-react";

export default function CreateEventPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [organizer, setOrganizer] = useState("PakeLagi");
  const [status, setStatus] = useState<"draft" | "published" | "cancelled">("draft");
  const [showOnHomepage, setShowOnHomepage] = useState(false);

  // Cover image
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // Form submission state
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  function handleCoverChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setFieldErrors({});

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("event_date", eventDate);
      if (endDate) formData.append("end_date", endDate);
      formData.append("location", location.trim());
      if (organizer) formData.append("organizer", organizer.trim());
      formData.append("status", status);
      formData.append("show_on_homepage", showOnHomepage ? "1" : "0");
      if (coverFile) {
        formData.append("cover_image", coverFile);
      }

      const created = await createAdminEvent(formData);
      router.push(`/admin/events/${created.id}/edit`);
    } catch (err: any) {
      if (err instanceof ApiError && err.errors) {
        setFieldErrors(err.errors);
      }
      setErrorMsg(err.message || "Gagal menyimpan event.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <AdminPageHeader
        title="Tambah Event Baru"
        description="Buat pengumuman acara mendatang atau dokumentasi event baru."
        actions={
          <Link
            href="/admin/events"
            className="inline-flex items-center gap-2 text-xs font-semibold text-brand-muted hover:text-brand-primary bg-surface border border-brand-border px-3.5 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Event</span>
          </Link>
        }
      />

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: EVENT INFORMATION */}
        <div className="bg-surface border border-brand-border rounded-2xl p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 border-b border-brand-border pb-3 text-brand-primary">
            <FileText className="w-4 h-4" />
            <h2 className="text-sm font-bold uppercase tracking-wider">Event Information</h2>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Judul Acara <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="misal: Jakarta Thrift Market 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-background text-foreground text-xs rounded-lg px-3 py-2.5 border border-brand-border focus:border-brand-primary focus:outline-none"
              />
              {fieldErrors.title && (
                <p className="text-[11px] text-red-600 mt-1">{fieldErrors.title[0]}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Deskripsi Acara <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={5}
                placeholder="Tuliskan deskripsi lengkap seputar acara, nomor booth, lineup produk, atau kegiatan yang akan berlangsung..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-background text-foreground text-xs rounded-lg p-3 border border-brand-border focus:border-brand-primary focus:outline-none"
              />
              {fieldErrors.description && (
                <p className="text-[11px] text-red-600 mt-1">{fieldErrors.description[0]}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Location */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Lokasi Acara <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="misal: Senayan Park, Jakarta Pusat"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-background text-foreground text-xs rounded-lg pl-9 pr-3 py-2.5 border border-brand-border focus:border-brand-primary focus:outline-none"
                  />
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                </div>
                {fieldErrors.location && (
                  <p className="text-[11px] text-red-600 mt-1">{fieldErrors.location[0]}</p>
                )}
              </div>

              {/* Organizer */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Penyelenggara / Kolaborator
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="misal: Jakarta Thrift Fest & PakeLagi"
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    className="w-full bg-background text-foreground text-xs rounded-lg pl-9 pr-3 py-2.5 border border-brand-border focus:border-brand-primary focus:outline-none"
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                </div>
                {fieldErrors.organizer && (
                  <p className="text-[11px] text-red-600 mt-1">{fieldErrors.organizer[0]}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: DATE & TIME */}
        <div className="bg-surface border border-brand-border rounded-2xl p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 border-b border-brand-border pb-3 text-brand-primary">
            <Calendar className="w-4 h-4" />
            <h2 className="text-sm font-bold uppercase tracking-wider">Date & Time</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Event Start Date */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Tanggal & Waktu Mulai <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full bg-background text-foreground text-xs rounded-lg px-3 py-2.5 border border-brand-border focus:border-brand-primary focus:outline-none font-mono"
              />
              {fieldErrors.event_date && (
                <p className="text-[11px] text-red-600 mt-1">{fieldErrors.event_date[0]}</p>
              )}
            </div>

            {/* Event End Date */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Tanggal & Waktu Selesai (Opsional)
              </label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-background text-foreground text-xs rounded-lg px-3 py-2.5 border border-brand-border focus:border-brand-primary focus:outline-none font-mono"
              />
              {fieldErrors.end_date && (
                <p className="text-[11px] text-red-600 mt-1">{fieldErrors.end_date[0]}</p>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 3: MEDIA (COVER IMAGE) */}
        <div className="bg-surface border border-brand-border rounded-2xl p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 border-b border-brand-border pb-3 text-brand-primary">
            <Upload className="w-4 h-4" />
            <h2 className="text-sm font-bold uppercase tracking-wider">Cover Image</h2>
          </div>

          <div className="space-y-4">
            <p className="text-xs text-brand-muted">
              Unggah foto sampul/banner acara (Maks 2MB, WebP/JPG/PNG). Foto dokumentasi galeri dapat ditambahkan setelah event disimpan.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              {coverPreview ? (
                <div className="relative aspect-video w-full sm:w-60 bg-background rounded-xl overflow-hidden border border-brand-border">
                  <Image
                    src={coverPreview}
                    alt="Cover preview"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video w-full sm:w-60 bg-background rounded-xl border border-dashed border-brand-border flex flex-col items-center justify-center text-brand-muted">
                  <Upload className="w-6 h-6 mb-1" />
                  <span className="text-[11px]">Belum ada cover</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="inline-flex items-center gap-2 bg-background hover:bg-brand-border text-foreground text-xs font-medium px-4 py-2 rounded-lg border border-brand-border cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Pilih Cover Image</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleCoverChange}
                    className="hidden"
                  />
                </label>
                {fieldErrors.cover_image && (
                  <p className="text-[11px] text-red-600">{fieldErrors.cover_image[0]}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: PUBLISHING */}
        <div className="bg-surface border border-brand-border rounded-2xl p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 border-b border-brand-border pb-3 text-brand-primary">
            <CheckCircle className="w-4 h-4" />
            <h2 className="text-sm font-bold uppercase tracking-wider">Publishing & Visibility</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Status Publikasi <span className="text-red-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-background text-foreground text-xs rounded-lg px-3 py-2.5 border border-brand-border focus:outline-none font-semibold"
              >
                <option value="draft">Draft (Hanya terlihat di admin)</option>
                <option value="published">Published (Tampil di publik)</option>
                <option value="cancelled">Cancelled (Event dibatalkan)</option>
              </select>
            </div>

            {/* Show on Homepage Toggle */}
            <div className="flex items-center pt-5">
              <label className="relative flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnHomepage}
                  onChange={(e) => setShowOnHomepage(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-primary focus:ring-brand-primary border-brand-border"
                />
                <div>
                  <p className="text-xs font-semibold text-foreground">Tampilkan di Homepage</p>
                  <p className="text-[11px] text-brand-muted">
                    Tampilkan di section Upcoming Events pada beranda jika status published.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/admin/events"
            className="px-5 py-2.5 text-xs font-medium text-foreground bg-surface border border-brand-border rounded-lg hover:bg-background transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <span>Simpan & Lanjutkan</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
