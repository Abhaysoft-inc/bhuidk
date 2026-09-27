"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileCode,
  AlertCircle,
  CheckCircle2,
  X,
  Layers,
  Sparkles,
  Info,
  Check,
  ChevronRight,
  LandPlot,
} from "lucide-react";
import {
  parseAndValidateGeoJSON,
  ParsedZoneFeature,
  GeoJSONParseResult,
} from "./geojson-parser";
import {
  ProposedZoneData,
  computeZoneAnalysis,
  ZoneType,
} from "./policy-planning-types";

interface UploadZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportZones: (zones: ProposedZoneData[]) => void;
  hasExistingZone: boolean;
}

// Built-in sample GeoJSON payloads for 1-click test evaluation
const SAMPLE_FILES: Record<string, { fileName: string; content: string }> = {
  pune_corridor: {
    fileName: "Industrial_Corridor_Pune.geojson",
    content: JSON.stringify({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            zone_name: "Chakan Auto Cluster Phase-V",
            zone_type: "Industrial Zone",
            project_id: "MH-MIDC-2026-08",
            planning_year: 2026,
            authority: "MIDC Maharashtra",
          },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [73.8425, 18.7612],
                [73.8682, 18.7695],
                [73.8745, 18.751],
                [73.851, 18.7425],
                [73.8425, 18.7612],
              ],
            ],
          },
        },
        {
          type: "Feature",
          properties: {
            zone_name: "Talegaon Logistics & Warehousing Hub",
            zone_type: "Logistics Park",
            project_id: "MH-MIDC-2026-09",
            planning_year: 2027,
            authority: "MIDC Maharashtra",
          },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [73.712, 18.721],
                [73.731, 18.729],
                [73.738, 18.711],
                [73.719, 18.705],
                [73.712, 18.721],
              ],
            ],
          },
        },
      ],
    }),
  },
  noida_tech: {
    fileName: "Greater_Noida_Ecotech_Zone.geojson",
    content: JSON.stringify({
      type: "Feature",
      properties: {
        zone_name: "Ecotech VII Electronics Cluster",
        zone_type: "Special Economic Zone",
        project_id: "UP-GNIDA-SEZ-42",
        planning_year: 2025,
        nodal_agency: "GNIDA & Invest UP",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [77.5312, 28.3245],
            [77.5548, 28.3262],
            [77.5615, 28.311],
            [77.5482, 28.3045],
            [77.5285, 28.3075],
            [77.5312, 28.3245],
          ],
        ],
      },
    }),
  },
  bullet_corridor: {
    fileName: "High_Speed_Rail_Corridor.geojson",
    content: JSON.stringify({
      type: "Feature",
      properties: {
        name: "Mumbai-Ahmedabad Bullet Train Alignment",
        zone_type: "Infrastructure Corridor",
        buffer_m: 500,
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [72.8777, 19.0760],
          [72.9500, 19.3000],
          [72.9800, 19.8000],
          [72.9000, 20.5000],
          [72.8000, 21.2000],
          [72.6000, 22.3000],
          [72.5714, 23.0225],
        ],
      },
    }),
  },
};

