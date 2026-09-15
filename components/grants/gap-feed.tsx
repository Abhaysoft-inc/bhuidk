"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Flame,
  Clock,
  Building,
  CheckCircle,
  Lock,
  ArrowRight,
  FileText,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import { ResearchGap, UrgencyLevel, TopicCategory, UserRole } from "@/lib/grants-data";

interface GapFeedProps {
  gaps: ResearchGap[];
  userRole: UserRole;
  onClaimClick: (gap: ResearchGap) => void;
  onCoFunderClick: (funderName: string) => void;
  onOpenCoFundersModal: () => void;
}

export function GapFeed({
  gaps,
  userRole,
  onClaimClick,
  onCoFunderClick,
  onOpenCoFundersModal,
}: GapFeedProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState<string>("all");
  const [selectedUrgency, setSelectedUrgency] = useState<string>("all");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");

  const statesList = useMemo(() => {
    const s = new Set<string>();
    gaps.forEach((g) => s.add(g.state));
    return Array.from(s).sort();
  }, [gaps]);

  const filteredGaps = useMemo(() => {
    return gaps
      .filter((gap) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            gap.title.toLowerCase().includes(q) ||
            gap.state.toLowerCase().includes(q) ||
            (gap.district && gap.district.toLowerCase().includes(q)) ||
            gap.code.toLowerCase().includes(q) ||
            gap.evidenceSnippet.toLowerCase().includes(q);
          if (!match) return false;
        }
        if (selectedState !== "all" && gap.state !== selectedState) return false;
        if (selectedUrgency !== "all" && gap.urgency !== selectedUrgency) return false;
        if (selectedTopic !== "all" && gap.topic !== selectedTopic) return false;
        return true;
      })
      .sort((a, b) => {
        const w: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
        return (w[b.urgency] || 0) - (w[a.urgency] || 0);
      });
  }, [gaps, searchQuery, selectedState, selectedUrgency, selectedTopic]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedState !== "all" ||
    selectedUrgency !== "all" ||
    selectedTopic !== "all";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedState("all");
    setSelectedUrgency("all");
    setSelectedTopic("all");
  };

  const urgencyDot = (u: UrgencyLevel) => {
    const colors = { High: "bg-red-500", Medium: "bg-amber-500", Low: "bg-slate-400" };
    return <span className={`w-2 h-2 rounded-full ${colors[u]} shrink-0`} />;
  };

  const topicLabel: Record<TopicCategory, string> = {
    disputes: "Disputes",
    "land-use": "Land Use",
    climate: "Climate",
    digitization: "Digitization",
  };

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <p className="text-sm font-bold text-slate-800">
          {filteredGaps.length} research gap{filteredGaps.length !== 1 ? "s" : ""} detected
        </p>
        <button
          type="button"
          onClick={onOpenCoFundersModal}
          className="text-[11px] font-semibold text-[#0b2b50] hover:underline cursor-pointer flex items-center gap-1 self-start sm:self-auto"
        >
          <Building className="w-3.5 h-3.5 text-amber-500" />
          <span>View co-funding partners</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by district, state, or keyword..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0b2b50]/20"
          />
        </div>

        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0b2b50]/20"
        >
          <option value="all">All States</option>
          {statesList.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>

        <select
          value={selectedUrgency}
          onChange={(e) => setSelectedUrgency(e.target.value)}
          className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0b2b50]/20"
        >
          <option value="all">All Urgencies</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0b2b50]/20"
        >
          <option value="all">All Topics</option>
          <option value="disputes">Disputes</option>
          <option value="land-use">Land Use</option>
          <option value="climate">Climate</option>
          <option value="digitization">Digitization</option>
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Gap Cards */}
      <div className="space-y-3">
        {filteredGaps.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center space-y-2">
            <Search className="w-5 h-5 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500">No gaps match your filters.</p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-bold text-[#0b2b50] hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        ) : (
          filteredGaps.map((gap) => {
            const isClaimed = gap.claimStatus === "Claimed";
            const canClaim = userRole === "researcher" || userRole === "official" || userRole === "admin";

            return (
              <div
                key={gap.id}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm transition-shadow"
              >
                {/* Top meta row */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold bg-slate-800 text-white px-1.5 py-0.5 rounded">
                    {gap.code}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-600">
                    {urgencyDot(gap.urgency)} {gap.urgency}
                  </span>
                  <span className="text-[10px] text-slate-400">•</span>
                  <span className="text-[10px] font-medium text-slate-600">
                    {topicLabel[gap.topic]}
                  </span>
                  <span className="text-[10px] text-slate-400">•</span>
                  <span className="text-[10px] font-medium text-slate-600">
                    {gap.state}{gap.district ? `, ${gap.district}` : ""}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-slate-900 leading-snug mb-2">
                  {gap.title}
                </h3>

                {/* Evidence — compact one-liner */}
                <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">
                  {gap.evidenceSnippet}
                </p>

                {/* Source citation — inline subtle */}
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-3">
                  <FileText className="w-3 h-3 shrink-0" />
                  <span className="truncate">
                    Source: {gap.sourceEngine} · {gap.sourceCitation}
                  </span>
                </div>

                {/* Co-funders — simple inline chips */}
                <div className="flex flex-wrap items-center gap-1.5 mb-4">
                  {gap.coFunders.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => onCoFunderClick(f)}
                      className="text-[10px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
                    >
                      {f}
                    </button>
                  ))}
                </div>

                {/* Bottom action row */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>
                      <span className="font-semibold text-slate-700">{gap.recommendedFundingTier}</span>
                    </span>
                    <span className="font-bold text-emerald-700">{gap.estimatedBudget}</span>
                  </div>

                  {isClaimed ? (
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      Claimed
                    </span>
                  ) : canClaim ? (
                    <button
                      type="button"
                      onClick={() => onClaimClick(gap)}
                      className="bg-[#0b2b50] hover:bg-[#164275] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center gap-1"
                    >
                      Claim This Gap
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        alert(
                          "Public users can view gaps but cannot claim them. Log in as a researcher or official to submit proposals."
                        )
                      }
                      className="text-xs text-slate-400 flex items-center gap-1 cursor-pointer hover:text-slate-600"
                    >
                      <Lock className="w-3 h-3" />
                      Log in to claim
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
