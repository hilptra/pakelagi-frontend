"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { getAdminEvents, deleteAdminEvent } from "@/services/event-service";
import type { AdminEventListItem, EventStatus, EventTiming } from "@/types/event";
import {
  Calendar,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Loader2,
  MapPin,
  Home,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

export default function AdminEventsListPage() {
  const [events, setEvents] = useState<AdminEventListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<AdminEventListItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadEvents();
  }, [search, statusFilter, typeFilter]);

  async function loadEvents() {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminEvents({
        q: search || undefined,
        status: (statusFilter as EventStatus) || undefined,
        type: (typeFilter as EventTiming) || undefined,
        per_page: 50,
      });
      setEvents(res.data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat daftar event");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteAdminEvent(deleteTarget.id);
      setDeleteTarget(null);
      await loadEvents();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus event");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <AdminPageHeader
        title="Event & Acara"
        description="Kelola pengumuman upcoming event dan dokumentasi acara terdahulu."
        actions={
          <Link
            href="/admin/events/create"
            className="inline-flex items-center gap-2 bg-[#1E3447] hover:bg-[#162735] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Event Baru</span>
          </Link>
        }
      />

      {/* Filters Bar */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-2xs">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Cari judul, lokasi, deskripsi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#F8F7F4] text-[#1F2937] text-xs rounded-lg pl-9 pr-3 py-2 border border-[#E5E7EB] focus:border-[#1E3447] focus:outline-none"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF]" />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F8F7F4] text-[#1F2937] text-xs rounded-lg px-3 py-2 border border-[#E5E7EB] focus:outline-none font-medium"
          >
            <option value="">Semua Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[#F8F7F4] text-[#1F2937] text-xs rounded-lg px-3 py-2 border border-[#E5E7EB] focus:outline-none font-medium"
          >
            <option value="">Semua Tanggal</option>
            <option value="upcoming">Upcoming Event</option>
            <option value="past">Past Event</option>
          </select>
        </div>
      </div>

      {/* Content Table / List */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-2xs">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-[#6B7280]">
            <Loader2 className="w-6 h-6 animate-spin text-[#1E3447] mb-2" />
            <span className="text-xs font-medium">Memuat data event...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 text-xs">{error}</div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#F8F7F4] border border-[#E5E7EB] flex items-center justify-center mx-auto text-[#6B7280]">
              <Calendar className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-[#1F2937]">Belum Ada Event</p>
            <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
              Event yang kamu tambahkan akan tampil di daftar ini serta halaman publik dan homepage.
            </p>
            <div className="pt-2">
              <Link
                href="/admin/events/create"
                className="inline-flex items-center gap-2 bg-[#1E3447] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#162735] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Event Pertama</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F7F4] border-b border-[#E5E7EB] text-[#6B7280] font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Cover</th>
                  <th className="py-3 px-4">Judul Acara</th>
                  <th className="py-3 px-4">Waktu & Lokasi</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Timing</th>
                  <th className="py-3 px-4 text-center">Homepage</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] text-[#1F2937]">
                {events.map((evt) => (
                  <tr key={evt.id} className="hover:bg-[#F8F7F4]/50 transition-colors">
                    {/* Cover Preview */}
                    <td className="py-3 px-4">
                      <div className="relative w-14 h-10 bg-[#F8F7F4] rounded-lg overflow-hidden border border-[#E5E7EB]">
                        {evt.cover_image_thumbnail_url || evt.cover_image_url ? (
                          <Image
                            src={evt.cover_image_thumbnail_url || evt.cover_image_url!}
                            alt={evt.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#9CA3AF]">
                            <Calendar className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Title & Slug */}
                    <td className="py-3 px-4 font-medium max-w-xs">
                      <p className="font-semibold text-[#1F2937] line-clamp-1">{evt.title}</p>
                      <p className="text-[10px] text-[#6B7280] font-mono line-clamp-1">/{evt.slug}</p>
                    </td>

                    {/* Date & Location */}
                    <td className="py-3 px-4">
                      <p className="font-semibold text-[#1E3447]">
                        {new Date(evt.event_date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-[11px] text-[#6B7280] flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="line-clamp-1">{evt.location}</span>
                      </p>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      {evt.status === "published" && (
                        <span className="inline-flex items-center gap-1 bg-[#6B7F6B]/10 text-[#6B7F6B] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#6B7F6B]/20">
                          Published
                        </span>
                      )}
                      {evt.status === "draft" && (
                        <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-yellow-200">
                          Draft
                        </span>
                      )}
                      {evt.status === "cancelled" && (
                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-red-200">
                          Cancelled
                        </span>
                      )}
                    </td>

                    {/* Timing Badge */}
                    <td className="py-3 px-4">
                      {evt.is_upcoming ? (
                        <span className="inline-flex items-center gap-1 bg-[#1E3447] text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                          Upcoming
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-[#F8F7F4] text-[#6B7280] text-[10px] font-medium px-2.5 py-0.5 rounded-full border border-[#E5E7EB]">
                          Past
                        </span>
                      )}
                    </td>

                    {/* Homepage Visibility */}
                    <td className="py-3 px-4 text-center">
                      {evt.show_on_homepage ? (
                        <span className="inline-flex items-center justify-center p-1 bg-emerald-50 text-emerald-600 rounded-full">
                          <CheckCircle className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="text-[#9CA3AF]">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-1">
                      <Link
                        href={`/events/${evt.slug}`}
                        target="_blank"
                        className="p-1.5 text-[#6B7280] hover:text-[#1E3447] rounded-md transition-colors inline-block"
                        title="Lihat Halaman Publik"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/events/${evt.id}/edit`}
                        className="p-1.5 text-[#6B7280] hover:text-[#1E3447] rounded-md transition-colors inline-block"
                        title="Edit Event"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(evt)}
                        className="p-1.5 text-red-500 hover:text-red-700 rounded-md transition-colors inline-block"
                        title="Hapus Event"
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

      {/* Confirmation Modal */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Event?"
        description={`Apakah Anda yakin ingin menghapus event "${deleteTarget?.title}"? Semua foto dokumentasi terkait akan dihapus secara permanen.`}
        confirmLabel="Hapus Event"
        cancelLabel="Batal"
        variant="danger"
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
