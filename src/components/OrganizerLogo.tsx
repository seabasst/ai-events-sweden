"use client";

import { useState } from "react";
import { Users } from "lucide-react";

// Extract domain from URL for logo fetching
function getDomainFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace("www.", "");
  } catch {
    return null;
  }
}

// Get logo URL using Google's favicon service (higher quality)
function getLogoUrl(url: string): string | null {
  const domain = getDomainFromUrl(url);
  if (!domain) return null;
  // Use Google's favicon service with size 64 for better quality
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

interface OrganizerLogoProps {
  url: string;
  organizer: string;
  size?: "sm" | "md" | "lg";
}

export default function OrganizerLogo({ url, organizer, size = "sm" }: OrganizerLogoProps) {
  const [hasError, setHasError] = useState(false);
  const logoUrl = getLogoUrl(url);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  if (!logoUrl || hasError) {
    return <Users className={`${sizeClasses[size]} text-gray-400`} />;
  }

  return (
    <img
      src={logoUrl}
      alt={`${organizer} logo`}
      className={`${sizeClasses[size]} rounded-sm object-contain`}
      onError={() => setHasError(true)}
    />
  );
}
