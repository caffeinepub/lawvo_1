import React from "react";

interface VakyomLogoProps {
  size?: number;
  className?: string;
}

export function VakyomLogo({ size = 36, className = "" }: VakyomLogoProps) {
  return (
    <div
      className={`relative flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Gold glow */}
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          boxShadow: "0 0 12px 3px oklch(0.72 0.14 78 / 0.4)",
        }}
      />
      <img
        src="/assets/generated/vakyom-logo-transparent.dim_120x120.png"
        alt="Vakyom Logo"
        style={{ width: size, height: size, objectFit: "contain" }}
        className="relative z-10 drop-shadow"
      />
    </div>
  );
}
