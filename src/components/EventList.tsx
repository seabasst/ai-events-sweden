import type { AIEvent } from "@/lib/types";
import EventCard from "./EventCard";

interface EventListProps {
  events: AIEvent[];
  featured?: boolean;
}

export default function EventList({ events, featured = false }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No events found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} featured={featured} />
      ))}
    </div>
  );
}
