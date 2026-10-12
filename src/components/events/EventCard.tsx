import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, ArrowRight, User } from "lucide-react";
import type { EventListItem } from "@/types/event";

interface EventCardProps {
  event: EventListItem;
  featured?: boolean;
}

export function EventCard({ event, featured = false }: EventCardProps) {
  // Format dates cleanly in Indonesian
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

  return (
    <Link
      href={`/events/${event.slug}`}
      className={`group flex flex-col bg-surface border border-brand-border rounded-2xl overflow-hidden transition-all duration-200 hover:border-brand-primary/30 hover:shadow-md ${
        featured ? "md:grid md:grid-cols-12 md:gap-6" : ""
      }`}
    >
      {/* Cover Image Container */}
      <div
        className={`relative aspect-video w-full bg-background overflow-hidden ${
          featured ? "md:col-span-6 md:h-full md:aspect-auto min-h-60" : ""
        }`}
      >
        {event.cover_image_url ? (
          <Image
            src={event.cover_image_url}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-accent/20 text-brand-primary">
            <Calendar className="w-10 h-10 opacity-40 mb-1" />
            <span className="text-xs font-medium text-brand-muted">PakeLagi Event</span>
          </div>
        )}

        {/* Timing Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {event.is_upcoming ? (
            <span className="bg-brand-primary text-white text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Upcoming Event
            </span>
          ) : (
            <span className="bg-brand-secondary text-white text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Past Event
            </span>
          )}
        </div>
      </div>

      {/* Content Container */}
      <div
        className={`p-6 flex flex-col flex-1 justify-between gap-4 ${
          featured ? "md:col-span-6 md:py-8 md:pr-8" : ""
        }`}
      >
        <div className="space-y-3">
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-brand-muted font-medium">
            <span className="flex items-center gap-1 text-brand-primary font-semibold">
              <Calendar className="w-3.5 h-3.5 text-brand-secondary" />
              {formattedDate} • {formattedTime} WIB
            </span>

            {event.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-muted" />
                {event.location}
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            className={`font-bold text-foreground group-hover:text-brand-primary transition-colors line-clamp-2 ${
              featured ? "text-xl sm:text-2xl" : "text-lg"
            }`}
          >
            {event.title}
          </h3>

          {/* Description Excerpt */}
          <p className="text-sm text-brand-muted line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Footer & CTA */}
        <div className="pt-3 border-t border-brand-border flex items-center justify-between text-xs">
          {event.organizer ? (
            <span className="flex items-center gap-1 text-brand-muted">
              <User className="w-3.5 h-3.5" />
              {event.organizer}
            </span>
          ) : (
            <span className="text-brand-muted">PakeLagi Activity</span>
          )}

          <span className="inline-flex items-center gap-1 font-semibold text-brand-primary group-hover:translate-x-0.5 transition-transform">
            Detail Acara
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
