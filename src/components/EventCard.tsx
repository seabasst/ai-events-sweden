"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Calendar, MapPin, Presentation, BookOpen, Wrench, Globe, Users2, Video, Code, Sparkles } from "lucide-react";
import type { AIEvent, EventType } from "@/lib/types";
import OrganizerLogo from "./OrganizerLogo";

interface EventCardProps {
  event: AIEvent;
  featured?: boolean;
}

// Define colors and icons for each event type
const eventTypeConfig: Record<EventType, { bg: string; text: string; gradient: string; icon: React.ElementType }> = {
  Conference: {
    bg: "bg-purple-600",
    text: "text-white",
    gradient: "from-purple-600 to-purple-800",
    icon: Presentation,
  },
  Seminar: {
    bg: "bg-blue-600",
    text: "text-white",
    gradient: "from-blue-600 to-blue-800",
    icon: BookOpen,
  },
  Workshop: {
    bg: "bg-amber-500",
    text: "text-white",
    gradient: "from-amber-500 to-amber-700",
    icon: Wrench,
  },
  Summit: {
    bg: "bg-indigo-600",
    text: "text-white",
    gradient: "from-indigo-600 to-indigo-800",
    icon: Globe,
  },
  Meetup: {
    bg: "bg-green-600",
    text: "text-white",
    gradient: "from-green-600 to-green-800",
    icon: Users2,
  },
  Webinar: {
    bg: "bg-cyan-600",
    text: "text-white",
    gradient: "from-cyan-600 to-cyan-800",
    icon: Video,
  },
  Hackathon: {
    bg: "bg-rose-600",
    text: "text-white",
    gradient: "from-rose-600 to-rose-800",
    icon: Code,
  },
};

export default function EventCard({ event, featured = false }: EventCardProps) {
  const formattedDate = event.date
    ? format(new Date(event.date), "EEE, MMM d")
    : "";
  const formattedTime = event.date
    ? format(new Date(event.date), "h:mm a")
    : "";

  const typeConfig = eventTypeConfig[event.type] || eventTypeConfig.Meetup;
  const TypeIcon = typeConfig.icon;

  return (
    <Link href={`/events/${event.slug}`}>
      <article
        className={`group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
          featured ? "ring-2 ring-orange-400 shadow-md" : ""
        }`}
      >
        {/* Image Section */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            // Gradient placeholder when no image
            <div className={`w-full h-full bg-gradient-to-br ${typeConfig.gradient} flex items-center justify-center`}>
              <TypeIcon className="w-16 h-16 text-white/30" />
            </div>
          )}

          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />

          {/* Event Type Badge - Overlaid on image */}
          <div className="absolute top-3 left-3">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${typeConfig.bg} ${typeConfig.text} shadow-lg backdrop-blur-sm`}
            >
              <TypeIcon className="w-3 h-3" />
              {event.type}
            </span>
          </div>

          {/* Price Badge - Top right */}
          <div className="absolute top-3 right-3">
            <span
              className={`px-2.5 py-1 text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm ${
                event.price === "Free"
                  ? "bg-green-500 text-white"
                  : event.price === "Freemium"
                  ? "bg-yellow-500 text-white"
                  : "bg-white/90 text-gray-800"
              }`}
            >
              {event.price === "Free" ? "Free" : event.price === "Paid" && event.priceAmount ? `${event.priceAmount} SEK` : event.price}
            </span>
          </div>

          {/* Featured Badge */}
          {featured && (
            <div className="absolute bottom-3 left-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-orange-500 text-white shadow-lg">
                <Sparkles className="w-3 h-3" />
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Date - Prominent like Eventbrite */}
          <p className="text-orange-600 font-semibold text-sm mb-2">
            {formattedDate} {formattedTime && `• ${formattedTime}`}
          </p>

          {/* Title */}
          <h3 className="font-bold text-gray-900 text-base mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
            {event.name}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{event.location || event.city}</span>
          </div>

          {/* Organizer */}
          {event.organizer && (
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              <OrganizerLogo url={event.url} organizer={event.organizer} />
              <span className="text-gray-600 text-sm truncate">{event.organizer}</span>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
