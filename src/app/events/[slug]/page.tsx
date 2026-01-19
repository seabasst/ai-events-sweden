import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { format } from "date-fns";
import {
  Calendar,
  MapPin,
  Users,
  ExternalLink,
  ArrowLeft,
  Tag,
  Presentation,
  BookOpen,
  Wrench,
  Globe,
  Users2,
  Video,
  Code,
} from "lucide-react";
import { getEventBySlug, getUpcomingEvents } from "@/lib/notion";
import CategoryPill from "@/components/CategoryPill";
import EventCard from "@/components/EventCard";
import ShareButton from "@/components/ShareButton";
import type { EventType } from "@/lib/types";

// Define colors and icons for each event type
const eventTypeConfig: Record<EventType, { bg: string; text: string; border: string; icon: React.ElementType; label: string }> = {
  Conference: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    icon: Presentation,
    label: "Multi-day event with speakers and networking",
  },
  Seminar: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    icon: BookOpen,
    label: "Educational presentation on a specific topic",
  },
  Workshop: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    icon: Wrench,
    label: "Hands-on, interactive learning session",
  },
  Summit: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
    icon: Globe,
    label: "High-level gathering of industry leaders",
  },
  Meetup: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    icon: Users2,
    label: "Casual community gathering",
  },
  Webinar: {
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    border: "border-cyan-200",
    icon: Video,
    label: "Online presentation or workshop",
  },
  Hackathon: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    icon: Code,
    label: "Competitive coding or building event",
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const event = await getEventBySlug(resolvedParams.slug);

  if (!event) {
    return {
      title: "Event Not Found",
    };
  }

  return {
    title: event.name,
    description: event.description.slice(0, 160),
    openGraph: {
      title: event.name,
      description: event.description.slice(0, 160),
      type: "website",
      images: event.imageUrl ? [{ url: event.imageUrl }] : undefined,
    },
  };
}

export const revalidate = 300;

export default async function EventPage({ params }: PageProps) {
  const resolvedParams = await params;
  const event = await getEventBySlug(resolvedParams.slug);

  if (!event) {
    notFound();
  }

  const relatedEvents = await getUpcomingEvents(4);
  const filteredRelated = relatedEvents
    .filter((e) => e.id !== event.id)
    .slice(0, 3);

  const formattedDate = event.date
    ? format(new Date(event.date), "EEEE, MMMM d, yyyy")
    : "";
  const formattedTime = event.date
    ? format(new Date(event.date), "h:mm a")
    : "";
  const formattedEndDate = event.endDate
    ? format(new Date(event.endDate), "MMMM d, yyyy")
    : "";

  // Generate calendar URLs
  const eventTitle = encodeURIComponent(event.name);
  const eventDesc = encodeURIComponent(event.description.slice(0, 500));
  const eventLocation = encodeURIComponent(
    event.address || event.location || event.city
  );
  const startDate = event.date
    ? new Date(event.date).toISOString().replace(/-|:|\.\d\d\d/g, "")
    : "";
  const endDate = event.endDate
    ? new Date(event.endDate).toISOString().replace(/-|:|\.\d\d\d/g, "")
    : startDate;

  const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${startDate}/${endDate}&details=${eventDesc}&location=${eventLocation}`;

  const typeConfig = eventTypeConfig[event.type] || eventTypeConfig.Meetup;
  const TypeIcon = typeConfig.icon;

  return (
    <div className="min-h-screen bg-white">
      {/* Back button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        <Link
          href="/events"
          className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to events
        </Link>
      </div>

      {/* Hero */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {event.imageUrl && (
          <div className="aspect-video rounded-2xl overflow-hidden mb-8">
            <img
              src={event.imageUrl}
              alt={event.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Event Type Banner */}
        <div className={`flex items-center gap-3 p-4 rounded-xl mb-6 ${typeConfig.bg} border ${typeConfig.border}`}>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${typeConfig.bg} border ${typeConfig.border}`}>
            <TypeIcon className={`w-6 h-6 ${typeConfig.text}`} />
          </div>
          <div>
            <p className={`font-semibold ${typeConfig.text}`}>{event.type}</p>
            <p className="text-sm text-gray-600">{typeConfig.label}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span
            className={`px-3 py-1 text-sm font-medium rounded-lg ${
              event.price === "Free"
                ? "bg-green-50 text-green-700"
                : event.price === "Freemium"
                ? "bg-yellow-50 text-yellow-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {event.price}
            {event.price === "Paid" && event.priceAmount
              ? ` - ${event.priceAmount} SEK`
              : ""}
          </span>
          <span className="px-3 py-1 text-sm font-medium rounded-lg bg-gray-100 text-gray-700">
            {event.language}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
          {event.name}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-2 space-y-6">
            {/* Date & Time */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{formattedDate}</p>
                {formattedTime && (
                  <p className="text-gray-600">{formattedTime}</p>
                )}
                {formattedEndDate && formattedEndDate !== formattedDate && (
                  <p className="text-gray-500 text-sm">
                    Ends: {formattedEndDate}
                  </p>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{event.city}</p>
                {event.location && (
                  <p className="text-gray-600">{event.location}</p>
                )}
                {event.address && (
                  <p className="text-gray-500 text-sm">{event.address}</p>
                )}
              </div>
            </div>

            {/* Organizer */}
            {event.organizer && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Organized by</p>
                  <p className="font-medium text-gray-900">{event.organizer}</p>
                </div>
              </div>
            )}

            {/* Categories */}
            {event.categories.length > 0 && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Tag className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-2">Categories</p>
                  <div className="flex flex-wrap gap-2">
                    {event.categories.map((category) => (
                      <CategoryPill key={category} category={category} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Sidebar */}
          <div className="space-y-4">
            {event.url && (
              <a
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Visit Event Page
              </a>
            )}

            <a
              href={googleCalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Add to Calendar
            </a>

            <ShareButton
              title={event.name}
              description={event.description.slice(0, 100)}
            />
          </div>
        </div>

        {/* Description */}
        <div className="prose prose-gray max-w-none mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            About this event
          </h2>
          <div className="text-gray-600 whitespace-pre-wrap">
            {event.description}
          </div>
        </div>
      </article>

      {/* Related Events */}
      {filteredRelated.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              More Upcoming Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredRelated.map((relatedEvent) => (
                <EventCard key={relatedEvent.id} event={relatedEvent} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
