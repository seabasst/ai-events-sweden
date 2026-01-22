import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { getEvents } from "@/lib/notion";
import EventList from "@/components/EventList";
import FilterBar from "@/components/FilterBar";
import type { EventFilters, City, Category, EventType, Price } from "@/lib/types";

export const metadata: Metadata = {
  title: "AI Events | AI Journalen",
  description:
    "Browse all AI events happening in Sweden. Filter by city, category, type, and more.",
};

export const revalidate = 300;

interface PageProps {
  searchParams: Promise<{
    city?: string;
    category?: string;
    type?: string;
    price?: string;
    month?: string;
    search?: string;
  }>;
}

export default async function EventsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  let dateFrom: string | undefined;
  let dateTo: string | undefined;

  if (params.month) {
    const [year, month] = params.month.split("-").map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    dateFrom = startDate.toISOString().split("T")[0];
    dateTo = endDate.toISOString().split("T")[0];
  }

  const filters: EventFilters = {
    city: params.city as City,
    category: params.category as Category,
    type: params.type as EventType,
    price: params.price as Price,
    dateFrom,
    dateTo,
    search: params.search,
  };

  const hasFilters =
    params.city || params.category || params.type || params.price || params.month || params.search;
  const events = await getEvents(hasFilters ? filters : undefined);

  return (
    <div className="min-h-screen bg-neutral-50/50">
      {/* Hero Section */}
      <section className="bg-white border-b border-neutral-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-2xl">
            <h1 className="text-[32px] sm:text-[40px] font-semibold text-neutral-900 mb-4 tracking-tight leading-[1.1]">
              AI Events in Sweden
            </h1>
            <p className="text-[17px] text-neutral-600 leading-relaxed mb-8">
              Discover conferences, meetups, workshops, and more from Sweden&apos;s growing AI
              community. All events in one place.
            </p>
            <div className="flex items-center gap-6 text-[13px] text-neutral-500">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span>{events.length} upcoming events</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 bg-blue-500 rounded-full" />
                <span>Updated daily</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <Suspense
            fallback={<div className="h-9 bg-neutral-100 rounded-md animate-pulse w-96" />}
          >
            <FilterBar basePath="/events" />
          </Suspense>
        </div>
      </div>

      {/* Events Listing */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {events.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-[13px] text-neutral-500">
                {hasFilters
                  ? `${events.length} event${events.length !== 1 ? "s" : ""} found`
                  : "All upcoming events"}
              </p>
              {hasFilters && (
                <Link
                  href="/events"
                  className="text-[13px] text-neutral-500 hover:text-neutral-900 transition-colors duration-200"
                >
                  Clear filters
                </Link>
              )}
            </div>
            <EventList events={events} />
          </>
        ) : (
          <div className="text-center py-24">
            <h3 className="text-[17px] font-medium text-neutral-900 mb-2">No events found</h3>
            <p className="text-[14px] text-neutral-500 mb-6">
              {hasFilters ? "Try adjusting your filters." : "Check back soon for upcoming events."}
            </p>
            {hasFilters && (
              <Link
                href="/events"
                className="text-[13px] font-medium text-neutral-900 hover:text-neutral-600 transition-colors duration-200"
              >
                Clear all filters
              </Link>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
