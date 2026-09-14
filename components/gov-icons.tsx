import React from "react";

export function AshokaEmblem({ className = "h-14 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 125"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="State Emblem of India"
    >
      {/* Central Lion */}
      <path d="M50 14 C46 14 43 17 43 21 C43 23 44 25 45 27 C41 27 38 30 38 34 C38 37 40 40 43 41 C43 45 45 49 48 52 L48 58 L45 58 C44 58 43 59 43 60 L43 64 L57 64 L57 60 C57 59 56 58 55 58 L52 58 L52 52 C55 49 57 45 57 41 C60 40 62 37 62 34 C62 30 59 27 55 27 C56 25 57 23 57 21 C57 17 54 14 50 14 Z" />
      {/* Left Lion head profile */}
      <path d="M36 24 C33 24 30 27 30 30 C30 32 31 33 32 34 C29 35 27 38 27 41 C27 44 29 46 32 47 C32 50 34 53 37 55 L38 51 C36 49 35 46 35 44 C35 42 36 40 37 39 C36 38 35 36 35 34 C35 32 36 30 38 29 Z" />
      {/* Right Lion head profile */}
      <path d="M64 24 C67 24 70 27 70 30 C70 32 69 33 68 34 C71 35 73 38 73 41 C73 44 71 46 68 47 C68 50 66 53 63 55 L62 51 C64 49 65 46 65 44 C65 42 64 40 63 39 C64 38 65 36 65 34 C65 32 64 30 62 29 Z" />
      {/* Abacus / Pedestal */}
      <rect x="22" y="66" width="56" height="12" rx="2" fill="currentColor" />
      {/* Ashoka Chakra in Center of Abacus */}
      <circle cx="50" cy="72" r="5" fill="none" stroke="#ffffff" strokeWidth="1.2" />
      <circle cx="50" cy="72" r="1.2" fill="#ffffff" />
      {/* Bull on Left */}
      <ellipse cx="32" cy="72" rx="3.5" ry="2.2" fill="#ffffff" />
      {/* Horse on Right */}
      <ellipse cx="68" cy="72" rx="3.5" ry="2.2" fill="#ffffff" />
      {/* Bell / Lotus Base */}
      <path d="M26 80 Q50 83 74 80 L72 87 Q50 91 28 87 Z" fill="currentColor" opacity="0.9" />
      {/* Base Platform */}
      <rect x="20" y="88" width="60" height="4" rx="1" fill="currentColor" />
      {/* Satyameva Jayate in Devanagari */}
      <text
        x="50"
        y="104"
        textAnchor="middle"
        fontSize="10"
        fontWeight="700"
        fill="currentColor"
        fontFamily="sans-serif"
        letterSpacing="1"
      >
        सत्यमेव जयते
      </text>
    </svg>
  );
}

export function DigitalIndiaLogo({ className = "h-10 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 font-bold tracking-tight select-none ${className}`}>
      <div className="relative flex flex-col items-center justify-center w-8 h-8 rounded-full border border-orange-500 bg-orange-50/50 p-1">
        <span className="text-[10px] text-orange-600 font-extrabold leading-none">DI</span>
        <div className="w-5 h-0.5 bg-green-600 mt-0.5 rounded-full" />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-[13px] font-black text-slate-800 tracking-wider">Digital India</span>
        <span className="text-[9px] font-medium text-slate-500">Power To Empower</span>
      </div>
    </div>
  );
}

export function MeghRajLogo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 border border-sky-200 bg-sky-50/70 px-2.5 py-1 rounded text-sky-900 ${className}`}>
      <svg className="w-5 h-5 text-sky-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
      <div className="text-[10px] leading-tight">
        <div className="font-bold text-sky-950">MeghRaj</div>
        <div className="text-[8px] text-sky-700 font-medium">GI Cloud • NIC</div>
      </div>
    </div>
  );
}

export function NICBadge({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 border border-slate-300 bg-white px-2 py-1 rounded text-slate-800 ${className}`}>
      <div className="flex flex-col text-center">
        <span className="text-[11px] font-black text-blue-900 tracking-wider">एन आई सी</span>
        <span className="text-[8px] font-extrabold text-blue-700 tracking-tight">NIC</span>
      </div>
      <div className="h-6 w-[1px] bg-slate-200" />
      <div className="text-[8px] text-slate-600 leading-tight">
        <div>National Informatics</div>
        <div className="font-semibold text-slate-700">Centre</div>
      </div>
    </div>
  );
}

export function ViksitBharatBadge({ className = "h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`hidden lg:flex items-center gap-1.5 border border-amber-300 bg-amber-50/60 px-2.5 py-1 rounded text-amber-950 ${className}`}>
      <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center text-[10px] font-black shadow-xs">
        VB
      </div>
      <div className="text-[9px] leading-tight">
        <span className="font-bold text-amber-900 block">विकसित भारत @2047</span>
        <span className="text-[8px] text-amber-700">Land Governance Mission</span>
      </div>
    </div>
  );
}
