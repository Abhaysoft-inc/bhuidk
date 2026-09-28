"use client";

import React from "react";
import { MapPin, X, Loader2, ChevronDown } from "lucide-react";
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

  const isFiltered = selectedStateId !== "all";

  return (
    <div className="flex items-center bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-1 shadow-[0_2px_8px_-2px_rgba(11,43,80,0.06)] hover:border-slate-300 transition-all text-xs">
      {/* Territory Brand Icon & Label */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50/90 text-slate-700 font-bold shrink-0 border border-slate-100">
        <MapPin className="w-3.5 h-3.5 text-[#0b2b50]" />
        <span className="text-[11px] font-bold text-slate-700 tracking-wide hidden lg:inline">
          Territory
        </span>
      </div>

      <div className="h-4 w-px bg-slate-200 mx-1.5" />

      {/* State / UT Selector */}
      <div className="relative flex items-center">
        <select
          value={selectedStateId}
          onChange={(e) => handleStateChange(e.target.value)}
          className="appearance-none bg-transparent hover:bg-slate-50 focus:bg-white pl-2 pr-7 py-1 text-xs font-semibold text-slate-800 rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0b2b50] transition-all border border-transparent hover:border-slate-200 focus:border-[#0b2b50]"
          title="Filter by State / UT (Census 2011)"
        >
          <option value="all">All India</option>
          {statesCatalog.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 pointer-events-none transition-transform" />
      </div>

      <div className="h-4 w-px bg-slate-200 mx-1" />

      {/* District Selector */}
      <div className="relative flex items-center">
        <select
          value={selectedDistrictId || ""}
          onChange={(e) => handleDistrictChange(e.target.value)}
          disabled={!isFiltered}
          className="appearance-none bg-transparent hover:bg-slate-50 focus:bg-white pl-2 pr-7 py-1 text-xs font-semibold text-slate-800 rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0b2b50] transition-all border border-transparent hover:border-slate-200 focus:border-[#0b2b50] disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:border-transparent disabled:cursor-not-allowed max-w-[160px] truncate"
          title="Filter by District (641 Official Census Districts)"
        >
          <option value="">
            {!isFiltered ? "— All Districts —" : "— Select District —"}
          </option>
          {availableDistricts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} {d.censusCode ? `(#${d.censusCode})` : ""}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 pointer-events-none" />
      </div>

      {/* Live Loading Indicator */}
      {isLoadingBoundary && (
        <div className="flex items-center gap-1 px-1.5 py-0.5 ml-1 rounded-md bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200/80 animate-pulse shrink-0">
          <Loader2 className="w-3 h-3 animate-spin text-amber-600" />
          <span className="hidden sm:inline">GIS Sync</span>
        </div>
      )}

      {/* Active District Census Badge & Clear Filter Action */}
      {isFiltered && (
        <div className="flex items-center gap-1.5 ml-1 pl-1.5 border-l border-slate-200 shrink-0">
          {selectedDistrictMetadata?.censusCode && (
            <span
              className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 shadow-2xs"
              title="Official Census 2011 District Code"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              #{selectedDistrictMetadata.censusCode}
            </span>
          )}

          <button
            type="button"
            onClick={handleClearTerritory}
            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
            title="Reset Territory filter to All India"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
