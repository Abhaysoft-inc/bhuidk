"use client";

import React, { useState } from "react";
import {
  ProposedZoneData,
  ZoneType,
  computeZoneAnalysis,
} from "./policy-planning-types";
import {
  FileText,
  AlertTriangle,
  AlertCircle,
  Layers,
  MapPin,
  Clock,
  ShieldAlert,
  Sparkles,
  Info,
  Check,
  Copy,
  ChevronRight,
  ChevronLeft,
  Code2,
  TreePine,
  Waves,
  Building2,
  Wheat,
  LandPlot,
  X,
  Upload,
  Pencil,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
} from "lucide-react";

interface ProposedZonePanelProps {
  activeZone: ProposedZoneData | null;
  allZones?: ProposedZoneData[];
  onSelectZone?: (zoneId: string) => void;
  onRemoveZone?: (zoneId: string) => void;
  onClearProposal?: () => void;
  onUpdateZone: (updatedZone: ProposedZoneData) => void;
  onLoadSample: () => void;
  onOpenUpload: () => void;
  onOpenAiSearch?: () => void;
}

export type InspectorTab = "proposed_zone" | "analysis" | "constraints" | "results";

const ZONE_TYPES: ZoneType[] = [
  "Industrial Zone",
  "Residential Zone",
  "Commercial Zone",
  "Logistics Park",
  "Infrastructure Corridor",
  "Special Economic Zone",
  "Custom",
];

