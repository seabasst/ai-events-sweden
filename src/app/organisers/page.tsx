import Link from "next/link";
import { Building2, Calendar, ArrowRight } from "lucide-react";
import { getEvents } from "@/lib/notion";

export const revalidate = 300;

export const metadata = {
  title: "Organisers | AI Journalen",
  description: "Discover organisations hosting AI events across Sweden",
};

interface OrganiserData {
  name: string;
  eventCount: number;
  cities: string[];
  upcomingEvent?: {
    name: string;
    date: string;
    slug: string;
  };
}

export default async function OrganisersPage() {
  const events = await getEvents();

  // Extract unique organisers with their event counts and cities
  const organiserMap = new Map<string, OrganiserData>();

  events.forEach((event) => {
    const organiser = event.organizer.trim();
    if (!organiser) return;

    const existing = organiserMap.get(organiser);
    if (existing) {
      existing.eventCount++;
      if (!existing.cities.includes(event.city)) {
        existing.cities.push(event.city);
      }
      // Update upcoming event if this one is sooner
      if (!existing.upcomingEvent || new Date(event.date) < new Date(existing.upcomingEvent.date)) {
        existing.upcomingEvent = {
          name: event.name,
          date: event.date,
          slug: event.slug,
        };
      }
    } else {
      organiserMap.set(organiser, {
        name: organiser,
        eventCount: 1,
        cities: [event.city],
        upcomingEvent: {
          name: event.name,
          date: event.date,
          slug: event.slug,
        },
      });
    }
  });

  const organisers = Array.from(organiserMap.values()).sort(
    (a, b) => b.eventCount - a.eventCount
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Event Organisers
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Meet the organisations and communities driving AI events across Sweden.
            From tech companies to research institutions, these are the people bringing
            the AI community together.
          </p>
        </div>
      </section>

      {/* Organisers Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {organisers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organisers.map((organiser) => (
              <div
                key={organiser.name}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {organiser.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {organiser.eventCount} upcoming event{organiser.eventCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {organiser.cities.slice(0, 3).map((city) => (
                      <span
                        key={city}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                      >
                        {city}
                      </span>
                    ))}
                    {organiser.cities.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                        +{organiser.cities.length - 3} more
                      </span>
                    )}
                  </div>

                  {organiser.upcomingEvent && (
                    <Link
                      href={`/events/${organiser.upcomingEvent.slug}`}
                      className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Next event
                      </p>
                      <p className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {organiser.upcomingEvent.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(organiser.upcomingEvent.date).toLocaleDateString("en-SE", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </Link>
                  )}
                </div>

                <Link
                  href={`/?search=${encodeURIComponent(organiser.name)}`}
                  className="mt-4 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all events
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No organisers found
            </h3>
            <p className="text-gray-600">
              Check back soon as more events are added.
            </p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">
            Want to list your events?
          </h2>
          <p className="text-blue-100 mb-6 max-w-lg mx-auto">
            If you&apos;re organising AI events in Sweden, submit them to our platform
            and reach the growing AI community.
          </p>
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
          >
            Submit an Event
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
