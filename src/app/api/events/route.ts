import { NextRequest, NextResponse } from "next/server";
import { getEvents, submitEvent } from "@/lib/notion";
import type { EventFilters, SubmitEventData } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: EventFilters = {};

    const city = searchParams.get("city");
    const category = searchParams.get("category");
    const type = searchParams.get("type");
    const price = searchParams.get("price");
    const search = searchParams.get("search");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    if (city) filters.city = city as EventFilters["city"];
    if (category) filters.category = category as EventFilters["category"];
    if (type) filters.type = type as EventFilters["type"];
    if (price) filters.price = price as EventFilters["price"];
    if (search) filters.search = search;
    if (dateFrom) filters.dateFrom = dateFrom;
    if (dateTo) filters.dateTo = dateTo;

    const events = await getEvents(filters);

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: SubmitEventData = await request.json();

    // Validate required fields
    if (
      !body.name ||
      !body.date ||
      !body.city ||
      !body.type ||
      !body.organizer ||
      !body.url ||
      !body.description ||
      !body.price ||
      !body.language ||
      !body.categories?.length
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const eventId = await submitEvent(body);

    return NextResponse.json({ success: true, eventId });
  } catch (error) {
    console.error("Failed to submit event:", error);
    return NextResponse.json(
      { error: "Failed to submit event" },
      { status: 500 }
    );
  }
}
