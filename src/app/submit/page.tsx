"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import type {
  SubmitEventData,
  City,
  Category,
  EventType,
  Price,
  Language,
} from "@/lib/types";

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
const languages: Language[] = ["Swedish", "English", "Both"];

const inputClass =
  "w-full h-10 px-3.5 text-[13px] bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200 focus:border-neutral-300 transition-all duration-200";
const labelClass = "block text-[13px] font-medium text-neutral-700 mb-1.5";

export default function SubmitEventPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<SubmitEventData>({
    name: "",
    date: "",
    endDate: "",
    location: "",
    city: "Stockholm",
    address: "",
    categories: [],
    type: "Meetup",
    organizer: "",
    url: "",
    description: "",
    price: "Free",
    priceAmount: undefined,
    language: "Swedish",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit event");
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setError("Failed to submit event. Please try again.");
    }
  };

  const handleCategoryToggle = (category: Category) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  if (status === "success") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-sm w-full text-center animate-fade-in">
          <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <Check className="w-6 h-6 text-emerald-600" strokeWidth={1.5} />
          </div>
          <h1 className="text-[20px] font-semibold text-neutral-900 mb-2">Event Submitted</h1>
          <p className="text-[14px] text-neutral-500 mb-6">
            Thank you. We&apos;ll review it and publish it shortly.
          </p>
          <button
            onClick={() => router.push("/events")}
            className="text-[13px] font-medium text-neutral-900 hover:text-neutral-600 transition-colors duration-200"
          >
            Browse Events →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/50">
      {/* Header */}
      <section className="bg-white border-b border-neutral-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-2xl">
            <h1 className="text-[32px] sm:text-[40px] font-semibold text-neutral-900 mb-4 tracking-tight leading-[1.1]">
              Submit an Event
            </h1>
            <p className="text-[17px] text-neutral-600 leading-relaxed">
              Share an AI event with the Swedish community. We&apos;ll review your submission before
              publishing.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
          {/* Event Name */}
          <div>
            <label htmlFor="name" className={labelClass}>
              Event Name *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className={inputClass}
              placeholder="e.g., Stockholm AI Meetup"
            />
          </div>

          {/* Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className={labelClass}>
                Start Date *
              </label>
              <input
                type="datetime-local"
                id="date"
                required
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="endDate" className={labelClass}>
                End Date (optional)
              </label>
              <input
                type="datetime-local"
                id="endDate"
                value={formData.endDate || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className={labelClass}>
                City *
              </label>
              <select
                id="city"
                required
                value={formData.city}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, city: e.target.value as City }))
                }
                className={inputClass}
              >
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="location" className={labelClass}>
                Venue Name
              </label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                className={inputClass}
                placeholder="e.g., SUP46"
              />
            </div>
          </div>

          <div>
            <label htmlFor="address" className={labelClass}>
              Address (optional)
            </label>
            <input
              type="text"
              id="address"
              value={formData.address || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
              className={inputClass}
              placeholder="e.g., Regeringsgatan 29, Stockholm"
            />
          </div>

          {/* Event Type & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="type" className={labelClass}>
                Event Type *
              </label>
              <select
                id="type"
                required
                value={formData.type}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, type: e.target.value as EventType }))
                }
                className={inputClass}
              >
                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="price" className={labelClass}>
                Price *
              </label>
              <select
                id="price"
                required
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price: e.target.value as Price }))
                }
                className={inputClass}
              >
                {prices.map((price) => (
                  <option key={price} value={price}>
                    {price}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="language" className={labelClass}>
                Language *
              </label>
              <select
                id="language"
                required
                value={formData.language}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, language: e.target.value as Language }))
                }
                className={inputClass}
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {formData.price === "Paid" && (
            <div>
              <label htmlFor="priceAmount" className={labelClass}>
                Price Amount (SEK)
              </label>
              <input
                type="number"
                id="priceAmount"
                value={formData.priceAmount || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    priceAmount: e.target.value ? parseInt(e.target.value) : undefined,
                  }))
                }
                className={inputClass}
                placeholder="e.g., 500"
              />
            </div>
          )}

          {/* Categories */}
          <div>
            <label className={labelClass}>Categories *</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryToggle(category)}
                  className={`h-8 px-3 rounded-md text-[12px] font-medium transition-all duration-200 ${
                    formData.categories.includes(category)
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            {formData.categories.length === 0 && (
              <p className="text-[12px] text-neutral-400 mt-2">Select at least one category</p>
            )}
          </div>

          {/* Organizer */}
          <div>
            <label htmlFor="organizer" className={labelClass}>
              Organizer *
            </label>
            <input
              type="text"
              id="organizer"
              required
              value={formData.organizer}
              onChange={(e) => setFormData((prev) => ({ ...prev, organizer: e.target.value }))}
              className={inputClass}
              placeholder="e.g., AI Sweden"
            />
          </div>

          {/* URL */}
          <div>
            <label htmlFor="url" className={labelClass}>
              Event URL *
            </label>
            <input
              type="url"
              id="url"
              required
              value={formData.url}
              onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
              className={inputClass}
              placeholder="https://..."
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className={labelClass}>
              Description *
            </label>
            <textarea
              id="description"
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className={`${inputClass} h-auto py-2.5 resize-none`}
              placeholder="Describe your event..."
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-[13px] rounded-md">{error}</div>
          )}

          <button
            type="submit"
            disabled={status === "loading" || formData.categories.length === 0}
            className="w-full h-11 flex items-center justify-center gap-2 bg-neutral-900 text-white text-[13px] font-medium rounded-md hover:bg-neutral-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
                Submitting...
              </>
            ) : (
              "Submit Event"
            )}
          </button>
        </form>
      </section>
    </div>
  );
}
