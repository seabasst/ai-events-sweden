import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Rocket, TrendingUp, Users, Sparkles, Calendar } from "lucide-react";
import { getEvents } from "@/lib/notion";
import EventList from "@/components/EventList";
import FilterBar from "@/components/FilterBar";
import NewsletterSignup from "@/components/NewsletterSignup";
import type { EventFilters } from "@/lib/types";

export const revalidate = 300; // Revalidate every 5 minutes

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

  // Convert month filter to dateFrom/dateTo
  let dateFrom: string | undefined;
  let dateTo: string | undefined;

  if (params.month) {
    const [year, month] = params.month.split("-").map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of month
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
    <div>
      {/* Hero Section - Intro about AI in Sweden */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>The AI Stage in Sweden</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 tracking-tight leading-tight">
              Sweden&apos;s AI ecosystem is thriving
            </h1>

            <p className="text-lg sm:text-xl text-blue-100 leading-relaxed mb-8 max-w-3xl">
              Sweden has become a hotbed for AI innovation, with companies like <span className="text-white font-semibold">Lovable</span>, <span className="text-white font-semibold">Klarna AI</span>, and <span className="text-white font-semibold">ElevenLabs</span> leading the charge.
              From Stockholm&apos;s tech hubs to Gothenburg&apos;s research centers, Swedish AI startups are raising record funding rounds and pushing the boundaries of what&apos;s possible.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">$2B+ Raised</p>
                  <p className="text-sm text-blue-200">AI funding in 2024</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">500+ Startups</p>
                  <p className="text-sm text-blue-200">AI-focused companies</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">Growing Community</p>
                  <p className="text-sm text-blue-200">Meetups & events</p>
                </div>
              </div>
            </div>

            <p className="text-blue-100 text-lg">
              We&apos;re gathering <span className="text-white font-semibold">all AI events</span> available to the public in one place.
              Find conferences, meetups, workshops, and more across Sweden.
            </p>
          </div>
        </div>
      </section>

      {/* Events Section with Filter */}
      <section className="bg-gray-50 min-h-[70vh]">
        {/* Filter Bar */}
        <div className="sticky top-16 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Find Events</h2>
                <p className="text-sm text-gray-500">
                  {hasFilters
                    ? `${events.length} event${events.length !== 1 ? "s" : ""} found`
                    : "Filter by city, month, category, type, or price"
                  }
                </p>
              </div>
            </div>
            <Suspense fallback={<div className="h-12 bg-gray-100 rounded-lg animate-pulse" />}>
              <FilterBar basePath="/" />
            </Suspense>
          </div>
        </div>

        {/* Events Listing */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          {events.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {hasFilters ? "Filtered Events" : "Upcoming Events"}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {hasFilters
                      ? `Showing ${events.length} matching event${events.length !== 1 ? "s" : ""}`
                      : "Discover what's happening in the Swedish AI community"
                    }
                  </p>
                </div>
                <Link
                  href="/events"
                  className="hidden sm:flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  View all
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <EventList events={events} />
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No events found
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {hasFilters
                  ? "Try adjusting your filters to find more events."
                  : "Check back soon for upcoming AI events in Sweden."
                }
              </p>
              {hasFilters && (
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Clear all filters
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <NewsletterSignup />
        </div>
      </section>
    </div>
  );
}
