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
          boxShadow: "0 0 14px 4px rgba(201, 168, 76, 0.6)",
        }}
      />
      <div
        className="relative z-10 flex items-center justify-center rounded-xl overflow-hidden"
        style={{
          width: size,
          height: size,
          backgroundColor: "#ffffff",
        }}
      >
        <svg
          role="img"
          aria-label="Vakyom"
          viewBox="0 0 100 100"
          width={size * 0.88}
          height={size * 0.88}
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Vakyom</title>
          {/* Balance scale vertical pole */}
          <rect x="48" y="18" width="4" height="44" rx="2" fill="#C9A84C" />
          {/* Horizontal beam */}
          <rect x="18" y="26" width="64" height="4" rx="2" fill="#C9A84C" />
          {/* Left scale pan string */}
          <line
            x1="22"
            y1="30"
            x2="22"
            y2="46"
            stroke="#C9A84C"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Right scale pan string */}
          <line
            x1="78"
            y1="30"
            x2="78"
            y2="46"
            stroke="#C9A84C"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Left pan */}
          <path
            d="M10 46 Q22 56 34 46"
            stroke="#C9A84C"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Right pan */}
          <path
            d="M66 46 Q78 56 90 46"
            stroke="#C9A84C"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Base foot */}
          <rect x="44" y="62" width="12" height="4" rx="2" fill="#C9A84C" />
          <rect x="36" y="66" width="28" height="4" rx="2" fill="#C9A84C" />
          {/* V letter above the beam */}
          <text
            x="50"
            y="17"
            textAnchor="middle"
            fontSize="15"
            fontWeight="900"
            fontFamily="Georgia, serif"
            fill="#1a2a4a"
          >
            V
          </text>
        </svg>
      </div>
    </div>
  );
}
