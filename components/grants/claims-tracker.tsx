"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Send,
  FileCheck,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Database,
  Building,
  User,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { ClaimedGapItem, ClaimStatus, UserRole } from "@/lib/grants-data";

interface ClaimsTrackerProps {
  claims: ClaimedGapItem[];
  userRole: UserRole;
  onAdvanceStatus?: (claimId: string) => void;
}

export function ClaimsTracker({ claims, userRole, onAdvanceStatus }: ClaimsTrackerProps) {
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(
    claims.length > 0 ? claims[0].id : null
  );

  const stages: ClaimStatus[] = ["Claimed", "In Progress", "Submitted", "Reviewed", "Published"];

  const getStageIndex = (stage: ClaimStatus) => stages.indexOf(stage);

  const activeClaim = claims.find((c) => c.id === selectedClaimId) || claims[0];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-extrabold text-[#0b2b50] tracking-tight flex items-center gap-2">
            <span>Adopt-a-Gap Progress & Repository Pipeline</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              {claims.length} Active Studies
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track claimed research projects from initial inception to peer review and auto-ingestion into the Central Repository
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
          <Database className="w-3.5 h-3.5 text-[#0b2b50]" />
          <span>Continuous Repository Synced</span>
        </div>
      </div>

      {claims.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
          No gaps currently claimed. Click &quot;Claim This Gap&quot; in the Gap Feed above to initiate an Adopt-a-Gap fellowship.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Claims List (Left) */}
          <div className="lg:col-span-4 space-y-2.5">
            {claims.map((claim) => {
              const isSelected = claim.id === activeClaim?.id;
              const isPublished = claim.currentStage === "Published";

              return (
                <div
                  key={claim.id}
                  onClick={() => setSelectedClaimId(claim.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? "bg-[#0b2b50] text-white border-[#0b2b50] shadow-sm"
                      : "bg-white text-slate-800 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                        isSelected ? "bg-white/20 text-amber-300" : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {claim.citationRef}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isPublished
                          ? isSelected
                            ? "bg-emerald-400 text-slate-950"
                            : "bg-emerald-100 text-emerald-800"
                          : isSelected
                          ? "bg-amber-400 text-slate-950"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {claim.currentStage}
                    </span>
                  </div>

                  <h4
                    className={`text-xs font-bold leading-snug line-clamp-2 ${
                      isSelected ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {claim.gapTitle}
                  </h4>

                  <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                    <span className={isSelected ? "text-slate-300" : "text-slate-500"}>
                      {claim.researcherName}
                    </span>
                    <span
                      className={`font-semibold ${
                        isSelected ? "text-amber-300" : "text-emerald-700"
                      }`}
                    >
                      {claim.amountRequested}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Claim Detail & Stepper Tracker (Right) */}
          {activeClaim && (
            <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold bg-slate-800 text-white px-2 py-0.5 rounded">
                      {activeClaim.citationRef}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      {activeClaim.fundingTier}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                    {activeClaim.gapTitle}
                  </h3>
                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2 pt-0.5">
                    <span className="font-semibold text-slate-700">
                      Lead: {activeClaim.researcherName}
                    </span>
                    <span>•</span>
                    <span>{activeClaim.institution}</span>
                  </div>
                </div>

                {/* Advance Stage Test Button (for Admin/Official/Researcher) */}
                {userRole !== "public" && activeClaim.currentStage !== "Published" && (
                  <button
                    type="button"
                    onClick={() => onAdvanceStatus && onAdvanceStatus(activeClaim.id)}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors shrink-0 self-start"
                    title="Simulate advancing to next milestone review stage"
                  >
                    <span>Advance Milestone Stage</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Visual 5-Stage Stepper Tracker */}
              <div className="py-2">
                <div className="text-xs font-bold text-slate-700 mb-3 flex items-center justify-between">
                  <span>Adoption Lifecycle Status</span>
                  <span className="text-slate-400 font-normal text-[11px]">
                    Target Completion: {activeClaim.estimatedCompletion}
                  </span>
                </div>

                {/* Stepper container */}
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-4 left-4 right-4 h-1 bg-slate-100 -z-0">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{
                        width: `${(getStageIndex(activeClaim.currentStage) / (stages.length - 1)) * 100}%`,
                      }}
                    />
                  </div>

                  {/* Stage nodes */}
                  <div className="grid grid-cols-5 relative z-10">
                    {stages.map((stage, idx) => {
                      const currentIdx = getStageIndex(activeClaim.currentStage);
                      const isComplete = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div key={stage} className="flex flex-col items-center text-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                              isCurrent
                                ? "bg-[#0b2b50] border-amber-400 text-white shadow-xs"
                                : isComplete
                                ? "bg-emerald-500 border-emerald-600 text-white"
                                : "bg-white border-slate-300 text-slate-400"
                            }`}
                          >
                            {isComplete && !isCurrent ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <span>{idx + 1}</span>
                            )}
                          </div>
                          <span
                            className={`text-[11px] font-bold mt-2 ${
                              isCurrent
                                ? "text-[#0b2b50]"
                                : isComplete
                                ? "text-slate-800"
                                : "text-slate-400"
                            }`}
                          >
                            {stage}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Research Approach & Output Details */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-slate-200/80">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Target Deliverable
                    </span>
                    <span className="font-bold text-slate-800 mt-0.5 block">
                      {activeClaim.deliverableType}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Approved Funding
                    </span>
                    <span className="font-extrabold text-emerald-700 mt-0.5 block">
                      {activeClaim.amountRequested}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Proposed Methodology Summary
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    {activeClaim.proposedApproach}
                  </p>
                </div>
              </div>

              {/* Central Repository Ingestion Box */}
              <div
                className={`rounded-xl p-4 border text-xs transition-colors ${
                  activeClaim.indexedInRepository
                    ? "bg-emerald-50/70 border-emerald-200"
                    : "bg-blue-50/60 border-blue-200"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Database
                        className={`w-4 h-4 ${
                          activeClaim.indexedInRepository ? "text-emerald-700" : "text-blue-700"
                        }`}
                      />
                      <span
                        className={`font-bold ${
                          activeClaim.indexedInRepository ? "text-emerald-900" : "text-blue-950"
                        }`}
                      >
                        {activeClaim.indexedInRepository
                          ? "Indexed in Central Repository (Open Access)"
                          : "Repository Accession Provisioned"}
                      </span>
                    </div>
                    <div className="text-slate-600 text-[11px]">
                      Accession DOI:{" "}
                      <span className="font-mono font-bold text-slate-900">
                        {activeClaim.targetRepoDoi}
                      </span>
                      {" • "}
                      Platform Citation Tag:{" "}
                      <span className="font-mono font-bold text-amber-800">
                        {activeClaim.citationRef}
                      </span>
                    </div>
                  </div>

                  {activeClaim.indexedInRepository ? (
                    <Link
                      href="/dashboard/repository"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>View in Repository</span>
                    </Link>
                  ) : (
                    <span className="text-[11px] text-blue-800 font-semibold bg-white/70 px-2.5 py-1 rounded-md border border-blue-200 self-start sm:self-auto">
                      Auto-ingests on final peer review
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
