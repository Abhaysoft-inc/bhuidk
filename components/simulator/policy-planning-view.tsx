"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  ProposedZoneData,
  ZoneType,
  SAMPLE_ZONES,
  computePolygonAreaSqMeters,
  computePerimeterKm,
  sqMetersToHectares,
  coordsToGeoJSONPolygon,
  detectDistrictAndState,
  computeZoneAnalysis,
} from "./policy-planning-types";
import { ProposedZonePanel } from "./proposed-zone-panel";
import { UploadZoneModal } from "./upload-zone-modal";
import { AiSiteModal } from "./ai-site-modal";
import { AiCandidatePanel } from "./ai-candidate-panel";
import { AiCandidateCompareModal } from "./ai-candidate-compare-modal";
import { CandidateLocation, SitePlanningCriteria } from "./ai-site-types";
import { SandboxClient } from "./sandbox-client";
import {
  Sparkles,
  Layers,
  Compass,
  MapPin,
  Sliders,
  RotateCcw,
  CheckCircle2,
  Info,
  ChevronRight,
  ShieldCheck,
  LandPlot,
  Upload,
  X,
  FileCheck,
  Search,
} from "lucide-react";

// Dynamic import for Leaflet map component (SSR disabled)
const PolicyPlanningMap = dynamic(() => import("./policy-planning-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[620px] lg:h-[680px] rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200">
      <div className="text-center space-y-3">
        <div className="w-9 h-9 border-3 border-[#0b2b50] border-t-transparent rounded-full animate-spin mx-auto" />
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-slate-800">Initializing BLIN Spatial Engine…</p>
          <p className="text-[11px] text-slate-400">Loading WGS84 Cadastral Base Canvas</p>
        </div>
      </div>
    </div>
  ),
});

