"use client";

import React, { useState } from "react";
import {
  MapPin,
  Layers,
  Globe2,
  Eye,
  Crosshair,
  Compass,
  AlertCircle,
  CheckCircle,
  Trees,
  Building,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Info,
} from "lucide-react";

interface GisExplorerProps {
  language: "en" | "hi";
}

interface RegionData {
  state: string;
  district: string;
  totalParcels: string;
  georeferencedPct: number;
  satellitePass: string;
  ulpinSeededPct: number;
  climateRiskTier: "Low" | "Moderate" | "High";
  activeEncroachments: number;
}

export function GisExplorer({ language }: GisExplorerProps) {
  const regions: RegionData[] = [
    {
      state: "Madhya Pradesh",
      district: "Sehore",
      totalParcels: "412,850",
      georeferencedPct: 98.4,
      satellitePass: "Cartosat-3 / Sentinel-2 (Sept 2026)",
      ulpinSeededPct: 96.2,
      climateRiskTier: "Moderate",
      activeEncroachments: 14,
    },
    {
      state: "Uttar Pradesh",
      district: "Varanasi",
      totalParcels: "584,200",
      georeferencedPct: 94.7,
      satellitePass: "RISAT-1A / Bhuvan LISS-IV (Sept 2026)",
      ulpinSeededPct: 91.8,
      climateRiskTier: "Low",
      activeEncroachments: 8,
    },
    {
      state: "Maharashtra",
      district: "Pune (Peri-Urban)",
      totalParcels: "732,100",
      georeferencedPct: 99.1,
      satellitePass: "WorldView-3 / NRSC Bhuvan (Sept 2026)",
      ulpinSeededPct: 97.5,
      climateRiskTier: "Moderate",
      activeEncroachments: 32,
    },
    {
      state: "Rajasthan",
      district: "Barmer (Arid)",
      totalParcels: "289,600",
      georeferencedPct: 92.5,
      satellitePass: "Oceansat / Cartosat-2 (Aug 2026)",
      ulpinSeededPct: 88.4,
      climateRiskTier: "High",
      activeEncroachments: 4,
    },
    {
      state: "Assam",
      district: "Kamrup",
      totalParcels: "341,900",
      georeferencedPct: 89.2,
      satellitePass: "Sentinel-1 SAR / NRSC (Sept 2026)",
      ulpinSeededPct: 84.1,
      climateRiskTier: "High",
      activeEncroachments: 19,
    },
  ];

  const [selectedRegionIndex, setSelectedRegionIndex] = useState(0);
  const [activeLayer, setActiveLayer] = useState<"cadastral" | "satellite" | "climate" | "urban">("cadastral");
  const [selectedParcel, setSelectedParcel] = useState<{
    khasra: string;
    ulpin: string;
    area: string;
    owner: string;
    crop: string;
    soilCarbon: string;
  } | null>({
    khasra: "142/3-A",
    ulpin: "MP-SEH-1423-99824",
    area: "1.42 Hectares (3.51 Acres)",
    owner: "Devendra Narayan Patel & 2 others",
    crop: "Soybean (Kharif) / Wheat (Rabi)",
    soilCarbon: "0.68% (Moderate organic stock)",
  });

  const currentRegion = regions[selectedRegionIndex];

  return (
    <section id="gis" className="w-full bg-[#f8fafc] py-12 border-b border-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
              <Globe2 className="w-4 h-4 text-emerald-700" />
              <span>{language === "hi" ? "भू-स्थानिक एकीकरण एवं भुवन मंच" : "Geospatial Integration & Bhuvan Platform"}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#0b2b50] tracking-tight mt-1">
              {language === "hi"
                ? "राष्ट्रीय भू-स्थानिक एवं उपग्रह विश्लेषण सुइट"
                : "National Geospatial & Remote Sensing Intelligence Suite"}
            </h3>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              {language === "hi"
                ? "इसरो (भुवन), भारतीय सर्वेक्षण विभाग एवं राज्य राजस्व रिकॉर्ड्स का त्रि-आयामी समन्वय। उपग्रह इमेजरी, कैडस्ट्रल पार्सल मैपिंग, जलवायु जोखिम एवं शहरी संक्रमण की वास्तविक समय दृश्यता।"
                : "Seamless convergence of ISRO Bhuvan satellite imagery, Survey of India CORS precision network, and State land registries for real-time spatial decision-making."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold bg-white text-slate-800 border border-slate-300 px-3 py-1.5 rounded flex items-center gap-1.5 shadow-2xs">
              <Compass className="w-3.5 h-3.5 text-blue-800" />
              <span>WGS84 / EPSG:4326 Datum Compliant</span>
            </span>
          </div>
        </div>

        {/* GIS Explorer Layout */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Controls & Analytics (4 cols) */}
          <div className="lg:col-span-4 bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-4">
            {/* Region Selector */}
            <div>
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide block mb-1.5">
                {language === "hi" ? "राज्य एवं जनपद चयन:" : "Select Pilot Region / District:"}
              </label>
              <select
                value={selectedRegionIndex}
                onChange={(e) => setSelectedRegionIndex(Number(e.target.value))}
                className="w-full py-2 px-3 bg-slate-50 text-slate-900 text-xs font-semibold rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0b2b50]"
              >
                {regions.map((reg, idx) => (
                  <option key={reg.district} value={idx}>
                    {reg.state} — {reg.district}
                  </option>
                ))}
              </select>
            </div>

            {/* Layer Selection */}
            <div>
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide block mb-2">
                {language === "hi" ? "सक्रिय भू-स्थानिक परत (GIS Layers):" : "Active Geospatial Layers:"}
              </label>
              <div className="space-y-1.5">
                {[
                  {
                    id: "cadastral",
                    label: "Cadastral Parcels & ULPIN",
                    sub: "Vector polygons with 14-digit geo-identifiers",
                    color: "border-blue-500",
                  },
                  {
                    id: "satellite",
                    label: "Bhuvan 0.5m Optical Satellite",
                    sub: "ISRO Cartosat-3 / Sentinel-2 composite",
                    color: "border-emerald-500",
                  },
                  {
                    id: "climate",
                    label: "Climate Vulnerability & Soil Runoff",
                    sub: "Degradation neutral risk zones & slopes",
                    color: "border-amber-500",
                  },
                  {
                    id: "urban",
                    label: "Urban-Rural Fringe Conversion",
                    sub: "Farmland to built-up expansion monitor",
                    color: "border-rose-500",
                  },
                ].map((lyr) => (
                  <button
                    key={lyr.id}
                    type="button"
                    onClick={() => setActiveLayer(lyr.id as any)}
                    className={`w-full text-left p-2.5 rounded text-xs transition-all border ${
                      activeLayer === lyr.id
                        ? "bg-[#0b2b50] text-white border-[#0b2b50] shadow-xs"
                        : "bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <div className="font-bold">{lyr.label}</div>
                    <div
                      className={`text-[10px] ${
                        activeLayer === lyr.id ? "text-slate-200" : "text-slate-500"
                      }`}
                    >
                      {lyr.sub}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Regional Metrics Box */}
            <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-2 text-xs">
              <div className="text-[11px] font-bold text-slate-900 border-b border-slate-200 pb-1 flex justify-between">
                <span>{currentRegion.district} Spatial Status</span>
                <span className="text-emerald-700 font-bold">Verified</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Total Surveyed Parcels:</span>
                <span className="font-bold text-slate-800">{currentRegion.totalParcels}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">GIS Geo-referencing Rate:</span>
                <span className="font-bold text-emerald-700">{currentRegion.georeferencedPct}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">ULPIN Seeding Index:</span>
                <span className="font-bold text-blue-700">{currentRegion.ulpinSeededPct}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Climate Vulnerability:</span>
                <span
                  className={`font-bold px-1.5 py-0.2 rounded text-[10px] ${
                    currentRegion.climateRiskTier === "High"
                      ? "bg-rose-100 text-rose-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {currentRegion.climateRiskTier}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 pt-1 font-mono">
                Latest Pass: {currentRegion.satellitePass}
              </div>
            </div>
          </div>

          {/* Right: Map Canvas & Parcel Inspector (8 cols) */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            {/* Flat Interactive Map Canvas */}
            <div className="relative w-full h-[360px] sm:h-[400px] bg-slate-900 rounded-lg overflow-hidden border-2 border-slate-300 shadow-inner flex items-center justify-center select-none">
              {/* Cadastral Vector Grid Overlay Simulation */}
              <svg
                viewBox="0 0 600 360"
                className="w-full h-full object-cover"
                style={{
                  background:
                    activeLayer === "satellite"
                      ? "#1e293b"
                      : activeLayer === "climate"
                      ? "#292524"
                      : activeLayer === "urban"
                      ? "#18181b"
                      : "#0f172a",
                }}
              >
                {/* Background Grid Lines representing Survey grid */}
                <defs>
                  <pattern id="surveyGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#surveyGrid)" />

                {/* River / Canal Waterway feature */}
                <path
                  d="M 20 180 Q 180 230 320 160 T 580 190"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="8"
                  opacity="0.8"
                />
                <text x="330" y="150" fill="#7dd3fc" fontSize="9" fontWeight="bold">
                  Narmada Sub-Canal System (Irrigation)
                </text>

                {/* Road / Transport corridor */}
                <path
                  d="M 120 20 L 260 340"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="3"
                  strokeDasharray="4 2"
                />
                <text x="200" y="240" fill="#fef08a" fontSize="9" fontWeight="bold">
                  State Highway SH-18
                </text>

                {/* Cadastral Parcels (Clickable Polygons) */}
                {/* Parcel 1 */}
                <polygon
                  points="160,80 230,70 250,130 180,140"
                  fill={
                    activeLayer === "climate"
                      ? "rgba(239, 68, 68, 0.4)"
                      : activeLayer === "urban"
                      ? "rgba(244, 63, 94, 0.4)"
                      : "rgba(16, 185, 129, 0.3)"
                  }
                  stroke="#10b981"
                  strokeWidth="2"
                  className="cursor-pointer hover:fill-emerald-500/50 transition-colors"
                  onClick={() =>
                    setSelectedParcel({
                      khasra: "142/3-A",
                      ulpin: "MP-SEH-1423-99824",
                      area: "1.42 Hectares (3.51 Acres)",
                      owner: "Devendra Narayan Patel & 2 others",
                      crop: "Soybean (Kharif) / Wheat (Rabi)",
                      soilCarbon: "0.68% (Moderate organic stock)",
                    })
                  }
                />
                <text x="185" y="110" fill="#ffffff" fontSize="9" fontWeight="bold">
                  142/3-A
                </text>

                {/* Parcel 2 */}
                <polygon
                  points="235,70 320,60 330,120 255,130"
                  fill={
                    activeLayer === "climate"
                      ? "rgba(245, 158, 11, 0.4)"
                      : "rgba(59, 130, 246, 0.3)"
                  }
                  stroke="#3b82f6"
                  strokeWidth="2"
                  className="cursor-pointer hover:fill-blue-500/50 transition-colors"
                  onClick={() =>
                    setSelectedParcel({
                      khasra: "142/4",
                      ulpin: "MP-SEH-1424-33102",
                      area: "2.10 Hectares (5.18 Acres)",
                      owner: "Gram Panchayat Shamilat / Community Grazing",
                      crop: "Protected Pasture & Silviculture",
                      soilCarbon: "0.92% (High carbon retention)",
                    })
                  }
                />
                <text x="265" y="100" fill="#ffffff" fontSize="9" fontWeight="bold">
                  142/4 (Gram)
                </text>

                {/* Parcel 3 */}
                <polygon
                  points="180,145 255,135 270,210 190,220"
                  fill="rgba(168, 85, 247, 0.3)"
                  stroke="#a855f7"
                  strokeWidth="2"
                  className="cursor-pointer hover:fill-purple-500/50 transition-colors"
                  onClick={() =>
                    setSelectedParcel({
                      khasra: "143/1",
                      ulpin: "MP-SEH-1431-77291",
                      area: "0.85 Hectares (2.10 Acres)",
                      owner: "Smt. Kamala Bai w/o Rameshwar",
                      crop: "Organic Mustard & Pulses",
                      soilCarbon: "0.74% (Healthy soil matrix)",
                    })
                  }
                />
                <text x="210" y="180" fill="#ffffff" fontSize="9" fontWeight="bold">
                  143/1
                </text>

                {/* Parcel 4 (SVAMITVA Abadi cluster) */}
                <polygon
                  points="340,110 440,95 450,170 350,180"
                  fill="rgba(234, 88, 12, 0.35)"
                  stroke="#ea580c"
                  strokeWidth="2"
                  className="cursor-pointer hover:fill-orange-500/50 transition-colors"
                  onClick={() =>
                    setSelectedParcel({
                      khasra: "Abadi Plot #54",
                      ulpin: "SVAMITVA-MP-SEH-V054",
                      area: "2,400 sq. ft (Rural Homestead)",
                      owner: "Rajesh Kumar Verma",
                      crop: "Residential Abadi Structure (SVAMITVA Card Issued)",
                      soilCarbon: "N/A (Built-up Habitation)",
                    })
                  }
                />
                <text x="360" y="145" fill="#ffffff" fontSize="9" fontWeight="bold">
                  Abadi Cluster #54
                </text>

                {/* High-risk Encroachment / Change alert pin */}
                <circle cx="215" cy="270" r="14" fill="rgba(239, 68, 68, 0.3)" stroke="#ef4444" strokeWidth="1.5" />
                <circle cx="215" cy="270" r="4" fill="#ef4444" />
                <text x="235" y="274" fill="#fca5a5" fontSize="9" fontWeight="bold">
                  Encroachment Alert: Unapproved Layout
                </text>
              </svg>

              {/* Map Controls Floating Bar */}
              <div className="absolute top-3 right-3 flex flex-col gap-1.5 bg-slate-900/90 p-1.5 rounded border border-slate-700 text-white">
                <button
                  type="button"
                  className="p-1 hover:bg-slate-800 rounded"
                  title="Zoom In"
                  onClick={() => alert("Zooming In (Simulated Cartographic View)")}
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-1 hover:bg-slate-800 rounded"
                  title="Zoom Out"
                  onClick={() => alert("Zooming Out (Simulated Cartographic View)")}
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-1 hover:bg-slate-800 rounded"
                  title="Reset Extent"
                  onClick={() => alert("Extent reset to District boundary.")}
                >
                  <Crosshair className="w-4 h-4" />
                </button>
              </div>

              {/* Floating Layer Legend */}
              <div className="absolute bottom-3 left-3 bg-slate-900/90 text-white text-[10px] p-2 rounded border border-slate-700 space-y-1">
                <div className="font-bold text-amber-400">Map Legend:</div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" />
                  <span>Verified Agriculture</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-orange-500 inline-block" />
                  <span>SVAMITVA Abadi</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block" />
                  <span>AI Encroachment Warning</span>
                </div>
              </div>
            </div>

            {/* Selected Parcel Inspector Card */}
            {selectedParcel && (
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                      Selected Cadastral Parcel
                    </span>
                    <span className="font-mono font-bold text-sm text-[#0b2b50]">
                      Khasra {selectedParcel.khasra}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    ULPIN: {selectedParcel.ulpin}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Registered Area:</span>
                    <span className="font-bold text-slate-800">{selectedParcel.area}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Title Holder(s):</span>
                    <span className="font-bold text-slate-800 truncate block">{selectedParcel.owner}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Land Use / Crop:</span>
                    <span className="font-bold text-slate-800">{selectedParcel.crop}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Soil Organic Carbon:</span>
                    <span className="font-bold text-emerald-700">{selectedParcel.soilCarbon}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
