"use client";

import React, { useState } from "react";
import { X, ShieldCheck, CheckCircle2, Clock, IndianRupee, FileText, Building2, AlertCircle } from "lucide-react";
import { ResearchGap, FundingTier, UserRole } from "@/lib/grants-data";

interface ClaimModalProps {
  gap: ResearchGap | null;
  isOpen: boolean;
  onClose: () => void;
  onClaimSubmitted: (claimData: {
    gapId: string;
    gapTitle: string;
    proposedApproach: string;
    timelineMonths: number;
    fundingTier: FundingTier;
    amountRequested: string;
    deliverableType: string;
    targetRepoDoi: string;
    citationRef: string;
  }) => void;
  userRole: UserRole;
}

export function ClaimModal({ gap, isOpen, onClose, onClaimSubmitted, userRole }: ClaimModalProps) {
  const [fundingTier, setFundingTier] = useState<FundingTier>("Standard (₹2L–10L)");
  const [timelineMonths, setTimelineMonths] = useState<number>(6);
  const [deliverableType, setDeliverableType] = useState<string>("Empirical Policy Paper & Data Synthesis");
  const [proposedApproach, setProposedApproach] = useState<string>("");
  const [amountRequested, setAmountRequested] = useState<string>("");
  const [autoIndexAgreed, setAutoIndexAgreed] = useState<boolean>(true);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [generatedDoi, setGeneratedDoi] = useState<string>("");

  React.useEffect(() => {
    if (gap) {
      setFundingTier(gap.recommendedFundingTier);
      setAmountRequested(gap.estimatedBudget);
      setProposedApproach("");
      setSubmitted(false);
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      setGeneratedDoi(`DOI: 10.GOV.IN/LGD/2026/REP-${randomNum}`);
    }
  }, [gap]);

  if (!isOpen || !gap) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposedApproach.trim()) {
      alert("Please outline your proposed methodological approach.");
      return;
    }
    if (!autoIndexAgreed) {
      alert("You must agree to repository indexing upon peer-review completion.");
      return;
    }

    const citationRef = `[D-CLAIM-${Math.floor(100 + Math.random() * 900)}]`;

    onClaimSubmitted({
      gapId: gap.id,
      gapTitle: gap.title,
      proposedApproach,
      timelineMonths,
      fundingTier,
      amountRequested: amountRequested || gap.estimatedBudget,
      deliverableType,
      targetRepoDoi: generatedDoi,
      citationRef,
    });

    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-[#0b2b50] text-white p-5 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                ADOPT-A-GAP WORKFLOW
              </span>
              <span className="text-xs text-slate-300 font-mono">{gap.code}</span>
              <span className="text-[10px] bg-white/15 px-2 py-0.5 rounded font-semibold text-slate-200">
                {gap.state}
              </span>
            </div>
            <h3 className="text-base font-bold leading-snug">{gap.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          /* Confirmation View */
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-black text-slate-900">Research Gap Claimed Successfully!</h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Your research proposal has been linked to <strong>{gap.code}</strong>. The project is now tracked in the platform&apos;s Adopt-a-Gap pipeline and provisioned for auto-ingestion into the Central Repository.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left max-w-md mx-auto text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Lead Investigator:</span>
                <span className="font-bold text-slate-800">
                  {userRole === "official" ? "Joint Secretary (Revenue / Land Records)" : "Dr. Ashok Sharma (Researcher)"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Provisioned Repository DOI:</span>
                <span className="font-mono font-bold text-blue-700">{generatedDoi}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Funding Tier:</span>
                <span className="font-bold text-emerald-700">{fundingTier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Status:</span>
                <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  <Clock className="w-3 h-3" /> Claimed (Initial Inception)
                </span>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={onClose}
                className="bg-[#0b2b50] hover:bg-[#164275] text-white px-6 py-2.5 rounded-lg text-xs font-bold cursor-pointer transition-colors"
              >
                Go to Active Claims Tracker
              </button>
            </div>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Grounding Source Context Box */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Data Gap Surfaced By Platform Intelligence</span>
              </div>
              <p className="text-slate-700 text-[11px] leading-relaxed">
                <strong>Source:</strong> {gap.sourceMetric}
              </p>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                <strong>Evidence:</strong> {gap.evidenceSnippet}
              </p>
              <div className="text-[11px] font-mono text-slate-800 pt-0.5">
                <span className="font-semibold text-amber-800">Contradiction Citation: </span>
                {gap.sourceCitation}
              </div>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Funding Tier */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Funding Tier Requested
                </label>
                <select
                  value={fundingTier}
                  onChange={(e) => setFundingTier(e.target.value as FundingTier)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#0b2b50]/20"
                >
                  <option value="Micro (₹50k–2L)">Micro: ₹50k – 2L (Rapid field/desk brief)</option>
                  <option value="Standard (₹2L–10L)">Standard: ₹2L – 10L (Empirical survey/model)</option>
                  <option value="Major (₹10L+)">Major: ₹10L+ (Multi-state longitudinal study)</option>
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Proposed Budget Estimate
                </label>
                <div className="relative">
                  <IndianRupee className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={amountRequested}
                    onChange={(e) => setAmountRequested(e.target.value)}
                    placeholder="e.g. ₹5.8 Lakhs"
                    className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0b2b50]/20"
                  />
                </div>
              </div>

              {/* Timeline */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Research Execution Timeline
                </label>
                <select
                  value={timelineMonths}
                  onChange={(e) => setTimelineMonths(Number(e.target.value))}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#0b2b50]/20"
                >
                  <option value={3}>3 Months (Rapid Assessment)</option>
                  <option value={6}>6 Months (Standard Fellowship)</option>
                  <option value={12}>12 Months (Comprehensive Grant)</option>
                </select>
              </div>

              {/* Primary Deliverable */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Expected Primary Deliverable
                </label>
                <select
                  value={deliverableType}
                  onChange={(e) => setDeliverableType(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#0b2b50]/20"
                >
                  <option value="Empirical Policy Paper & Data Synthesis">Policy Paper & Data Synthesis</option>
                  <option value="Statutory Harmonization & Legal SOP Draft">Statutory Harmonization SOP Draft</option>
                  <option value="Geo-Spatial Ground Validation Dataset">Geo-Spatial Ground Validation Dataset</option>
                  <option value="Machine Learning Pre-Litigation Model">ML Pre-Litigation Model</option>
                </select>
              </div>
            </div>

            {/* Proposed Approach Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Proposed Research Methodology & Data Plan
                </label>
                <span className="text-[10px] text-slate-400">Brief summary (2-3 sentences)</span>
              </div>
              <textarea
                rows={3}
                value={proposedApproach}
                onChange={(e) => setProposedApproach(e.target.value)}
                placeholder="Explain how you will resolve the flagged discrepancy, target field sample, and analytical framework..."
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0b2b50]/20"
                required
              />
            </div>

            {/* Investigator Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#0b2b50] text-white text-xs font-bold flex items-center justify-center">
                  AS
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    Dr. Ashok Sharma (Principal Investigator)
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Centre for Rural Land Governance • Verified via Jan Parichay
                  </div>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                Eligible Scholar
              </span>
            </div>

            {/* Repository Auto-Ingest Agreement */}
            <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3.5 space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoIndexAgreed}
                  onChange={(e) => setAutoIndexAgreed(e.target.checked)}
                  className="mt-0.5 rounded text-[#0b2b50] focus:ring-[#0b2b50]"
                />
                <span className="text-xs text-slate-700 leading-relaxed">
                  <strong>Central Repository Ingestion Commitment:</strong> I agree that final deliverables will automatically feed back into the National Land Governance Curated Repository under provisioned accession ID <span className="font-mono text-blue-900 font-bold">{generatedDoi}</span> upon peer review.
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#0b2b50] hover:bg-[#164275] text-white px-5 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Submit Formal Claim
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
