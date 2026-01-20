// Simple in-memory rate limiter
// For production, consider using Redis or Vercel KV

interface RateLimitEntry {
  count: number;
  firstRequest: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now - entry.firstRequest > 60 * 60 * 1000) { // 1 hour
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

interface RateLimitConfig {
  maxRequests: number;  // Max requests allowed
  windowMs: number;     // Time window in milliseconds
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { maxRequests: 5, windowMs: 60 * 60 * 1000 } // 5 per hour by default
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry) {
    // First request from this identifier
    rateLimitMap.set(identifier, { count: 1, firstRequest: now });
    return { allowed: true, remaining: config.maxRequests - 1, resetIn: config.windowMs };
  }

  // Check if window has expired
  if (now - entry.firstRequest > config.windowMs) {
    // Reset the window
    rateLimitMap.set(identifier, { count: 1, firstRequest: now });
    return { allowed: true, remaining: config.maxRequests - 1, resetIn: config.windowMs };
  }

  // Within window, check count
  if (entry.count >= config.maxRequests) {
    const resetIn = config.windowMs - (now - entry.firstRequest);
    return { allowed: false, remaining: 0, resetIn };
  }

  // Increment count
  entry.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetIn: config.windowMs - (now - entry.firstRequest)
  };
}
