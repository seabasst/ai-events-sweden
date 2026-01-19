import Link from "next/link";
import { format } from "date-fns";
import { Calendar, MapPin, Users, Tag } from "lucide-react";
import type { AIEvent } from "@/lib/types";
import CategoryPill from "./CategoryPill";

interface EventCardProps {
  event: AIEvent;
  featured?: boolean;
}

export default function EventCard({ event, featured = false }: EventCardProps) {
  const formattedDate = event.date
    ? format(new Date(event.date), "MMM d, yyyy")
    : "";

  return (
    <Link href={`/events/${event.slug}`}>
      <article
        className={`group bg-white rounded-xl border transition-all duration-200 hover:shadow-lg hover:border-gray-200 ${
          featured ? "border-blue-100 shadow-sm" : "border-gray-100"
        }`}
      >
        {event.imageUrl && (
          <div className="aspect-video overflow-hidden rounded-t-xl">
            <img
              src={event.imageUrl}
              alt={event.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
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
            <span className="px-2 py-1 text-xs font-medium rounded-md bg-blue-50 text-blue-700">
              {event.type}
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
