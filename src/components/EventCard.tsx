"use client";

import Link from "next/link";
import { format } from "date-fns";
import { MapPin, ArrowUpRight } from "lucide-react";
import type { AIEvent } from "@/lib/types";

interface EventCardProps {
  event: AIEvent;
  featured?: boolean;
}

export default function EventCard({ event, featured = false }: EventCardProps) {
  const formattedDate = event.date
    ? format(new Date(event.date), "MMM d")
    : "";
  const formattedDay = event.date
    ? format(new Date(event.date), "EEE")
    : "";

  return (
    <Link href={`/events/${event.slug}`}>
      <article
        className={`group relative bg-white rounded-xl border transition-all duration-200 hover:border-gray-300 hover:shadow-sm ${
          featured ? "border-emerald-200 bg-emerald-50/30" : "border-gray-200"
        }`}
      >
        <div className="p-5">
          {/* Top row: Date and Type */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wide">{formattedDay}</p>
                <p className="text-lg font-semibold text-gray-900">{formattedDate}</p>
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {event.type}
              </span>
            </div>
            {event.price === "Free" && (
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                Free
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-gray-600 transition-colors line-clamp-2 leading-snug">
            {event.name}
          </h3>

          {/* Location & Organizer */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {event.city}
            </span>
            {event.organizer && (
              <>
                <span className="text-gray-300">·</span>
                <span className="truncate">{event.organizer}</span>
              </>
            )}
          </div>
        </div>

        {/* Hover arrow indicator */}
        <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowUpRight className="w-4 h-4 text-gray-400" />
        </div>
      </article>
    </Link>
  );
}
