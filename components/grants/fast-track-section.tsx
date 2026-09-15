"use client";

import React, { useState } from "react";
import {
  Zap,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Sparkles,
  ArrowRight,
  IndianRupee,
  Lock,
} from "lucide-react";
import { ResearchGap, UserRole, FastTrackApplication } from "@/lib/grants-data";

interface FastTrackSectionProps {
  availableGaps: ResearchGap[];
  userRole: UserRole;
  onApplicationSubmit: (app: FastTrackApplication) => void;
}

export function FastTrackSection({
  availableGaps,
  userRole,
  onApplicationSubmit,
}: FastTrackSectionProps) {
  const [selectedGapRef, setSelectedGapRef] = useState<string>(
    availableGaps.length > 0 ? availableGaps[0].code : "GAP-2026-081"
  );
  const [deliverable, setDeliverable] = useState<string>("Statutory Harmonization Note & SOP Draft");
  const [timelineWeeks, setTimelineWeeks] = useState<number>(3);
  const [requestedAmount, setRequestedAmount] = useState<string>("₹1,50,000");
  const [submittedApp, setSubmittedApp] = useState<FastTrackApplication | null>(null);

  const canApply = userRole === "researcher" || userRole === "official" || userRole === "admin";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canApply) {
      alert("Public users are in read-only mode. Please switch to Researcher or Official role to submit fast-track grants.");
      return;
    }

    const randomNum = Math.floor(100 + Math.random() * 900);
    const newApp: FastTrackApplication = {
      id: `FG-2026-${randomNum}`,
      applicantName: userRole === "official" ? "State Revenue Liaison Officer" : "Dr. Ashok Sharma",
      applicantRole: userRole === "official" ? "Government Official" : "Verified Academic Scholar",
      applicantOrg: "Centre for Rural Land Governance",
      gapReference: selectedGapRef,
      expectedDeliverable: deliverable,
      timelineWeeks,
      requestedAmount,
      status: "Under Review",
      submittedAt: "Just now",
    };

    onApplicationSubmit(newApp);
    setSubmittedApp(newApp);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-white to-emerald-500/10 border-2 border-amber-400/60 p-6 shadow-sm">
      {/* Decorative Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-amber-200/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              <Zap className="w-3 h-3 fill-slate-950" /> Micro-Grant Fast Track
            </span>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
              ⚡ Decision within 2 Weeks
            </span>
          </div>
          <h2 className="text-lg font-black text-[#0b2b50] tracking-tight">
            Rapid Action Funding for Urgent Land Governance Gaps
          </h2>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            Designed for focused, high-speed interventions (measured in weeks, not years). 
            Deploy rapid empirical ground truthing, statutory clause analysis, or cadastral field verifications with expedited approvals.
          </p>
        </div>

        {/* Speed Comparison Pill */}
        <div className="bg-white/90 border border-slate-200 rounded-xl p-3 text-xs shrink-0 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-500 font-medium">Standard Grants:</span>
            <span className="font-bold text-slate-700">60-90 days review</span>
          </div>
          <div className="flex items-center justify-between gap-4 font-extrabold text-[#0b2b50]">
            <span className="flex items-center gap-1 text-amber-600">
              <Zap className="w-3 h-3 fill-amber-600" /> Fast-Track:
            </span>
            <span className="text-emerald-700 font-black">14-day guaranteed review</span>
          </div>
        </div>
      </div>

      {submittedApp ? (
        /* Submission Confirmation */
        <div className="mt-5 p-6 bg-white rounded-xl border border-emerald-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900">
            Fast-Track Application Logged: {submittedApp.id}
          </h3>
          <p className="text-xs text-slate-600 max-w-lg mx-auto">
            Your micro-grant application referencing <strong>{submittedApp.gapReference}</strong> has been prioritized in the 14-day evaluation queue. Disbursal timeline commences upon automated committee signoff.
          </p>
          <div className="inline-flex items-center gap-4 text-xs bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg font-mono text-slate-700">
            <span>Grant Pool: {submittedApp.requestedAmount}</span>
            <span>•</span>
            <span>Duration: {submittedApp.timelineWeeks} Weeks</span>
            <span>•</span>
            <span className="text-amber-700 font-bold">Status: {submittedApp.status}</span>
          </div>
          <div>
            <button
              type="button"
              onClick={() => setSubmittedApp(null)}
              className="text-xs font-bold text-[#0b2b50] hover:underline cursor-pointer"
            >
              Submit Another Fast-Track Pitch
            </button>
          </div>
        </div>
      ) : (
        /* 3-Field Application Form */
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Field 1: Gap Reference */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                1. Target Gap Reference
              </label>
              <select
                value={selectedGapRef}
                onChange={(e) => setSelectedGapRef(e.target.value)}
                className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#0b2b50]/20"
              >
                {availableGaps.map((gap) => (
                  <option key={gap.id} value={gap.code}>
                    {gap.code}: {gap.state} ({gap.topic})
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Selected from platform-detected research gaps
              </span>
            </div>

            {/* Field 2: Expected Deliverable */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                2. Expected Deliverable
              </label>
              <select
                value={deliverable}
                onChange={(e) => setDeliverable(e.target.value)}
                className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#0b2b50]/20"
              >
                <option value="Statutory Harmonization Note & SOP Draft">Statutory Harmonization Brief</option>
                <option value="Empirical Ground-Truth Survey Dataset">Empirical Ground-Truth Dataset</option>
                <option value="Rapid Legal Conciliation Schema">Pre-Litigation Settlement Schema</option>
                <option value="Cadastral Tolerance Verification Note">Cadastral Drone Tolerance Note</option>
              </select>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Actionable artifact ready for gazetting/indexing
              </span>
            </div>

            {/* Field 3: Timeline */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                3. Execution Timeline
              </label>
              <select
                value={timelineWeeks}
                onChange={(e) => setTimelineWeeks(Number(e.target.value))}
                className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#0b2b50]/20"
              >
                <option value={2}>2 Weeks (Rapid Desk Synthesis)</option>
                <option value={3}>3 Weeks (Focused Empirical Sample)</option>
                <option value={4}>4 Weeks (Field Ground Validation)</option>
                <option value={6}>6 Weeks (Multi-Tehsil Pilot)</option>
              </select>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Micro-grant cap is strictly 6 weeks
              </span>
            </div>
          </div>

          {/* Submission Bar */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Requested Micro-Grant:</span>
              <div className="flex items-center gap-1">
                {["₹75,000", "₹1,50,000", "₹2,00,000"].map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setRequestedAmount(tier)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold border transition-colors cursor-pointer ${
                      requestedAmount === tier
                        ? "bg-[#0b2b50] text-white border-[#0b2b50]"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            {canApply ? (
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-5 py-2.5 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-colors shrink-0"
              >
                <Zap className="w-3.5 h-3.5 fill-white" />
                <span>Submit 14-Day Fast-Track Pitch</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  alert(
                    "Role-Based Access Notice: Fast-track micro-grants are reserved for verified researchers and revenue officials. Please switch your role using the top bar to test submission."
                  )
                }
                className="bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold px-4 py-2.5 rounded-lg text-xs flex items-center justify-center gap-1.5 border border-slate-200 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Log in as researcher/official to apply</span>
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
