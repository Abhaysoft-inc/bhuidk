"use client";

import React from "react";
import { MapPin, X, Loader2, Database } from "lucide-react";
import { useTerritory } from "@/context/territory-context";

export function TerritoryHeaderSelector() {
  const {
    selectedStateId,
    selectedDistrictId,
    selectedDistrictMetadata,
    availableDistricts,
    handleStateChange,
    handleDistrictChange,
    handleClearTerritory,
    statesCatalog,
    isLoadingBoundary,
  } = useTerritory();

  return (
    <div className="flex items-center gap-1.5 bg-slate-50/90 hover:bg-slate-100/90 border border-slate-200/90 p-1 rounded-xl shadow-2xs text-xs transition-colors">
      <div className="flex items-center gap-1 pl-2 pr-0.5 text-slate-500 font-bold shrink-0">
        <MapPin className="w-3.5 h-3.5 text-[#0b2b50]" />
        <span className="hidden xl:inline text-[11px] uppercase tracking-wider text-slate-400">
          Territory:
        </span>
      </div>

      {/* State Dropdown */}
      <select
        value={selectedStateId}
        onChange={(e) => handleStateChange(e.target.value)}
        className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0b2b50] transition-colors"
        title="Filter by State / UT (Census 2011)"
      >
        <option value="all">🇮🇳 All India</option>
        {statesCatalog.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      {/* District Dropdown */}
      <select
        value={selectedDistrictId || ""}
        onChange={(e) => handleDistrictChange(e.target.value)}
        disabled={selectedStateId === "all"}
        className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0b2b50] transition-colors disabled:opacity-50 disabled:cursor-not-allowed max-w-[155px] truncate"
        title="Filter by District (641 Official Census Districts)"
      >
        <option value="">
          {selectedStateId === "all" ? "— District —" : "— Select District —"}
        </option>
        {availableDistricts.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name} {d.censusCode ? `(#${d.censusCode})` : ""}
          </option>
        ))}
      </select>

      {/* Loading Spinner */}
      {isLoadingBoundary && (
        <Loader2 className="w-3.5 h-3.5 text-amber-500 animate-spin shrink-0 mx-1" />
      )}

      {/* Official Census Badge & Reset */}
      {selectedDistrictMetadata && (
        <div className="flex items-center gap-1 shrink-0">
          {selectedDistrictMetadata.censusCode && (
            <span
              className="bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold hidden 2xl:inline"
              title="Official Census 2011 District Code"
            >
              #{selectedDistrictMetadata.censusCode}
            </span>
          )}

          <button
            type="button"
            onClick={handleClearTerritory}
            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
            title="Reset Territory filter to All India"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
