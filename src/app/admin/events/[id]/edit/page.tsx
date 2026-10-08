"use client";

import { useState, useEffect, FormEvent, ChangeEvent, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  getAdminEvent,
  updateAdminEvent,
  uploadAdminEventImages,
  deleteAdminEventImage,
} from "@/services/event-service";
import type { AdminEventDetail, AdminEventImage, EventStatus } from "@/types/event";
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
  Image as ImageIcon,
  Trash2,
  Eye,
} from "lucide-react";

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

export default function EditEventPage({ params }: EditEventPageProps) {
  const resolvedParams = use(params);
  const eventId = parseInt(resolvedParams.id, 10);
  const router = useRouter();

  const [eventData, setEventData] = useState<AdminEventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [status, setStatus] = useState<EventStatus>("draft");
  const [showOnHomepage, setShowOnHomepage] = useState(false);

  // Cover image states
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [removeCover, setRemoveCover] = useState(false);

  // Gallery documentation upload states
  const [docFiles, setDocFiles] = useState<File[]>([]);
  const [uploadingDocs, setUploadingDocs] = useState(false);

  // Delete image state
  const [deleteImageTarget, setDeleteImageTarget] = useState<AdminEventImage | null>(null);
  const [deletingImage, setDeletingImage] = useState(false);

  // Submission state
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  async function loadEvent() {
    setLoading(true);
    try {
      const data = await getAdminEvent(eventId);
      setEventData(data);
      setTitle(data.title);
      setDescription(data.description);

      // Format ISO string to datetime-local string (YYYY-MM-DDTHH:mm)
      const startDateObj = new Date(data.event_date);
      setEventDate(startDateObj.toISOString().slice(0, 16));

      if (data.end_date) {
        const endDateObj = new Date(data.end_date);
        setEndDate(endDateObj.toISOString().slice(0, 16));
      } else {
        setEndDate("");
      }

      setLocation(data.location);
      setOrganizer(data.organizer || "");
      setStatus(data.status);
      setShowOnHomepage(data.show_on_homepage);
      setCoverPreview(data.cover_image_url);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal memuat detail event.");
    } finally {
      setLoading(false);
    }
  }

  function handleCoverChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
      setRemoveCover(false);
    }
  }

  function handleRemoveCover() {
    setCoverFile(null);
    setCoverPreview(null);
    setRemoveCover(true);
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
      if (removeCover) formData.append("remove_cover", "1");
      if (coverFile) formData.append("cover_image", coverFile);

      await updateAdminEvent(eventId, formData);
      await loadEvent();
      alert("Event berhasil diperbarui!");
    } catch (err: any) {
      if (err instanceof ApiError && err.errors) {
        setFieldErrors(err.errors);
      }
      setErrorMsg(err.message || "Gagal memperbarui event.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDocUpload(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingDocs(true);
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("images[]", f));

      await uploadAdminEventImages(eventId, formData);
      await loadEvent();
    } catch (err: any) {
      alert(err.message || "Gagal mengunggah foto dokumentasi.");
    } finally {
      setUploadingDocs(false);
      e.target.value = "";
    }
  }

  async function handleDeleteImageConfirm() {
    if (!deleteImageTarget) return;
    setDeletingImage(true);
    try {
      await deleteAdminEventImage(eventId, deleteImageTarget.id);
      setDeleteImageTarget(null);
      await loadEvent();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus foto.");
    } finally {
      setDeletingImage(false);
    }
  }

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-[#6B7280]">
        <Loader2 className="w-6 h-6 animate-spin text-[#1E3447] mb-2" />
        <span className="text-xs font-medium">Memuat event...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <AdminPageHeader
        title={`Edit Event: ${eventData?.title}`}
        description="Perbarui informasi acara dan kelola foto dokumentasi galeri."
        actions={
          <div className="flex items-center gap-2">
            {eventData && (
              <Link
                href={`/events/${eventData.slug}`}
                target="_blank"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#1E3447] bg-[#E7DCC8]/40 border border-[#E7DCC8] px-3.5 py-2 rounded-lg hover:bg-[#E7DCC8] transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>Lihat Publik</span>
              </Link>
            )}
            <Link
              href="/admin/events"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#6B7280] hover:text-[#1E3447] bg-white border border-[#E5E7EB] px-3.5 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </Link>
          </div>
        }
      />

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* EDIT FORM */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: EVENT INFORMATION */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-3 text-[#1E3447]">
            <FileText className="w-4 h-4" />
            <h2 className="text-sm font-bold uppercase tracking-wider">Event Information</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                Judul Acara <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#F8F7F4] text-[#1F2937] text-xs rounded-lg px-3 py-2.5 border border-[#E5E7EB] focus:border-[#1E3447] focus:outline-none"
              />
              {fieldErrors.title && (
                <p className="text-[11px] text-red-600 mt-1">{fieldErrors.title[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                Deskripsi Acara <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#F8F7F4] text-[#1F2937] text-xs rounded-lg p-3 border border-[#E5E7EB] focus:border-[#1E3447] focus:outline-none"
              />
              {fieldErrors.description && (
                <p className="text-[11px] text-red-600 mt-1">{fieldErrors.description[0]}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                  Lokasi Acara <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-[#F8F7F4] text-[#1F2937] text-xs rounded-lg pl-9 pr-3 py-2.5 border border-[#E5E7EB] focus:border-[#1E3447] focus:outline-none"
                  />
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                </div>
                {fieldErrors.location && (
                  <p className="text-[11px] text-red-600 mt-1">{fieldErrors.location[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                  Penyelenggara / Kolaborator
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    className="w-full bg-[#F8F7F4] text-[#1F2937] text-xs rounded-lg pl-9 pr-3 py-2.5 border border-[#E5E7EB] focus:border-[#1E3447] focus:outline-none"
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                </div>
                {fieldErrors.organizer && (
                  <p className="text-[11px] text-red-600 mt-1">{fieldErrors.organizer[0]}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: DATE & TIME */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-3 text-[#1E3447]">
            <Calendar className="w-4 h-4" />
            <h2 className="text-sm font-bold uppercase tracking-wider">Date & Time</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                Tanggal & Waktu Mulai <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full bg-[#F8F7F4] text-[#1F2937] text-xs rounded-lg px-3 py-2.5 border border-[#E5E7EB] focus:border-[#1E3447] focus:outline-none font-mono"
              />
              {fieldErrors.event_date && (
                <p className="text-[11px] text-red-600 mt-1">{fieldErrors.event_date[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                Tanggal & Waktu Selesai (Opsional)
              </label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-[#F8F7F4] text-[#1F2937] text-xs rounded-lg px-3 py-2.5 border border-[#E5E7EB] focus:border-[#1E3447] focus:outline-none font-mono"
              />
              {fieldErrors.end_date && (
                <p className="text-[11px] text-red-600 mt-1">{fieldErrors.end_date[0]}</p>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 3: COVER IMAGE */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-3 text-[#1E3447]">
            <Upload className="w-4 h-4" />
            <h2 className="text-sm font-bold uppercase tracking-wider">Cover Image</h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            {coverPreview ? (
              <div className="relative aspect-[16/9] w-full sm:w-60 bg-[#F8F7F4] rounded-xl overflow-hidden border border-[#E5E7EB]">
                <Image
                  src={coverPreview}
                  alt="Cover preview"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="aspect-[16/9] w-full sm:w-60 bg-[#F8F7F4] rounded-xl border border-dashed border-[#E5E7EB] flex flex-col items-center justify-center text-[#9CA3AF]">
                <Upload className="w-6 h-6 mb-1" />
                <span className="text-[11px]">Belum ada cover</span>
              </div>
            )}

            <div className="space-y-3">
              <label className="inline-flex items-center gap-2 bg-[#F8F7F4] hover:bg-[#E5E7EB] text-[#1F2937] text-xs font-medium px-4 py-2 rounded-lg border border-[#E5E7EB] cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Ganti Cover Image</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleCoverChange}
                  className="hidden"
                />
              </label>

              {coverPreview && (
                <div>
                  <button
                    type="button"
                    onClick={handleRemoveCover}
                    className="text-xs text-red-600 hover:underline inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Hapus Cover</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 4: PUBLISHING */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-3 text-[#1E3447]">
            <CheckCircle className="w-4 h-4" />
            <h2 className="text-sm font-bold uppercase tracking-wider">Publishing & Visibility</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                Status Publikasi <span className="text-red-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-[#F8F7F4] text-[#1F2937] text-xs rounded-lg px-3 py-2.5 border border-[#E5E7EB] focus:outline-none font-semibold"
              >
                <option value="draft">Draft (Hanya terlihat di admin)</option>
                <option value="published">Published (Tampil di publik)</option>
                <option value="cancelled">Cancelled (Event dibatalkan)</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="relative flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnHomepage}
                  onChange={(e) => setShowOnHomepage(e.target.checked)}
                  className="w-4 h-4 rounded text-[#1E3447] focus:ring-[#1E3447] border-[#E5E7EB]"
                />
                <div>
                  <p className="text-xs font-semibold text-[#1F2937]">Tampilkan di Homepage</p>
                  <p className="text-[11px] text-[#6B7280]">
                    Tampilkan di section Upcoming Events pada beranda jika status published.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#1E3447] hover:bg-[#162735] text-white text-xs font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memperbarui...</span>
              </>
            ) : (
              <span>Simpan Perubahan</span>
            )}
          </button>
        </div>
      </form>

      {/* SECTION 5: DOCUMENTATION GALLERY MANAGEMENT */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-6 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <div className="flex items-center gap-2 text-[#1E3447]">
            <ImageIcon className="w-4 h-4" />
            <h2 className="text-sm font-bold uppercase tracking-wider">
              Dokumentasi Foto Galeri ({eventData?.images?.length || 0})
            </h2>
          </div>

          <label className="inline-flex items-center gap-2 bg-[#1E3447] hover:bg-[#162735] text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors disabled:opacity-50">
            {uploadingDocs ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Mengunggah...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5" />
                <span>Unggah Foto Dokumentasi</span>
              </>
            )}
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleDocUpload}
              disabled={uploadingDocs}
              className="hidden"
            />
          </label>
        </div>

        {eventData?.images && eventData.images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {eventData.images.map((img) => (
              <div
                key={img.id}
                className="group relative aspect-[4/3] bg-[#F8F7F4] rounded-xl overflow-hidden border border-[#E5E7EB]"
              >
                <Image
                  src={img.thumbnail_url || img.url}
                  alt={img.caption || "Dokumentasi event"}
                  fill
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                  <button
                    onClick={() => setDeleteImageTarget(img)}
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                    title="Hapus foto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-[#F8F7F4] border border-dashed border-[#E5E7EB] rounded-xl text-[#6B7280] text-xs">
            Belum ada foto dokumentasi untuk event ini. Klik tombol di atas untuk mengunggah foto suasana acara/booth.
          </div>
        )}
      </div>

      {/* Delete Image Confirmation */}
      <ConfirmDialog
        open={!!deleteImageTarget}
        title="Hapus Foto Dokumentasi?"
        description="Apakah Anda yakin ingin menghapus foto ini dari galeri event?"
        confirmLabel="Hapus Foto"
        cancelLabel="Batal"
        variant="danger"
        loading={deletingImage}
        onConfirm={handleDeleteImageConfirm}
        onCancel={() => setDeleteImageTarget(null)}
      />
    </div>
  );
}
