"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Sparkles,
  Sliders,
  Compass,
  MapPin,
  X,
  ChevronDown,
  ChevronUp,
  Info,
  RotateCcw,
  ChevronRight,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { useTerritory } from "@/context/territory-context";
import {
  SitePlanningCriteria,
  PlanningPriorities,
  parseNaturalLanguagePrompt,
  normalizePriorities,
  generateCandidateLocations,
  CandidateLocation,
} from "./ai-site-types";
import { ZoneType } from "./policy-planning-types";
import { INDIAN_STATES_CATALOG } from "./india-districts-catalog";

interface AiSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCandidatesGenerated: (
    candidates: CandidateLocation[],
    criteria: SitePlanningCriteria
  ) => void;
  initialCriteria?: SitePlanningCriteria;
}

const ZONE_OPTIONS: ZoneType[] = [
  "Logistics Park",
  "Industrial Zone",
  "Special Economic Zone",
  "Commercial Zone",
  "Infrastructure Corridor",
  "Residential Zone",
  "Custom",
];

export const STATE_OPTIONS: { state: string; districts: string[] }[] =
  INDIAN_STATES_CATALOG && INDIAN_STATES_CATALOG.length > 0
    ? INDIAN_STATES_CATALOG.map((s) => ({
        state: s.name,
        districts: s.districts.map((d) => d.name),
      }))
    : [
        { state: "Maharashtra", districts: ["Pune", "Nagpur", "Thane", "Solapur"] },
        { state: "Uttar Pradesh", districts: ["Gautam Buddha Nagar", "Lucknow", "Agra", "Varanasi"] },
        { state: "Karnataka", districts: ["Bengaluru Rural", "Dharwad", "Mysuru"] },
      ];

const PRESET_PROMPTS = [
  "Find a suitable location in Maharashtra for a 500-acre logistics park, close to highways and railways, with low flood risk, minimal agricultural displacement and low land-dispute exposure.",
  "Identify a 250-acre Electronics Manufacturing SEZ in Uttar Pradesh along an expressway corridor with low dispute density and rapid acquisition feasibility.",
  "Locate candidate areas in Karnataka for a 400-acre Aerospace & Defense hardware hub near international cargo access with minimal forest buffer encroachment.",
];