export function ProposedZonePanel({
  activeZone,
  allZones,
  onSelectZone,
  onRemoveZone,
  onClearProposal,
  onUpdateZone,
  onLoadSample,
  onOpenUpload,
  onOpenAiSearch,
}: ProposedZonePanelProps) {
  const [activeTab, setActiveTab] = useState<InspectorTab>("proposed_zone");
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [phase2ModalOpen, setPhase2ModalOpen] = useState(false);
  const [showSimulatedAnalysis, setShowSimulatedAnalysis] = useState(false);

  // Active Zone Handlers
  const handleZoneTypeChange = (newType: ZoneType) => {
    if (!activeZone) return;
    const updatedAnalysis = computeZoneAnalysis(activeZone.area, newType);
    onUpdateZone({
      ...activeZone,
      zone_type: newType,
      analysis: updatedAnalysis,
    });
  };

  const handleNameChange = (newName: string) => {
    if (!activeZone) return;
    onUpdateZone({
      ...activeZone,
      name: newName,
    });
  };

  // Structured GeoJSON export object
  const exportPayload = activeZone
    ? {
        zone_id: activeZone.zone_id,
        source: activeZone.source || "manual",
        source_file: activeZone.source_file || null,
        zone_type: activeZone.zone_type.toLowerCase().replace(/\s+/g, "_"),
        name: activeZone.name,
        geometry: activeZone.geometry,
        properties: activeZone.properties || {},
        area: activeZone.area,
        perimeter: activeZone.perimeter,
        state: activeZone.state,
        district: activeZone.district,
        analysis: {
          affected_parcels: activeZone.analysis.affected_parcels,
          agricultural_area: activeZone.analysis.agricultural_area,
          built_up_area: activeZone.analysis.built_up_area,
          forest_area: activeZone.analysis.forest_area,
          water_area: activeZone.analysis.water_area,
          other_area: activeZone.analysis.other_area,
          disputed_parcels: activeZone.analysis.disputed_parcels,
          population_affected: activeZone.analysis.population_affected,
        },
      }
    : null;

  const handleCopyJson = () => {
    if (!exportPayload) return;
    navigator.clipboard.writeText(JSON.stringify(exportPayload, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const isUploaded = activeZone?.source === "upload";
  const analysis = activeZone?.analysis;

  return (
    <div className="ux4g-card ux4g-card-solid p-5 space-y-5">
      {/* ─── UNDERLINE TAB BAR (UX4G Standard) ─── */}
      <div className="ux4g-tab ux4g-tab-underline ux4g-tab-md">
        <ul className="ux4g-tab-list">
          <li>
            <button
              type="button"
              onClick={() => setActiveTab("proposed_zone")}
              className={`ux4g-tab-item ${activeTab === "proposed_zone" ? "is-active" : ""}`}
            >
              Proposed Zone
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => setActiveTab("analysis")}
              className={`ux4g-tab-item ${activeTab === "analysis" ? "is-active" : ""}`}
            >
              Analysis
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => setActiveTab("constraints")}
              className={`ux4g-tab-item ${activeTab === "constraints" ? "is-active" : ""}`}
            >
              Constraints
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => setActiveTab("results")}
              className={`ux4g-tab-item ${activeTab === "results" ? "is-active" : ""}`}
            >
              Results
            </button>
          </li>
        </ul>
      </div>

      {/* ─── EMPTY STATE (When no zone is active) ─── */}
      {!activeZone && (
        <div className="space-y-6 min-h-[440px] flex flex-col justify-between pt-1">
          {activeTab === "proposed_zone" && (
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    BLIN Cadastral Inspector
                  </span>
                  <h3 className="text-base font-black text-[#0b2b50] tracking-tight">Proposed Zone</h3>
                </div>
                <span className="ux4g-tag ux4g-tag-tonal-neutral ux4g-tag-xs">
                  Awaiting Input
                </span>
              </div>

              <div className="mt-6 text-center px-2 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0b2b50]/5 border border-[#0b2b50]/15 text-[#0b2b50] mx-auto flex items-center justify-center shadow-xs">
                  <LandPlot className="w-7 h-7" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-800">
                    Find, upload, or draw a proposed zone to begin analysis.
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Use AI Site Selection to search by constraints, upload an existing GeoJSON boundary, or draw manually on the map.
                  </p>
                </div>

                {/* Quick 3-Way Workflow Guide */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left max-w-md mx-auto pt-2">
                  <div
                    onClick={onOpenAiSearch}
                    className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-amber-900 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
                      <span>AI Find</span>
                    </div>
                    <p className="text-[10px] text-amber-700 leading-snug">
                      Multi-criteria site search & candidate ranking.
                    </p>
                  </div>

                  <div
                    onClick={onOpenUpload}
                    className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#0b2b50]/40 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-[#0b2b50] mb-1">
                      <Upload className="w-3.5 h-3.5 text-[#0b2b50] group-hover:scale-110 transition-transform" />
                      <span>Upload</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-snug">
                      Import GeoJSON boundary file (up to 20 MB).
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800 mb-1">
                      <Pencil className="w-3.5 h-3.5 text-slate-500" />
                      <span>Draw</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-snug">
                      Use Polygon, Rectangle or Circle tool.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "analysis" && (
            <div className="text-center py-10 px-4 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 mx-auto flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">No Zone Active for Analysis</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Draw, upload, or find a site to inspect land-use composition (LULC), agricultural footprint, and built-up area distribution.
              </p>
            </div>
          )}

          {activeTab === "constraints" && (
            <div className="text-center py-10 px-4 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 mx-auto flex items-center justify-center">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">No Active Constraints Data</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Establish a proposed boundary to screen revenue court litigation disputes, social displacement, and environmental buffer constraints.
              </p>
            </div>
          )}

          {activeTab === "results" && (
            <div className="text-center py-10 px-4 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 mx-auto flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">No Simulation Results Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Define a proposed zone boundary to review comprehensive feasibility scores, executive summaries, and GeoJSON export payloads.
              </p>
            </div>
          )}

          {/* Action buttons at bottom of empty state */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            {onOpenAiSearch && (
              <button
                type="button"
                onClick={onOpenAiSearch}
                className="ux4g-btn ux4g-btn-primary ux4g-btn-md w-full cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>AI Find Location</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenUpload}
              className="ux4g-btn ux4g-btn-outline-neutral ux4g-btn-md w-full cursor-pointer"
            >
              <Upload className="w-4 h-4 text-[#0b2b50]" />
              <span>Upload GeoJSON Proposal</span>
            </button>

            <button
              type="button"
              onClick={onLoadSample}
              className="ux4g-btn ux4g-btn-text-primary ux4g-btn-sm w-full cursor-pointer !text-slate-700 hover:!text-slate-900"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Load 420 Ha Benchmark Sample Zone</span>
            </button>
          </div>
        </div>
      )}

      {/* ─── ACTIVE ZONE TAB CONTENTS ─── */}
      {activeZone && (
        <>
          {/* ═════════════════════════════════════════════════════════
              TAB 1: PROPOSED ZONE (Identity, Geometry, Form Inputs)
             ═════════════════════════════════════════════════════════ */}
          {activeTab === "proposed_zone" && (
            <div className="space-y-5">
              {/* Header row: Zone ID, Tag, Quick Actions */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      {activeZone.zone_id}
                    </span>

                    {isUploaded ? (
                      <span className="ux4g-tag ux4g-tag-tonal-primary ux4g-tag-xs">
                        <Upload className="w-3 h-3 text-[#0b2b50]" />
                        <span>Source: Uploaded GIS</span>
                      </span>
                    ) : activeZone.source === "ai" ? (
                      activeZone.isModified ? (
                        <span className="ux4g-tag ux4g-tag-filled-brand ux4g-tag-xs">
                          <Sparkles className="w-3 h-3 text-amber-300" />
                          <span>AI Recommendation + Manual Edit</span>
                        </span>
                      ) : (
                        <span className="ux4g-tag ux4g-tag-filled-brand ux4g-tag-xs">
                          <Sparkles className="w-3 h-3 text-amber-300" />
                          <span>AI Recommendation</span>
                        </span>
                      )
                    ) : (
                      <span className="ux4g-tag ux4g-tag-tonal-neutral ux4g-tag-xs">
                        <Pencil className="w-3 h-3 text-slate-500" />
                        <span>Source: Manual Drawing</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-black text-[#0b2b50] tracking-tight">
                    Proposed Zone Configuration
                  </h3>

                  {activeZone.source_file && (
                    <p className="text-[11px] text-slate-400 font-mono truncate max-w-xs">
                      File: {activeZone.source_file}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowJsonModal(true)}
                    className="ux4g-btn ux4g-btn-outline-neutral ux4g-btn-sm cursor-pointer"
                    title="Inspect structured BLIN GeoJSON object"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>GeoJSON</span>
                  </button>

                  {onClearProposal && (
                    <button
                      type="button"
                      onClick={onClearProposal}
                      className="ux4g-btn ux4g-btn-danger ux4g-btn-sm cursor-pointer !bg-rose-50 !text-rose-700 !border-rose-200 hover:!bg-rose-100"
                      title="Clear Proposal from map"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Clear</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Multi-zones List (If multiple zones imported) */}
              {allZones && allZones.length > 1 && (
                <div className="space-y-2 p-3 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#0b2b50]" />
                      <span>Imported Zones ({allZones.length})</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal">Click to focus & inspect</span>
                  </div>

                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                    {allZones.map((zone, idx) => {
                      const isSelected = activeZone.zone_id === zone.zone_id;
                      return (
                        <div
                          key={zone.zone_id}
                          onClick={() => onSelectZone && onSelectZone(zone.zone_id)}
                          className={`p-2 rounded-lg border text-xs flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? "bg-white border-[#0b2b50] shadow-xs font-bold text-[#0b2b50]"
                              : "bg-white/80 border-slate-200 text-slate-600 hover:bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isSelected ? "bg-[#0b2b50]" : "bg-slate-300"
                              }`}
                            />
                            <span className="truncate">
                              Zone {String(idx + 1).padStart(2, "0")}: {zone.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] font-mono text-slate-400">{zone.area} Ha</span>
                            {onRemoveZone && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRemoveZone(zone.zone_id);
                                }}
                                className="text-slate-400 hover:text-rose-600 p-0.5 rounded hover:bg-rose-50 cursor-pointer"
                                title="Remove Zone"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Candidate Geometry Modification Audit Alert */}
              {activeZone.source === "ai" && activeZone.isModified && (
                <div className="ux4g-alert ux4g-alert-warning">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-amber-900 text-xs">Candidate geometry has been manually modified.</p>
                    <p className="text-[11px] text-amber-700 mt-0.5 leading-relaxed">
                      The original AI-recommended boundary was adjusted via map editing. BLIN audit records classify this boundary as a hybrid recommendation.
                    </p>
                  </div>
                </div>
              )}

              {/* Zone Name Input */}
              <div className="ux4g-input-container">
                <label className="ux4g-form-label">
                  Zone Name:
                </label>
                <input
                  type="text"
                  value={activeZone.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="ux4g-input"
                  placeholder="e.g. Industrial_Corridor_Pune.geojson"
                />
              </div>

              {/* Zone Type Dropdown */}
              <div className="ux4g-input-container">
                <label className="ux4g-form-label">
                  Zone Type:
                </label>
                <select
                  value={activeZone.zone_type}
                  onChange={(e) => handleZoneTypeChange(e.target.value as ZoneType)}
                  className="ux4g-select cursor-pointer"
                >
                  {ZONE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Core Geometry Metrics Strip (4-card grid) */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="ux4g-card ux4g-card-solid p-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Estimated Area
                  </span>
                  <div className="text-base font-black text-[#0b2b50] mt-0.5">
                    {activeZone.area.toLocaleString()} Ha
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {(activeZone.area / 100).toFixed(2)} sq km
                  </div>
                </div>

                <div className="ux4g-card ux4g-card-solid p-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Perimeter
                  </span>
                  <div className="text-base font-black text-slate-800 mt-0.5">
                    {activeZone.perimeter} km
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {(activeZone.perimeter * 1000).toLocaleString()} meters
                  </div>
                </div>

                <div className="ux4g-card ux4g-card-solid p-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Administrative Unit
                  </span>
                  <div className="text-xs font-bold text-slate-800 truncate mt-0.5">
                    {activeZone.district}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium truncate">
                    {activeZone.state}
                  </div>
                </div>

                <div className="ux4g-card ux4g-card-solid p-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Affected Parcels
                  </span>
                  <div className="text-base font-black text-amber-700 mt-0.5">
                    {isUploaded && !showSimulatedAnalysis ? "—" : analysis?.affected_parcels}
                  </div>
                  <div className="text-[9px] text-amber-800 font-medium">
                    {isUploaded && !showSimulatedAnalysis ? "Unconnected GIS" : "Prototype estimate"}
                  </div>
                </div>
              </div>

              {/* Imported GIS Properties Section */}
              {activeZone.properties && Object.keys(activeZone.properties).length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#0b2b50]" />
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                        Imported Properties
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {Object.keys(activeZone.properties).length} attributes
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-1.5 text-xs">
                    {Object.entries(activeZone.properties).map(([k, v]) => {
                      const label = k
                        .replace(/[-_]/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase());
                      const valueStr = typeof v === "object" ? JSON.stringify(v) : String(v);
                      return (
                        <div
                          key={k}
                          className="flex items-start justify-between gap-3 py-1 border-b border-slate-200/60 last:border-0"
                        >
                          <span className="font-semibold text-slate-600 text-[11px]">{label}:</span>
                          <span
                            className="font-mono text-slate-900 text-right text-[11px] truncate max-w-[200px]"
                            title={valueStr}
                          >
                            {valueStr}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quick Tab Step-Forward Banner */}
              <button
                type="button"
                onClick={() => setActiveTab("analysis")}
                className="w-full p-3 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100/70 text-blue-900 flex items-center justify-between text-xs font-bold transition-all cursor-pointer shadow-2xs group"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-700" />
                  <span>Inspect Land Use & Impact Analysis</span>
                </div>
                <ChevronRight className="w-4 h-4 text-blue-700 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════
              TAB 2: ANALYSIS (Land Impact, LULC Composition & Metrics)
             ═════════════════════════════════════════════════════════ */}
          {activeTab === "analysis" && analysis && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#0b2b50]" />
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                      Land Impact & LULC Analysis
                    </h3>
                    <p className="text-[11px] text-slate-400">Preliminary cadastral intersection</p>
                  </div>
                </div>
                <span className="ux4g-tag ux4g-tag-tonal-neutral ux4g-tag-xs">
                  {isUploaded && !showSimulatedAnalysis ? "Dataset Pending" : "Prototype estimate"}
                </span>
              </div>

              {/* Spatial dataset pending notice for uploaded GIS */}
              {isUploaded && !showSimulatedAnalysis ? (
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-[#0b2b50] shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-900">
                        Land impact analysis unavailable
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Connect spatial datasets to analyze this zone. Real-world cadastral parcel
                        boundaries, tenure registers (e-Dharti), and LULC raster intersection require
                        connecting state spatial data infrastructure.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      Area ({activeZone.area} Ha) & Perimeter are calculated
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowSimulatedAnalysis(true)}
                      className="text-[11px] font-bold text-[#0b2b50] hover:underline cursor-pointer"
                    >
                      Preview Prototype Estimate →
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {isUploaded && (
                    <div className="flex items-center justify-between text-[11px] bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-amber-900">
                      <span>Previewing simulated prototype distribution</span>
                      <button
                        type="button"
                        onClick={() => setShowSimulatedAnalysis(false)}
                        className="font-bold underline cursor-pointer"
                      >
                        Hide Simulation
                      </button>
                    </div>
                  )}

                  {/* Horizontal Composition Progress Bar */}
                  <div className="space-y-2 p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="text-[11px] font-bold text-slate-700 flex justify-between items-center">
                      <span>Land Use Classification (NRSC Standard)</span>
                      <span className="text-slate-400 font-normal">Preliminary intersection</span>
                    </div>

                    <div className="h-4 w-full rounded-md overflow-hidden flex bg-slate-100 border border-slate-200 shadow-inner">
                      <div
                        style={{ width: `${analysis.agricultural_pct}%` }}
                        className="bg-emerald-500 h-full transition-all duration-300"
                        title={`Agricultural: ${analysis.agricultural_pct}%`}
                      />
                      <div
                        style={{ width: `${analysis.built_up_pct}%` }}
                        className="bg-slate-500 h-full transition-all duration-300"
                        title={`Built-up: ${analysis.built_up_pct}%`}
                      />
                      <div
                        style={{ width: `${analysis.forest_pct}%` }}
                        className="bg-green-700 h-full transition-all duration-300"
                        title={`Forest/Protected: ${analysis.forest_pct}%`}
                      />
                      <div
                        style={{ width: `${analysis.water_pct}%` }}
                        className="bg-cyan-500 h-full transition-all duration-300"
                        title={`Water Bodies: ${analysis.water_pct}%`}
                      />
                      <div
                        style={{ width: `${analysis.other_pct}%` }}
                        className="bg-amber-400 h-full transition-all duration-300"
                        title={`Other Land: ${analysis.other_pct}%`}
                      />
                    </div>

                    {/* Composition Legend Pills */}
                    <div className="flex flex-wrap gap-2 text-[10px] font-medium text-slate-600 pt-1">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Agri {analysis.agricultural_pct}%
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-slate-500" />
                        Built {analysis.built_up_pct}%
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-700" />
                        Forest {analysis.forest_pct}%
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-cyan-500" />
                        Water {analysis.water_pct}%
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        Other {analysis.other_pct}%
                      </span>
                    </div>
                  </div>

                  {/* 6 Land Impact Breakdown Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-500 block">Total Area</span>
                      <div className="text-sm font-black text-slate-900 mt-0.5">
                        {activeZone.area} Ha
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">100% of zone</span>
                    </div>

                    <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200/80">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-emerald-900">Agricultural</span>
                        <Wheat className="w-3 h-3 text-emerald-700" />
                      </div>
                      <div className="text-sm font-black text-emerald-900 mt-0.5">
                        {analysis.agricultural_area} Ha
                      </div>
                      <span className="text-[10px] text-emerald-700 font-semibold">
                        {analysis.agricultural_pct}% share
                      </span>
                    </div>

                    <div className="bg-slate-100/80 p-2.5 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-700">Built-up Land</span>
                        <Building2 className="w-3 h-3 text-slate-600" />
                      </div>
                      <div className="text-sm font-black text-slate-800 mt-0.5">
                        {analysis.built_up_area} Ha
                      </div>
                      <span className="text-[10px] text-slate-600 font-semibold">
                        {analysis.built_up_pct}% share
                      </span>
                    </div>

                    <div className="bg-green-50/70 p-2.5 rounded-xl border border-green-200/80">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-green-900">Forest / Protected</span>
                        <TreePine className="w-3 h-3 text-green-700" />
                      </div>
                      <div className="text-sm font-black text-green-900 mt-0.5">
                        {analysis.forest_area} Ha
                      </div>
                      <span className="text-[10px] text-green-700 font-semibold">
                        {analysis.forest_pct}% share
                      </span>
                    </div>

                    <div className="bg-cyan-50/70 p-2.5 rounded-xl border border-cyan-200/80">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-cyan-900">Water Bodies</span>
                        <Waves className="w-3 h-3 text-cyan-700" />
                      </div>
                      <div className="text-sm font-black text-cyan-900 mt-0.5">
                        {analysis.water_area} Ha
                      </div>
                      <span className="text-[10px] text-cyan-700 font-semibold">
                        {analysis.water_pct}% share
                      </span>
                    </div>

                    <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/80">
                      <span className="text-[10px] font-bold text-amber-900 block">Other Land</span>
                      <div className="text-sm font-black text-amber-900 mt-0.5">
                        {analysis.other_area} Ha
                      </div>
                      <span className="text-[10px] text-amber-700 font-semibold">
                        {analysis.other_pct}% share
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* Navigation Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("proposed_zone")}
                  className="ux4g-btn ux4g-btn-outline-neutral ux4g-btn-sm cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Proposed Zone</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("constraints")}
                  className="ux4g-btn ux4g-btn-primary ux4g-btn-sm cursor-pointer"
                >
                  <span>View Constraints</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════
              TAB 3: CONSTRAINTS (Legal, Settlement, Risk & Clearances)
             ═════════════════════════════════════════════════════════ */}
          {activeTab === "constraints" && analysis && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                      Risk & Regulatory Constraints
                    </h3>
                    <p className="text-[11px] text-slate-400">Cadastral, social & environmental screening</p>
                  </div>
                </div>
                <span className="ux4g-tag ux4g-tag-tonal-neutral ux4g-tag-xs">
                  Prototype estimate
                </span>
              </div>

              {/* 6 Impact & Risk Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 block">Parcels Affected</span>
                  <div className="text-base font-black text-slate-900 mt-0.5">
                    {isUploaded && !showSimulatedAnalysis ? "—" : analysis.affected_parcels}
                  </div>
                  <div className="text-[9px] text-slate-400 font-medium">Cadastral boundaries</div>
                </div>

                <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200/80">
                  <span className="text-[10px] font-bold text-rose-900 block">Disputed Parcels</span>
                  <div className="text-base font-black text-rose-800 mt-0.5">
                    {isUploaded && !showSimulatedAnalysis ? "—" : `~${analysis.disputed_parcels}`}
                  </div>
                  <div className="text-[9px] text-rose-700 font-medium">Revenue court disputes</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 block">Population Affected</span>
                  <div className="text-base font-black text-slate-900 mt-0.5">
                    {isUploaded && !showSimulatedAnalysis
                      ? "—"
                      : `~${analysis.population_affected.toLocaleString()}`}
                  </div>
                  <div className="text-[9px] text-slate-400 font-medium">Habitation displacement</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 block">Acquisition Complexity</span>
                  <div className="mt-1 flex items-center justify-between">
                    <span
                      className={`text-[11px] font-extrabold px-2 py-0.5 rounded ${
                        analysis.acquisition_complexity === "High"
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : analysis.acquisition_complexity === "Medium"
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      }`}
                    >
                      {analysis.acquisition_complexity}
                    </span>
                  </div>
                  <div className="text-[9px] text-slate-400 mt-1 font-medium">Tenure fragmentation</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 block">Environmental Sens.</span>
                  <div className="mt-1 flex items-center justify-between">
                    <span
                      className={`text-[11px] font-extrabold px-2 py-0.5 rounded ${
                        analysis.environmental_sensitivity === "High"
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : analysis.environmental_sensitivity === "Medium"
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      }`}
                    >
                      {analysis.environmental_sensitivity}
                    </span>
                  </div>
                  <div className="text-[9px] text-slate-400 mt-1 font-medium">Eco-sensitive buffer</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 block">Flood Exposure</span>
                  <div className="mt-1 flex items-center justify-between">
                    <span
                      className={`text-[11px] font-extrabold px-2 py-0.5 rounded ${
                        analysis.flood_exposure === "High"
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : analysis.flood_exposure === "Medium"
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      }`}
                    >
                      {analysis.flood_exposure}
                    </span>
                  </div>
                  <div className="text-[9px] text-slate-400 mt-1 font-medium">CWC 25-yr flood line</div>
                </div>
              </div>

              {/* Regulatory Baseline Screening Notes */}
              <div className="space-y-2 p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs text-slate-600">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Statutory Regulatory Screening:</span>
                </div>
                <ul className="space-y-1.5 list-disc pl-4 text-[11px] leading-relaxed">
                  <li>
                    <strong>RFCTLARR Act 2013 (Land Acquisition):</strong> Multi-crop irrigated agricultural land acquisition triggers Sec 10(2) restrictions. Mandatory Social Impact Assessment (SIA) required for affected resident population.
                  </li>
                  <li>
                    <strong>Forest Conservation Act (FCA 1980):</strong> Clearances required from MoEFCC Regional Office for non-forest activities within recorded forest buffers ({analysis.forest_pct}% zone overlap).
                  </li>
                  <li>
                    <strong>CWC & Wetland Conservation Rules:</strong> Minimum statutory buffer required around natural water bodies ({analysis.water_pct}% zone overlap).
                  </li>
                </ul>
              </div>

              {/* Navigation Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("analysis")}
                  className="ux4g-btn ux4g-btn-outline-neutral ux4g-btn-sm cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Land Analysis</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("results")}
                  className="ux4g-btn ux4g-btn-primary ux4g-btn-sm cursor-pointer"
                >
                  <span>View Results</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════
              TAB 4: RESULTS (Feasibility Summary, Phase 2 Simulation)
             ═════════════════════════════════════════════════════════ */}
          {activeTab === "results" && analysis && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                      Feasibility Results & Summary
                    </h3>
                    <p className="text-[11px] text-slate-400">Executive decision support evaluation</p>
                  </div>
                </div>
                <span className="ux4g-tag ux4g-tag-tonal-neutral ux4g-tag-xs">
                  Ready for Simulation
                </span>
              </div>

              {/* Zone Summary Narrative Card */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Zone Executive Summary
                </h4>
                <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed">
                  Your proposed zone covers approximately{" "}
                  <strong>{activeZone.area.toLocaleString()} hectares</strong> (
                  {activeZone.zone_type}) in {activeZone.district}, {activeZone.state} and intersects
                  multiple land-use categories. Preliminary screening indicates an acquisition complexity of{" "}
                  <strong className="text-amber-800">{analysis.acquisition_complexity}</strong> with{" "}
                  <strong>~{analysis.disputed_parcels} disputed parcels</strong> and an estimated{" "}
                  <strong>~{analysis.population_affected.toLocaleString()} residents</strong> potentially affected.
                </p>
              </div>

              {/* Preliminary Feasibility Rating Pill Grid */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Preliminary Feasibility Rating:</span>
                  <span
                    className={`font-black px-2.5 py-0.5 rounded text-xs ${
                      analysis.acquisition_complexity === "Low" && analysis.flood_exposure === "Low"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : analysis.acquisition_complexity === "High" || analysis.environmental_sensitivity === "High"
                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                        : "bg-blue-100 text-blue-900 border border-blue-300"
                    }`}
                  >
                    {analysis.acquisition_complexity === "High"
                      ? "Moderate Feasibility (Litigation Safeguards Needed)"
                      : "High Feasibility (Standard Clearances)"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-600">
                  <div className="p-2 rounded-lg bg-white border border-slate-200/80">
                    <span className="text-slate-400 block text-[10px]">Agri Displacement</span>
                    <span className="font-bold text-slate-800">{analysis.agricultural_pct}% ({analysis.agricultural_area} Ha)</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200/80">
                    <span className="text-slate-400 block text-[10px]">Forest Intersect</span>
                    <span className="font-bold text-slate-800">{analysis.forest_pct}% ({analysis.forest_area} Ha)</span>
                  </div>
                </div>
              </div>

              {/* Primary Call to Action: Detailed Phase 2 Analysis */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setPhase2ModalOpen(true)}
                  className="ux4g-btn ux4g-btn-primary ux4g-btn-md w-full cursor-pointer group shadow-sm"
                >
                  <span>Run Detailed Impact Analysis</span>
                  <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                </button>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 px-1">
                  <span>Phase 1 Module • Upload & Manual</span>
                  <span className="font-semibold text-slate-600">BLIN Spatial Engine</span>
                </div>
              </div>

              {/* Export & Data Integration Options */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setShowJsonModal(true)}
                  className="ux4g-btn ux4g-btn-outline-neutral ux4g-btn-sm flex-1 cursor-pointer"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Inspect GeoJSON Schema</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="ux4g-btn ux4g-btn-outline-neutral ux4g-btn-sm flex-1 cursor-pointer"
                >
                  {copiedJson ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy GeoJSON</span>
                    </>
                  )}
                </button>
              </div>

              {/* Back navigation */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTab("constraints")}
                  className="ux4g-btn ux4g-btn-outline-neutral ux4g-btn-sm cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Review Constraints</span>
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ─── Phase 2 Placeholder Modal ─── */}
      {phase2ModalOpen && (
        <div className="ux4g-modal-backdrop ux4g-modal-backdrop-50">
          <div className="ux4g-modal-box ux4g-modal-m">
            <div className="ux4g-modal-header">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0b2b50]/10 border border-[#0b2b50]/20 text-[#0b2b50] flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Phase 2 Engine: Detailed Impact Simulation
                  </h4>
                  <p className="text-[11px] text-slate-500">Scheduled for Phase 2 Rollout</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPhase2ModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="ux4g-modal-body space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Full policy simulation requires connecting live state cadastral registers (e-Dharti / RoR)
                and environmental impact scoring. In Phase 2, this action will execute:
              </p>

              <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-5">
                <li>Detailed RFCTLARR 2013 Land Acquisition Cost Estimation</li>
                <li>Micro-parcel boundary overlap & litigation risk resolution</li>
                <li>Displacement & rehabilitation modeling</li>
                <li>Multi-location candidate comparison & AI site selection</li>
              </ul>

              <div className="ux4g-alert ux4g-alert-info text-xs">
                <div>
                  <strong>Phase 1 Status:</strong> Proposal geometry and initial estimates are
                  preserved and ready for export into GeoJSON format.
                </div>
              </div>
            </div>

            <div className="ux4g-modal-footer">
              <button
                type="button"
                onClick={() => setPhase2ModalOpen(false)}
                className="ux4g-btn ux4g-btn-primary ux4g-btn-sm cursor-pointer"
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── GeoJSON Schema Inspection Modal ─── */}
      {showJsonModal && exportPayload && (
        <div className="ux4g-modal-backdrop ux4g-modal-backdrop-50">
          <div className="ux4g-modal-box ux4g-modal-l">
            <div className="ux4g-modal-header">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#0b2b50]" />
                <h4 className="text-sm font-bold text-slate-900">
                  BLIN Normalized GeoJSON Data Object
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowJsonModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="ux4g-modal-body">
              <div className="bg-slate-900 text-slate-100 border border-slate-800 rounded-xl p-3 max-h-[380px] overflow-y-auto">
                <pre className="text-[11px] font-mono whitespace-pre-wrap leading-relaxed">
                  {JSON.stringify(exportPayload, null, 2)}
                </pre>
              </div>
            </div>

            <div className="ux4g-modal-footer justify-between">
              <span className="text-[10px] text-slate-400">BLIN ProposedZoneData Schema v1.0</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="ux4g-btn ux4g-btn-primary ux4g-btn-sm cursor-pointer"
                >
                  {copiedJson ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Object</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowJsonModal(false)}
                  className="ux4g-btn ux4g-btn-outline-neutral ux4g-btn-sm cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
