export type City =
  | "Stockholm"
  | "Göteborg"
  | "Malmö"
  | "Uppsala"
  | "Lund"
  | "Linköping"
  | "Online"
  | "Other";

export type Category =
  | "AI/ML"
  | "Data Science"
  | "Business"
  | "Research"
  | "Creative"
  | "Healthcare"
  | "Finance"
  | "Robotics"
  | "NLP";

export type EventType =
  | "Conference"
  | "Meetup"
  | "Workshop"
  | "Webinar"
  | "Hackathon"
  | "Summit"
  | "Seminar";

export type Price = "Free" | "Paid" | "Freemium";

export type Language = "Swedish" | "English" | "Both";

export type EventStatus = "Draft" | "Published" | "Cancelled";

export interface AIEvent {
  id: string;
  slug: string;
  name: string;
  date: string;
  endDate?: string;
  location: string;
  city: City;
  address?: string;
  categories: Category[];
  type: EventType;
  organizer: string;
  url: string;
  description: string;
  price: Price;
  priceAmount?: number;
  language: Language;
  imageUrl?: string;
  status: EventStatus;
  featured: boolean;
}

export interface EventFilters {
  city?: City;
  category?: Category;
  type?: EventType;
  price?: Price;
  language?: Language;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface SubmitEventData {
  name: string;
  date: string;
  endDate?: string;
  location: string;
  city: City;
  address?: string;
  categories: Category[];
  type: EventType;
  organizer: string;
  url: string;
  description: string;
  price: Price;
  priceAmount?: number;
  language: Language;
}
