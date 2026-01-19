import { Suspense } from "react";
import Link from "next/link";
import { Archive, Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { getPastEvents } from "@/lib/notion";
import type { EventFilters, AIEvent } from "@/lib/types";
import CategoryPill from "@/components/CategoryPill";

export const revalidate = 300;

export const metadata = {
  title: "Archives | AI Events Sweden",
  description: "Browse past AI events that have taken place across Sweden",
};

interface ArchivesPageProps {
  searchParams: Promise<{
    city?: string;
    category?: string;
    year?: string;
    search?: string;
  }>;
}

// Group events by year and month
function groupEventsByDate(events: AIEvent[]): Map<string, Map<string, AIEvent[]>> {
  const grouped = new Map<string, Map<string, AIEvent[]>>();

  events.forEach((event) => {
    const date = new Date(event.date);
    const year = date.getFullYear().toString();
    const month = date.toLocaleDateString("en-SE", { month: "long" });

    if (!grouped.has(year)) {
      grouped.set(year, new Map());
    }
    const yearMap = grouped.get(year)!;

    if (!yearMap.has(month)) {
      yearMap.set(month, []);
    }
    yearMap.get(month)!.push(event);
  });

  return grouped;
}

function ArchiveEventCard({ event }: { event: AIEvent }) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 line-clamp-1 mb-2">
            {event.name}
          </h3>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(event.date).toLocaleDateString("en-SE", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {event.city}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {event.organizer}
            </span>
          </div>
          {event.categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {event.categories.slice(0, 3).map((category) => (
                <CategoryPill key={category} category={category} size="sm" />
              ))}
            </div>
          )}
        </div>
        <span
          className={`px-2 py-1 text-xs font-medium rounded ${
            event.price === "Free"
              ? "bg-green-100 text-green-700"
              : event.price === "Freemium"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {event.price}
        </span>
      </div>
    </Link>
  );
}

export default async function ArchivesPage({ searchParams }: ArchivesPageProps) {
  const params = await searchParams;

  const filters: EventFilters = {
    city: params.city as EventFilters["city"],
    category: params.category as EventFilters["category"],
    search: params.search,
  };

  const hasFilters = Object.values(filters).some(Boolean);
  const events = await getPastEvents(hasFilters ? filters : undefined);
  const groupedEvents = groupEventsByDate(events);

  // Get available years for filtering
  const years = Array.from(groupedEvents.keys()).sort((a, b) => Number(b) - Number(a));

  // Filter by year if specified
  const selectedYear = params.year;
  const filteredYears = selectedYear ? years.filter((y) => y === selectedYear) : years;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Archive className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Event Archives
              </h1>
            </div>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl">
            Browse past AI events that have taken place across Sweden.
            A record of our community&apos;s growth and the knowledge shared.
          </p>
        </div>
      </section>

      {/* Year Filter */}
      {years.length > 0 && (
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-500 mr-2">Filter by year:</span>
              <Link
                href="/archives"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !selectedYear
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </Link>
              {years.map((year) => (
                <Link
                  key={year}
                  href={`/archives?year=${year}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedYear === year
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {year}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Archives Content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {events.length > 0 ? (
          <div className="space-y-12">
            {filteredYears.map((year) => {
              const yearData = groupedEvents.get(year);
              if (!yearData) return null;

              const months = Array.from(yearData.keys());

              return (
                <div key={year}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                    {year}
                  </h2>
                  <div className="space-y-8">
                    {months.map((month) => {
                      const monthEvents = yearData.get(month);
                      if (!monthEvents) return null;

                      return (
                        <div key={`${year}-${month}`}>
                          <h3 className="text-lg font-semibold text-gray-700 mb-4">
                            {month}
                            <span className="text-sm font-normal text-gray-500 ml-2">
                              ({monthEvents.length} event{monthEvents.length !== 1 ? "s" : ""})
                            </span>
                          </h3>
                          <div className="space-y-3">
                            {monthEvents.map((event) => (
                              <Suspense
                                key={event.id}
                                fallback={
                                  <div className="h-24 bg-white rounded-lg animate-pulse" />
                                }
                              >
                                <ArchiveEventCard event={event} />
                              </Suspense>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Archive className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No archived events yet
            </h3>
            <p className="text-gray-600 mb-6">
              Past events will appear here after they&apos;ve concluded.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
            >
              View upcoming events
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </section>

      {/* Stats */}
      {events.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-gray-900">{events.length}</p>
              <p className="text-gray-600">Past Events</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {new Set(events.map((e) => e.organizer)).size}
              </p>
              <p className="text-gray-600">Organisers</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {new Set(events.map((e) => e.city)).size}
              </p>
              <p className="text-gray-600">Cities</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{years.length}</p>
              <p className="text-gray-600">Years</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
