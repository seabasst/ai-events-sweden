import { Client } from "@notionhq/client";
import type {
  PageObjectResponse,
  QueryDatabaseParameters,
} from "@notionhq/client/build/src/api-endpoints";
import type {
  AIEvent,
  EventFilters,
  SubmitEventData,
  City,
  Category,
  EventType,
  Price,
  Language,
  EventStatus,
} from "./types";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const databaseId = process.env.NOTION_DATABASE_ID || "";

function isConfigured(): boolean {
  return Boolean(process.env.NOTION_API_KEY && process.env.NOTION_DATABASE_ID);
}

function generateSlug(name: string, id: string): string {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  // Use last 12 characters of ID (without dashes) for uniqueness
  const idWithoutDashes = id.replace(/-/g, "");
  const uniqueId = idWithoutDashes.slice(-12);
  return `${baseSlug}-${uniqueId}`;
}

// Blocked aggregator/spam domains - events from these sites are hidden entirely
const blockedDomains = [
  "allconferencealert.com",
  "allconferencealerts.com",
  "conferencealert.com",
  "conferenceindex.org",
  "10times.com",
  "eventbrite.com",
  "eventbrite.se",
  "eventbrite.ie",
  "eventbrite.co.uk",
];

// Check if event should be completely hidden (spam/aggregator sites)
function shouldHideEvent(url: string): boolean {
  if (!url) return false;
  const lowerUrl = url.toLowerCase();
  return blockedDomains.some((domain) => lowerUrl.includes(domain));
}

// Patterns that indicate a generic listing page (not a specific event)
const genericListingPatterns = [
  /\/events\/?$/i,                    // Ends with /events or /events/
  /\/events\/?\?/i,                   // /events with query params
  /\/upcoming\/?$/i,                  // Ends with /upcoming
  /\/calendar\/?$/i,                  // Ends with /calendar
  /\/all-events\/?$/i,                // Ends with /all-events
  /eventbrite\.com\/d\//i,            // Eventbrite search pages
  /meetup\.com\/find\//i,             // Meetup search pages
];

// Check if URL points to a specific event page (exported for use in components)
export function isSpecificEventUrl(url: string): boolean {
  if (!url) return false;

  // Check for generic listing page patterns
  for (const pattern of genericListingPatterns) {
    if (pattern.test(url)) {
      return false;
    }
  }

  return true;
}

function getPropertyValue(
  page: PageObjectResponse,
  propertyName: string
): unknown {
  const property = page.properties[propertyName];
  if (!property) return null;

  switch (property.type) {
    case "title":
      return property.title[0]?.plain_text || "";
    case "rich_text":
      return property.rich_text[0]?.plain_text || "";
    case "date":
      return property.date;
    case "select":
      return property.select?.name || null;
    case "multi_select":
      return property.multi_select.map((item) => item.name);
    case "checkbox":
      return property.checkbox;
    case "url":
      return property.url || "";
    case "number":
      return property.number;
    default:
      return null;
  }
}

function pageToEvent(page: PageObjectResponse): AIEvent {
  const name = getPropertyValue(page, "Name") as string;
  const dateProperty = getPropertyValue(page, "Date") as {
    start: string;
    end?: string;
  } | null;

  return {
    id: page.id,
    slug: generateSlug(name, page.id),
    name,
    date: dateProperty?.start || "",
    endDate: dateProperty?.end || undefined,
    location: (getPropertyValue(page, "Location") as string) || "",
    city: (getPropertyValue(page, "City") as City) || "Other",
    address: (getPropertyValue(page, "Address") as string) || undefined,
    categories: (getPropertyValue(page, "Category") as Category[]) || [],
    type: (getPropertyValue(page, "Type") as EventType) || "Meetup",
    organizer: (getPropertyValue(page, "Organizer") as string) || "",
    url: (getPropertyValue(page, "URL") as string) || "",
    description: (getPropertyValue(page, "Description") as string) || "",
    price: (getPropertyValue(page, "Price") as Price) || "Free",
    priceAmount: (getPropertyValue(page, "Price Amount") as number) || undefined,
    language: (getPropertyValue(page, "Language") as Language) || "Swedish",
    imageUrl: (getPropertyValue(page, "Image URL") as string) || undefined,
    status: (getPropertyValue(page, "Status") as EventStatus) || "Draft",
    featured: (getPropertyValue(page, "Featured") as boolean) || false,
  };
}

export async function getEvents(filters?: EventFilters): Promise<AIEvent[]> {
  if (!isConfigured()) {
    console.warn("Notion is not configured. Set NOTION_API_KEY and NOTION_DATABASE_ID.");
    return [];
  }

  const filterConditions: QueryDatabaseParameters["filter"] = {
    and: [
      {
        property: "Status",
        select: {
          equals: "Published",
        },
      },
      {
        property: "Date",
        date: {
          on_or_after: new Date().toISOString().split("T")[0],
        },
      },
    ],
  };

  if (filters) {
    if (filters.city) {
      (filterConditions.and as Array<object>).push({
        property: "City",
        select: { equals: filters.city },
      });
    }
    if (filters.category) {
      (filterConditions.and as Array<object>).push({
        property: "Category",
        multi_select: { contains: filters.category },
      });
    }
    if (filters.type) {
      (filterConditions.and as Array<object>).push({
        property: "Type",
        select: { equals: filters.type },
      });
    }
    if (filters.price) {
      (filterConditions.and as Array<object>).push({
        property: "Price",
        select: { equals: filters.price },
      });
    }
    if (filters.language) {
      (filterConditions.and as Array<object>).push({
        property: "Language",
        select: { equals: filters.language },
      });
    }
    if (filters.dateFrom) {
      (filterConditions.and as Array<object>).push({
        property: "Date",
        date: { on_or_after: filters.dateFrom },
      });
    }
    if (filters.dateTo) {
      (filterConditions.and as Array<object>).push({
        property: "Date",
        date: { on_or_before: filters.dateTo },
      });
    }
  }

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: filterConditions,
    sorts: [
      {
        property: "Date",
        direction: "ascending",
      },
    ],
  });

  let events = response.results
    .filter((page): page is PageObjectResponse => "properties" in page)
    .map(pageToEvent)
    .filter((event) => !shouldHideEvent(event.url)); // Filter out invalid URLs

  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    events = events.filter(
      (event) =>
        event.name.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.organizer.toLowerCase().includes(searchLower)
    );
  }

  return events;
}

