import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getEvents } from "@/lib/notion";
import EventList from "@/components/EventList";
import FilterBar from "@/components/FilterBar";
import NewsletterSignup from "@/components/NewsletterSignup";
import type { EventFilters } from "@/lib/types";

export const revalidate = 300;

interface HomePageProps {
  searchParams: Promise<{
    city?: string;
    category?: string;
    type?: string;
    price?: string;
    month?: string;
    search?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
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
    city: params.city as EventFilters["city"],
    category: params.category as EventFilters["category"],
    type: params.type as EventFilters["type"],
    price: params.price as EventFilters["price"],
    dateFrom,
    dateTo,
    search: params.search,
  };

  const hasFilters = params.city || params.category || params.type || params.price || params.month || params.search;
  const events = await getEvents(hasFilters ? filters : undefined);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Clean & Minimal */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-4 tracking-tight">
              AI Events in Sweden
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Discover conferences, meetups, workshops, and more from Sweden&apos;s growing AI community.
              All events in one place.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span>{events.length} upcoming events</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full" />
                <span>Updated daily</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <Suspense fallback={<div className="h-10 bg-gray-100 rounded-lg animate-pulse" />}>
            <FilterBar basePath="/" />
          </Suspense>
        </div>
      </div>

      {/* Events Listing */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {events.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                {hasFilters
                  ? `${events.length} event${events.length !== 1 ? "s" : ""} found`
                  : "All upcoming events"
                }
              </p>
              {hasFilters && (
                <Link
                  href="/"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Clear filters
                </Link>
              )}
            </div>
            <EventList events={events} />
          </>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No events found
            </h3>
            <p className="text-gray-500 mb-6">
              {hasFilters
                ? "Try adjusting your filters."
                : "Check back soon for upcoming events."
              }
            </p>
            {hasFilters && (
              <Link
                href="/"
                className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
              >
                Clear all filters
              </Link>
            )}
          </div>
        )}
      </section>

      {/* Newsletter - Minimal */}
      <section className="border-t border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <NewsletterSignup />
        </div>
      </section>
    </div>
  );
}
