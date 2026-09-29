"use client";

import React from "react";

interface VedaLogoProps {
  className?: string;
  size?: number | string;
}

export function VedaLogo({ className = "w-9 h-9", size }: VedaLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-label="VEDA Logo"
    >
      <defs>
        <linearGradient id="vedaBgCmp" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4A2BC2" />
          <stop offset="100%" stop-color="#2B1382" />
        </linearGradient>
        <linearGradient id="vedaleftCmp" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF" />
          <stop offset="100%" stop-color="#D4C8FF" />
        </linearGradient>
        <linearGradient id="vedarightCmp" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#C7B5FF" />
          <stop offset="100%" stop-color="#8C66FF" />
        </linearGradient>
        <linearGradient id="vedaNodeCmp" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00F2FE" />
          <stop offset="100%" stop-color="#00A896" />
        </linearGradient>
      </defs>

      {/* Rounded Squircle Badge Base */}
      <rect width="100" height="100" rx="22" fill="url(#vedaBgCmp)" />
      <rect
        width="98"
        height="98"
        x="1"
        y="1"
        rx="21"
        stroke="#FFFFFF"
        strokeOpacity="0.18"
        strokeWidth="1.5"
        fill="none"
      />

      {/* Left Facet of V */}
      <path d="M 26 28 L 41 28 L 50 72 L 35 72 Z" fill="url(#vedaleftCmp)" />

      {/* Right Facet of V */}
      <path d="M 74 28 L 59 28 L 50 72 L 65 72 Z" fill="url(#vedarightCmp)" />

      {/* Cadastral Coordinate Diamond (Bhu-Aadhaar Node) */}
      <polygon points="50,33 58,41 50,49 42,41" fill="url(#vedaNodeCmp)" />
      <circle cx="50" cy="41" r="2.5" fill="#FFFFFF" />
    </svg>
  );
}

export default VedaLogo;
