import { Metadata } from "next";
import Link from "next/link";
import { getEvents } from "@/services/event-service";
import { EventCard } from "@/components/events/EventCard";
import { Calendar, Sparkles, History, MapPin } from "lucide-react";

import type { EventListItem } from "@/types/event";

export const metadata: Metadata = {
  title: "Events & Pop-up Market — PakeLagi",
  description:
    "Jelajahi acara, bazaar thrift, pop-up market, dan aktivitas komunitas yang diikuti oleh PakeLagi.",
};

export const revalidate = 60; // ISR 60s

interface EventsPageProps {
  searchParams: Promise<{ type?: string }>;
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const resolvedParams = await searchParams;
  const currentType = resolvedParams.type || "all";

  let upcomingEvents: EventListItem[] = [];
  let pastEvents: EventListItem[] = [];

  try {
    const [upcomingRes, pastRes] = await Promise.all([
      getEvents({ type: "upcoming", per_page: 20 }),
      getEvents({ type: "past", per_page: 20 }),
    ]);
    upcomingEvents = upcomingRes.data;
    pastEvents = pastRes.data;
  } catch {
    upcomingEvents = [];
    pastEvents = [];
  }

  const showUpcoming = currentType === "all" || currentType === "upcoming";
  const showPast = currentType === "all" || currentType === "past";

  return (
    <div className="bg-[#F8F7F4] min-h-screen pb-20">
      {/* Header Banner */}
      <div className="bg-white border-b border-[#E5E7EB] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#E7DCC8]/50 text-[#1E3447] text-xs font-semibold px-3.5 py-1.5 rounded-full border border-[#E7DCC8] mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#6B7F6B]" />
              <span>Aktivitas & Acara Komunitas</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1F2937] tracking-tight">
              Event & Pop-Up Market
            </h1>
            <p className="text-base sm:text-lg text-[#6B7280] mt-3 leading-relaxed">
              PakeLagi tidak hanya hadir secara online. Ikuti keseruan booth kami di berbagai thrift market, bazaar fashion, hingga workshop keberlanjutan.
            </p>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-1">
              <Link
                href="/events"
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors whitespace-nowrap ${
                  currentType === "all"
                    ? "bg-[#1E3447] text-white"
                    : "bg-[#F8F7F4] text-[#1F2937] border border-[#E5E7EB] hover:bg-[#E5E7EB]"
                }`}
              >
                Semua Event ({upcomingEvents.length + pastEvents.length})
              </Link>
              <Link
                href="/events?type=upcoming"
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors whitespace-nowrap ${
                  currentType === "upcoming"
                    ? "bg-[#1E3447] text-white"
                    : "bg-[#F8F7F4] text-[#1F2937] border border-[#E5E7EB] hover:bg-[#E5E7EB]"
                }`}
              >
                Upcoming ({upcomingEvents.length})
              </Link>
              <Link
                href="/events?type=past"
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors whitespace-nowrap ${
                  currentType === "past"
                    ? "bg-[#1E3447] text-white"
                    : "bg-[#F8F7F4] text-[#1F2937] border border-[#E5E7EB] hover:bg-[#E5E7EB]"
                }`}
              >
                Past Event ({pastEvents.length})
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* SECTION: UPCOMING EVENTS */}
        {showUpcoming && (
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-4">
              <Calendar className="w-5 h-5 text-[#1E3447]" />
              <h2 className="text-xl sm:text-2xl font-bold text-[#1F2937]">
                Akan Datang (Upcoming Events)
              </h2>
            </div>

            {upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.slug} event={event} />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-white border border-[#E5E7EB] rounded-2xl">
                <p className="text-sm font-medium text-[#1F2937]">Belum ada event mendatang yang dijadwalkan.</p>
                <p className="text-xs text-[#6B7280] mt-1">
                  Pantau terus halaman ini atau media sosial kami untuk pengumuman pop-up market berikutnya!
                </p>
              </div>
            )}
          </section>
        )}

        {/* SECTION: PAST EVENTS */}
        {showPast && (
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-4">
              <History className="w-5 h-5 text-[#6B7F6B]" />
              <h2 className="text-xl sm:text-2xl font-bold text-[#1F2937]">
                Dokumentasi Acara Selesai (Past Events)
              </h2>
            </div>

            {pastEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEvents.map((event) => (
                  <EventCard key={event.slug} event={event} />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-white border border-[#E5E7EB] rounded-2xl">
                <p className="text-sm font-medium text-[#1F2937]">Belum ada dokumentasi event terdahulu.</p>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
