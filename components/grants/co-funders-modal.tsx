"use client";

import React, { useState } from "react";
import {
  Building,
  X,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  ExternalLink,
  Handshake,
  Layers,
  Sparkles,
} from "lucide-react";
import { CoFunder, ResearchGap, UserRole } from "@/lib/grants-data";

interface CoFundersModalProps {
  isOpen: boolean;
  onClose: () => void;
  coFunders: CoFunder[];
  gaps: ResearchGap[];
  selectedFunderName?: string | null;
  userRole: UserRole;
}

export function CoFundersModal({
  isOpen,
  onClose,
  coFunders,
  gaps,
  selectedFunderName,
  userRole,
}: CoFundersModalProps) {
  const [pledgedFunders, setPledgedFunders] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const handlePledgeInterest = (funderId: string) => {
    setPledgedFunders((prev) => ({
      ...prev,
      [funderId]: !prev[funderId],
    }));
  };

  const totalPool = coFunders.reduce((acc, f) => acc + f.committedPoolLakhs, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#0b2b50] text-white p-5 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                CO-FUNDING SYNDICATION
              </span>
              <span className="text-xs text-slate-300">
                Total Committed Pool: ₹{(totalPool / 100).toFixed(2)} Cr
              </span>
            </div>
            <h3 className="text-base font-bold leading-snug">
              Institutional Co-Funding & Matchmaking Directory
            </h3>
            <p className="text-xs text-slate-300">
              Government departments, multilateral programs, and think tanks co-financing platform-detected research gaps.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coFunders.map((funder) => {
              const matchedGaps = gaps.filter((g) => g.coFunders.includes(funder.name));
              const isPledged = pledgedFunders[funder.id];
              const isHighlighted = selectedFunderName === funder.name;

              return (
                <div
                  key={funder.id}
                  className={`rounded-xl border p-4 flex flex-col justify-between transition-all ${
                    isHighlighted
                      ? "border-amber-400 bg-amber-50/40 ring-2 ring-amber-400/20"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          {funder.type}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 leading-tight mt-0.5">
                          {funder.name}
                        </h4>
                      </div>
                      <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                        ₹{funder.committedPoolLakhs}L Pool
                      </span>
                    </div>

                    {/* Focus areas */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block mb-1">
                        Mandated Focus Themes:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {funder.focusAreas.map((area) => (
                          <span
                            key={area}
                            className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Matched Gaps */}
                    <div className="text-[11px] text-slate-600">
                      <span className="font-semibold text-slate-700">Co-Sponsoring Gaps: </span>
                      <span className="text-[#0b2b50] font-bold">
                        {matchedGaps.length} Active Gaps on Platform
                      </span>
                    </div>
                  </div>

                  {/* Co-sponsor CTA */}
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-medium">
                      Syndicated with DoLR
                    </span>
                    <button
                      type="button"
                      onClick={() => handlePledgeInterest(funder.id)}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                        isPledged
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200"
                      }`}
                    >
                      {isPledged ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Pledged Co-Sponsor</span>
                        </>
                      ) : (
                        <>
                          <Handshake className="w-3.5 h-3.5 text-[#0b2b50]" />
                          <span>Express Interest to Co-Fund</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Co-funding pledges are formal non-binding expressions governed under NDSAP and PME guidelines.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="bg-[#0b2b50] text-white font-bold px-4 py-1.5 rounded-lg hover:bg-[#164275] cursor-pointer transition-colors"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
}
