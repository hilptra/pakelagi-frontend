import Link from "next/link";
import { getEvents } from "@/services/event-service";
import { EventCard } from "./EventCard";
import { Calendar, ArrowRight } from "lucide-react";

import type { EventListItem } from "@/types/event";

export async function UpcomingEventSection() {
  let events: EventListItem[] = [];
  try {
    const res = await getEvents({
      type: "upcoming",
      homepage: true,
      per_page: 3,
    });
    events = res.data;
  } catch {
    events = [];
  }

  // If no upcoming events are scheduled for homepage display, render nothing
  if (!events || events.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-[#F8F7F4] border-t border-b border-[#E5E7EB] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 border-b border-[#E5E7EB] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#E7DCC8]/50 text-[#1E3447] text-xs font-semibold px-3 py-1 rounded-full border border-[#E7DCC8] mb-3">
              <Calendar className="w-3.5 h-3.5 text-[#6B7F6B]" />
              <span>Aktivitas & Pop-Up Market</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937] tracking-tight">
              Upcoming Events
            </h2>
            <p className="text-sm text-[#6B7280] mt-1 max-w-xl">
              Temukan PakeLagi di bazaar, thrift market, dan acara fashion mendatang. Jumpa langsung dengan tim kami!
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E3447] hover:text-[#162735] transition-colors"
          >
            <span>Lihat Semua Acara</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
