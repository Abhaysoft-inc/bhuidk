"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Lightbulb,
  Award,
  Zap,
  Cpu,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  Database,
  Building,
  UserCheck,
  Sparkles,
  Layers,
  FileCheck,
  Info,
  CheckCircle2,
  Lock,
  ChevronDown,
} from "lucide-react";
import {
  INITIAL_RESEARCH_GAPS,
  INITIAL_CLAIMED_GAPS,
  INITIAL_INNOVATION_CHALLENGES,
  INITIAL_IMPACT_RECORDS,
  INITIAL_CO_FUNDERS,
  PLATFORM_IMPACT_STATS,
  ResearchGap,
  ClaimedGapItem,
  FastTrackApplication,
  UserRole,
  FundingTier,
} from "@/lib/grants-data";
import { GapFeed } from "./gap-feed";
import { ClaimModal } from "./claim-modal";
import { ClaimsTracker } from "./claims-tracker";
import { FastTrackSection } from "./fast-track-section";
import { InnovationChallenges } from "./innovation-challenges";
import { ImpactTracker } from "./impact-tracker";
import { CoFundersModal } from "./co-funders-modal";

export function GrantsPageClient() {
  const [userRole, setUserRole] = useState<UserRole>("researcher");
  const [gaps, setGaps] = useState<ResearchGap[]>(INITIAL_RESEARCH_GAPS);
  const [claims, setClaims] = useState<ClaimedGapItem[]>(INITIAL_CLAIMED_GAPS);
  const [fastTrackApps, setFastTrackApps] = useState<FastTrackApplication[]>([]);
  const [activeSection, setActiveSection] = useState<
    "feed" | "tracker" | "fasttrack" | "challenges" | "impact"
  >("feed");

  const [selectedGapToClaim, setSelectedGapToClaim] = useState<ResearchGap | null>(null);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState<boolean>(false);
  const [isCoFundersModalOpen, setIsCoFundersModalOpen] = useState<boolean>(false);
  const [selectedFunderForModal, setSelectedFunderForModal] = useState<string | null>(null);

  const handleOpenClaimModal = (gap: ResearchGap) => {
    setSelectedGapToClaim(gap);
    setIsClaimModalOpen(true);
  };

  const handleClaimSubmitted = (claimData: {
    gapId: string;
    gapTitle: string;
    proposedApproach: string;
    timelineMonths: number;
    fundingTier: FundingTier;
    amountRequested: string;
    deliverableType: string;
    targetRepoDoi: string;
    citationRef: string;
  }) => {
    setGaps((prev) =>
      prev.map((g) =>
        g.id === claimData.gapId
          ? {
              ...g,
              claimStatus: "Claimed" as const,
              claimedBy:
                userRole === "official"
                  ? "Joint Secretary (Revenue)"
                  : "Dr. Ashok Sharma (PI)",
              claimedDate: "Just now",
              targetRepoDoi: claimData.targetRepoDoi,
            }
          : g
      )
    );

    const newClaim: ClaimedGapItem = {
      id: `claim-${Date.now()}`,
      gapId: claimData.gapId,
      gapTitle: claimData.gapTitle,
      researcherName:
        userRole === "official" ? "Joint Secretary (Land Governance)" : "Dr. Ashok Sharma",
      institution:
        userRole === "official"
          ? "Department of Land Resources (DoLR)"
          : "Centre for Rural Land Governance, IIT Roorkee",
      role: userRole === "official" ? "State Revenue Official" : "Principal Investigator",
      fundingTier: claimData.fundingTier,
      amountRequested: claimData.amountRequested,
      timelineMonths: claimData.timelineMonths,
      currentStage: "Claimed",
      progressPercent: 15,
      deliverableType: claimData.deliverableType,
      proposedApproach: claimData.proposedApproach,
      targetRepoDoi: claimData.targetRepoDoi,
      citationRef: claimData.citationRef,
      indexedInRepository: false,
      dateSubmitted: "Just now",
      estimatedCompletion: `In ${claimData.timelineMonths} Months`,
    };

    setClaims((prev) => [newClaim, ...prev]);
  };

  const handleAdvanceStatus = (claimId: string) => {
    const stageFlow: Array<ClaimedGapItem["currentStage"]> = [
      "Claimed",
      "In Progress",
      "Submitted",
      "Reviewed",
      "Published",
    ];

    setClaims((prev) =>
      prev.map((c) => {
        if (c.id === claimId) {
          const currentIndex = stageFlow.indexOf(c.currentStage);
          const nextIndex = Math.min(stageFlow.length - 1, currentIndex + 1);
          const nextStage = stageFlow[nextIndex];
          const isNowPublished = nextStage === "Published";

          return {
            ...c,
            currentStage: nextStage,
            progressPercent: isNowPublished ? 100 : Math.min(90, (nextIndex + 1) * 20),
            indexedInRepository: isNowPublished,
          };
        }
        return c;
      })
    );
  };

  const handleFastTrackSubmit = (app: FastTrackApplication) => {
    setFastTrackApps((prev) => [app, ...prev]);
  };

  const handleCoFunderClick = (funderName: string) => {
    setSelectedFunderForModal(funderName);
    setIsCoFundersModalOpen(true);
  };

  const tabs = [
    { id: "feed", label: "Research Gaps", icon: Sparkles },
    { id: "tracker", label: "Active Projects", icon: FileCheck },
    { id: "fasttrack", label: "Quick Grants", icon: Zap },
    { id: "challenges", label: "Tech Challenges", icon: Cpu },
    { id: "impact", label: "Impact", icon: Award },
  ] as const;

  return (
    <div className="space-y-5">
      {/* ─── Clean Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Grants & Innovation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Fund research on data gaps detected by the platform&apos;s dispute and contradiction engines
          </p>
        </div>

        {/* Compact role switcher */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[10px] text-slate-400 font-medium">Viewing as:</span>
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as UserRole)}
            className="text-[11px] font-semibold bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0b2b50]/20 cursor-pointer"
          >
            <option value="researcher">Researcher</option>
            <option value="official">Government Official</option>
            <option value="public">Public (Read-Only)</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* ─── Clean Tab Bar ─── */}
      <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border-b-2 -mb-px ${
                isActive
                  ? "border-[#0b2b50] text-[#0b2b50] font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ─── Active Section Content ─── */}
      {activeSection === "feed" && (
        <div className="space-y-8">
          <GapFeed
            gaps={gaps}
            userRole={userRole}
            onClaimClick={handleOpenClaimModal}
            onCoFunderClick={handleCoFunderClick}
            onOpenCoFundersModal={() => {
              setSelectedFunderForModal(null);
              setIsCoFundersModalOpen(true);
            }}
          />

          <FastTrackSection
            availableGaps={gaps}
            userRole={userRole}
            onApplicationSubmit={handleFastTrackSubmit}
          />
        </div>
      )}

      {activeSection === "tracker" && (
        <ClaimsTracker
          claims={claims}
          userRole={userRole}
          onAdvanceStatus={handleAdvanceStatus}
        />
      )}

      {activeSection === "fasttrack" && (
        <div className="space-y-6">
          <FastTrackSection
            availableGaps={gaps}
            userRole={userRole}
            onApplicationSubmit={handleFastTrackSubmit}
          />

          {fastTrackApps.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
              <h3 className="text-sm font-bold text-slate-900">
                Your Fast-Track Applications
              </h3>
              <div className="divide-y divide-slate-100">
                {fastTrackApps.map((app) => (
                  <div key={app.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#0b2b50]">{app.id}</span>
                        <span className="text-slate-400">•</span>
                        <span className="font-semibold text-slate-800">{app.gapReference}</span>
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                          {app.status}
                        </span>
                      </div>
                      <div className="text-slate-500 mt-0.5">{app.expectedDeliverable}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-emerald-700">{app.requestedAmount}</div>
                      <div className="text-[10px] text-slate-400">{app.timelineWeeks} Weeks</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeSection === "challenges" && (
        <InnovationChallenges
          challenges={INITIAL_INNOVATION_CHALLENGES}
          userRole={userRole}
          onCoFunderClick={handleCoFunderClick}
        />
      )}

      {activeSection === "impact" && (
        <ImpactTracker records={INITIAL_IMPACT_RECORDS} stats={PLATFORM_IMPACT_STATS} />
      )}

      {/* ─── Subtle Honesty Footer Note ─── */}
      <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center gap-1.5">
        <Info className="w-3 h-3 shrink-0" />
        <span>
          Gap detection is illustrative in this prototype — powered by rule-based analysis, not live contradiction scanning at scale. All entities are fictional.
        </span>
      </div>

      {/* ─── Modals ─── */}
      <ClaimModal
        gap={selectedGapToClaim}
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        onClaimSubmitted={handleClaimSubmitted}
        userRole={userRole}
      />

      <CoFundersModal
        isOpen={isCoFundersModalOpen}
        onClose={() => setIsCoFundersModalOpen(false)}
        coFunders={INITIAL_CO_FUNDERS}
        gaps={gaps}
        selectedFunderName={selectedFunderForModal}
        userRole={userRole}
      />
    </div>
  );
}
