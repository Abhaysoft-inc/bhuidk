"use client";

import React, { useState, useMemo } from "react";
import {
  Sparkles,
  Sliders,
  TrendingDown,
  TrendingUp,
  Clock,
  IndianRupee,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  BarChart3,
  RefreshCw,
  Info,
} from "lucide-react";

interface PolicySimulatorProps {
  language: "en" | "hi";
}

interface PolicyScenario {
  id: string;
  nameEn: string;
  nameHi: string;
  descriptionEn: string;
  descriptionHi: string;
  baseDisputeReduction: number;
  baseTurnaroundDays: number;
  baseRevenueImpactPct: number;
  baseSavingsCrores: number;
  keyRiskEn: string;
  mitigationEn: string;
}

export function PolicySimulator({ language }: PolicySimulatorProps) {
  const scenarios: PolicyScenario[] = [
    {
      id: "ulpin_mandatory",
      nameEn: "Mandatory Bhu-Aadhaar (ULPIN) Seeding in Real-Time Property Registration",
      nameHi: "संपत्ति पंजीकरण में अनिवार्य भू-आधार (यूलपिन) सीडिंग",
      descriptionEn: "Enforce real-time spatial validation of 14-digit ULPIN before any deed registration or title transfer at Sub-Registrar Offices (SRO).",
      descriptionHi: "उप-पंजीयक कार्यालयों (SRO) में विलेख पंजीकरण से पूर्व 14-अंकीय यूलपिन का वास्तविक समय में स्थानिक सत्यापन अनिवार्य करना।",
      baseDisputeReduction: 44,
      baseTurnaroundDays: 5,
      baseRevenueImpactPct: 28,
      baseSavingsCrores: 7800,
      keyRiskEn: "Legacy cadastral map distortion causing false boundary overlaps during GIS geo-tagging.",
      mitigationEn: "Deploy CORS network ground-truthing and differential GPS re-alignment prior to final freeze.",
    },
    {
      id: "ai_dispute_conciliation",
      nameEn: "AI-Powered Pre-Litigation Revenue Dispute Conciliation Engine",
      nameHi: "एआई आधारित मुकदमा-पूर्व राजस्व विवाद सुलह प्रणाली",
      descriptionEn: "Leverage historical appellate precedents, satellite boundary changes, and RoR genealogy to predict dispute merits and propose settlement terms.",
      descriptionHi: "ऐतिहासिक अपीलीय निर्णयों, उपग्रह सीमा परिवर्तनों व खतौनी वंशावली के आधार पर विवाद सुलह शर्तों की भविष्यवाणी करना।",
      baseDisputeReduction: 58,
      baseTurnaroundDays: 14,
      baseRevenueImpactPct: 15,
      baseSavingsCrores: 11200,
      keyRiskEn: "Digital divide among marginal landholders during automated notice delivery.",
      mitigationEn: "Mandate physical village Panchayat hearing alongside digital AI case summary generation.",
    },
    {
      id: "svamitva_drone_expansion",
      nameEn: "SVAMITVA Drone Resurvey & Dynamic Cadastral Linkage in Peri-Urban Areas",
      nameHi: "पेरी-अर्बन क्षेत्रों में स्वामित्व ड्रोन पुनर्सर्वेक्षण एवं डायनामिक कैडस्ट्रल लिंकिंग",
      descriptionEn: "High-resolution 1:500 drone photogrammetry over fast-growing urban-rural transition zones with automated property card issuance.",
      descriptionHi: "तीव्र विकसित हो रहे शहरी-ग्रामीण संक्रमण क्षेत्रों में 1:500 रिज़ॉल्यूशन ड्रोन फोटोग्रामेट्री और स्वचालित प्रॉपर्टी कार्ड वितरण।",
      baseDisputeReduction: 36,
      baseTurnaroundDays: 8,
      baseRevenueImpactPct: 34,
      baseSavingsCrores: 6400,
      keyRiskEn: "Rapid unauthorized plotting and informal subdivision prior to final drone flight approval.",
      mitigationEn: "Weekly Sentinel satellite change-detection monitoring to flag active encroachment corridors.",
    },
    {
      id: "model_leasing_reforms",
      nameEn: "Model Land Leasing Act: Institutionalized Tenancy & Collateral Security",
      nameHi: "मॉडल भूमि पट्टा कानून: संस्थागत काश्तकारी एवं संस्थागत साख सुरक्षा",
      descriptionEn: "Formal legal recognition of tenant farmers without affecting landowners' underlying proprietary title, unlocking crop loan eligibility.",
      descriptionHi: "भूस्वामियों के स्वामित्व को सुरक्षित रखते हुए काश्तकारों को कानूनी मान्यता एवं फसल ऋण पात्रता सुनिश्चित करना।",
      baseDisputeReduction: 29,
      baseTurnaroundDays: 10,
      baseRevenueImpactPct: 21,
      baseSavingsCrores: 8900,
      keyRiskEn: "Landowner apprehension regarding adverse possession or tenancy tenancy rights persistence.",
      mitigationEn: "Statutory clause explicitly disallowing adverse possession claims on registered lease agreements.",
    },
  ];

  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("ulpin_mandatory");
  const [coveragePct, setCoveragePct] = useState<number>(75);
  const [timelineYears, setTimelineYears] = useState<number>(3);
  const [frictionLevel, setFrictionLevel] = useState<"low" | "standard" | "high">("standard");

  const currentScenario = useMemo(
    () => scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0],
    [selectedScenarioId]
  );

  // Dynamic simulation calculations
  const simulationResults = useMemo(() => {
    const coverageFactor = coveragePct / 100;
    const timelineFactor = timelineYears === 1 ? 0.75 : timelineYears === 3 ? 1.0 : 1.22;
    const frictionFactor = frictionLevel === "low" ? 1.15 : frictionLevel === "standard" ? 1.0 : 0.82;

    const disputeReduction = Math.min(
      85,
      Math.round(currentScenario.baseDisputeReduction * coverageFactor * timelineFactor * frictionFactor)
    );

    const turnaroundDays = Math.max(
      3,
      Math.round(currentScenario.baseTurnaroundDays * (1 / (coverageFactor * timelineFactor * frictionFactor)))
    );

    const revenueGrowthPct = Math.min(
      50,
      Math.round(currentScenario.baseRevenueImpactPct * coverageFactor * timelineFactor * frictionFactor)
    );

    const projectedSavings = Math.round(
      currentScenario.baseSavingsCrores * coverageFactor * timelineFactor * frictionFactor
    );

    return {
      disputeReduction,
      turnaroundDays,
      revenueGrowthPct,
      projectedSavings,
    };
  }, [currentScenario, coveragePct, timelineYears, frictionLevel]);

  return (
    <section id="simulator" className="w-full bg-white py-12 border-b border-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{language === "hi" ? "एआई नीति निर्णय समर्थन उपकरण" : "AI Policy Decision-Support Tool"}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#0b2b50] tracking-tight mt-1">
              {language === "hi"
                ? "राष्ट्रीय भूमि नीति अनुकरण एवं परिणाम सैंडबॉक्स"
                : "National Land Policy Simulation & Outcome Sandbox"}
            </h3>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              {language === "hi"
                ? "सुधार लागू करने से पूर्व विभिन्न नीतिगत हस्तक्षेपों के सामाजिक-आर्थिक प्रभावों का आकलन करें। मशीन लर्निंग मॉडल के माध्यम से विवादों में कमी, राजस्व संग्रह एवं समय की बचत का सटीक प्रक्षेपण।"
                : "Evaluate legislative reforms, cadastral modernization policies, and administrative interventions prior to gazette notification. Simulates projected impacts across disputes, turnaround latency, and state revenue."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-300 px-3 py-1.5 rounded flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>Evidence-Based Policy Engine v3.2</span>
            </span>
          </div>
        </div>

        {/* Sandbox Interface Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Parameter Controls (5 cols) */}
          <div className="lg:col-span-5 bg-slate-50 p-5 rounded-lg border border-slate-200 shadow-2xs space-y-5">
            <div>
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                <FileCheck className="w-4 h-4 text-[#0b2b50]" />
                <span>{language === "hi" ? "1. नीतिगत हस्तक्षेप चुनें:" : "1. Select Policy Intervention:"}</span>
              </label>
              <div className="space-y-2">
                {scenarios.map((sc) => {
                  const isSelected = selectedScenarioId === sc.id;
                  return (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => setSelectedScenarioId(sc.id)}
                      className={`w-full text-left p-2.5 rounded text-xs font-semibold transition-all border ${
                        isSelected
                          ? "bg-[#0b2b50] text-white border-[#0b2b50] shadow-xs"
                          : "bg-white text-slate-800 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <div className="font-bold leading-tight">
                        {language === "hi" ? sc.nameHi : sc.nameEn}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Coverage Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                <span>{language === "hi" ? "2. कार्यान्वयन कवरेज (जनपद / भूखंड):" : "2. Implementation Scale / Coverage:"}</span>
                <span className="text-[#0b2b50] font-black bg-white px-2 py-0.5 rounded border border-slate-200">
                  {coveragePct}%
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="5"
                value={coveragePct}
                onChange={(e) => setCoveragePct(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0b2b50]"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-semibold">
                <span>Pilot Phase (20%)</span>
                <span>Sub-National (60%)</span>
                <span>Universal (100%)</span>
              </div>
            </div>

            {/* Implementation Horizon */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1.5">
                {language === "hi" ? "3. कार्यान्वयन समय-सीमा (Time Horizon):" : "3. Implementation Horizon:"}
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { yr: 1, label: "1 Year (Fast Track)" },
                  { yr: 3, label: "3 Years (Phased)" },
                  { yr: 5, label: "5 Years (Comprehensive)" },
                ].map((item) => (
                  <button
                    key={item.yr}
                    type="button"
                    onClick={() => setTimelineYears(item.yr)}
                    className={`py-1.5 px-2 rounded font-semibold text-center border text-[11px] transition-colors ${
                      timelineYears === item.yr
                        ? "bg-[#0b2b50] text-white border-[#0b2b50]"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Inter-Agency Friction */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1.5">
                {language === "hi" ? "4. अंतर-विभागीय समन्वय दक्षता (Inter-Agency Sync):" : "4. Inter-Agency Data Integration Velocity:"}
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: "low", label: "Optimized (API Sync)" },
                  { id: "standard", label: "Standard NIC Gateway" },
                  { id: "high", label: "Siloed / High Friction" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFrictionLevel(item.id as any)}
                    className={`py-1.5 px-2 rounded font-semibold text-center border text-[10px] transition-colors ${
                      frictionLevel === item.id
                        ? "bg-amber-600 text-white border-amber-700"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setCoveragePct(75);
                setTimelineYears(3);
                setFrictionLevel("standard");
              }}
              className="w-full flex items-center justify-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold pt-2 border-t border-slate-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{language === "hi" ? "डिफ़ॉल्ट मान रीसेट करें" : "Reset Parameters to Benchmark"}</span>
            </button>
          </div>

          {/* Right Column: Projected Real-Time Outcomes (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            {/* Scenario Header Card */}
            <div className="bg-white p-4 rounded-lg border-2 border-slate-200 shadow-2xs">
              <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-widest block">
                Active Scenario Evaluation
              </span>
              <h4 className="text-base sm:text-lg font-black text-[#0b2b50] mt-0.5">
                {language === "hi" ? currentScenario.nameHi : currentScenario.nameEn}
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {language === "hi" ? currentScenario.descriptionHi : currentScenario.descriptionEn}
              </p>
            </div>

            {/* 4 Dynamic Impact Cards */}
            <div className="grid grid-cols-2 gap-3">
              {/* Card 1: Dispute Reduction */}
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-900">Dispute Rate Impact</span>
                  <TrendingDown className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-800 mt-1">
                  -{simulationResults.disputeReduction}%
                </div>
                <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
                  Projected decline in fresh title litigation & revenue court appeals
                </div>
              </div>

              {/* Card 2: Mutation Turnaround */}
              <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-blue-900">Mutation Latency</span>
                  <Clock className="w-4 h-4 text-blue-700" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-blue-800 mt-1">
                  {simulationResults.turnaroundDays} Days
                </div>
                <div className="text-[10px] text-blue-700 font-medium mt-0.5">
                  Reduced from baseline of 45-60 working days per transaction
                </div>
              </div>

              {/* Card 3: Revenue Realization */}
              <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-900">Stamp Duty Realization</span>
                  <TrendingUp className="w-4 h-4 text-amber-700" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-800 mt-1">
                  +{simulationResults.revenueGrowthPct}%
                </div>
                <div className="text-[10px] text-amber-700 font-medium mt-0.5">
                  Revenue leakage closure via auto-valuation & spatial verification
                </div>
              </div>

              {/* Card 4: Citizen Savings */}
              <div className="bg-indigo-50 border border-indigo-200 p-3.5 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-indigo-900">Citizen Economic Benefit</span>
                  <IndianRupee className="w-4 h-4 text-indigo-700" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-indigo-800 mt-1">
                  ₹{simulationResults.projectedSavings.toLocaleString()} Cr
                </div>
                <div className="text-[10px] text-indigo-700 font-medium mt-0.5">
                  Direct citizen savings in legal counsel, travel, and delayed credit
                </div>
              </div>
            </div>

            {/* AI Risk & Mitigation Recommendation Box */}
            <div className="bg-slate-900 text-slate-100 p-4 rounded-lg border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[10px]">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>AI Automated Vulnerability & Risk Synthesis:</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                <span className="text-white font-semibold">Identified Risk:</span> {currentScenario.keyRiskEn}
              </p>
              <p className="text-emerald-300 leading-relaxed text-[11px]">
                <span className="text-emerald-200 font-semibold">Recommended Mitigation:</span> {currentScenario.mitigationEn}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                <Info className="w-3.5 h-3.5" />
                Simulated using MoRD/DoLR PME econometric land administration models
              </span>
              <button
                type="button"
                onClick={() => {
                  alert(
                    `Generating Official Policy Simulation Brief for ${currentScenario.nameEn} at ${coveragePct}% coverage over ${timelineYears} year(s). Report sent to registered Jan Parichay identity.`
                  );
                }}
                className="bg-[#0b2b50] hover:bg-[#071e3d] text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <FileCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Export Policy Brief (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