export function AiSiteModal({
  isOpen,
  onClose,
  onCandidatesGenerated,
  initialCriteria,
}: AiSiteModalProps) {
  const {
    selectedDistrictMetadata,
    districtBoundary,
    selectedStateId,
    statesCatalog,
  } = useTerritory();

  const defaultPrompt = useMemo(() => {
    if (selectedDistrictMetadata) {
      return `Find a suitable location in ${selectedDistrictMetadata.name} (${selectedDistrictMetadata.state_name}) for a 500-acre logistics park, close to highways and railways, with low flood risk, minimal agricultural displacement and low land-dispute exposure.`;
    }
    return "Find a suitable location in Maharashtra for a 500-acre logistics park, close to highways and railways, with low flood risk, minimal agricultural displacement and low land-dispute exposure.";
  }, [selectedDistrictMetadata]);

  const [promptText, setPromptText] = useState(
    initialCriteria?.rawPrompt || defaultPrompt
  );

  const [criteria, setCriteria] = useState<SitePlanningCriteria>(() => {
    if (initialCriteria) return initialCriteria;
    const parsed = parseNaturalLanguagePrompt(promptText);
    if (selectedDistrictMetadata) {
      parsed.preferredState = selectedDistrictMetadata.state_name;
      parsed.preferredDistrict = selectedDistrictMetadata.name;
      parsed.centerCoordinates = districtBoundary?.center;
    }
    return parsed;
  });

  // When selected district changes, update criteria
  useEffect(() => {
    if (selectedDistrictMetadata && !initialCriteria) {
      setCriteria((prev) => ({
        ...prev,
        preferredState: selectedDistrictMetadata.state_name,
        preferredDistrict: selectedDistrictMetadata.name,
        centerCoordinates: districtBoundary?.center,
      }));
      setPromptText(
        `Find a suitable location in ${selectedDistrictMetadata.name} (${selectedDistrictMetadata.state_name}) for a 500-acre logistics park, close to highways and railways, with low flood risk, minimal agricultural displacement and low land-dispute exposure.`
      );
    }
  }, [selectedDistrictMetadata, districtBoundary, initialCriteria]);

  const [hasGeneratedCriteria, setHasGeneratedCriteria] = useState(true);
  const [advancedExpanded, setAdvancedExpanded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedStateDistricts = useMemo(() => {
    const foundState = statesCatalog?.find(
      (s) => s.name.toLowerCase() === (criteria.preferredState || "").toLowerCase()
    );
    if (foundState && foundState.districts.length > 0) {
      return foundState.districts.map((d) => d.name);
    }
    return (
      STATE_OPTIONS.find(
        (s) => s.state.toLowerCase() === (criteria.preferredState || "").toLowerCase()
      )?.districts || STATE_OPTIONS[0]?.districts || ["Pune"]
    );
  }, [criteria.preferredState, statesCatalog]);

  // Early return AFTER all hooks to comply with Rules of Hooks
  if (!isOpen) return null;

  // NLP Heuristic Extraction Trigger
  const handleGenerateCriteria = () => {
    const parsed = parseNaturalLanguagePrompt(promptText);
    if (selectedDistrictMetadata) {
      parsed.preferredState = selectedDistrictMetadata.state_name;
      parsed.preferredDistrict = selectedDistrictMetadata.name;
    }
    parsed.centerCoordinates = districtBoundary?.center;
    setCriteria(parsed);
    setHasGeneratedCriteria(true);
  };

  // Priority Slider Update with Auto-Normalization
  const handlePriorityChange = (key: keyof PlanningPriorities, val: number) => {
    const updated = { ...criteria.priorities, [key]: val };
    const normalized = normalizePriorities(updated);
    setCriteria((prev) => ({ ...prev, priorities: normalized }));
  };

  // Equalize all weights evenly
  const handleEqualizeWeights = () => {
    const equalized: PlanningPriorities = {
      infrastructure: 17,
      acquisition: 17,
      environment: 17,
      agriculture: 17,
      disputes: 16,
      economic: 16,
    };
    setCriteria((prev) => ({ ...prev, priorities: equalized }));
  };

  // Run Deterministic Spatial Query
  const handleFindLocations = () => {
    setIsProcessing(true);

    const enrichedCriteria: SitePlanningCriteria = {
      ...criteria,
      centerCoordinates: criteria.centerCoordinates || districtBoundary?.center,
    };

    setTimeout(() => {
      const { candidates } = generateCandidateLocations(enrichedCriteria);
      setIsProcessing(false);
      onCandidatesGenerated(candidates, enrichedCriteria);
      onClose();
    }, 400);
  };

  return (
    <div className="ux4g-modal-backdrop ux4g-modal-backdrop-50">
      <div className="ux4g-modal-box ux4g-modal-l max-w-2xl max-h-[92vh]">
        {/* ─── Modal Header ─── */}
        <div className="ux4g-modal-header">
          <div>
            <div className="flex items-center gap-2">
              <span className="ux4g-tag ux4g-tag-filled-brand ux4g-tag-xs">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>AI Decision Support</span>
              </span>
              <span className="ux4g-tag ux4g-tag-tonal-neutral ux4g-tag-xs">
                Non-Autonomous
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#0b2b50] tracking-tight mt-1">
              AI Site Selection
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Describe your proposed project and the constraints that matter.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ─── Modal Content (Scrollable) ─── */}
        <div className="ux4g-modal-body space-y-5 text-xs text-slate-700">
          {/* ─── Section 2: Natural Language Input ─── */}
          <div className="ux4g-input-container">
            <label className="ux4g-form-label flex items-center justify-between">
              <span>What are you planning?</span>
              <span className="text-[11px] font-normal text-slate-400 normal-case">
                Natural Language Query
              </span>
            </label>

            <div>
              <textarea
                rows={3}
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="e.g. Find a suitable location for a 500-acre logistics park in Maharashtra near major highways and railways, while minimizing agricultural displacement, flood exposure and land-dispute risk."
                className="ux4g-input !h-auto leading-relaxed"
              />
            </div>

            {/* Quick Prompt Chips */}
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-slate-400">Sample planning briefs:</span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_PROMPTS.map((sample, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setPromptText(sample);
                      setCriteria(parseNaturalLanguagePrompt(sample));
                      setHasGeneratedCriteria(true);
                    }}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                  >
                    {sample.slice(0, 52)}…
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-1 flex justify-end">
              <button
                type="button"
                onClick={handleGenerateCriteria}
                className="px-3 py-1.5 bg-[#0b2b50] hover:bg-[#071e3d] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Generate Criteria</span>
              </button>
            </div>
          </div>

          {/* ─── Section 3: Structured Requirements (Reviewable & Editable) ─── */}
          {hasGeneratedCriteria && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#0b2b50]" />
                  <span className="font-bold text-slate-900 uppercase tracking-wide text-[11px]">
                    Planning Requirements
                  </span>
                </div>
                <span className="bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                  Review & edit inferred criteria
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Project Type */}
                <div>
                  <label className="text-[10px] font-medium text-slate-600 block mb-1">
                    Project Type:
                  </label>
                  <select
                    value={criteria.projectType}
                    onChange={(e) =>
                      setCriteria((prev) => ({
                        ...prev,
                        projectType: e.target.value as ZoneType,
                      }))
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0b2b50]/20 focus:border-[#0b2b50] cursor-pointer"
                  >
                    {ZONE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Required Area */}
                <div>
                  <label className="text-[10px] font-medium text-slate-600 block mb-1">
                    Required Area:
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={criteria.requiredAreaAcres}
                      onChange={(e) => {
                        const val = Math.max(10, parseFloat(e.target.value) || 10);
                        setCriteria((prev) => ({
                          ...prev,
                          requiredAreaAcres: val,
                          requiredAreaHa: Number((val * 0.404686).toFixed(1)),
                        }));
                      }}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0b2b50]/20 focus:border-[#0b2b50]"
                    />
                    <span className="text-[11px] font-medium text-slate-500 shrink-0">acres</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    ≈ {criteria.requiredAreaHa} Hectares
                  </div>
                </div>

                {/* Preferred Geography */}
                <div>
                  <label className="text-[10px] font-medium text-slate-600 block mb-1">
                    Preferred State:
                  </label>
                  <select
                    value={criteria.preferredState}
                    onChange={(e) => {
                      const newState = e.target.value;
                      const foundState = statesCatalog?.find((s) => s.name === newState);
                      const newDistricts =
                        foundState && foundState.districts.length > 0
                          ? foundState.districts.map((d) => d.name)
                          : STATE_OPTIONS.find((s) => s.state === newState)?.districts || [];
                      setCriteria((prev) => ({
                        ...prev,
                        preferredState: newState,
                        preferredDistrict: newDistricts[0] || "",
                      }));
                    }}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0b2b50]/20 focus:border-[#0b2b50] cursor-pointer"
                  >
                    {(statesCatalog && statesCatalog.length > 0 ? statesCatalog : STATE_OPTIONS).map((s) => {
                      const stateName = "name" in s ? s.name : s.state;
                      return (
                        <option key={stateName} value={stateName}>
                          {stateName}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Inferred Priorities Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-[10px] font-medium text-slate-500 block mb-1">
                    Infrastructure Access Priorities:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {criteria.infrastructureNeeds.map((item, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-medium px-2 py-0.5 rounded-md"
                      >
                        ✓ {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-medium text-slate-500 block mb-1">
                    Minimization Targets:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {criteria.minimizePriorities.map((item, idx) => (
                      <span
                        key={idx}
                        className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-medium px-2 py-0.5 rounded-md"
                      >
                        ↓ {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── Section 4: Objective Weights (Planning Priorities) ─── */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-[#0b2b50]" />
                <span className="font-bold text-slate-900 uppercase tracking-wide text-xs">
                  Planning Priorities (Objective Weights)
                </span>
              </div>
              <button
                type="button"
                onClick={handleEqualizeWeights}
                className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-[11px] font-semibold cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Equalize Weights
              </button>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Higher weight means the factor has greater influence on candidate ranking. Weights
              are automatically normalized to sum to 100%.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              {/* Infrastructure */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Infrastructure Access</span>
                  <span className="font-mono text-[#0b2b50] font-bold">
                    {criteria.priorities.infrastructure}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={criteria.priorities.infrastructure}
                  onChange={(e) =>
                    handlePriorityChange("infrastructure", Number(e.target.value))
                  }
                  className="w-full accent-[#0b2b50] cursor-pointer"
                />
              </div>

              {/* Land Acquisition Complexity */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Acquisition Feasibility</span>
                  <span className="font-mono text-[#0b2b50] font-bold">
                    {criteria.priorities.acquisition}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={criteria.priorities.acquisition}
                  onChange={(e) =>
                    handlePriorityChange("acquisition", Number(e.target.value))
                  }
                  className="w-full accent-[#0b2b50] cursor-pointer"
                />
              </div>

              {/* Environmental Impact */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Environmental Sensitivity</span>
                  <span className="font-mono text-[#0b2b50] font-bold">
                    {criteria.priorities.environment}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={criteria.priorities.environment}
                  onChange={(e) =>
                    handlePriorityChange("environment", Number(e.target.value))
                  }
                  className="w-full accent-[#0b2b50] cursor-pointer"
                />
              </div>

              {/* Agricultural Impact */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Agricultural Protection</span>
                  <span className="font-mono text-[#0b2b50] font-bold">
                    {criteria.priorities.agriculture}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={criteria.priorities.agriculture}
                  onChange={(e) =>
                    handlePriorityChange("agriculture", Number(e.target.value))
                  }
                  className="w-full accent-[#0b2b50] cursor-pointer"
                />
              </div>

              {/* Dispute Exposure */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Dispute & Conflict Avoidance</span>
                  <span className="font-mono text-[#0b2b50] font-bold">
                    {criteria.priorities.disputes}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={criteria.priorities.disputes}
                  onChange={(e) =>
                    handlePriorityChange("disputes", Number(e.target.value))
                  }
                  className="w-full accent-[#0b2b50] cursor-pointer"
                />
              </div>

              {/* Economic Potential */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Economic Potential & Clustering</span>
                  <span className="font-mono text-[#0b2b50] font-bold">
                    {criteria.priorities.economic}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={criteria.priorities.economic}
                  onChange={(e) =>
                    handlePriorityChange("economic", Number(e.target.value))
                  }
                  className="w-full accent-[#0b2b50] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* ─── Section 5: Advanced Constraints (Expandable) ─── */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setAdvancedExpanded(!advancedExpanded)}
              className="w-full p-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0b2b50]" />
                <span className="font-bold text-xs text-slate-800">
                  Advanced Constraints & Hard Filter Thresholds
                </span>
              </div>
              {advancedExpanded ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {advancedExpanded && (
              <div className="p-3.5 space-y-3 bg-white text-xs border-t border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-medium text-slate-600 block mb-1">
                      Max Distance from Highway:
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="5"
                        max="50"
                        value={criteria.constraints.maxHighwayDistKm}
                        onChange={(e) =>
                          setCriteria((prev) => ({
                            ...prev,
                            constraints: {
                              ...prev.constraints,
                              maxHighwayDistKm: Number(e.target.value),
                            },
                          }))
                        }
                        className="w-24 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                      />
                      <span className="text-[11px] text-slate-500">km</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-medium text-slate-600 block mb-1">
                      Max Flood Exposure Tolerance:
                    </label>
                    <select
                      value={criteria.constraints.maxFloodRisk}
                      onChange={(e) =>
                        setCriteria((prev) => ({
                          ...prev,
                          constraints: {
                            ...prev.constraints,
                            maxFloodRisk: e.target.value as any,
                          },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 cursor-pointer"
                    >
                      <option value="Low">Low only (1-in-100 yr plain)</option>
                      <option value="Medium">Medium & Low permitted</option>
                      <option value="High">Any flood zone allowed</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-medium text-slate-600 block mb-1">
                      Max Agricultural Land Conversion:
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="10"
                        max="80"
                        value={criteria.constraints.maxAgriConversionPct}
                        onChange={(e) =>
                          setCriteria((prev) => ({
                            ...prev,
                            constraints: {
                              ...prev.constraints,
                              maxAgriConversionPct: Number(e.target.value),
                            },
                          }))
                        }
                        className="w-24 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                      />
                      <span className="text-[11px] text-slate-500">% of zone</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-medium text-slate-600 block mb-1">
                      Protected Buffer Zone (Forest/Wetland):
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={criteria.constraints.minProtectedBufferKm}
                        onChange={(e) =>
                          setCriteria((prev) => ({
                            ...prev,
                            constraints: {
                              ...prev.constraints,
                              minProtectedBufferKm: Number(e.target.value),
                            },
                          }))
                        }
                        className="w-24 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                      />
                      <span className="text-[11px] text-slate-500">km buffer</span>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 flex items-center gap-1.5 pt-1">
                  <Info className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>
                    Hard constraints eliminate non-compliant parcels before multi-criteria ranking.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ─── Section 6: Search Area Definition ─── */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#0b2b50]" />
              <span>Geographic Search Boundary</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <span className="text-[10px] font-medium text-slate-500 block mb-1">
                  Target State:
                </span>
                <select
                  value={criteria.preferredState}
                  onChange={(e) => {
                    const stName = e.target.value;
                    const stObj = statesCatalog.find((s) => s.name === stName);
                    const firstDist =
                      stObj && stObj.districts.length > 0
                        ? stObj.districts[0].name
                        : "District";
                    setCriteria((prev) => ({
                      ...prev,
                      preferredState: stName,
                      preferredDistrict: firstDist,
                    }));
                  }}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 cursor-pointer"
                >
                  {statesCatalog.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="text-[10px] font-medium text-slate-500 block mb-1">
                  Target District:
                </span>
                <select
                  value={criteria.preferredDistrict}
                  onChange={(e) =>
                    setCriteria((prev) => ({
                      ...prev,
                      preferredDistrict: e.target.value,
                    }))
                  }
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 cursor-pointer"
                >
                  {(
                    statesCatalog.find((s) => s.name === criteria.preferredState)
                      ?.districts || []
                  ).map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} {d.censusCode ? `(#${d.censusCode})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Modal Footer Actions ─── */}
        <div className="ux4g-modal-footer flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-500">
            Generates 3 to 5 candidate areas scored against configured weights.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="ux4g-btn ux4g-btn-outline-neutral ux4g-btn-md cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isProcessing}
              onClick={handleFindLocations}
              className="ux4g-btn ux4g-btn-primary ux4g-btn-md cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Querying Spatial Datasets…</span>
                </>
              ) : (
                <>
                  <Compass className="w-4 h-4 text-amber-300" />
                  <span>Find Suitable Locations</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
