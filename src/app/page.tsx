import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin, Sparkles } from "lucide-react";
import { getFeaturedEvents, getUpcomingEvents } from "@/lib/notion";
import EventList from "@/components/EventList";
import SearchBar from "@/components/SearchBar";
import NewsletterSignup from "@/components/NewsletterSignup";
import type { Category } from "@/lib/types";

const quickCategories: Category[] = [
  "AI/ML",
  "Data Science",
  "Business",
  "Research",
  "NLP",
];

export const revalidate = 300; // Revalidate every 5 minutes

export default async function HomePage() {
  const [featuredEvents, upcomingEvents] = await Promise.all([
    getFeaturedEvents(),
    getUpcomingEvents(9),
  ]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Discover AI events across Sweden</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              Find your next AI event
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Conferences, meetups, workshops, and more. Connect with the Swedish
              AI community and stay ahead of the curve.
            </p>
            <div className="max-w-xl mx-auto mb-8">
              <Suspense fallback={<div className="h-12 bg-gray-100 rounded-xl animate-pulse" />}>
                <SearchBar placeholder="Search for events, topics, or organizers..." />
              </Suspense>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {quickCategories.map((category) => (
                <Link
                  key={category}
                  href={`/events?category=${encodeURIComponent(category)}`}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Featured Events
              </h2>
              <p className="text-gray-600 mt-1">
                Hand-picked events you won&apos;t want to miss
              </p>
            </div>
          </div>
          <EventList events={featuredEvents} featured />
        </section>
      )}

      {/* Upcoming Events */}
      <section className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Upcoming Events
              </h2>
              <p className="text-gray-600 mt-1">
                What&apos;s happening in the Swedish AI community
              </p>
            </div>
            <Link
              href="/events"
              className="hidden sm:flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
            >
              View all events
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <EventList events={upcomingEvents} />
          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/events"
              className="inline-flex items-center gap-1 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
            >
              View all events
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">100+</p>
            <p className="text-gray-600">Events listed</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">8</p>
            <p className="text-gray-600">Cities covered</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">9</p>
            <p className="text-gray-600">Categories</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">7</p>
            <p className="text-gray-600">Event types</p>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <NewsletterSignup />
      </section>
    </div>
  );
}
