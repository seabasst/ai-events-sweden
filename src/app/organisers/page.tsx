import Link from "next/link";
import { ArrowRight } from "lucide-react";
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

// Color palette for organiser logos
const logoColors = [
  "bg-violet-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-orange-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-amber-500",
  "bg-indigo-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-red-500",
  "bg-lime-500",
];

// Generate consistent color based on organiser name
function getOrganiserColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return logoColors[Math.abs(hash) % logoColors.length];
}

// Get initials from organiser name (up to 2 characters)
function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
}

function OrganiserLogo({ name }: { name: string }) {
  const color = getOrganiserColor(name);
  const initials = getInitials(name);

  return (
    <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}>
      <span className="text-[14px] font-semibold text-white tracking-tight">{initials}</span>
    </div>
  );
}

export default async function OrganisersPage() {
  const events = await getEvents();

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
      if (
        !existing.upcomingEvent ||
        new Date(event.date) < new Date(existing.upcomingEvent.date)
      ) {
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
    <div className="min-h-screen bg-neutral-50/50">
      {/* Header */}
      <section className="bg-white border-b border-neutral-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-2xl">
            <h1 className="text-[32px] sm:text-[40px] font-semibold text-neutral-900 mb-4 tracking-tight leading-[1.1]">
              Event Organisers
            </h1>
            <p className="text-[17px] text-neutral-600 leading-relaxed">
              Meet the organisations and communities driving AI events across Sweden.
            </p>
          </div>
        </div>
      </section>

      {/* Organisers List */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {organisers.length > 0 ? (
          <>
            <p className="text-[13px] text-neutral-500 mb-6">
              {organisers.length} organiser{organisers.length !== 1 ? "s" : ""}
            </p>

            <div className="space-y-3">
              {organisers.map((organiser) => (
                <div
                  key={organiser.name}
                  className="group bg-white rounded-lg border border-neutral-200/80 hover:border-neutral-300 p-5 sm:p-6 transition-all duration-300 hover:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)]"
                >
                  <div className="flex items-start gap-4 sm:gap-5">
                    <OrganiserLogo name={organiser.name} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-[15px] font-semibold text-neutral-900">
                              {organiser.name}
                            </h3>
                            <span className="text-[12px] text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                              {organiser.eventCount} event{organiser.eventCount !== 1 ? "s" : ""}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[13px] text-neutral-500 mb-3">
                            {organiser.cities.slice(0, 4).map((city, index) => (
                              <span key={city} className="flex items-center gap-2">
                                {city}
                                {index < Math.min(organiser.cities.length - 1, 3) && (
                                  <span className="w-1 h-1 rounded-full bg-neutral-300" />
                                )}
                              </span>
                            ))}
                            {organiser.cities.length > 4 && (
                              <span className="text-neutral-400">
                                +{organiser.cities.length - 4} more
                              </span>
                            )}
                          </div>

                          {organiser.upcomingEvent && (
                            <Link
                              href={`/events/${organiser.upcomingEvent.slug}`}
                              className="inline-flex items-center gap-2 text-[13px] text-neutral-600 hover:text-neutral-900 transition-colors duration-200"
                            >
                              <span className="text-neutral-400">Next:</span>
                              <span className="line-clamp-1 max-w-[300px]">
                                {organiser.upcomingEvent.name}
                              </span>
                              <span className="text-neutral-400">
                                {new Date(organiser.upcomingEvent.date).toLocaleDateString("en-SE", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </Link>
                          )}
                        </div>

                        <Link
                          href={`/events?search=${encodeURIComponent(organiser.name)}`}
                          className="text-[13px] text-neutral-500 hover:text-neutral-900 transition-colors duration-200 whitespace-nowrap flex items-center gap-1"
                        >
                          View all
                          <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-24">
            <h3 className="text-[17px] font-medium text-neutral-900 mb-2">No organisers found</h3>
            <p className="text-[14px] text-neutral-500">Check back soon as more events are added.</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white border border-neutral-200/80 rounded-lg p-8 sm:p-10 text-center">
          <h2 className="text-[17px] font-semibold text-neutral-900 mb-2">
            Want to list your events?
          </h2>
          <p className="text-[14px] text-neutral-500 mb-6 max-w-md mx-auto">
            If you&apos;re organising AI events in Sweden, submit them to our platform.
          </p>
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 h-10 px-5 bg-neutral-900 text-white text-[13px] font-medium rounded-md hover:bg-neutral-800 transition-all duration-200"
          >
            Submit an Event
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </Link>
        </div>
      </section>
    </div>
  );
}
