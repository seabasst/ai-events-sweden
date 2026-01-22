"use client";

import Link from "next/link";
import { format } from "date-fns";
import { MapPin, ArrowRight } from "lucide-react";
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
        className={`group relative bg-white rounded-lg border transition-all duration-300 ${
          featured
            ? "border-emerald-200/80 bg-gradient-to-r from-emerald-50/40 to-transparent"
            : "border-neutral-200/80 hover:border-neutral-300"
        } hover:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)]`}
      >
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-5">
            {/* Date block */}
            <div className="flex-shrink-0 w-14 text-center">
              <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                {formattedDay}
              </p>
              <p className="text-xl font-semibold text-neutral-900 -mt-0.5">
                {formattedDate}
              </p>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-12 bg-neutral-200/80 flex-shrink-0" />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                  {event.type}
                </span>
                {event.price === "Free" && (
                  <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Free
                  </span>
                )}
              </div>

              <h3 className="text-[15px] font-semibold text-neutral-900 mb-2.5 group-hover:text-neutral-600 transition-colors duration-200 line-clamp-2 leading-snug">
                {event.name}
              </h3>

              <div className="flex items-center gap-3 text-[13px] text-neutral-500">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" strokeWidth={1.5} />
                  {event.city}
                </span>
                {event.organizer && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-neutral-300" />
                    <span className="truncate max-w-[180px]">{event.organizer}</span>
                  </>
                )}
              </div>
            </div>

            {/* Arrow indicator */}
            <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-neutral-50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex-shrink-0 self-center">
              <ArrowRight className="w-4 h-4 text-neutral-500" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
