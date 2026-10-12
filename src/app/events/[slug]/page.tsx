import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventBySlug } from "@/services/event-service";
import { Calendar, MapPin, User, ArrowLeft, Image as ImageIcon } from "lucide-react";

export const revalidate = 60; // ISR 60s

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const event = await getEventBySlug(resolvedParams.slug);
    return {
      title: `${event.title} — Event PakeLagi`,
      description: event.description.slice(0, 160),
      openGraph: {
        title: event.title,
        description: event.description.slice(0, 160),
        images: event.cover_image_url ? [event.cover_image_url] : [],
      },
    };
  } catch {
    return {
      title: "Event Tidak Ditemukan — PakeLagi",
    };
  }
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const resolvedParams = await params;
  let event = null;

  try {
    event = await getEventBySlug(resolvedParams.slug);
  } catch {
    notFound();
  }

  const startDate = new Date(event.event_date);
  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(startDate);

  const formattedTime = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(startDate);

  let endDateStr = null;
  if (event.end_date) {
    const endDate = new Date(event.end_date);
    endDateStr = new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(endDate);
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Top Breadcrumb Header */}
      <div className="bg-surface border-b border-brand-border py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-xs font-semibold text-brand-muted hover:text-brand-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Daftar Event</span>
          </Link>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        {/* Cover Image Banner */}
        {event.cover_image_url && (
          <div className="relative aspect-21/9 w-full bg-surface rounded-3xl overflow-hidden border border-brand-border shadow-xs">
            <Image
              src={event.cover_image_url}
              alt={event.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </div>
        )}

        {/* Main Content Info */}
        <div className="bg-surface border border-brand-border rounded-3xl p-6 sm:p-10 space-y-8 shadow-xs">
          
          {/* Header Metadata */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {event.is_upcoming ? (
                <span className="bg-brand-primary text-white text-xs font-semibold px-3.5 py-1 rounded-full uppercase tracking-wider">
                  Upcoming Event
                </span>
              ) : (
                <span className="bg-brand-secondary text-white text-xs font-semibold px-3.5 py-1 rounded-full uppercase tracking-wider">
                  Past Event
                </span>
              )}

              {event.status === "cancelled" && (
                <span className="bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">
                  Dibatalkan
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold text-foreground leading-tight">
              {event.title}
            </h1>

            {/* Event Specs Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-brand-border">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-brand-secondary shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-muted">
                    Waktu & Tanggal
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {formattedDate}
                  </p>
                  <p className="text-xs text-brand-muted">
                    {formattedTime} WIB {endDateStr ? ` - s/d ${endDateStr}` : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-muted">
                    Lokasi
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {event.location}
                  </p>
                </div>
              </div>

              {event.organizer && (
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-brand-muted shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-muted">
                      Penyelenggara
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {event.organizer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Event Description Body */}
          <div className="space-y-4 pt-6 border-t border-brand-border">
            <h2 className="text-lg font-bold text-foreground">Tentang Acara Ini</h2>
            <div className="prose prose-slate max-w-none text-sm text-foreground leading-relaxed whitespace-pre-line">
              {event.description}
            </div>
          </div>

          {/* Documentation Gallery Section (if images exist) */}
          {event.images && event.images.length > 0 && (
            <div className="space-y-4 pt-8 border-t border-brand-border">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-brand-primary" />
                <h2 className="text-lg font-bold text-foreground">
                  Galeri & Dokumentasi Foto ({event.images.length})
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {event.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="group relative aspect-4/3 bg-background rounded-2xl overflow-hidden border border-brand-border"
                  >
                    <Image
                      src={img.url}
                      alt={img.caption || `Dokumentasi ${event.title}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {img.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-xs p-3 text-white text-xs">
                        <p className="line-clamp-2">{img.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
