"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Globe2 } from "lucide-react";
import MapControls from "@/components/gis/MapControls";

// Dynamically import MapComponent to disable SSR since Leaflet uses `window`
const MapComponent = dynamic(() => import("@/components/gis/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-slate-100 animate-pulse rounded-xl border border-slate-200 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-slate-400">
        <Globe2 className="w-8 h-8 animate-spin-slow" />
        <span className="font-bold text-sm">Initializing GIS Environment...</span>
      </div>
    </div>
  ),
});

export default function GisPage() {
  const [activeLayers, setActiveLayers] = useState<string[]>(["landUse"]);
  const [isPredictorActive, setIsPredictorActive] = useState<boolean>(false);
  const [timePeriod, setTimePeriod] = useState<number>(2024);

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto pb-10">
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-2">
          <Globe2 className="w-4 h-4" />
          <span>National Spatial Data Infrastructure</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Geospatial GIS Suite</h1>
        <p className="text-sm text-slate-500 mt-2 max-w-3xl">
          Explore integrated layers from ISRO Bhuvan, Survey of India, and state land records with real-time spatial analysis and predictive modeling.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Controls Sidebar */}
        <MapControls
          activeLayers={activeLayers}
          setActiveLayers={setActiveLayers}
          isPredictorActive={isPredictorActive}
          setIsPredictorActive={setIsPredictorActive}
          timePeriod={timePeriod}
          setTimePeriod={setTimePeriod}
        />

        {/* Main Map View */}
        <div className="flex-1 w-full">
          <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
            <MapComponent
              activeLayers={activeLayers}
              isPredictorActive={isPredictorActive}
              timePeriod={timePeriod}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
