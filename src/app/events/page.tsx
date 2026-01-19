import { Suspense } from "react";
import type { Metadata } from "next";
import { getEvents } from "@/lib/notion";
import EventList from "@/components/EventList";
import FilterBar from "@/components/FilterBar";
import SearchBar from "@/components/SearchBar";
import type { EventFilters, City, Category, EventType, Price } from "@/lib/types";

export const metadata: Metadata = {
  title: "All Events",
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
    search?: string;
  }>;
}

async function EventsContent({ searchParams }: { searchParams: Awaited<PageProps["searchParams"]> }) {
  const filters: EventFilters = {};

  if (searchParams.city) {
    filters.city = searchParams.city as City;
  }
  if (searchParams.category) {
    filters.category = searchParams.category as Category;
  }
  if (searchParams.type) {
    filters.type = searchParams.type as EventType;
  }
  if (searchParams.price) {
    filters.price = searchParams.price as Price;
  }
  if (searchParams.search) {
    filters.search = searchParams.search;
  }

  const events = await getEvents(filters);

  return <EventList events={events} />;
}

export default async function EventsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Events</h1>
          <p className="text-gray-600">
            Discover AI events happening across Sweden
          </p>
        </div>

        <div className="mb-6 space-y-4">
          <SearchBar className="max-w-xl" />
          <Suspense fallback={<div className="h-10" />}>
            <FilterBar />
          </Suspense>
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse"
                >
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          }
        >
          <EventsContent searchParams={resolvedSearchParams} />
        </Suspense>
      </div>
    </div>
  );
}
