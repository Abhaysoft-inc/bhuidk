"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Globe2 } from "lucide-react";

// Dynamically import MapShell to disable SSR
const MapShell = dynamic(() => import("@/components/gis/MapShell"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[700px] bg-slate-100 animate-pulse rounded-xl border border-slate-200 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-slate-400">
        <Globe2 className="w-8 h-8 animate-spin-slow" />
        <span className="font-bold text-sm">Initializing GIS Environment...</span>
      </div>
    </div>
  ),
});

export default function GisPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto pb-10 h-[calc(100vh-120px)]">
      <div className="border-b border-slate-200 pb-5 shrink-0">
        <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-2">
          <Globe2 className="w-4 h-4" />
          <span>National Spatial Data Infrastructure</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Geospatial Intelligence Map</h1>
        <p className="text-sm text-slate-500 mt-2 max-w-3xl">
          High-performance vector rendering of cadastral parcels, simulated ST_Intersects querying, and predictive dispute density mapping.
        </p>
      </div>

      <div className="flex-1 w-full relative">
        <MapShell />
      </div>
    </div>
  );
}