export async function getEventBySlug(slug: string): Promise<AIEvent | null> {
  if (!isConfigured()) {
    return null;
  }

  // Extract the last 12 characters (the unique ID part)
  const idPart = slug.split("-").pop();
  if (!idPart || idPart.length < 12) return null;

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: "Status",
      select: {
        equals: "Published",
      },
    },
  });

  const page = response.results
    .filter((p): p is PageObjectResponse => "properties" in p)
    .find((p) => p.id.replace(/-/g, "").endsWith(idPart));

  if (!page) return null;

  return pageToEvent(page);
}

export async function getFeaturedEvents(): Promise<AIEvent[]> {
  if (!isConfigured()) {
    return [];
  }

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      and: [
        {
          property: "Status",
          select: {
            equals: "Published",
          },
        },
        {
          property: "Featured",
          checkbox: {
            equals: true,
          },
        },
        {
          property: "Date",
          date: {
            on_or_after: new Date().toISOString().split("T")[0],
          },
        },
      ],
    },
    sorts: [
      {
        property: "Date",
        direction: "ascending",
      },
    ],
    page_size: 5,
  });

  return response.results
    .filter((page): page is PageObjectResponse => "properties" in page)
    .map(pageToEvent)
    .filter((event) => !shouldHideEvent(event.url));
}

export async function getUpcomingEvents(limit = 10): Promise<AIEvent[]> {
  if (!isConfigured()) {
    return [];
  }

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      and: [
        {
          property: "Status",
          select: {
            equals: "Published",
          },
        },
        {
          property: "Date",
          date: {
            on_or_after: new Date().toISOString().split("T")[0],
          },
        },
      ],
    },
    sorts: [
      {
        property: "Date",
        direction: "ascending",
      },
    ],
    page_size: limit,
  });

  return response.results
    .filter((page): page is PageObjectResponse => "properties" in page)
    .map(pageToEvent)
    .filter((event) => !shouldHideEvent(event.url));
}

export async function getPastEvents(filters?: EventFilters): Promise<AIEvent[]> {
  if (!isConfigured()) {
    return [];
  }

  const filterConditions: QueryDatabaseParameters["filter"] = {
    and: [
      {
        property: "Status",
        select: {
          equals: "Published",
        },
      },
      {
        property: "Date",
        date: {
          before: new Date().toISOString().split("T")[0],
        },
      },
    ],
  };

  if (filters) {
    if (filters.city) {
      (filterConditions.and as Array<object>).push({
        property: "City",
        select: { equals: filters.city },
      });
    }
    if (filters.category) {
      (filterConditions.and as Array<object>).push({
        property: "Category",
        multi_select: { contains: filters.category },
      });
    }
    if (filters.type) {
      (filterConditions.and as Array<object>).push({
        property: "Type",
        select: { equals: filters.type },
      });
    }
    if (filters.price) {
      (filterConditions.and as Array<object>).push({
        property: "Price",
        select: { equals: filters.price },
      });
    }
  }

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: filterConditions,
    sorts: [
      {
        property: "Date",
        direction: "descending",
      },
    ],
  });

  let events = response.results
    .filter((page): page is PageObjectResponse => "properties" in page)
    .map(pageToEvent)
    .filter((event) => !shouldHideEvent(event.url)); // Filter out invalid URLs

  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    events = events.filter(
      (event) =>
        event.name.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.organizer.toLowerCase().includes(searchLower)
    );
  }

  return events;
}

export async function submitEvent(data: SubmitEventData): Promise<string> {
  if (!isConfigured()) {
    throw new Error("Notion is not configured");
  }

  const response = await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      Name: {
        title: [{ text: { content: data.name } }],
      },
      Date: {
        date: {
          start: data.date,
          end: data.endDate || null,
        },
      },
      Location: {
        rich_text: [{ text: { content: data.location } }],
      },
      City: {
        select: { name: data.city },
      },
      Address: {
        rich_text: [{ text: { content: data.address || "" } }],
      },
      Category: {
        multi_select: data.categories.map((cat) => ({ name: cat })),
      },
      Type: {
        select: { name: data.type },
      },
      Organizer: {
        rich_text: [{ text: { content: data.organizer } }],
      },
      URL: {
        url: data.url,
      },
      Description: {
        rich_text: [{ text: { content: data.description } }],
      },
      Price: {
        select: { name: data.price },
      },
      "Price Amount": {
        number: data.priceAmount || null,
      },
      Language: {
        select: { name: data.language },
      },
      Status: {
        select: { name: "Draft" },
      },
      Featured: {
        checkbox: false,
      },
    },
  });

  return response.id;
}