export function PolicyPlanningView() {
  // View mode switcher: "planning" (Phase 1 upgraded Manual Zone Planning) vs "sandbox" (Legacy Econometric Model)
  const [activeTab, setActiveTab] = useState<"planning" | "sandbox">("planning");

  // Multi-zone state collection
  const [zones, setZones] = useState<ProposedZoneData[]>([]);
  const [activeZoneId, setActiveZoneId] = useState<string | null>(null);
  const [selectedZoneType, setSelectedZoneType] = useState<ZoneType>("Industrial Zone");

  // Modal and toast states
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // AI Site Selection state
  const [candidates, setCandidates] = useState<CandidateLocation[]>([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [activeCriteria, setActiveCriteria] = useState<SitePlanningCriteria | null>(null);
  const [panelTab, setPanelTab] = useState<"zone" | "candidates">("zone");

  // Active Zone derived from collection
  const activeZone = useMemo(() => {
    if (!activeZoneId) return zones[0] || null;
    return zones.find((z) => z.zone_id === activeZoneId) || zones[0] || null;
  }, [zones, activeZoneId]);

  // Handle successful GeoJSON import (single or multiple zones)
  const handleImportZones = (importedZones: ProposedZoneData[]) => {
    if (importedZones.length === 0) return;
    setZones(importedZones);
    setActiveZoneId(importedZones[0].zone_id);
    setSelectedZoneType(importedZones[0].zone_type);
    setPanelTab("zone");

    // Show import success notification
    setSuccessToast(
      importedZones.length === 1
        ? "Proposal imported successfully."
        : `Proposal imported successfully (${importedZones.length} zones detected).`
    );
    setTimeout(() => {
      setSuccessToast(null);
    }, 4500);
  };

  // Handle candidate generation from AI Site Selection modal
  const handleCandidatesGenerated = (
    generatedCandidates: CandidateLocation[],
    criteria: SitePlanningCriteria
  ) => {
    setCandidates(generatedCandidates);
    setActiveCriteria(criteria);
    setSelectedCandidateId(generatedCandidates[0]?.candidate_id || null);
    setPanelTab("candidates");
    setAiModalOpen(false);

    setSuccessToast(
      `Identified ${generatedCandidates.length} candidate locations in ${criteria.preferredState || "selected area"} ranked by multi-criteria spatial scoring.`
    );
    setTimeout(() => {
      setSuccessToast(null);
    }, 5000);
  };

  // Convert an AI Candidate into an active ProposedZoneData
  const handleUseCandidate = (candidate: CandidateLocation) => {
    const rawCoords = candidate.geometry.coordinates[0].map(
      ([lng, lat]) => [lat, lng] as [number, number]
    );
    const areaSqM = computePolygonAreaSqMeters(rawCoords);
    const calculatedHa = sqMetersToHectares(areaSqM);
    const finalAreaHa = candidate.areaHa || candidate.area || calculatedHa;
    const perimeterKm = Number(computePerimeterKm(rawCoords).toFixed(2));
    const detected = detectDistrictAndState(rawCoords[0][0], rawCoords[0][1]);
    const zoneType: ZoneType = (activeCriteria?.projectType || "Logistics Park") as ZoneType;
    const baseAnalysis = computeZoneAnalysis(finalAreaHa, zoneType);

    const newZone: ProposedZoneData = {
      zone_id: `ZONE-AI-${candidate.candidate_id.replace("CAND-", "")}`,
      source: "ai",
      source_file: undefined,
      zone_type: zoneType,
      name: candidate.name,
      geometry: candidate.geometry,
      properties: {
        candidate_id: candidate.candidate_id,
        suitability_score: candidate.suitability_score,
        criteria_scores: candidate.criteria_scores,
        rank: candidate.rank || 1,
        state: candidate.state,
        district: candidate.district,
      },
      area: finalAreaHa,
      perimeter: perimeterKm,
      state: candidate.state || detected.state,
      district: candidate.district || detected.district,
      analysis: {
        ...baseAnalysis,
        acquisition_complexity: candidate.acquisition_complexity || baseAnalysis.acquisition_complexity,
        environmental_sensitivity: candidate.environmental_sensitivity || baseAnalysis.environmental_sensitivity,
        flood_exposure: candidate.flood_exposure || baseAnalysis.flood_exposure,
        population_affected: candidate.population_impact ?? baseAnalysis.population_affected,
        disputed_parcels: Math.round((candidate.dispute_density ?? 1) * 4),
      },
      rawCoordinates: rawCoords,
      createdAt: new Date().toISOString(),
      isModified: false,
      criteria: activeCriteria || undefined,
      evidence: candidate.evidence || candidate.data_sources,
    };

    setZones([newZone]);
    setActiveZoneId(newZone.zone_id);
    setSelectedZoneType(zoneType);
    setPanelTab("zone");
    setSuccessToast(`Adopted ${candidate.candidate_id} (${candidate.name}) as Active Proposed Zone.`);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4500);
  };

  // Load benchmark 420 Ha sample zone
  const handleLoadSample = () => {
    const sample = SAMPLE_ZONES.greater_noida_420;
    const coords = sample.coords;
    const areaSqM = computePolygonAreaSqMeters(coords);
    const areaHa = sqMetersToHectares(areaSqM);
    const perimeterKm = Number(computePerimeterKm(coords).toFixed(2));
    const geojsonGeom = coordsToGeoJSONPolygon(coords);
    const avgLat = coords.reduce((acc, c) => acc + c[0], 0) / coords.length;
    const avgLng = coords.reduce((acc, c) => acc + c[1], 0) / coords.length;
    const { district, state } = detectDistrictAndState(avgLat, avgLng);
    const analysis = computeZoneAnalysis(areaHa, sample.type);

    const loadedZone: ProposedZoneData = {
      zone_id: "ZONE-001",
      source: "manual",
      zone_type: sample.type,
      name: sample.name,
      geometry: geojsonGeom,
      area: areaHa,
      perimeter: perimeterKm,
      state,
      district,
      analysis,
      rawCoordinates: coords,
      createdAt: new Date().toISOString(),
      isModified: false,
    };

    setZones([loadedZone]);
    setActiveZoneId(loadedZone.zone_id);
    setSelectedZoneType(sample.type);
    setPanelTab("zone");
  };

  // Manual Drawing Callback
  const handleZoneCreated = (newZone: ProposedZoneData) => {
    setZones([newZone]);
    setActiveZoneId(newZone.zone_id);
    setSelectedZoneType(newZone.zone_type);
    setPanelTab("zone");
  };

  // Update Zone (e.g. rename, change type, drag vertex)
  const handleZoneUpdated = (updatedZone: ProposedZoneData) => {
    // If the zone was generated by AI, mark it as manually modified for audit tracking
    const isAiZone = updatedZone.source === "ai" || activeZone?.source === "ai";
    const finalZone: ProposedZoneData = {
      ...updatedZone,
      isModified: isAiZone ? true : updatedZone.isModified,
    };

    setZones((prev) =>
      prev.map((z) => (z.zone_id === finalZone.zone_id ? finalZone : z))
    );
    setSelectedZoneType(finalZone.zone_type);
  };

  // Delete active zone
  const handleZoneDeleted = () => {
    if (!activeZoneId) {
      setZones([]);
      return;
    }
    const remaining = zones.filter((z) => z.zone_id !== activeZoneId);
    setZones(remaining);
    setActiveZoneId(remaining.length > 0 ? remaining[0].zone_id : null);
  };

  // Select a specific zone from multi-zone list or map click
  const handleSelectZone = (zoneId: string) => {
    setActiveZoneId(zoneId);
    const found = zones.find((z) => z.zone_id === zoneId);
    if (found) {
      setSelectedZoneType(found.zone_type);
    }
  };

  // Remove individual zone from multi-zone collection
  const handleRemoveZone = (zoneId: string) => {
    const remaining = zones.filter((z) => z.zone_id !== zoneId);
    setZones(remaining);
    if (activeZoneId === zoneId) {
      setActiveZoneId(remaining.length > 0 ? remaining[0].zone_id : null);
    }
  };

  // Clear entire proposal
  const handleClearProposal = () => {
    setZones([]);
    setActiveZoneId(null);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* ─── 1. PAGE HEADER ─── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-black text-[#0b2b50] tracking-tight">
              Policy Planning
            </h1>

            {/* Status Tags with UX4G class compositions */}
            {candidates.length > 0 && panelTab === "candidates" ? (
              <span className="ux4g-tag ux4g-tag-filled-brand ux4g-tag-xs">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>AI SITE SELECTION</span>
              </span>
            ) : activeZone?.source === "ai" ? (
              <span className="ux4g-tag ux4g-tag-filled-brand ux4g-tag-xs">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>AI RECOMMENDATION {activeZone.isModified ? "(MODIFIED)" : ""}</span>
              </span>
            ) : activeZone?.source === "upload" ? (
              <span className="ux4g-tag ux4g-tag-tonal-primary ux4g-tag-xs">
                GIS UPLOAD
              </span>
            ) : (
              <span className="ux4g-tag ux4g-tag-tonal-neutral ux4g-tag-xs">
                MANUAL PLANNING
              </span>
            )}

            {/* Active Source indicator */}
            {activeZone && (
              <span className="ux4g-tag ux4g-tag-outline-neutral ux4g-tag-xs">
                {activeZone.source === "ai"
                  ? activeZone.isModified
                    ? "AI Zone + Manual Edit"
                    : "AI Zone Active"
                  : activeZone.source === "upload"
                  ? "GIS Upload Active"
                  : "Manual Canvas Active"}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Define a proposed zone, upload GIS boundaries, or use AI Site Selection to find and rank candidate locations against spatial criteria.
          </p>
        </div>

        {/* View Switcher & Actions: AI Find Location, Upload Proposal */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {/* AI Find Location Button */}
          <button
            type="button"
            onClick={() => setAiModalOpen(true)}
            className="ux4g-btn ux4g-btn-primary ux4g-btn-md cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>AI Find Location</span>
          </button>

          {/* Upload Proposal Button */}
          <button
            type="button"
            onClick={() => setUploadModalOpen(true)}
            className="ux4g-btn ux4g-btn-outline-neutral ux4g-btn-md cursor-pointer"
          >
            <Upload className="w-4 h-4 text-[#0b2b50]" />
            <span>Upload Proposal</span>
          </button>

          {/* View Tab Switcher */}
          <div className="bg-white border border-slate-200 p-1 rounded-xl shadow-2xs flex items-center gap-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("planning")}
              className={`ux4g-btn ux4g-btn-sm transition-all cursor-pointer ${
                activeTab === "planning"
                  ? "ux4g-btn-primary"
                  : "ux4g-btn-text-primary !text-slate-600 hover:!text-slate-900"
              }`}
            >
              <LandPlot className="w-3.5 h-3.5" />
              <span>Zone Planning</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("sandbox")}
              className={`ux4g-btn ux4g-btn-sm transition-all cursor-pointer ${
                activeTab === "sandbox"
                  ? "ux4g-btn-primary"
                  : "ux4g-btn-text-primary !text-slate-600 hover:!text-slate-900"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Regression Model</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── Success Notification Toast ─── */}
      {successToast && (
        <div className="ux4g-alert ux4g-alert-success justify-between shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="text-xs font-bold">{successToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessToast(null)}
            className="text-emerald-800 hover:text-emerald-950 p-0.5 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ─── TAB CONTENT ─── */}
      {activeTab === "sandbox" ? (
        <SandboxClient />
      ) : (
        /* ─── 2. MAP-FIRST WORKSPACE & PROPOSED ZONE PANEL ─── */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Map-First Workspace (7 cols on lg, 8 cols on xl) */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-3">
            <PolicyPlanningMap
              activeZone={activeZone}
              allZones={zones}
              candidateZones={candidates}
              selectedCandidateId={selectedCandidateId || undefined}
              onSelectCandidate={(id) => {
                setSelectedCandidateId(id);
                setPanelTab("candidates");
              }}
              onSelectZone={handleSelectZone}
              onZoneCreated={handleZoneCreated}
              onZoneUpdated={handleZoneUpdated}
              onZoneDeleted={handleZoneDeleted}
              selectedZoneType={selectedZoneType}
              onOpenUpload={() => setUploadModalOpen(true)}
              onOpenAiSite={() => setAiModalOpen(true)}
            />

            {/* Quick Helper Ribbon under Map */}
            <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600 shadow-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>
                  <strong>Interactive Vector Canvas:</strong> Supports manual drawing tools,
                  GeoJSON file uploads, and AI candidate boundary overlays.
                </span>
                {candidates.length > 0 && (
                  <span className="bg-amber-50 text-amber-900 border border-amber-300 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>{candidates.length} AI Candidates Active</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                <button
                  type="button"
                  onClick={() => setAiModalOpen(true)}
                  className="text-[#0b2b50] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>AI Site Search</span>
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(true)}
                  className="text-[#0b2b50] hover:underline cursor-pointer"
                >
                  Upload GeoJSON
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="text-[#0b2b50] hover:underline cursor-pointer"
                >
                  Load Benchmark
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: AI Candidates or Proposed Zone Analysis Panel (5 cols on lg, 4 cols on xl) */}
          <div className="lg:col-span-5 xl:col-span-4">
            {/* If candidates exist AND an active zone also exists, provide toggle tabs */}
            {candidates.length > 0 && activeZone && (
              <div className="bg-white border border-slate-200 p-1 rounded-xl shadow-2xs flex items-center gap-1.5 mb-3 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setPanelTab("candidates")}
                  className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    panelTab === "candidates"
                      ? "bg-[#0b2b50] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Candidates ({candidates.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPanelTab("zone")}
                  className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    panelTab === "zone"
                      ? "bg-[#0b2b50] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <LandPlot className="w-3.5 h-3.5" />
                  <span>Active Proposed Zone</span>
                </button>
              </div>
            )}

            {panelTab === "candidates" && candidates.length > 0 ? (
              <AiCandidatePanel
                candidates={candidates}
                selectedCandidateId={selectedCandidateId}
                onSelectCandidate={(id) => setSelectedCandidateId(id)}
                activeCriteria={activeCriteria}
                onUseCandidate={handleUseCandidate}
                onOpenCompare={() => setCompareModalOpen(true)}
                onRecalculate={() => setAiModalOpen(true)}
                onCloseCandidates={() => {
                  setCandidates([]);
                  setPanelTab("zone");
                }}
              />
            ) : (
              <ProposedZonePanel
                activeZone={activeZone}
                allZones={zones}
                onSelectZone={handleSelectZone}
                onRemoveZone={handleRemoveZone}
                onClearProposal={handleClearProposal}
                onUpdateZone={handleZoneUpdated}
                onLoadSample={handleLoadSample}
                onOpenUpload={() => setUploadModalOpen(true)}
                onOpenAiSearch={() => setAiModalOpen(true)}
              />
            )}
          </div>
        </div>
      )}

      {/* ─── Upload Proposed Zone Modal ─── */}
      <UploadZoneModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onImportZones={handleImportZones}
        hasExistingZone={zones.length > 0}
      />

      {/* ─── AI Site Selection Modal ─── */}
      <AiSiteModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onCandidatesGenerated={handleCandidatesGenerated}
        initialCriteria={activeCriteria || undefined}
      />

      {/* ─── AI Candidate Comparison Modal ─── */}
      <AiCandidateCompareModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        candidates={candidates}
        onSelectCandidate={(c: CandidateLocation) => {
          setSelectedCandidateId(c.candidate_id);
          setCompareModalOpen(false);
        }}
        onUseCandidate={(c: CandidateLocation) => {
          handleUseCandidate(c);
          setCompareModalOpen(false);
        }}
      />
    </div>
  );
}
