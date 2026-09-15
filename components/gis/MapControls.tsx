"use client";

import React from "react";
import { Map, Layers, ShieldAlert, History, Activity, AlertCircle } from "lucide-react";

interface MapControlsProps {
  activeLayers: string[];
  setActiveLayers: React.Dispatch<React.SetStateAction<string[]>>;
  isPredictorActive: boolean;
  setIsPredictorActive: React.Dispatch<React.SetStateAction<boolean>>;
  timePeriod: number;
  setTimePeriod: React.Dispatch<React.SetStateAction<number>>;
}

export default function MapControls({
  activeLayers,
  setActiveLayers,
  isPredictorActive,
  setIsPredictorActive,
  timePeriod,
  setTimePeriod,
}: MapControlsProps) {
  const toggleLayer = (layerId: string) => {
    setActiveLayers((prev) =>
      prev.includes(layerId)
        ? prev.filter((id) => id !== layerId)
        : [...prev, layerId]
    );
  };

  const layers = [
    { id: "landUse", label: "Land Use", desc: "Agricultural & commercial zones", color: "bg-emerald-500" },
    { id: "infrastructure", label: "Infrastructure", desc: "Roads, power lines, canals", color: "bg-blue-500" },
    { id: "climateRisk", label: "Climate Risk", desc: "Flood & drought vulnerability", color: "bg-amber-500" },
    { id: "disputes", label: "Active Disputes", desc: "Ongoing court cases & conflicts", color: "bg-slate-500" },
  ];

  return (
    <div className="w-full lg:w-80 flex flex-col gap-4">
      {/* Layers Panel */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          Map Layers
        </h3>
        <div className="space-y-2">
          {layers.map((layer) => (
            <label
              key={layer.id}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                activeLayers.includes(layer.id)
                  ? "border-blue-600 bg-blue-50/50"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              <input
                type="checkbox"
                className="mt-1 flex-shrink-0 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-600"
                checked={activeLayers.includes(layer.id)}
                onChange={() => toggleLayer(layer.id)}
              />
              <div>
                <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${layer.color}`} />
                  {layer.label}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{layer.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Predictive Analytics */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-red-600" />
          Predictive Analytics
        </h3>
        <button
          onClick={() => setIsPredictorActive(!isPredictorActive)}
          className={`w-full flex items-center justify-between p-3 rounded-lg border font-bold text-sm transition-all ${
            isPredictorActive
              ? "bg-red-50 border-red-200 text-red-700 shadow-inner"
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          <span className="flex items-center gap-2">
            <ShieldAlert className={`w-4 h-4 ${isPredictorActive ? "text-red-600" : "text-slate-400"}`} />
            Dispute Hotspot Predictor
          </span>
          <div
            className={`w-8 h-4 rounded-full p-0.5 transition-colors ${
              isPredictorActive ? "bg-red-600" : "bg-slate-300"
            }`}
          >
            <div
              className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${
                isPredictorActive ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </div>
        </button>
        {isPredictorActive && (
          <div className="mt-3 p-3 bg-red-50/50 border border-red-100 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-red-800">
              AI model indicates high likelihood of conflict in highlighted zones due to rapid urban encroachment.
            </p>
          </div>
        )}
      </div>

      {/* Time Slider */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
          <History className="w-4 h-4 text-emerald-600" />
          Historical Timeline
        </h3>
        <div className="px-2">
          <input
            type="range"
            min="2010"
            max="2024"
            step="1"
            value={timePeriod}
            onChange={(e) => setTimePeriod(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between mt-2 text-xs font-bold text-slate-500">
            <span>2010</span>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {timePeriod}
            </span>
            <span>2024</span>
          </div>
        </div>
        {timePeriod < 2024 && (
          <p className="text-xs text-slate-500 mt-4 text-center">
            Viewing historical satellite and cadastral state.
          </p>
        )}
      </div>
    </div>
  );
}
