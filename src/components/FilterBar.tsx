"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { X } from "lucide-react";
import type { City, Category, EventType, Price } from "@/lib/types";

const cities: City[] = [
  "Stockholm",
  "Göteborg",
  "Malmö",
  "Uppsala",
  "Lund",
  "Linköping",
  "Online",
  "Other",
];

const categories: Category[] = [
  "AI/ML",
  "Data Science",
  "Business",
  "Research",
  "Creative",
  "Healthcare",
  "Finance",
  "Robotics",
  "NLP",
];

const eventTypes: EventType[] = [
  "Conference",
  "Meetup",
  "Workshop",
  "Webinar",
  "Hackathon",
  "Summit",
  "Seminar",
];

const prices: Price[] = ["Free", "Paid", "Freemium"];

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCity = searchParams.get("city") as City | null;
  const currentCategory = searchParams.get("category") as Category | null;
  const currentType = searchParams.get("type") as EventType | null;
  const currentPrice = searchParams.get("price") as Price | null;

  const updateFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/events?${params.toString()}`);
    },
    [searchParams, router]
  );

  const clearAllFilters = useCallback(() => {
    router.push("/events");
  }, [router]);

  const hasFilters = currentCity || currentCategory || currentType || currentPrice;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <select
          value={currentCity || ""}
          onChange={(e) => updateFilter("city", e.target.value || null)}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        <select
          value={currentCategory || ""}
          onChange={(e) => updateFilter("category", e.target.value || null)}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={currentType || ""}
          onChange={(e) => updateFilter("type", e.target.value || null)}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Types</option>
          {eventTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={currentPrice || ""}
          onChange={(e) => updateFilter("price", e.target.value || null)}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Prices</option>
          {prices.map((price) => (
            <option key={price} value={price}>
              {price}
            </option>
          ))}
        </select>

        {hasFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <X className="w-4 h-4" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
