"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Code2,
  Cpu,
  CheckCircle2,
  AlertCircle,
  Building,
  ArrowRight,
  Send,
  X,
  Lock,
  Clock,
  Layers,
  HelpCircle,
} from "lucide-react";
import { InnovationChallenge, UserRole } from "@/lib/grants-data";

interface InnovationChallengesProps {
  challenges: InnovationChallenge[];
  userRole: UserRole;
  onCoFunderClick: (funderName: string) => void;
}

export function InnovationChallenges({
  challenges,
  userRole,
  onCoFunderClick,
}: InnovationChallengesProps) {
  const [selectedChallenge, setSelectedChallenge] = useState<InnovationChallenge | null>(null);
  const [pitchText, setPitchText] = useState("");
  const [techStack, setTechStack] = useState("");
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const canSubmit = userRole === "researcher" || userRole === "official" || userRole === "admin";

  const handleOpenModal = (ch: InnovationChallenge) => {
    setSelectedChallenge(ch);
    setPitchText("");
    setTechStack("");
    setSubmittedId(null);
  };

  const handlePitchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pitchText.trim()) {
      alert("Please enter a brief outline of your technical approach.");
      return;
    }
    setSubmittedId(selectedChallenge?.challengeCode || "CHAL");
  };

  return (
    <div className="space-y-4">
      {/* Header with humble framing */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold bg-[#0b2b50] text-white px-2 py-0.5 rounded">
              OPEN ROADMAP
            </span>
            <h2 className="text-base font-extrabold text-[#0b2b50] tracking-tight">
              Platform Innovation Challenges: Help Us Improve What We&apos;ve Built
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Open engineering and algorithmic challenges pulled directly from our production gaps. 
            We share current system limitations transparently so innovators can build real upgrades.
          </p>
        </div>

        <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto shrink-0">
          Total Challenge Pool: <span className="text-emerald-700 font-extrabold">₹1.25 Cr</span>
        </div>
      </div>

      {/* Challenge Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {challenges.map((ch) => (
          <div
            key={ch.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Card Meta Row */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono font-bold bg-slate-800 text-amber-300 px-2 py-0.5 rounded">
                  {ch.challengeCode}
                </span>
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {ch.roadmapStage}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                {ch.title}
              </h3>

              {/* Problem Statement */}
              <div className="text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-700 block">The Engineering Problem:</span>
                <p className="leading-relaxed">{ch.problemStatement}</p>
              </div>

              {/* Why it matters */}
              <div className="text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-700 block">Why It Matters for India:</span>
                <p className="leading-relaxed">{ch.whyItMatters}</p>
              </div>

              {/* HONEST CURRENT BASELINE (Critical requirement) */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-3 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Current Platform Baseline (Transparent Assessment)</span>
                </div>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  {ch.currentBaseline}
                </p>
              </div>

              {/* Expected target outcome */}
              <div className="text-xs bg-slate-50 border border-slate-200/80 rounded-lg p-3 space-y-1">
                <span className="font-bold text-[#0b2b50] text-[11px] block">
                  Expected Architecture Target:
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {ch.expectedOutcome}
                </p>
              </div>

              {/* Co-Funders */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-bold text-slate-400 block">
                  Co-Sponsoring Institutions:
                </span>
                <div className="flex flex-wrap gap-1">
                  {ch.coFunders.map((funder) => (
                    <button
                      key={funder}
                      type="button"
                      onClick={() => onCoFunderClick(funder)}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded border border-slate-200 transition-colors cursor-pointer"
                    >
                      {funder}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Strip */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Grant Pool</span>
                <span className="text-xs font-black text-emerald-700">{ch.grantPool}</span>
              </div>

              {canSubmit ? (
                <button
                  type="button"
                  onClick={() => handleOpenModal(ch)}
                  className="bg-[#0b2b50] hover:bg-[#164275] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <span>Submit Solution Pitch</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    alert(
                      "Role Notice: Solution architecture submissions require verified academic researcher, engineering fellow, or official access. Public mode is view-only."
                    )
                  }
                  className="bg-slate-100 hover:bg-slate-200 text-slate-500 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer border border-slate-200"
                >
                  <Lock className="w-3 h-3 text-amber-600" />
                  <span>Log in to submit pitch</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Submission Modal */}
      {selectedChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-[#0b2b50] text-white p-5 flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                  {selectedChallenge.challengeCode}
                </span>
                <h3 className="text-base font-bold leading-snug">{selectedChallenge.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedChallenge(null)}
                className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submittedId ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-black text-slate-900">Solution Pitch Received</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Your architecture proposal for <strong>{submittedId}</strong> has been logged with the Technical Steering Working Group (WG-04). Shortlisted teams are notified within 21 days for sandboxed prototyping.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedChallenge(null)}
                    className="bg-[#0b2b50] hover:bg-[#164275] text-white px-5 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                  >
                    Close & Return to Challenges
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePitchSubmit} className="p-6 space-y-4 text-xs">
                {/* Baseline reminder */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-slate-700 space-y-1">
                  <span className="font-bold text-amber-900 block">Baseline to Benchmark Against:</span>
                  <p className="text-[11px] leading-relaxed">{selectedChallenge.currentBaseline}</p>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Proposed Technical Architecture / Model Approach
                  </label>
                  <textarea
                    rows={4}
                    value={pitchText}
                    onChange={(e) => setPitchText(e.target.value)}
                    placeholder="Describe how your architecture will outperform the baseline (e.g. model architecture, training data source, edge runtime, or latency improvements)..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0b2b50]/20"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Core Technology Stack / Frameworks
                  </label>
                  <input
                    type="text"
                    value={techStack}
                    onChange={(e) => setTechStack(e.target.value)}
                    placeholder="e.g. PyTorch, Indian Legal BERT, ONNX Runtime, FastAPI, QGIS plugins"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0b2b50]/20"
                  />
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] text-slate-600">
                  <p>
                    <strong>Open Source Requirement:</strong> All winning solutions must license their code under GNU GPL v3 or Apache 2.0 to be integrated into the Central National Land Governance codebase.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedChallenge(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#0b2b50] hover:bg-[#164275] text-white px-5 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-400" />
                    <span>Submit Technical Architecture</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