export function UploadZoneModal({
  isOpen,
  onClose,
  onImportZones,
  hasExistingZone,
}: UploadZoneModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [parseResult, setParseResult] = useState<GeoJSONParseResult | null>(null);
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<string[]>([]);
  const [replaceConfirmOpen, setReplaceConfirmOpen] = useState(false);
  const [pendingImportZones, setPendingImportZones] = useState<ProposedZoneData[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleProcessFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const result = parseAndValidateGeoJSON(content, file.name, file.size);
      setParseResult(result);
      if (result.success && result.features.length > 0) {
        setSelectedFeatureIds(result.features.map((f) => f.id));
      }
    };
    reader.onerror = () => {
      setParseResult({
        success: false,
        error: "The uploaded file could not be read. Please upload a valid GeoJSON file.",
        fileName: file.name,
        fileSizeBytes: file.size,
        features: [],
      });
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleBrowseFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProcessFile(e.target.files[0]);
    }
  };

  const handleLoadSample = (sampleKey: string) => {
    const sample = SAMPLE_FILES[sampleKey];
    if (!sample) return;
    const result = parseAndValidateGeoJSON(sample.content, sample.fileName, sample.content.length);
    setParseResult(result);
    if (result.success && result.features.length > 0) {
      setSelectedFeatureIds(result.features.map((f) => f.id));
    }
  };

  const handleToggleSelectFeature = (id: string) => {
    setSelectedFeatureIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleExecuteImport = (featuresToImport: ParsedZoneFeature[]) => {
    const convertedZones: ProposedZoneData[] = featuresToImport.map((feat) => {
      const analysis = computeZoneAnalysis(feat.areaHa, feat.suggestedZoneType);

      return {
        zone_id: feat.id,
        source: "upload",
        source_file: parseResult?.fileName || "uploaded_zone.geojson",
        zone_type: feat.suggestedZoneType,
        name: feat.name,
        geometry: feat.geoJsonGeometry,
        properties: feat.properties,
        area: feat.areaHa,
        perimeter: feat.perimeterKm,
        state: feat.state,
        district: feat.district,
        analysis,
        rawCoordinates: feat.rawCoordinates,
        createdAt: new Date().toISOString(),
        isBackendConnected: false, // Phase 1 flagged
      };
    });

    if (hasExistingZone) {
      setPendingImportZones(convertedZones);
      setReplaceConfirmOpen(true);
    } else {
      onImportZones(convertedZones);
      handleResetAndClose();
    }
  };

  const handleConfirmReplace = () => {
    if (pendingImportZones) {
      onImportZones(pendingImportZones);
    }
    setReplaceConfirmOpen(false);
    handleResetAndClose();
  };

  const handleResetAndClose = () => {
    setParseResult(null);
    setSelectedFeatureIds([]);
    setPendingImportZones(null);
    setReplaceConfirmOpen(false);
    onClose();
  };

  return (
    <div className="ux4g-modal-backdrop ux4g-modal-backdrop-50">
      <div className="ux4g-modal-box ux4g-modal-l max-w-xl max-h-[90vh]">
        {/* Header */}
        <div className="ux4g-modal-header">
          <div>
            <div className="flex items-center gap-2">
              <span className="ux4g-tag ux4g-tag-filled-brand ux4g-tag-xs">
                GIS Import
              </span>
              <span className="ux4g-tag ux4g-tag-tonal-neutral ux4g-tag-xs">
                Max 20 MB
              </span>
            </div>
            <h3 className="text-xl font-black text-[#0b2b50] tracking-tight mt-1">
              Upload Proposed Zone
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Import an existing GIS boundary for analysis.
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="ux4g-modal-body space-y-4">
          {/* 1. Drag & Drop Zone (when no successful parse yet) */}
          {!parseResult?.success && (
            <>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
                  dragActive
                    ? "border-[#0b2b50] bg-[#0b2b50]/5 scale-[0.99]"
                    : "border-slate-300 hover:border-[#0b2b50] hover:bg-slate-50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".geojson,.json"
                  onChange={handleBrowseFiles}
                  className="hidden"
                />

                <div className="w-12 h-12 rounded-2xl bg-[#0b2b50]/10 text-[#0b2b50] flex items-center justify-center shadow-xs">
                  <UploadCloud className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-black text-slate-800">
                    Drop GeoJSON file here
                  </p>
                  <p className="text-xs text-slate-500">
                    or <span className="text-[#0b2b50] font-bold underline">Browse Files</span>
                  </p>
                </div>

                <div className="text-[11px] text-slate-500 font-medium">
                  Supported format: <strong>GeoJSON (.geojson, .json)</strong> • Up to 20 MB
                </div>
              </div>

              {/* Validation Error Display */}
              {parseResult && !parseResult.success && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-900 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Import Error:</strong>
                    <span>{parseResult.error}</span>
                  </div>
                </div>
              )}

              {/* Sample GIS Proposals for 1-click test */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-600 block mb-2">
                  Or load benchmark GIS proposal sample:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleLoadSample("pune_corridor")}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-left transition-colors flex items-center justify-between cursor-pointer shadow-2xs"
                  >
                    <div>
                      <div className="font-bold text-slate-800">Pune Logistics</div>
                      <div className="text-[10px] text-slate-500">2 Zones (Chakan & Talegaon)</div>
                    </div>
                    <FileCode className="w-4 h-4 text-[#0b2b50]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLoadSample("noida_tech")}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-left transition-colors flex items-center justify-between cursor-pointer shadow-2xs"
                  >
                    <div>
                      <div className="font-bold text-slate-800">Noida Ecotech</div>
                      <div className="text-[10px] text-slate-500">1 Zone (Ecotech SEZ)</div>
                    </div>
                    <FileCode className="w-4 h-4 text-[#0b2b50]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLoadSample("bullet_corridor")}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-left transition-colors flex items-center justify-between cursor-pointer shadow-2xs"
                  >
                    <div>
                      <div className="font-bold text-slate-800">Bullet Train</div>
                      <div className="text-[10px] text-slate-500">LineString Corridor Buffer</div>
                    </div>
                    <FileCode className="w-4 h-4 text-[#0b2b50]" />
                  </button>
                </div>
              </div>

              {/* Future Format Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-2.5 text-[11px] text-blue-900 flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-[#0b2b50] shrink-0" />
                <span>
                  Additional GIS formats (KML, KMZ, Shapefile .zip) will be supported in future versions.
                </span>
              </div>
            </>
          )}

          {/* 2. Detected Features & Multi-Zone Selector */}
          {parseResult?.success && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold">
                    {parseResult.features.length}{" "}
                    {parseResult.features.length === 1 ? "proposed zone" : "proposed zones"}{" "}
                    detected in <span className="font-mono">{parseResult.fileName}</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setParseResult(null)}
                  className="text-[11px] font-bold text-emerald-800 underline hover:text-emerald-950 cursor-pointer"
                >
                  Change File
                </button>
              </div>

              {parseResult.normalizationNotice && (
                <div className="bg-amber-50 border border-amber-200 text-amber-900 p-2.5 rounded-xl text-xs flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{parseResult.normalizationNotice}</span>
                </div>
              )}

              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                {parseResult.features.map((feat) => {
                  const isChecked = selectedFeatureIds.includes(feat.id);
                  return (
                    <div
                      key={feat.id}
                      onClick={() => handleToggleSelectFeature(feat.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isChecked
                          ? "border-[#0b2b50] bg-[#0b2b50]/5 shadow-xs"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="rounded text-[#0b2b50] focus:ring-0 cursor-pointer"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                            <span>{feat.name}</span>
                            <span className="text-[10px] font-normal text-slate-500 font-mono">
                              ({feat.geometryType})
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                            <span>
                              Area: <strong>{feat.areaHa} Ha</strong>
                            </span>
                            <span>•</span>
                            <span>
                              Perimeter: <strong>{feat.perimeterKm} km</strong>
                            </span>
                            <span>•</span>
                            <span>
                              {feat.district}, {feat.state}
                            </span>
                          </div>
                        </div>
                      </div>

                      <span className="bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0">
                        {feat.suggestedZoneType}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-100">
                <span className="text-xs text-slate-500 font-medium">
                  {selectedFeatureIds.length} of {parseResult.features.length} zones selected
                </span>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      const allSelected =
                        selectedFeatureIds.length === parseResult.features.length;
                      setSelectedFeatureIds(
                        allSelected ? [] : parseResult.features.map((f) => f.id)
                      );
                    }}
                    className="ux4g-btn ux4g-btn-outline-neutral ux4g-btn-sm cursor-pointer"
                  >
                    {selectedFeatureIds.length === parseResult.features.length
                      ? "Deselect All"
                      : "Select All"}
                  </button>

                  <button
                    type="button"
                    disabled={selectedFeatureIds.length === 0}
                    onClick={() => {
                      const selected = parseResult.features.filter((f) =>
                        selectedFeatureIds.includes(f.id)
                      );
                      handleExecuteImport(selected);
                    }}
                    className="ux4g-btn ux4g-btn-primary ux4g-btn-sm cursor-pointer"
                  >
                    <span>Import Selected Zones</span>
                    <ChevronRight className="w-3.5 h-3.5 text-amber-300" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Replace Existing Proposal Confirmation Dialog ─── */}
      {replaceConfirmOpen && (
        <div className="ux4g-modal-backdrop ux4g-modal-backdrop-50">
          <div className="ux4g-modal-box ux4g-modal-s p-5 space-y-4">
            <div className="flex items-center gap-2.5 text-amber-600 font-bold text-sm">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>Replace current proposal?</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              An active proposed zone is already loaded on the map. Importing this new GIS file
              will replace the current active proposal geometry.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReplaceConfirmOpen(false)}
                className="ux4g-btn ux4g-btn-outline-neutral ux4g-btn-sm cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmReplace}
                className="ux4g-btn ux4g-btn-primary ux4g-btn-sm cursor-pointer !bg-amber-600 hover:!bg-amber-700 !border-amber-600"
              >
                Replace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
