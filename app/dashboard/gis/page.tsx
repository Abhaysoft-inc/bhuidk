"use client";

import React, { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Globe2, FileText, Crosshair, RefreshCw, TrendingUp, AlertTriangle, MapPin, Activity, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MapShell = dynamic(() => import("@/components/gis/MapShell"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 animate-pulse rounded-xl border border-slate-200 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-slate-400">
        <Globe2 className="w-8 h-8 animate-spin" />
        <span className="font-bold text-sm">Initializing GIS Environment...</span>
      </div>
    </div>
  ),
});

export default function GisPage() {
  const [analytics, setAnalytics] = useState<any>(null);

  const handleAnalytics = useCallback((data: any) => {
    setAnalytics(data);
  }, []);

  const stats = analytics ?? {};

  return (
    <div className="flex flex-col w-full" style={{ height: 'calc(100vh - 72px)' }}>
      {/* Header */}
      <div className="border-b border-slate-200 px-6 py-4 shrink-0">
        <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-1">
          <Globe2 className="w-3.5 h-3.5" />
          <span>National Spatial Data Infrastructure</span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Geospatial Intelligence Map</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Vector rendering · ST_Intersects querying · Predictive dispute density mapping
            </p>
          </div>
        </div>
      </div>

      {/* Main Layout: Map + Sidebar — fills remaining height */}
      <div className="flex flex-1 min-h-0 gap-0">

        {/* Map — fills all remaining space */}
        <div className="flex-1 min-w-0 p-4 pr-2">
          <div className="w-full h-full rounded-xl overflow-hidden border border-slate-200 shadow-sm">
            <MapShell onAnalytics={handleAnalytics} />
          </div>
        </div>

        {/* Analytics Sidebar — fixed width, scrollable */}
        <div className="w-[300px] shrink-0 flex flex-col gap-3 overflow-y-auto p-4 pl-2">

          {/* Viewport Analytics */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-[#0b2b50] text-white px-4 py-2.5 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5" />
              <span className="font-black text-xs tracking-wide uppercase">Viewport Analytics</span>
            </div>
            <div className="p-3 grid grid-cols-2 gap-2">
              <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
                <div className="text-[9px] font-bold text-slate-400 uppercase">Visible Parcels</div>
                <div className="text-xl font-black text-[#0b2b50]">{stats.visibleParcels ?? '--'}</div>
                <div className="text-[9px] text-slate-400">in viewport</div>
              </div>
              <div className="bg-rose-50 border border-rose-100 p-2.5 rounded-lg">
                <div className="text-[9px] font-bold text-rose-500 uppercase">High Risk</div>
                <div className="text-xl font-black text-rose-700">{stats.highRiskPct ?? '--'}%</div>
                <div className="text-[9px] text-rose-400">litigation risk</div>
              </div>
              <div className="bg-amber-50 border border-amber-100 p-2.5 rounded-lg">
                <div className="text-[9px] font-bold text-amber-600 uppercase">Filtered</div>
                <div className="text-xl font-black text-amber-700">{stats.filteredCount ?? '--'}</div>
                <div className="text-[9px] text-amber-500">by year</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg">
                <div className="text-[9px] font-bold text-emerald-600 uppercase">Active Year</div>
                <div className="text-xl font-black text-emerald-700">{stats.timePeriod ?? '--'}</div>
                <div className="text-[9px] text-emerald-500">temporal view</div>
              </div>
            </div>
          </div>

          {/* Temporal Analysis */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-[#0b2b50] text-white px-4 py-2.5 flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="font-black text-xs tracking-wide uppercase">Temporal Analysis</span>
            </div>
            <div className="p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-500">2015 → {stats.timePeriod ?? 2026}</span>
                <span className="text-xs font-black text-[#c2410c] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                  {stats.filteredCount ?? 0} parcels
                </span>
              </div>
              <input
                type="range"
                min="2015"
                max="2026"
                value={stats.timePeriod ?? 2026}
                onChange={(e) => stats.setTimePeriod?.(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#c2410c]"
              />
              <div className="flex justify-between mt-1 text-[9px] font-bold text-slate-400">
                {[2015, 2018, 2021, 2024, 2026].map(y => (
                  <span key={y} className={(stats.timePeriod ?? 2026) >= y ? 'text-[#c2410c]' : ''}>{y}</span>
                ))}
              </div>
              {/* Year timeline */}
              <div className="mt-3 space-y-1">
                {[{ y: 2015, n: 160 }, { y: 2018, n: 320 }, { y: 2021, n: 540 }, { y: 2024, n: 720 }, { y: 2026, n: 800 }].map(({ y, n }) => {
                  const active = (stats.timePeriod ?? 2026) >= y;
                  return (
                    <div key={y} className="flex items-center gap-2 text-xs">
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${active ? 'bg-[#c2410c]' : 'bg-slate-200'}`} />
                      <span className={`font-semibold w-8 ${active ? 'text-slate-700' : 'text-slate-400'}`}>{y}</span>
                      <div className="flex-1 h-0.5 rounded-full bg-slate-100 overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${active ? 'bg-[#c2410c]/50' : 'bg-transparent'}`}
                          style={{ width: active ? `${Math.floor(n / 8)}%` : '0%' }} />
                      </div>
                      <span className={`text-[10px] font-bold w-16 text-right ${active ? 'text-slate-600' : 'text-slate-300'}`}>{n} parcels</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Region Analysis */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-[#0b2b50] text-white px-4 py-2.5 flex items-center gap-2">
              <Crosshair className="w-3.5 h-3.5" />
              <span className="font-black text-xs tracking-wide uppercase">Region Analysis</span>
              {stats.selectionStats && (
                <span className="ml-auto text-[9px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-bold">ACTIVE</span>
              )}
            </div>
            <div className="p-3">
              <AnimatePresence mode="wait">
                {stats.isSelecting ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-6 text-slate-400 gap-2">
                    <RefreshCw className="w-6 h-6 animate-spin text-[#c2410c]" />
                    <span className="text-xs font-bold">Querying spatial data...</span>
                  </motion.div>
                ) : stats.selectionStats ? (
                  <motion.div key="results" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2">
                    {[
                      { label: 'Parcels Affected', value: stats.selectionStats.totalParcels, color: 'text-[#0b2b50]' },
                      { label: 'Est. Land Value', value: `₹${(stats.selectionStats.estimatedValue / 10000000).toFixed(2)} Cr`, color: 'text-emerald-600' },
                      { label: 'Disputes Detected', value: stats.selectionStats.disputedParcels, color: 'text-rose-600' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="flex justify-between items-center py-1.5 border-b border-slate-50 last:border-0">
                        <span className="text-xs text-slate-500 font-semibold">{label}</span>
                        <span className={`text-sm font-black ${color}`}>{value}</span>
                      </div>
                    ))}
                    {Object.keys(stats.selectionStats.landUseBreakdown || {}).length > 0 && (
                      <div className="pt-2">
                        <div className="text-[9px] font-black text-slate-400 uppercase mb-1.5">Land Use</div>
                        {Object.entries(stats.selectionStats.landUseBreakdown || {}).map(([key, val]: any) => (
                          <div key={key} className="flex justify-between text-xs py-0.5">
                            <span className="text-slate-500">{key}</span>
                            <span className="font-bold text-slate-700">{val}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center py-6 text-center text-slate-400 gap-2">
                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-slate-300" />
                    </div>
                    <p className="text-xs font-semibold text-slate-400 leading-relaxed px-2">
                      Draw a <strong>polygon</strong> or <strong>line</strong> on the map to run a spatial query on parcels in that region.
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-[#c2410c] font-bold mt-1">
                      <ChevronRight className="w-3 h-3" /> Use the draw tools at the top of the map
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Selected Parcel */}
          <AnimatePresence>
            {stats.selectedParcel && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-[#0b2b50]/20 rounded-xl shadow-sm overflow-hidden"
              >
                <div className="bg-[#0b2b50] text-white px-4 py-2.5 flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
                  <span className="font-black text-xs uppercase tracking-wide">Parcel Inspector</span>
                </div>
                <div className="p-3 space-y-2">
                  <div className="text-base font-black text-[#0b2b50]">{stats.selectedParcel.properties.ulpin_id}</div>
                  {[
                    { label: 'Ownership', value: stats.selectedParcel.properties.ownership_status, badge: true },
                    { label: 'Land Use', value: stats.selectedParcel.properties.land_use_type, badge: false },
                  ].map(({ label, value, badge }) => (
                    <div key={label} className="flex justify-between items-center py-1 border-b border-slate-50">
                      <span className="text-xs text-slate-500 font-semibold">{label}</span>
                      {badge ? (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${
                          value === 'clear' ? 'bg-emerald-100 text-emerald-700' :
                          value === 'disputed' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                        }`}>{value}</span>
                      ) : (
                        <span className="text-xs font-bold text-slate-700">{value}</span>
                      )}
                    </div>
                  ))}
                  <div className="pt-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-bold text-slate-500">Litigation Risk</span>
                      <span className="font-black text-[#c2410c]">{stats.selectedParcel.properties.litigation_risk_score}/100</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#c2410c] rounded-full transition-all"
                        style={{ width: `${stats.selectedParcel.properties.litigation_risk_score}%` }} />
                    </div>
                  </div>
                  <button
                    onClick={() => alert(`Full title report: ${stats.selectedParcel.properties.ulpin_id}`)}
                    className="w-full mt-1 border border-[#0b2b50] text-[#0b2b50] hover:bg-[#0b2b50] hover:text-white font-bold text-xs py-1.5 rounded-lg transition-colors"
                  >
                    View Full Title Report
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Export */}
          <button
            onClick={() => alert('Exporting Viewport Report (PDF)...')}
            className="w-full bg-[#0b2b50] hover:bg-[#153a69] text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" /> Export Viewport Report
          </button>

          {/* Spacer */}
          <div className="h-2" />
        </div>
      </div>
    </div>
  );
}
