"use client";

import React from "react";
import { CandidateLocation } from "./ai-site-types";
import { X, ArrowRight } from "lucide-react";

interface AiCandidateCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidates: CandidateLocation[];
  onSelectAndUse?: (candidate: CandidateLocation) => void;
  onSelectCandidate?: (candidate: CandidateLocation) => void;
  onUseCandidate?: (candidate: CandidateLocation) => void;
}

export function AiCandidateCompareModal({
  isOpen,
  onClose,
  candidates,
  onSelectAndUse,
  onSelectCandidate,
  onUseCandidate,
}: AiCandidateCompareModalProps) {
  if (!isOpen) return null;

  const handleUse = onUseCandidate || onSelectAndUse || (() => {});

  const compareCandidates = candidates.slice(0, 3); // Compare top 3 candidates

  const comparisonRows = [
    {
      label: "Relative Suitability Score",
      render: (c: CandidateLocation) => (
        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black px-2 py-0.5 rounded">
          {c.suitability_score}/100
        </span>
      ),
    },
    {
      label: "Area (Acres / Hectares)",
      render: (c: CandidateLocation) => (
        <span className="font-bold text-slate-800">
          {c.areaAcres} acres <span className="text-slate-400 font-normal">({c.areaHa} Ha)</span>
        </span>
      ),
    },
    {
      label: "Infrastructure Access",
      render: (c: CandidateLocation) => (
        <div className="space-y-0.5">
          <span className="font-bold text-[#0b2b50]">{c.criteria_scores.infrastructure}/100</span>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#0b2b50] h-full" style={{ width: `${c.criteria_scores.infrastructure}%` }} />
          </div>
        </div>
      ),
    },
    {
      label: "Acquisition Feasibility",
      render: (c: CandidateLocation) => (
        <div className="space-y-0.5">
          <span className="font-bold text-indigo-700">{c.criteria_scores.acquisition}/100</span>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full" style={{ width: `${c.criteria_scores.acquisition}%` }} />
          </div>
        </div>
      ),
    },
    {
      label: "Environmental Protection",
      render: (c: CandidateLocation) => (
        <div className="space-y-0.5">
          <span className="font-bold text-emerald-700">{c.criteria_scores.environment}/100</span>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full" style={{ width: `${c.criteria_scores.environment}%` }} />
          </div>
        </div>
      ),
    },
    {
      label: "Agricultural Preservation",
      render: (c: CandidateLocation) => (
        <div className="space-y-0.5">
          <span className="font-bold text-teal-700">{c.criteria_scores.agriculture}/100</span>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-teal-600 h-full" style={{ width: `${c.criteria_scores.agriculture}%` }} />
          </div>
        </div>
      ),
    },
    {
      label: "Dispute Avoidance",
      render: (c: CandidateLocation) => (
        <div className="space-y-0.5">
          <span className="font-bold text-amber-600">{c.criteria_scores.disputes}/100</span>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full" style={{ width: `${c.criteria_scores.disputes}%` }} />
          </div>
        </div>
      ),
    },
    {
      label: "Economic Potential",
      render: (c: CandidateLocation) => (
        <div className="space-y-0.5">
          <span className="font-bold text-[#0b2b50]">{c.criteria_scores.economic}/100</span>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#0b2b50] h-full" style={{ width: `${c.criteria_scores.economic}%` }} />
          </div>
        </div>
      ),
    },
    {
      label: "Data Completeness",
      render: (c: CandidateLocation) => (
        <span className="text-xs font-mono font-semibold text-slate-600">
          {c.dataCompletenessPct}% ({c.confidence} Confidence)
        </span>
      ),
    },
  ];

  return (
    <div className="ux4g-modal-backdrop ux4g-modal-backdrop-50">
      <div className="ux4g-modal-box ux4g-modal-l max-w-4xl max-h-[90vh]">
        {/* Header */}
        <div className="ux4g-modal-header">
          <div>
            <div className="flex items-center gap-2">
              <span className="ux4g-tag ux4g-tag-filled-brand ux4g-tag-xs">
                Scenario Comparison
              </span>
              <span className="ux4g-tag ux4g-tag-tonal-neutral ux4g-tag-xs">
                Multi-Location Evaluation
              </span>
            </div>
            <h3 className="text-xl font-black text-[#0b2b50] tracking-tight mt-1">
              Compare Candidate Locations
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="ux4g-modal-body p-0 overflow-auto">
          <table className="ux4g-table ux4g-table-m">
            <thead>
              <tr>
                <th className="w-1/4 uppercase text-[10px]">
                  Planning Metric
                </th>
                {compareCandidates.map((cand) => (
                  <th key={cand.candidate_id} className="w-1/4">
                    <div className="space-y-0.5">
                      <span className="ux4g-tag ux4g-tag-tonal-neutral ux4g-tag-xs">
                        {cand.label}
                      </span>
                      <div className="text-xs font-black truncate text-slate-900 mt-1">
                        {cand.name.split(" - ")[1] || cand.name}
                      </div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {cand.district}, {cand.state}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr key={i}>
                  <td className="font-semibold text-slate-600 text-[11px]">{row.label}</td>
                  {compareCandidates.map((cand) => (
                    <td key={cand.candidate_id} className="text-slate-800">
                      {row.render(cand)}
                    </td>
                  ))}
                </tr>
              ))}
              {/* Action Row */}
              <tr className="bg-slate-50/50">
                <td className="font-bold text-slate-600 text-[11px]">Select Proposal</td>
                {compareCandidates.map((cand) => (
                  <td key={cand.candidate_id}>
                    <button
                      type="button"
                      onClick={() => {
                        handleUse(cand);
                        onClose();
                      }}
                      className="ux4g-btn ux4g-btn-primary ux4g-btn-sm w-full cursor-pointer shadow-xs"
                    >
                      <span>Use {cand.label.replace("Candidate ", "")}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="ux4g-modal-footer justify-between text-xs text-slate-500">
          <span>Relative suitability scores reflect user-configured objective weights.</span>
          <button
            type="button"
            onClick={onClose}
            className="ux4g-btn ux4g-btn-outline-neutral ux4g-btn-sm cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
