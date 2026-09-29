"use client";

import React from "react";
import {
  CandidateLocation,
  SitePlanningCriteria,
} from "./ai-site-types";
import {
  AlertTriangle,
  Layers,
  Sparkles,
  Scale,
  RotateCcw,
  CheckCircle2,
  Columns,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

interface AiCandidatePanelProps {
  candidates: CandidateLocation[];
  selectedCandidateId?: string | null;
  onSelectCandidate: (candidateId: string) => void;
  criteria?: SitePlanningCriteria | null;
  activeCriteria?: SitePlanningCriteria | null;
  onUseCandidate: (candidate: CandidateLocation) => void;
  onOpenCompare: () => void;
  onRecalculate: () => void;
  onExitCandidateMode?: () => void;
  onCloseCandidates?: () => void;
}

export function AiCandidatePanel({
  candidates,
  selectedCandidateId,
  onSelectCandidate,
  criteria,
  activeCriteria,
  onUseCandidate,
  onOpenCompare,
  onRecalculate,
  onExitCandidateMode,
  onCloseCandidates,
}: AiCandidatePanelProps) {
  const currentCriteria = activeCriteria || criteria || null;
  const exitHandler = onExitCandidateMode || onCloseCandidates || (() => {});

  const selectedCandidate =
    candidates.find((c) => c.candidate_id === selectedCandidateId) ||
    candidates[0];

  if (!selectedCandidate) return null;

  const priorities = currentCriteria?.priorities || {
    infrastructure: 25,
    acquisition: 20,
    environment: 20,
    agriculture: 15,
    disputes: 10,
    economic: 10,
  };

  const criteriaList = [
    {
      key: "infrastructure",
      label: "Infrastructure Access",
      score: selectedCandidate.criteria_scores.infrastructure,
      weight: priorities.infrastructure,
    },
    {
      key: "environment",
      label: "Environmental Protection",
      score: selectedCandidate.criteria_scores.environment,
      weight: priorities.environment,
    },
    {
      key: "acquisition",
      label: "Acquisition Feasibility",
      score: selectedCandidate.criteria_scores.acquisition,
      weight: priorities.acquisition,
    },
    {
      key: "disputes",
      label: "Dispute Avoidance",
      score: selectedCandidate.criteria_scores.disputes,
      weight: priorities.disputes,
    },
    {
      key: "agriculture",
      label: "Agricultural Preservation",
      score: selectedCandidate.criteria_scores.agriculture,
      weight: priorities.agriculture,
    },
    {
      key: "economic",
      label: "Economic Potential",
      score: selectedCandidate.criteria_scores.economic,
      weight: priorities.economic,
    },
  ];

  return (
    <div className="ux4g-card ux4g-card-solid p-5 space-y-5">
      {/* ─── 1. Header ─── */}
      <div className="space-y-4 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="ux4g-tag ux4g-tag-filled-brand ux4g-tag-xs">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>AI Candidate Selection</span>
              </span>
              <span className="ux4g-tag ux4g-tag-tonal-neutral ux4g-tag-xs">
                {candidates.length} candidate areas
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#0b2b50] tracking-tight mt-1">
              Candidate Locations
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenCompare}
              className="ux4g-btn ux4g-btn-outline-neutral ux4g-btn-sm cursor-pointer"
              title="Compare all candidates side-by-side"
            >
              <Columns className="w-3.5 h-3.5 text-[#0b2b50]" />
              <span>Compare</span>
            </button>

            <button
              type="button"
              onClick={exitHandler}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              title="Exit AI Candidate view"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ─── 2. Candidate Cards Strip (Top ranking list) ─── */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 block">
            Ranked by criteria suitability:
          </span>

          <div className="grid grid-cols-1 gap-1.5 max-h-[170px] overflow-y-auto pr-1">
            {candidates.map((cand) => {
              const isSelected = cand.candidate_id === selectedCandidate.candidate_id;
              return (
                <div
                  key={cand.candidate_id}
                  onClick={() => onSelectCandidate(cand.candidate_id)}
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#0b2b50] text-white border-[#0b2b50] shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                        isSelected
                          ? "bg-amber-400 text-slate-950"
                          : "bg-slate-200 text-slate-800"
                      }`}
                    >
                      {cand.label.replace("Candidate ", "")}
                    </span>
                    <span className="font-bold truncate">{cand.name.split(" - ")[1] || cand.name}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      }`}
                    >
                      {cand.suitability_score}/100
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Candidate Headline Card */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="bg-amber-50 text-amber-900 border border-amber-300 text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded">
                {selectedCandidate.label}
              </span>
              <h3 className="text-sm font-bold text-slate-900 leading-tight mt-1">
                {selectedCandidate.name.split(" - ")[1] || selectedCandidate.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedCandidate.district}, {selectedCandidate.state} • {selectedCandidate.areaAcres} acres ({selectedCandidate.areaHa} Ha)
              </p>
            </div>

            <div className="text-right shrink-0">
              <div className="text-2xl font-bold text-emerald-600">
                {selectedCandidate.suitability_score}
                <span className="text-xs text-slate-400 font-normal">/100</span>
              </div>
              <div className="text-[9px] font-medium uppercase tracking-wider text-emerald-700">
                Relative Suitability
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">
              Perimeter: <strong>{selectedCandidate.perimeterKm} km</strong>
            </span>
            <button
              type="button"
              onClick={() => onUseCandidate(selectedCandidate)}
              className="px-3 py-1.5 bg-[#0b2b50] hover:bg-[#071e3d] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Use This Candidate</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── 3. Why this location? (Evidence-based explanations) ─── */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            Why this location?
          </h3>
        </div>

        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
          {/* Pros */}
          <div className="space-y-1">
            {selectedCandidate.explanations.pros.map((pro, idx) => (
              <div key={idx} className="flex items-start gap-2 text-slate-800">
                <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✓</span>
                <span className="leading-snug">{pro}</span>
              </div>
            ))}
          </div>

          {/* Cautions */}
          {selectedCandidate.explanations.cautions.length > 0 && (
            <div className="pt-1.5 border-t border-slate-200/70 space-y-1">
              {selectedCandidate.explanations.cautions.map((caution, idx) => (
                <div key={idx} className="flex items-start gap-2 text-amber-900">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{caution}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── 4. Suitability Breakdown (Scores & Weights) ─── */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-[#0b2b50]" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Suitability Breakdown
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            Scores weighted by priorities
          </span>
        </div>

        <div className="space-y-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
          {criteriaList.map((item) => (
            <div key={item.key} className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-700">{item.label}</span>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-slate-400 text-[10px]">Weight: {item.weight}%</span>
                  <span className="font-bold text-slate-900">{item.score}/100</span>
                </div>
              </div>

              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#0b2b50] h-full rounded-full transition-all duration-300"
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 5. Evidence & Data Sources ─── */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#0b2b50]" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Evidence & Data
            </h3>
          </div>
          <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-mono px-1.5 py-0.5 rounded">
            {selectedCandidate.evidence.length} layers queried
          </span>
        </div>

        <div className="space-y-1.5">
          {selectedCandidate.evidence.map((ev, idx) => (
            <div
              key={idx}
              className="p-2 rounded-lg border border-slate-200 bg-white text-[11px] flex items-center justify-between gap-2"
            >
              <div>
                <span className="font-bold text-slate-800 block">{ev.layerName}</span>
                <span className="text-[10px] text-slate-500">{ev.sourceDataset} • {ev.metricValue}</span>
              </div>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                  ev.status === "Connected"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : ev.status === "Prototype proxy"
                    ? "bg-amber-50 text-amber-800 border border-amber-200"
                    : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                {ev.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 6. Confidence & Data Quality ─── */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 text-[11px]">
              Confidence & Data Quality
            </span>
            <span className="bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-medium px-1.5 py-0.5 rounded">
              {selectedCandidate.confidence} Confidence
            </span>
          </div>

          <div className="text-[11px] text-slate-600 flex justify-between">
            <span>Data Completeness:</span>
            <strong className="font-mono">{selectedCandidate.dataCompletenessPct}%</strong>
          </div>

          {selectedCandidate.missingDatasets.length > 0 && (
            <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200/60">
              <span className="font-semibold text-slate-600">Pending data: </span>
              {selectedCandidate.missingDatasets.join(", ")}
            </div>
          )}

          <p className="text-[10px] text-slate-400 italic leading-relaxed pt-1">
            Disclaimer: Suitability is an analytical estimate based on available data and selected criteria. It does not constitute a legal, financial, environmental or planning approval.
          </p>
        </div>
      </div>

      {/* ─── 7. Actions: Use Candidate, Recalculate, Compare ─── */}
      <div className="pt-2 border-t border-slate-100 space-y-2">
        <button
          type="button"
          onClick={() => onUseCandidate(selectedCandidate)}
          className="ux4g-btn ux4g-btn-primary ux4g-btn-md w-full cursor-pointer group shadow-sm"
        >
          <span>Use This Candidate as Proposed Zone</span>
          <ChevronRight className="w-4 h-4 text-amber-300 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onRecalculate}
            className="ux4g-btn ux4g-btn-outline-neutral ux4g-btn-sm w-full cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Recalculate</span>
          </button>

          <button
            type="button"
            onClick={onOpenCompare}
            className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-sm w-full cursor-pointer"
          >
            <Columns className="w-3.5 h-3.5 text-[#0b2b50]" />
            <span>Compare ({candidates.length})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
