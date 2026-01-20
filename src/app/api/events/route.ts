import { NextRequest, NextResponse } from "next/server";
import { getEvents, submitEvent } from "@/lib/notion";
import { checkRateLimit } from "@/lib/rate-limit";
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

// Extended type for submission with bot protection fields
interface SubmitEventRequest extends SubmitEventData {
  // Honeypot field - should be empty for real users
  website?: string;
  // Timestamp when form was loaded (for time-based check)
  _formLoadedAt?: number;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const clientIp = forwardedFor?.split(",")[0] || realIp || "unknown";

    // Check rate limit (5 submissions per hour per IP)
    const rateLimit = checkRateLimit(`event-submit:${clientIp}`, {
      maxRequests: 5,
      windowMs: 60 * 60 * 1000, // 1 hour
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Too many submissions. Please try again later.",
          retryAfter: Math.ceil(rateLimit.resetIn / 1000)
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(rateLimit.resetIn / 1000)),
            "X-RateLimit-Remaining": "0",
          }
        }
      );
    }

    const body: SubmitEventRequest = await request.json();

    // Bot Protection 1: Honeypot field check
    // If the hidden "website" field is filled, it's likely a bot
    if (body.website) {
      // Silently reject but return success to not tip off bots
      console.log(`[Bot detected] Honeypot triggered from IP: ${clientIp}`);
      return NextResponse.json({ success: true, eventId: "submitted" });
    }

    // Bot Protection 2: Time-based check
    // If form was submitted in less than 3 seconds, likely a bot
    if (body._formLoadedAt) {
      const submissionTime = Date.now() - body._formLoadedAt;
      if (submissionTime < 3000) { // Less than 3 seconds
        console.log(`[Bot detected] Too fast submission (${submissionTime}ms) from IP: ${clientIp}`);
        return NextResponse.json({ success: true, eventId: "submitted" });
      }
    }

    // Bot Protection 3: Content validation
    // Check for suspicious patterns in the submission
    const suspiciousPatterns = [
      /\[url=.*\]/i,           // BBCode links
      /<a\s+href=/i,           // HTML links
      /viagra|cialis|casino/i, // Common spam keywords
      /(.)\1{10,}/,            // Repeated characters (aaaaaaaaaa)
    ];

    const textContent = `${body.name} ${body.description} ${body.organizer}`;
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(textContent)) {
        console.log(`[Bot detected] Suspicious content from IP: ${clientIp}`);
        return NextResponse.json({ success: true, eventId: "submitted" });
      }
    }

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

    // Additional URL validation
    try {
      const url = new URL(body.url);
      // Block certain TLDs commonly used for spam
      const blockedTLDs = [".tk", ".ml", ".ga", ".cf", ".gq"];
      if (blockedTLDs.some(tld => url.hostname.endsWith(tld))) {
        console.log(`[Bot detected] Blocked TLD from IP: ${clientIp}`);
        return NextResponse.json({ success: true, eventId: "submitted" });
      }
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Remove bot protection fields before submitting
    const { website: _website, _formLoadedAt: _loadedAt, ...eventData } = body;

    const eventId = await submitEvent(eventData);

    return NextResponse.json(
      { success: true, eventId },
      {
        headers: {
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        }
      }
    );
  } catch (error) {
    console.error("Failed to submit event:", error);
    return NextResponse.json(
      { error: "Failed to submit event" },
      { status: 500 }
    );
  }
}
