"use client";

import { useState } from "react";

interface PartnerLogoProps {
  name: string;
  logoUrl?: string;
  logoColor: string;
}

export default function PartnerLogo({ name, logoUrl, logoColor }: PartnerLogoProps) {
  const [hasError, setHasError] = useState(false);

  if (!logoUrl || hasError) {
    return (
      <div className={`w-12 h-12 rounded-lg ${logoColor} flex items-center justify-center flex-shrink-0`}>
        <span className="text-[18px] font-semibold text-white">{name.charAt(0)}</span>
      </div>
    );
  }

  return (
    <div className="w-12 h-12 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center overflow-hidden flex-shrink-0">
      <img
        src={logoUrl}
        alt={`${name} logo`}
        className="w-8 h-8 object-contain"
        onError={() => setHasError(true)}
      />
    </div>
  );
}
