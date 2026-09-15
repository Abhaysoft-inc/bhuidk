"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  Search,
} from "lucide-react";
import { ImpactRecord, PlatformImpactStats, ImpactOutcome } from "@/lib/grants-data";

interface ImpactTrackerProps {
  records: ImpactRecord[];
  stats: PlatformImpactStats;
}

export function ImpactTracker({ records, stats }: ImpactTrackerProps) {
  const [outcomeFilter, setOutcomeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredRecords = records.filter((r) => {
    if (outcomeFilter !== "all" && r.outcomeStatus !== outcomeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.leadResearcher.toLowerCase().includes(q) ||
        r.institution.toLowerCase().includes(q) ||
        r.grantCode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getOutcomeBadge = (outcome: ImpactOutcome) => {
    const config: Record<ImpactOutcome, { bg: string; label: string }> = {
      "Cited in Policy": { bg: "bg-emerald-100 text-emerald-800", label: "Cited in Policy" },
      "Completed": { bg: "bg-blue-100 text-blue-800", label: "Completed" },
      "Under Peer Review": { bg: "bg-amber-100 text-amber-800", label: "Under Review" },
      "No update yet": { bg: "bg-slate-100 text-slate-600", label: "No Update" },
    };
    const c = config[outcome];
    return (
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.bg}`}>
        {c.label}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* KPI Stats — compact row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Disbursed", value: `₹${stats.totalGrantsFundedLakhs}L`, sub: `${stats.totalGrantsCount} projects` },
          { label: "Gaps Closed", value: `${stats.gapsClosedCount}`, sub: "Resolved & validated" },
          { label: "Publications", value: `${stats.papersPublishedCount}`, sub: "Open-access DOIs" },
          { label: "Fast-Track Speed", value: `${stats.avgFastTrackDays}d`, sub: "Avg turnaround" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <span className="text-[10px] text-slate-400 font-medium block">{s.label}</span>
            <div className="text-lg font-extrabold text-slate-900 mt-0.5">{s.value}</div>
            <span className="text-[10px] text-slate-400">{s.sub}</span>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search past studies..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0b2b50]/20"
          />
        </div>

        <div className="flex items-center gap-1">
          {[
            { id: "all", label: "All" },
            { id: "Cited in Policy", label: "Cited" },
            { id: "Completed", label: "Completed" },
            { id: "Under Peer Review", label: "Review" },
            { id: "No update yet", label: "Pending" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setOutcomeFilter(tab.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                outcomeFilter === tab.id
                  ? "bg-[#0b2b50] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Prototype label */}
      <p className="text-[10px] text-slate-400 italic">
        Sample data for demonstration purposes
      </p>

      {/* Records list — cards instead of wide table for readability */}
      <div className="space-y-3">
        {filteredRecords.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-400">
            No records match your filter.
          </div>
        ) : (
          filteredRecords.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-500">{r.grantCode}</span>
                    {getOutcomeBadge(r.outcomeStatus)}
                    <span className="text-[10px] text-slate-400">
                      {r.fundingTier} · {r.amountGranted}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{r.title}</h4>

                  <div className="text-[11px] text-slate-500">
                    {r.leadResearcher} · {r.institution}
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                    {r.policyImpactSummary}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200 px-1.5 py-0.5 rounded">
                    {r.repositoryCitation}
                  </span>
                  <Link
                    href="/dashboard/repository"
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#0b2b50] hover:underline cursor-pointer"
                  >
                    <BookOpen className="w-3 h-3" />
                    View in Repository
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
