import Link from "next/link";
import { format } from "date-fns";
import { Calendar, MapPin, Users, Presentation, BookOpen, Wrench, Globe, Users2, Video, Code } from "lucide-react";
import type { AIEvent, EventType } from "@/lib/types";
import CategoryPill from "./CategoryPill";

interface EventCardProps {
  event: AIEvent;
  featured?: boolean;
}

// Define colors and icons for each event type
const eventTypeConfig: Record<EventType, { bg: string; text: string; border: string; icon: React.ElementType }> = {
  Conference: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-l-purple-500",
    icon: Presentation,
  },
  Seminar: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-l-blue-500",
    icon: BookOpen,
  },
  Workshop: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-l-amber-500",
    icon: Wrench,
  },
  Summit: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-l-indigo-500",
    icon: Globe,
  },
  Meetup: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-l-green-500",
    icon: Users2,
  },
  Webinar: {
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    border: "border-l-cyan-500",
    icon: Video,
  },
  Hackathon: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-l-rose-500",
    icon: Code,
  },
};

export default function EventCard({ event, featured = false }: EventCardProps) {
  const formattedDate = event.date
    ? format(new Date(event.date), "MMM d, yyyy")
    : "";

  const typeConfig = eventTypeConfig[event.type] || eventTypeConfig.Meetup;
  const TypeIcon = typeConfig.icon;

  return (
    <Link href={`/events/${event.slug}`}>
      <article
        className={`group bg-white rounded-xl border-l-4 border border-gray-100 transition-all duration-200 hover:shadow-lg hover:border-gray-200 ${typeConfig.border} ${
          featured ? "ring-2 ring-blue-100 shadow-sm" : ""
        }`}
      >
        {event.imageUrl && (
          <div className="aspect-video overflow-hidden rounded-tr-xl">
            <img
              src={event.imageUrl}
              alt={event.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <div className="p-5">
          {/* Event Type Badge - Prominent */}
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg ${typeConfig.bg} ${typeConfig.text}`}
            >
              <TypeIcon className="w-3.5 h-3.5" />
              {event.type}
            </span>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-md ${
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
          </div>

          <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {event.name}
          </h3>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <MapPin className="w-4 h-4" />
              <span>{event.city}</span>
            </div>
            {event.organizer && (
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Users className="w-4 h-4" />
                <span className="truncate">{event.organizer}</span>
              </div>
            )}
          </div>

          {event.categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {event.categories.slice(0, 3).map((category) => (
                <CategoryPill key={category} category={category} size="sm" />
              ))}
              {event.categories.length > 3 && (
                <span className="px-2 py-0.5 text-xs text-gray-500">
                  +{event.categories.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
