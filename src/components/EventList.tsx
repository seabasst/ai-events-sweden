import type { AIEvent } from "@/lib/types";
import EventCard from "./EventCard";

interface EventListProps {
  events: AIEvent[];
  featured?: boolean;
}

export default function EventList({ events, featured = false }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">No events found.</p>
        <p className="text-gray-400 mt-2">
          Try adjusting your filters or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} featured={featured} />
      ))}
    </div>
  );
}
