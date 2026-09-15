"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  ChevronDown,
  ChevronUp,
  Download,
  Info,
  MapPin,
  RotateCcw,
  TrendingDown,
  TrendingUp,
  Minus,
  FileText,
  AlertCircle,
  CheckCircle2,
  Sliders,
  Share2,
  Copy,
  Check,
  X,
} from "lucide-react";
import {
  MODEL_CONFIG,
  INDIA_GEOJSON_URL,
  predictRiskScore,
  scoreToRiskLevel,
  riskLevelColor,
  computeStateRiskMap,
  getStates,
  getDistrictsForState,
  DistrictBaseline,
  RiskLevel,
} from "@/lib/sandbox-model";

// Dynamic import — Leaflet can't run on the server
const SandboxMap = dynamic(() => import("./sandbox-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-xl bg-slate-100 flex items-center justify-center">
      <div className="text-center space-y-2">
        <div className="w-8 h-8 border-2 border-[#0b2b50] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Loading geospatial boundaries…</p>
      </div>
    </div>
  ),
});

type UserRole = "researcher" | "official" | "public" | "admin";

export function SandboxClient() {
  // ─── Default to Pune (Maharashtra) so the page immediately displays a clear baseline snapshot ───
  const defaultDistrict = useMemo(() => {
    return (
      MODEL_CONFIG.districts.find((d) => d.id === "pune") ||
      MODEL_CONFIG.districts[0]
    );
  }, []);

  const [geoJsonData, setGeoJsonData] = useState<GeoJSON.FeatureCollection | null>(null);
  const [geoJsonError, setGeoJsonError] = useState(false);
  const [selectedState, setSelectedState] = useState<string>(defaultDistrict.state);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictBaseline>(defaultDistrict);
  const [showMath, setShowMath] = useState(false);
  const [scenarioModalOpen, setScenarioModalOpen] = useState(false);
  const [copiedBrief, setCopiedBrief] = useState(false);

  // Slider values — keyed by variable id, initialized to selected district's baseline values
  const [sliderValues, setSliderValues] = useState<Record<string, number>>(() => ({
    ...defaultDistrict.values,
  }));

  const userRole: UserRole = "researcher";
  const canSave = userRole === "researcher" || userRole === "official" || userRole === "admin";

  // ─── Derived Scores ───
  const baselineScore = useMemo(
    () => predictRiskScore(MODEL_CONFIG, selectedDistrict.values),
    [selectedDistrict]
  );
  const simulatedScore = useMemo(
    () => predictRiskScore(MODEL_CONFIG, sliderValues),
    [sliderValues]
  );

  const baselineLevel: RiskLevel = selectedDistrict.actualRiskLevel;
  const simulatedLevel: RiskLevel = scoreToRiskLevel(simulatedScore);

  const baselineColors = riskLevelColor(baselineLevel);
  const simulatedColors = riskLevelColor(simulatedLevel);

  const scoreDelta = simulatedScore - baselineScore;

  // Direction determination: UP, DOWN, or FLAT
  const directionInfo = useMemo(() => {
    if (scoreDelta <= -0.2) {
      return {
        type: "DOWN",
        label: "Risk Drops",
        icon: TrendingDown,
        badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
        arrowColor: "text-emerald-600",
        summaryText: "Policy adjustments indicate a downward trend in estimated land dispute risk.",
      };
    }
    if (scoreDelta >= 0.2) {
      return {
        type: "UP",
        label: "Risk Increases",
        icon: TrendingUp,
        badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
        arrowColor: "text-rose-600",
        summaryText: "Adjusted factors correlate with heightened dispute pressure in this district.",
      };
    }
    return {
      type: "FLAT",
      label: "Risk Stays Flat",
      icon: Minus,
      badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
      arrowColor: "text-slate-500",
      summaryText: "Net simulated variance remains within nominal baseline margin (±0.2 pts).",
    };
  }, [scoreDelta]);

  const states = useMemo(() => getStates(MODEL_CONFIG), []);

  const districtsInState = useMemo(
    () => (selectedState ? getDistrictsForState(MODEL_CONFIG, selectedState) : []),
    [selectedState]
  );

  // Map choropleth — updates state risk with current slider adjustments
  const stateRiskMap = useMemo(
    () =>
      computeStateRiskMap(MODEL_CONFIG, {
        districtId: selectedDistrict.id,
        values: sliderValues,
      }),
    [sliderValues, selectedDistrict]
  );

  // Check which sliders have been modified from baseline
  const modifiedSlidersCount = useMemo(() => {
    let count = 0;
    MODEL_CONFIG.variables.forEach((v) => {
      const base = selectedDistrict.values[v.id] ?? v.defaultValue;
      const curr = sliderValues[v.id] ?? v.defaultValue;
      if (Math.abs(curr - base) > 0.01) count++;
    });
    return count;
  }, [selectedDistrict, sliderValues]);

  // ─── Fetch GeoJSON ───
  useEffect(() => {
    fetch(INDIA_GEOJSON_URL)
      .then((res) => {
        if (!res.ok) throw new Error("GeoJSON fetch failed");
        return res.json();
      })
      .then((data) => setGeoJsonData(data as GeoJSON.FeatureCollection))
      .catch(() => setGeoJsonError(true));
  }, []);

  // ─── Selection Handlers ───
  const handleSelectDistrict = useCallback((district: DistrictBaseline) => {
    setSelectedDistrict(district);
    setSelectedState(district.state);
    setSliderValues({ ...district.values });
  }, []);

  const handleStateClick = useCallback((stateName: string) => {
    setSelectedState(stateName);
    const districts = getDistrictsForState(MODEL_CONFIG, stateName);
    if (districts.length > 0) {
      handleSelectDistrict(districts[0]);
    }
  }, [handleSelectDistrict]);

  const handleStateDropdown = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const st = e.target.value;
    if (!st) return;
    handleStateClick(st);
  };

  const handleDistrictDropdown = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dist = districtsInState.find((d) => d.id === e.target.value);
    if (dist) handleSelectDistrict(dist);
  };

  const handleSliderChange = (variableId: string, value: number) => {
    setSliderValues((prev) => ({ ...prev, [variableId]: value }));
  };

  const handleReset = () => {
    setSliderValues({ ...selectedDistrict.values });
  };

  const handleDownloadScenario = () => {
    const payload = {
      title: `Policy Reform Scenario Brief — ${selectedDistrict.name}, ${selectedDistrict.state}`,
      generatedDate: new Date().toISOString(),
      district: selectedDistrict.name,
      state: selectedDistrict.state,
      baselineRecordedRisk: selectedDistrict.actualRiskLevel,
      historicalConflictCount: selectedDistrict.actualConflictCount,
      simulatedEstimatedRisk: simulatedLevel,
      directionalDeltaScore: Number(scoreDelta.toFixed(2)),
      direction: directionInfo.label,
      levers: MODEL_CONFIG.variables.map((v) => ({
        variable: v.friendlyLabel,
        technicalKey: v.id,
        baselineValue: selectedDistrict.values[v.id],
        simulatedValue: sliderValues[v.id],
        unit: v.unit,
      })),
      directionalCaveat:
        "Based on real historical patterns across districts — this shows direction, not a guaranteed outcome.",
      model: {
        name: MODEL_CONFIG.modelName,
        version: MODEL_CONFIG.modelVersion,
        rSquared: MODEL_CONFIG.rSquared,
        sampleDistricts: MODEL_CONFIG.sampleSize,
      },
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `policy-scenario-${selectedDistrict.id}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyBriefText = () => {
    const text = `POLICY REFORM SCENARIO BRIEF: ${selectedDistrict.name.toUpperCase()} (${selectedDistrict.state.toUpperCase()})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Baseline State: ${selectedDistrict.actualRiskLevel} Risk (${selectedDistrict.actualConflictCount} recorded disputes)
Simulated State: ${simulatedLevel} Risk (Directional Delta: ${scoreDelta > 0 ? "+" : ""}${scoreDelta.toFixed(2)} pts)
Estimated Trajectory: ${directionInfo.label}

Adjusted Levers:
${MODEL_CONFIG.variables
  .map(
    (v) =>
      `• ${v.friendlyLabel}: ${selectedDistrict.values[v.id]}${v.unit === "%" ? "%" : ""} (Baseline) → ${sliderValues[v.id]}${v.unit === "%" ? "%" : ""}`
  )
  .join("\n")}

Directional Note: Based on real historical patterns across districts — this shows direction, not a guaranteed outcome.
Model: ${MODEL_CONFIG.modelName} (${MODEL_CONFIG.modelVersion}, R²=${MODEL_CONFIG.rSquared}, n=${MODEL_CONFIG.sampleSize} districts)`;

    navigator.clipboard.writeText(text);
    setCopiedBrief(true);
    setTimeout(() => setCopiedBrief(false), 2500);
  };

  return (
    <div className="space-y-5 max-w-[1560px] mx-auto pb-10">
      {/* ─── Top Header & Controls ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Policy Reform Sandbox
            </h1>
            <span className="text-[10px] font-bold bg-[#0b2b50] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
              {MODEL_CONFIG.modelVersion}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Simulate how policy adjustments (e.g. land record digitization, court clearance rates) directionally influence conflict risk across India&apos;s districts.
          </p>
        </div>

        {/* State / District Quick Selectors */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-slate-400 mb-0.5">State</span>
            <select
              value={selectedState}
              onChange={handleStateDropdown}
              className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#0b2b50]/20 cursor-pointer"
            >
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-slate-400 mb-0.5">District</span>
            <select
              value={selectedDistrict.id}
              onChange={handleDistrictDropdown}
              className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#0b2b50]/20 cursor-pointer"
            >
              {districtsInState.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ─── Step 7: Persistent Directional Notice (Unmissable) ─── */}
      <div className="flex items-center gap-3 bg-amber-50/90 border border-amber-200/80 rounded-xl px-4 py-2.5 text-xs text-amber-900 shadow-xs">
        <Info className="w-4 h-4 text-amber-700 shrink-0" />
        <span className="font-medium leading-relaxed">
          <strong>Directional Principle:</strong> Based on real historical patterns across districts — this tool shows <u>direction</u>, not a guaranteed outcome.
        </span>
      </div>

      {/* ─── Main Grid: Map + Policy Simulation Engine ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* ─── Left Column: Interactive Choropleth Map (5 cols on large screens) ─── */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="h-[480px] lg:h-[580px] relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
            {geoJsonError ? (
              <div className="w-full h-full bg-slate-50 flex items-center justify-center p-8">
                <div className="text-center space-y-2">
                  <MapPin className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500">
                    Map boundaries couldn&apos;t be loaded. Use the dropdowns above to select a district.
                  </p>
                </div>
              </div>
            ) : (
              <SandboxMap
                geoJsonData={geoJsonData}
                stateRiskMap={stateRiskMap}
                selectedState={selectedState}
                onStateClick={handleStateClick}
              />
            )}

            {/* Map Legend Overlay */}
            <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-xs border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600 space-y-1.5 shadow-md">
              <div className="flex items-center justify-between gap-4">
                <span className="font-bold text-slate-800">Predicted Risk</span>
                <span className="text-[10px] text-slate-400 font-mono">CARTO Basemap</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex rounded overflow-hidden border border-slate-300">
                  {["#bbf7d0", "#86efac", "#fde68a", "#fdba74", "#fca5a5", "#f87171"].map((c) => (
                    <div key={c} className="w-4 h-3" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <span className="text-[10px] text-slate-500 font-semibold">Low → High</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center justify-between text-xs text-slate-500 shadow-xs">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#0b2b50]" />
              Click any state boundary to view its districts
            </span>
            <span className="font-semibold text-slate-700">{selectedState} selected</span>
          </div>
        </div>

        {/* ─── Right Column: Simulation Cards & Levers (7 cols on large screens) ─── */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* ─── Card 1: Plain State & Side-by-Side Comparison (Steps 2, 4, 5) ─── */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            {/* Plain description snapshot */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-slate-900">
                    {selectedDistrict.name}, {selectedDistrict.state}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                    District Baseline
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {modifiedSlidersCount === 0 ? (
                    <>
                      Currently <strong>{baselineLevel}</strong> conflict risk — {selectedDistrict.actualConflictCount} documented disputes on record.
                    </>
                  ) : (
                    <>
                      Simulating {modifiedSlidersCount} policy lever adjustment{modifiedSlidersCount > 1 ? "s" : ""}. Baseline: {selectedDistrict.actualConflictCount} recorded disputes.
                    </>
                  )}
                </p>
              </div>

              {/* Action Buttons: Reset & Scenario Export (Step 8) */}
              <div className="flex items-center gap-2 shrink-0">
                {modifiedSlidersCount > 0 && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                )}

                {canSave && (
                  <button
                    type="button"
                    onClick={() => setScenarioModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#0b2b50] hover:bg-[#164275] rounded-lg cursor-pointer transition-colors shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Save Scenario
                  </button>
                )}
              </div>
            </div>

            {/* Side-by-Side Comparison Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              {/* Actual Baseline */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  1. Recorded Baseline
                </span>
                <span className={`inline-block px-3 py-1 rounded-lg text-sm font-black border ${baselineColors.bg} ${baselineColors.text} ${baselineColors.border}`}>
                  {baselineLevel} Risk
                </span>
                <span className="text-[11px] text-slate-500 block mt-1.5">
                  {selectedDistrict.actualConflictCount} disputes on record
                </span>
              </div>

              {/* Direction Indicator (Step 5) */}
              <div className="p-3.5 rounded-xl border flex flex-col items-center justify-center text-center gap-1 bg-white border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  2. Directional Shift
                </span>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${directionInfo.badgeClass}`}>
                  <directionInfo.icon className="w-3.5 h-3.5" />
                  <span>{directionInfo.label}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  Δ {scoreDelta >= 0 ? "+" : ""}{scoreDelta.toFixed(2)} pts
                </span>
              </div>

              {/* Simulated Output (Step 4) */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  3. Simulated Estimate
                </span>
                <span className={`inline-block px-3 py-1 rounded-lg text-sm font-black border ${simulatedColors.bg} ${simulatedColors.text} ${simulatedColors.border}`}>
                  {simulatedLevel} Risk
                </span>
                <span className="text-[11px] text-slate-500 block mt-1.5">
                  Est. index: {simulatedScore.toFixed(2)} / 10
                </span>
              </div>
            </div>
          </div>

          {/* ─── Card 2: Adjustable Policy Levers (Step 3) ─── */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#0b2b50]" />
                <h3 className="text-sm font-extrabold text-slate-900">
                  Adjust Policy Levers
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">
                Move sliders to test policy reform scenarios
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MODEL_CONFIG.variables.map((v) => {
                const baselineVal = selectedDistrict.values[v.id] ?? v.defaultValue;
                const currentVal = sliderValues[v.id] ?? v.defaultValue;
                const isModified = Math.abs(currentVal - baselineVal) > 0.01;
                const diff = currentVal - baselineVal;

                return (
                  <div
                    key={v.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isModified
                        ? "border-[#0b2b50]/30 bg-[#0b2b50]/[0.02]"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <label className="text-xs font-bold text-slate-800 block">
                          {v.friendlyLabel}
                        </label>
                        <span className="text-[10px] text-slate-400 block">
                          {v.technicalLabel}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-[#0b2b50]">
                          {currentVal}{v.unit === "%" ? "%" : ""}
                        </span>
                        {isModified && (
                          <span
                            className={`block text-[10px] font-bold ${
                              diff > 0 ? "text-sky-700" : "text-amber-700"
                            }`}
                          >
                            {diff > 0 ? `+${diff}` : diff} from baseline
                          </span>
                        )}
                      </div>
                    </div>

                    <input
                      type="range"
                      min={v.min}
                      max={v.max}
                      value={currentVal}
                      onChange={(e) => handleSliderChange(v.id, Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0b2b50]"
                    />

                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                      <span>{v.friendlyMin}</span>
                      <span className="font-semibold text-slate-500">
                        Baseline: {baselineVal}{v.unit === "%" ? "%" : ""}
                      </span>
                      <span>{v.friendlyMax}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── Card 3: "Show the Math" Accordion (Step 6) ─── */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <button
              type="button"
              onClick={() => setShowMath(!showMath)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-800">
                  {showMath ? "Hide Model Formulation & Regression Math" : "Show How This Is Calculated (Model Details & Coefficients)"}
                </span>
              </div>
              {showMath ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {showMath && (
              <div className="p-5 border-t border-slate-100 bg-slate-50/70 space-y-4 text-xs">
                {/* Mathematical Equation */}
                <div>
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Pre-Fitted Linear Regression Equation
                  </span>
                  <div className="bg-white rounded-xl border border-slate-200 p-3 font-mono text-xs text-slate-800 overflow-x-auto shadow-xs">
                    <span className="text-slate-500">estimated_risk_score</span> ={" "}
                    <strong>{MODEL_CONFIG.intercept}</strong>
                    {MODEL_CONFIG.variables.map((v) => (
                      <span key={v.id}>
                        {" "}
                        {v.coefficient >= 0 ? "+" : "−"}{" "}
                        <span className="text-amber-700 font-bold">
                          {Math.abs(v.coefficient)}
                        </span>
                        ·<span className="text-[#0b2b50] font-semibold">{v.id}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Model Fit Diagnostics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Goodness of Fit (R²)
                    </span>
                    <span className="text-base font-black text-slate-900 mt-0.5 block">
                      {MODEL_CONFIG.rSquared}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Explains 67% of observed inter-district variance
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Calibration Sample Size
                    </span>
                    <span className="text-base font-black text-slate-900 mt-0.5 block">
                      n = {MODEL_CONFIG.sampleSize} districts
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Nationwide district benchmark cohort
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Algorithm Architecture
                    </span>
                    <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                      {MODEL_CONFIG.type}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Standardized multivariate OLS
                    </span>
                  </div>
                </div>

                {/* Data Source Grounding */}
                <div className="text-[11px] text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
                  <strong className="text-slate-800">Benchmark Data Grounding:</strong> {MODEL_CONFIG.dataSource}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Explicit Specification Box: "What This Tool Does NOT Do" ─── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-slate-700" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Scope &amp; Operating Boundaries (What this tool does NOT do)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-800 block mb-1">
              ❌ No Calendar Forecasting
            </span>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Does not forecast dates or timelines (e.g., &quot;disputes drop by March 2027&quot;). It models directional propensity, not chronological scheduling.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-800 block mb-1">
              ❌ Correlation, Not Causation
            </span>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Does not claim digitization alone causes conflict reduction. Institutional enforcement and revenue court execution remain decisive variables.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-800 block mb-1">
              ❌ District-Level Scope Only
            </span>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Does not simulate multi-district spillovers, interstate river basins, or national macro reforms. Focused strictly within district administrative boundaries.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-800 block mb-1">
              ❌ Historical Calibration
            </span>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Fitted on verified public benchmark datasets (LCW + DILRMP + Census), not live streaming unverified court telemetry.
            </p>
          </div>
        </div>
      </div>

      {/* ─── Step 8: Save Scenario Modal / Brief Preview ─── */}
      {scenarioModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Scenario Brief for Policy Report
                </h3>
                <p className="text-xs text-slate-500">
                  Ready to attach to administrative dossiers or committee briefs
                </p>
              </div>
              <button
                type="button"
                onClick={() => setScenarioModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2.5 font-mono text-slate-700">
              <div className="font-bold text-slate-900">
                DISTRICT: {selectedDistrict.name.toUpperCase()}, {selectedDistrict.state.toUpperCase()}
              </div>
              <div>
                • Baseline State: {selectedDistrict.actualRiskLevel} Risk ({selectedDistrict.actualConflictCount} historical disputes)
              </div>
              <div>
                • Simulated State: <strong>{simulatedLevel} Risk</strong> (Δ {scoreDelta > 0 ? "+" : ""}{scoreDelta.toFixed(2)} pts)
              </div>
              <div className="text-emerald-700 font-bold">
                • Directional Recommendation: {directionInfo.label}
              </div>
              <div className="border-t border-slate-200 pt-2 text-[11px] text-slate-500 font-sans">
                {MODEL_CONFIG.variables.map((v) => (
                  <div key={v.id} className="flex justify-between py-0.5">
                    <span>{v.friendlyLabel}:</span>
                    <span className="font-mono font-semibold text-slate-700">
                      {selectedDistrict.values[v.id]}{v.unit === "%" ? "%" : ""} → {sliderValues[v.id]}{v.unit === "%" ? "%" : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-slate-500 leading-relaxed bg-amber-50/70 border border-amber-200/80 rounded-xl p-3">
              <strong>Official Note:</strong> This scenario summary models empirical directional correlation based on Land Conflict Watch &amp; DILRMP data. For formal submission, integrate with ground survey findings.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCopyBriefText}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors flex items-center gap-1.5"
              >
                {copiedBrief ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedBrief ? "Copied to Clipboard!" : "Copy Summary"}
              </button>

              <button
                type="button"
                onClick={() => {
                  handleDownloadScenario();
                  setScenarioModalOpen(false);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-[#0b2b50] hover:bg-[#164275] rounded-lg cursor-pointer transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download JSON Scenario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
