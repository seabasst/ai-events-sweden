"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
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
  "Seminar",
  "Summit",
  "Workshop",
  "Meetup",
  "Webinar",
  "Hackathon",
];

const prices: Price[] = ["Free", "Paid", "Freemium"];

function getMonthOptions(): { value: string; label: string }[] {
  const months: { value: string; label: string }[] = [];
  const now = new Date();

  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const label = date.toLocaleDateString("en-SE", { month: "long", year: "numeric" });
    months.push({ value, label });
  }

  return months;
}

interface FilterBarProps {
  basePath?: string;
  showDateFilter?: boolean;
  showTypeFilter?: boolean;
}

export default function FilterBar({
  basePath,
  showDateFilter = true,
  showTypeFilter = true,
}: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const targetPath = basePath || pathname;

  const currentCity = searchParams.get("city") as City | null;
  const currentCategory = searchParams.get("category") as Category | null;
  const currentType = searchParams.get("type") as EventType | null;
  const currentPrice = searchParams.get("price") as Price | null;
  const currentMonth = searchParams.get("month");

  const updateFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      const queryString = params.toString();
      router.push(queryString ? `${targetPath}?${queryString}` : targetPath);
    },
    [searchParams, router, targetPath]
  );

  const clearAllFilters = useCallback(() => {
    router.push(targetPath);
  }, [router, targetPath]);

  const hasFilters =
    currentCity || currentCategory || currentType || currentPrice || currentMonth;

  const monthOptions = getMonthOptions();

  const selectClass =
    "h-9 px-3 text-[13px] bg-white border border-neutral-200 rounded-md text-neutral-600 hover:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-200 focus:border-neutral-300 cursor-pointer transition-all duration-200";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={currentCity || ""}
        onChange={(e) => updateFilter("city", e.target.value || null)}
        className={`${selectClass} ${currentCity ? "border-neutral-400 bg-neutral-50" : ""}`}
      >
        <option value="">City</option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>

      {showDateFilter && (
        <select
          value={currentMonth || ""}
          onChange={(e) => updateFilter("month", e.target.value || null)}
          className={`${selectClass} ${currentMonth ? "border-neutral-400 bg-neutral-50" : ""}`}
        >
          <option value="">Month</option>
          {monthOptions.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
      )}

      <select
        value={currentCategory || ""}
        onChange={(e) => updateFilter("category", e.target.value || null)}
        className={`${selectClass} ${currentCategory ? "border-neutral-400 bg-neutral-50" : ""}`}
      >
        <option value="">Category</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      {showTypeFilter && (
        <select
          value={currentType || ""}
          onChange={(e) => updateFilter("type", e.target.value || null)}
          className={`${selectClass} ${currentType ? "border-neutral-400 bg-neutral-50" : ""}`}
        >
          <option value="">Type</option>
          {eventTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      )}

      <select
        value={currentPrice || ""}
        onChange={(e) => updateFilter("price", e.target.value || null)}
        className={`${selectClass} ${currentPrice ? "border-neutral-400 bg-neutral-50" : ""}`}
      >
        <option value="">Price</option>
        {prices.map((price) => (
          <option key={price} value={price}>
            {price}
          </option>
        ))}
      </select>

      {hasFilters && (
        <button
          onClick={clearAllFilters}
          className="flex items-center gap-1.5 h-9 px-3 text-[13px] text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-all duration-200"
        >
          <X className="w-3.5 h-3.5" strokeWidth={1.5} />
          Clear
        </button>
      )}
    </div>
  );
}
