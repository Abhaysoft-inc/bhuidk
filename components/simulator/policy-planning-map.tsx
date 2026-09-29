"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Polyline,
  CircleMarker,
  Marker,
  Tooltip,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import {
  Pentagon,
  Square,
  Circle,
  Pencil,
  Trash2,
  RotateCcw,
  Layers,
  Sparkles,
  Info,
  Maximize2,
  Check,
  AlertTriangle,
  MapPin,
  Eye,
  CheckCircle2,
  Upload,
  Loader2,
  X,
  Globe,
} from "lucide-react";
import {
  LiveDistrictBoundary,
  DistrictCatalogItem,
  generateInvertedDistrictMask,
} from "./india-districts-catalog";
import {
  ProposedZoneData,
  DrawingTool,
  ZoneType,
  MapLayerItem,
  computePolygonAreaSqMeters,
  computePerimeterKm,
  sqMetersToHectares,
  coordsToGeoJSONPolygon,
  generateCirclePolygon,
  computeBoundingBox,
  detectDistrictAndState,
  computeZoneAnalysis,
  computeHaversineDistance,
} from "./policy-planning-types";
import { CandidateLocation } from "./ai-site-types";

// Fix Leaflet's default icon bundle resolution
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom vertex handle icon for edit mode
const createVertexHandleIcon = (isFirst = false) =>
  L.divIcon({
    className: "custom-vertex-handle",
    html: `<div style="
      width: ${isFirst ? "16px" : "14px"};
      height: ${isFirst ? "16px" : "14px"};
      background-color: ${isFirst ? "#f59e0b" : "#ffffff"};
      border: 2.5px solid #0b2b50;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(11, 43, 80, 0.4);
      cursor: grab;
      transition: transform 0.15s ease;
    "></div>`,
    iconSize: [isFirst ? 16 : 14, isFirst ? 16 : 14],
    iconAnchor: [isFirst ? 8 : 7, isFirst ? 8 : 7],
  });

interface PolicyPlanningMapProps {
  activeZone: ProposedZoneData | null;
  allZones?: ProposedZoneData[];
  candidateZones?: CandidateLocation[];
  selectedCandidateId?: string;
  onSelectCandidate?: (candidateId: string) => void;
  onSelectZone?: (zoneId: string) => void;
  onZoneCreated: (zone: ProposedZoneData) => void;
  onZoneUpdated: (zone: ProposedZoneData) => void;
  onZoneDeleted: () => void;
  selectedZoneType: ZoneType;
  onOpenUpload: () => void;
  onOpenAiSite: () => void;
  selectedDistrictBoundary?: LiveDistrictBoundary | null;
  selectedDistrictMetadata?: DistrictCatalogItem | null;
  onClearDistrict?: () => void;
  isLoadingDistrictBoundary?: boolean;
}


// ─── Child Component: Interactive Map Drawing & Events Engine ───

function DrawingHandler({
  drawingTool,
  setDrawingTool,
  drawingPoints,
  setDrawingPoints,
  tempMousePos,
  setTempMousePos,
  rectStart,
  setRectStart,
  circleCenter,
  setCircleCenter,
  onFinishDrawing,
  activeZone,
}: {
  drawingTool: DrawingTool;
  setDrawingTool: (tool: DrawingTool) => void;
  drawingPoints: [number, number][];
  setDrawingPoints: React.Dispatch<React.SetStateAction<[number, number][]>>;
  tempMousePos: [number, number] | null;
  setTempMousePos: (pos: [number, number] | null) => void;
  rectStart: [number, number] | null;
  setRectStart: (pos: [number, number] | null) => void;
  circleCenter: [number, number] | null;
  setCircleCenter: (pos: [number, number] | null) => void;
  onFinishDrawing: (coords: [number, number][]) => void;
  activeZone: ProposedZoneData | null;
}) {
  const map = useMap();

  useMapEvents({
    click(e) {
      const latLng: [number, number] = [e.latlng.lat, e.latlng.lng];

      if (drawingTool === "polygon") {
        // If clicking close to the first point with at least 3 points, complete polygon
        if (drawingPoints.length >= 3) {
          const firstPoint = drawingPoints[0];
          const distToFirst = computeHaversineDistance(latLng, firstPoint);
          if (distToFirst < 60) {
            onFinishDrawing(drawingPoints);
            return;
          }
        }
        setDrawingPoints((prev) => [...prev, latLng]);
      } else if (drawingTool === "rectangle") {
        if (!rectStart) {
          setRectStart(latLng);
        } else {
          // Second corner clicked -> generate rectangle coords
          const cornerA = rectStart;
          const cornerB = latLng;
          const rectCoords: [number, number][] = [
            [cornerA[0], cornerA[1]],
            [cornerA[0], cornerB[1]],
            [cornerB[0], cornerB[1]],
            [cornerB[0], cornerA[1]],
          ];
          setRectStart(null);
          onFinishDrawing(rectCoords);
        }
      } else if (drawingTool === "circle") {
        if (!circleCenter) {
          setCircleCenter(latLng);
        } else {
          const radiusMeters = computeHaversineDistance(circleCenter, latLng);
          const circleCoords = generateCirclePolygon(circleCenter, Math.max(50, radiusMeters), 36);
          setCircleCenter(null);
          onFinishDrawing(circleCoords);
        }
      }
    },
    mousemove(e) {
      if (drawingTool !== "none" && drawingTool !== "edit") {
        setTempMousePos([e.latlng.lat, e.latlng.lng]);
      }
    },
  });

  // Adjust cursor based on drawing tool
  useEffect(() => {
    const container = map.getContainer();
    if (drawingTool === "polygon" || drawingTool === "rectangle" || drawingTool === "circle") {
      container.style.cursor = "crosshair";
    } else if (drawingTool === "edit") {
      container.style.cursor = "default";
    } else {
      container.style.cursor = "";
    }
  }, [drawingTool, map]);

  return null;
}

// ─── Fit Bounds Component ───
function BoundsFitter({
  activeZone,
  allZones,
  candidateZones,
  selectedCandidateId,
  selectedDistrictBoundary,
}: {
  activeZone: ProposedZoneData | null;
  allZones?: ProposedZoneData[];
  candidateZones?: CandidateLocation[];
  selectedCandidateId?: string;
  selectedDistrictBoundary?: LiveDistrictBoundary | null;
}) {
  const map = useMap();
  const prevDistrictRef = useRef<string | null>(null);
  const prevCandidateRef = useRef<string | null>(null);
  const prevZoneRef = useRef<string | null>(null);

  useEffect(() => {
    // 1. If AI candidates are loaded or user selects a candidate, fly directly to it:
    if (candidateZones && candidateZones.length > 0) {
      const activeCandidate =
        candidateZones.find((c) => c.candidate_id === selectedCandidateId) ||
        candidateZones[0];

      if (activeCandidate && activeCandidate.rawCoordinates.length >= 3) {
        const candKey = `${activeCandidate.candidate_id}_${candidateZones.length}`;
        if (candKey !== prevCandidateRef.current) {
          prevCandidateRef.current = candKey;
          const bbox = computeBoundingBox(activeCandidate.rawCoordinates);
          map.fitBounds(bbox, {
            padding: [70, 70],
            maxZoom: 14,
            animate: true,
            duration: 1.0,
          });
        }
        return;
      }
    } else {
      prevCandidateRef.current = null;
    }

    // 2. If a proposed zone is active or adopted:
    if (activeZone && activeZone.rawCoordinates.length >= 3) {
      const zoneKey = `${activeZone.zone_id}_${activeZone.rawCoordinates.length}`;
      if (zoneKey !== prevZoneRef.current) {
        prevZoneRef.current = zoneKey;
        const bbox = computeBoundingBox(activeZone.rawCoordinates);
        map.fitBounds(bbox, {
          padding: [60, 60],
          maxZoom: 15,
          animate: true,
          duration: 1.0,
        });
        return;
      }
    }

    // 3. If a district boundary is selected, fly to its bounds:
    if (selectedDistrictBoundary) {
      if (selectedDistrictBoundary.district !== prevDistrictRef.current) {
        prevDistrictRef.current = selectedDistrictBoundary.district;
        map.fitBounds(selectedDistrictBoundary.bounds, {
          padding: [30, 30],
          maxZoom: 13,
          animate: true,
          duration: 1.2,
        });
        return;
      }
    } else if (prevDistrictRef.current) {
      prevDistrictRef.current = null;
      map.setView([22.5, 78.9], 5, { animate: true });
      return;
    }

    // 4. Default all zones fallback
    if (allZones && allZones.length > 0) {
      const allCoords = allZones.flatMap((z) => z.rawCoordinates);
      if (allCoords.length >= 3) {
        const bbox = computeBoundingBox(allCoords);
        map.fitBounds(bbox, {
          padding: [60, 60],
          maxZoom: 15,
          animate: true,
        });
      }
    }
  }, [activeZone, allZones, candidateZones, selectedCandidateId, selectedDistrictBoundary, map]);

  return null;
}

export default function PolicyPlanningMap({
  activeZone,
  allZones,
  candidateZones,
  selectedCandidateId,
  onSelectCandidate,
  onSelectZone,
  onZoneCreated,
  onZoneUpdated,
  onZoneDeleted,
  selectedZoneType,
  onOpenUpload,
  onOpenAiSite,
  selectedDistrictBoundary,
  selectedDistrictMetadata,
  onClearDistrict,
  isLoadingDistrictBoundary,
}: PolicyPlanningMapProps) {
  // Drawing states
  const [drawingTool, setDrawingTool] = useState<DrawingTool>("none");
  const [drawingPoints, setDrawingPoints] = useState<[number, number][]>([]);
  const [tempMousePos, setTempMousePos] = useState<[number, number] | null>(null);
  const [rectStart, setRectStart] = useState<[number, number] | null>(null);
  const [circleCenter, setCircleCenter] = useState<[number, number] | null>(null);


  // Layers control state
  const [layersOpen, setLayersOpen] = useState(false);
  const layersRef = useRef<HTMLDivElement>(null);
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    satellite: false,
    adminBoundaries: true,
    landUse: true,
    parcels: false,
    roads: false,
    waterBodies: false,
    disputes: false,
  });

  // Close layers popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (layersRef.current && !layersRef.current.contains(event.target as Node)) {
        setLayersOpen(false);
      }
    }
    if (layersOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [layersOpen]);

  // Base map layers definition
  const layersList: MapLayerItem[] = [
    {
      id: "satellite",
      label: "Satellite Imagery",
      desc: "High-res ESRI / World Imagery",
      connected: true,
      statusText: "Connected (ISRO / ESRI)",
      color: "bg-blue-600",
      active: activeLayers.satellite,
    },
    {
      id: "adminBoundaries",
      label: "Administrative Boundaries",
      desc: "State & District Cadastral limits",
      connected: true,
      statusText: "Connected (NIC SDI)",
      color: "bg-indigo-600",
      active: activeLayers.adminBoundaries,
    },
    {
      id: "landUse",
      label: "Land Use / Land Cover (LULC)",
      desc: "Agricultural & industrial reference",
      connected: true,
      statusText: "Connected (Bhuvan 2024)",
      color: "bg-emerald-600",
      active: activeLayers.landUse,
    },
    {
      id: "parcels",
      label: "Cadastral Parcels",
      desc: "Micro parcel boundary geometries",
      connected: false,
      statusText: "Data source not connected",
      color: "bg-amber-500",
      active: false,
    },
    {
      id: "roads",
      label: "Roads & Transportation",
      desc: "NHAI / PMGSY road network",
      connected: false,
      statusText: "Data source not connected",
      color: "bg-slate-500",
      active: false,
    },
    {
      id: "waterBodies",
      label: "Water Bodies & Wetlands",
      desc: "Central Water Commission GIS",
      connected: false,
      statusText: "Data source not connected",
      color: "bg-cyan-500",
      active: false,
    },
    {
      id: "disputes",
      label: "Litigation & Disputes Overlay",
      desc: "e-Courts NJDG Geo-tagged appeals",
      connected: false,
      statusText: "Data source not connected",
      color: "bg-rose-500",
      active: false,
    },
  ];

  const handleToggleLayer = (id: string, connected: boolean) => {
    if (!connected) return;
    setActiveLayers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Complete drawing and package into ProposedZoneData
  const handleFinishDrawing = useCallback(
    (coords: [number, number][]) => {
      if (coords.length < 3) {
        setDrawingPoints([]);
        setDrawingTool("none");
        return;
      }

      const areaSqM = computePolygonAreaSqMeters(coords);
      const areaHa = sqMetersToHectares(areaSqM);
      const perimeterKm = Number(computePerimeterKm(coords).toFixed(2));
      const geojsonGeom = coordsToGeoJSONPolygon(coords);

      // Centroid
      const avgLat = coords.reduce((acc, c) => acc + c[0], 0) / coords.length;
      const avgLng = coords.reduce((acc, c) => acc + c[1], 0) / coords.length;
      const detected = detectDistrictAndState(avgLat, avgLng);
      const district = selectedDistrictMetadata ? selectedDistrictMetadata.name : detected.district;
      const state = selectedDistrictMetadata ? selectedDistrictMetadata.state_name : detected.state;

      const analysis = computeZoneAnalysis(areaHa, selectedZoneType);

      const newZone: ProposedZoneData = {
        zone_id: `ZONE-${Date.now().toString().slice(-4)}`,
        source: "manual",
        zone_type: selectedZoneType,
        name: `Proposed ${selectedZoneType} - Zone 1`,
        geometry: geojsonGeom,
        area: areaHa,
        perimeter: perimeterKm,
        state,
        district,
        analysis,
        rawCoordinates: coords,
        createdAt: new Date().toISOString(),
      };

      onZoneCreated(newZone);
      setDrawingPoints([]);
      setRectStart(null);
      setCircleCenter(null);
      setDrawingTool("none");
    },
    [selectedZoneType, onZoneCreated, selectedDistrictMetadata]
  );

  // Dragging vertex handles in Edit Mode
  const handleVertexDrag = (index: number, e: L.LeafletEvent) => {
    if (!activeZone) return;
    const marker = e.target as L.Marker;
    const newLatLng = marker.getLatLng();
    const updatedCoords: [number, number][] = activeZone.rawCoordinates.map((pt, i) =>
      i === index ? [newLatLng.lat, newLatLng.lng] : pt
    );

    const areaSqM = computePolygonAreaSqMeters(updatedCoords);
    const areaHa = sqMetersToHectares(areaSqM);
    const perimeterKm = Number(computePerimeterKm(updatedCoords).toFixed(2));
    const geojsonGeom = coordsToGeoJSONPolygon(updatedCoords);
    const analysis = computeZoneAnalysis(areaHa, activeZone.zone_type);

    const updatedZone: ProposedZoneData = {
      ...activeZone,
      geometry: geojsonGeom,
      area: areaHa,
      perimeter: perimeterKm,
      analysis,
      rawCoordinates: updatedCoords,
    };

    onZoneUpdated(updatedZone);
  };

  // Clear all drawing and current zone
  const handleClearAll = () => {
    setDrawingPoints([]);
    setRectStart(null);
    setCircleCenter(null);
    setDrawingTool("none");
    if (activeZone) {
      onZoneDeleted();
    }
  };

  // Preview coordinates for in-progress polygon
  const previewPolygonCoords: [number, number][] = useMemo(() => {
    if (drawingTool === "polygon" && drawingPoints.length > 0 && tempMousePos) {
      return [...drawingPoints, tempMousePos];
    }
    return [];
  }, [drawingTool, drawingPoints, tempMousePos]);

  // Preview coordinates for in-progress rectangle
  const previewRectCoords: [number, number][] = useMemo(() => {
    if (drawingTool === "rectangle" && rectStart && tempMousePos) {
      return [
        [rectStart[0], rectStart[1]],
        [rectStart[0], tempMousePos[1]],
        [tempMousePos[0], tempMousePos[1]],
        [tempMousePos[0], rectStart[1]],
      ];
    }
    return [];
  }, [drawingTool, rectStart, tempMousePos]);

  // Preview coordinates for in-progress circle
  const previewCircleCoords: [number, number][] = useMemo(() => {
    if (drawingTool === "circle" && circleCenter && tempMousePos) {
      const radiusMeters = computeHaversineDistance(circleCenter, tempMousePos);
      return generateCirclePolygon(circleCenter, Math.max(30, radiusMeters), 32);
    }
    return [];
  }, [drawingTool, circleCenter, tempMousePos]);

  // Center of India / NCR Greater Noida
  const defaultCenter: [number, number] = [28.32, 77.54];

  return (
    <div className="relative w-full h-[580px] lg:h-[calc(100vh-10.5rem)] min-h-[500px] max-h-[680px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-md">
      {/* ─── Top Floating Drawing Toolbar (Top Left) ─── */}
      <div className="absolute top-4 left-4 z-[1000] flex items-center gap-1.5 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-1.5 shadow-[0_8px_24px_-4px_rgba(11,43,80,0.12),0_2px_6px_-1px_rgba(11,43,80,0.06)] max-w-[calc(100%-32px)] transition-all">
        {/* Drawing Tools Segmented Group */}
        <div className="bg-slate-100/90 p-0.5 rounded-xl flex items-center gap-0.5">
          {/* Draw Polygon */}
          <button
            type="button"
            onClick={() => {
              setDrawingPoints([]);
              setRectStart(null);
              setCircleCenter(null);
              setDrawingTool(drawingTool === "polygon" ? "none" : "polygon");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              drawingTool === "polygon"
                ? "bg-[#0b2b50] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
            }`}
            title="Draw Polygon: Click vertices, double-click to finish"
          >
            <Pentagon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Polygon</span>
          </button>

          {/* Draw Rectangle */}
          <button
            type="button"
            onClick={() => {
              setDrawingPoints([]);
              setRectStart(null);
              setCircleCenter(null);
              setDrawingTool(drawingTool === "rectangle" ? "none" : "rectangle");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              drawingTool === "rectangle"
                ? "bg-[#0b2b50] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
            }`}
            title="Draw Rectangle: Click opposite corners"
          >
            <Square className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Rectangle</span>
          </button>

          {/* Draw Circle */}
          <button
            type="button"
            onClick={() => {
              setDrawingPoints([]);
              setRectStart(null);
              setCircleCenter(null);
              setDrawingTool(drawingTool === "circle" ? "none" : "circle");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              drawingTool === "circle"
                ? "bg-[#0b2b50] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
            }`}
            title="Draw Circle: Click center then radius"
          >
            <Circle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Circle</span>
          </button>
        </div>

        <div className="h-5 w-px bg-slate-200/90 mx-0.5" />

        {/* Upload Proposal */}
        <button
          type="button"
          onClick={onOpenUpload}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-[#0b2b50] transition-all cursor-pointer"
          title="Upload Proposal: Import GeoJSON file"
        >
          <Upload className="w-3.5 h-3.5 text-[#0b2b50]" />
          <span className="hidden md:inline">Upload</span>
        </button>

        {/* AI Find Location */}
        <button
          type="button"
          onClick={onOpenAiSite}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-900 bg-gradient-to-r from-amber-50 to-amber-100/90 hover:from-amber-100 hover:to-amber-200/90 border border-amber-300/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
          title="AI Site Selection: Search candidate areas"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span className="hidden md:inline">AI Find</span>
        </button>

        <div className="h-5 w-px bg-slate-200/90 mx-0.5" />

        {/* Edit Shape */}
        <button
          type="button"
          disabled={!activeZone}
          onClick={() => setDrawingTool(drawingTool === "edit" ? "none" : "edit")}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
            drawingTool === "edit"
              ? "bg-amber-600 text-white shadow-xs"
              : "text-slate-700 hover:bg-slate-100"
          }`}
          title={activeZone ? "Edit Shape: Drag vertex handles" : "No active shape to edit"}
        >
          <Pencil className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Edit</span>
        </button>

        {/* Delete Shape */}
        <button
          type="button"
          disabled={!activeZone}
          onClick={() => {
            onZoneDeleted();
            setDrawingTool("none");
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          title="Delete active shape"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Delete</span>
        </button>

        {/* Clear All */}
        <button
          type="button"
          onClick={handleClearAll}
          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          title="Clear all drawings"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ─── Sub-Toolbar Row: Map Layers & District Focus Pill (Under Toolbar, Below Polygon) ─── */}
      <div className="absolute top-[4.25rem] left-4 z-[1000] flex items-center gap-2 flex-wrap">
        {/* Map Layers Control Button & Popover */}
        <div ref={layersRef} className="relative">
          <button
            type="button"
            onClick={() => setLayersOpen(!layersOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer border ${
              layersOpen
                ? "bg-[#0b2b50] text-white border-[#0b2b50]"
                : "bg-white/95 backdrop-blur-xl text-slate-800 border-slate-200 hover:bg-white hover:border-slate-300"
            }`}
          >
            <Layers className={`w-3.5 h-3.5 ${layersOpen ? "text-amber-400" : "text-[#0b2b50]"}`} />
            <span>Map Layers</span>
            <span
              className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full flex items-center gap-1 ${
                layersOpen
                  ? "bg-white/20 text-white"
                  : "bg-blue-50 text-blue-800 border border-blue-200/80"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {Object.values(activeLayers).filter(Boolean).length} Active
            </span>
          </button>

          {/* Layers Popover Menu (Aligned Left below the button) */}
          {layersOpen && (
            <div className="absolute left-0 top-full mt-2 w-84 bg-white/98 backdrop-blur-2xl border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden text-xs z-[1050] animate-in fade-in zoom-in-95 duration-150">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#0b2b50] to-[#153a69] text-white p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                    <Layers className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <div className="font-bold text-xs tracking-wide">Spatial Intelligence Layers</div>
                    <div className="text-[10px] text-blue-200/80">BLIN National SDI Platform</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setLayersOpen(false)}
                  className="text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                  title="Close layers panel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Basemap Switcher Segment */}
              <div className="p-3 border-b border-slate-100 bg-slate-50/70">
                <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                  Base Canvas Layer
                </div>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-200/60 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      if (activeLayers.satellite) {
                        handleToggleLayer("satellite", true);
                      }
                    }}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      !activeLayers.satellite
                        ? "bg-white text-[#0b2b50] shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    <span>OpenStreetMap</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!activeLayers.satellite) {
                        handleToggleLayer("satellite", true);
                      }
                    }}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeLayers.satellite
                        ? "bg-white text-[#0b2b50] shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-600" />
                    <span>Satellite (ESRI)</span>
                  </button>
                </div>
              </div>

              {/* Thematic Layers List */}
              <div className="p-3 space-y-2 max-h-[340px] overflow-y-auto">
                <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                  Thematic Overlays
                </div>
                {layersList
                  .filter((l) => l.id !== "satellite")
                  .map((layer) => {
                    const isChecked = activeLayers[layer.id];
                    return (
                      <div
                        key={layer.id}
                        onClick={() => handleToggleLayer(layer.id, layer.connected)}
                        className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                          layer.connected
                            ? "cursor-pointer hover:bg-slate-50/80 " +
                              (isChecked
                                ? "border-blue-300 bg-blue-50/30"
                                : "border-slate-200/90 bg-white")
                            : "border-slate-100 bg-slate-50/50 opacity-55 cursor-not-allowed"
                        }`}
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <span
                            className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${layer.color} ring-2 ring-white shadow-xs`}
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-slate-800 text-xs truncate">
                              {layer.label}
                            </div>
                            <div className="text-[11px] text-slate-500 leading-snug">
                              {layer.desc}
                            </div>
                          </div>
                        </div>

                        {/* Toggle switch or Status */}
                        <div className="shrink-0 flex items-center gap-1.5">
                          {layer.connected ? (
                            <div
                              className={`w-8 h-4.5 rounded-full p-0.5 transition-colors flex items-center ${
                                isChecked ? "bg-[#0b2b50]" : "bg-slate-300"
                              }`}
                            >
                              <div
                                className={`w-3.5 h-3.5 rounded-full bg-white shadow-xs transition-transform ${
                                  isChecked ? "translate-x-3.5" : "translate-x-0"
                                }`}
                              />
                            </div>
                          ) : (
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
                              Phase 2
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Footer */}
              <div className="px-3.5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Info className="w-3 h-3 text-blue-600 shrink-0" />
                  <span>EPSG:4326 (WGS84) Cadastral Grid</span>
                </div>
                <span className="font-semibold text-slate-600">OpenStreetMap &copy;</span>
              </div>
            </div>
          )}
        </div>

        {/* Floating District Focus Pill (Next to Map Layers in same row) */}
        {selectedDistrictBoundary && (
          <div className="flex items-center gap-2 bg-[#0b2b50]/95 backdrop-blur-md text-white px-3 py-1.5 rounded-xl shadow-md border border-white/20 text-xs animate-in fade-in slide-in-from-left-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <div className="flex items-center gap-1.5 font-bold">
              <span>{selectedDistrictBoundary.district} District</span>
              <span className="text-white/40">•</span>
              <span className="text-amber-300 font-semibold">{selectedDistrictBoundary.state}</span>
            </div>

            {selectedDistrictBoundary.censusCode && selectedDistrictBoundary.censusCode > 0 && (
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold">
                Census #{selectedDistrictBoundary.censusCode}
              </span>
            )}

            <a
              href="https://github.com/yashveeeeeeer/india-geodata/tree/main/data/administrative/districts/census-2011"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border border-blue-400/30 px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors hidden md:inline-flex items-center gap-1"
              title="Sourced from GitHub yashveeeeeeer/india-geodata Census 2011 Official Shapefile"
            >
              <span>GitHub Dataset</span>
              <span className="text-[9px] text-blue-300">↗</span>
            </a>

            {selectedDistrictMetadata && (
              <span className="bg-white/15 px-1.5 py-0.5 rounded text-[10px] text-slate-200 font-mono hidden lg:inline">
                {selectedDistrictMetadata.record_type}
              </span>
            )}

            {onClearDistrict && (
              <button
                type="button"
                onClick={onClearDistrict}
                className="ml-1 p-0.5 rounded hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer transition-colors"
                title="Show All India (Clear Filter)"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Boundary Loading Indicator */}
        {isLoadingDistrictBoundary && (
          <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl shadow-md border border-slate-700 text-xs animate-in fade-in">
            <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>Fetching live boundary for {selectedDistrictMetadata?.name || "district"}...</span>
          </div>
        )}
      </div>

      {/* ─── Active Drawing Status & Finish Helper Pill ─── */}
      {drawingTool === "polygon" && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-slate-900/90 text-white backdrop-blur-md px-4 py-2.5 rounded-full text-xs font-semibold shadow-xl flex items-center gap-3 border border-slate-700">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <span>
            {drawingPoints.length === 0
              ? "Click on the map to place the first boundary vertex"
              : `Placing point ${drawingPoints.length + 1} • Click first point or Finish to complete shape`}
          </span>
          {drawingPoints.length >= 3 && (
            <button
              type="button"
              onClick={() => handleFinishDrawing(drawingPoints)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer ml-1"
            >
              <Check className="w-3.5 h-3.5" /> Finish Zone
            </button>
          )}
        </div>
      )}

      {drawingTool === "rectangle" && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-slate-900/90 text-white backdrop-blur-md px-4 py-2 rounded-full text-xs font-semibold shadow-xl flex items-center gap-2 border border-slate-700">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
          <span>
            {!rectStart
              ? "Click top-left corner on the map to anchor rectangle"
              : "Move mouse and click opposite corner to finish rectangle"}
          </span>
        </div>
      )}

      {drawingTool === "circle" && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-slate-900/90 text-white backdrop-blur-md px-4 py-2 rounded-full text-xs font-semibold shadow-xl flex items-center gap-2 border border-slate-700">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
          <span>
            {!circleCenter
              ? "Click center location for proposed circular zone"
              : "Move mouse outward and click to set zone radius"}
          </span>
        </div>
      )}

      {drawingTool === "edit" && activeZone && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-amber-950/90 text-amber-100 backdrop-blur-md px-4 py-2 rounded-full text-xs font-semibold shadow-xl flex items-center gap-2 border border-amber-800">
          <Pencil className="w-3.5 h-3.5 text-amber-400" />
          <span>Drag yellow/white circular handles on the boundary to adjust area</span>
          <button
            type="button"
            onClick={() => setDrawingTool("none")}
            className="ml-2 bg-amber-600 hover:bg-amber-500 text-white px-2.5 py-0.5 rounded-full text-[11px] font-medium cursor-pointer"
          >
            Done Editing
          </button>
        </div>
      )}

      {/* ─── Leaflet Map Container ─── */}
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        zoomControl={false}
        className="w-full h-full"
        style={{ background: "#e2e8f0" }}
      >
        {/* Basemap Switcher */}
        {activeLayers.satellite ? (
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>, Maxar, Earthstar Geographics'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={19}
          />
        ) : (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
        )}

        {/* ─── DYNAMIC DISTRICT FOCUS LAYERS (Fetched Live via API) ─── */}
        {selectedDistrictBoundary && (
          <>
            {/* 1. Inverted Mask: Dims everything outside the district (only when not inspecting AI candidates) */}
            {(!candidateZones || candidateZones.length === 0) && (
              <Polygon
                positions={generateInvertedDistrictMask(selectedDistrictBoundary.boundary)}
                pathOptions={{
                  fillColor: "#020617",
                  fillOpacity: 0.38,
                  stroke: false,
                  interactive: false,
                }}
              />
            )}

            {/* 2. Official Cadastral District Boundary Outline */}
            <Polygon
              positions={selectedDistrictBoundary.boundary}
              pathOptions={{
                color: "#0b2b50",
                weight: 2.5,
                dashArray: "6, 6",
                fillColor: "#3b82f6",
                fillOpacity: 0.04,
                interactive: true,
              }}
            >
              <Tooltip sticky direction="top" opacity={0.95}>
                <div className="text-xs p-1 space-y-0.5">
                  <div className="font-bold text-slate-900">
                    {selectedDistrictBoundary.district} District
                  </div>
                  <div className="text-[11px] text-slate-600">
                    State: {selectedDistrictBoundary.state}
                  </div>
                  {selectedDistrictBoundary.censusCode && selectedDistrictBoundary.censusCode > 0 && (
                    <div className="text-[10px] font-mono text-amber-800 font-semibold">
                      Census 2011 Code: #{selectedDistrictBoundary.censusCode} (State: {selectedDistrictBoundary.stateCensusCode}, Dist: {selectedDistrictBoundary.districtCensusCode})
                    </div>
                  )}
                  <div className="text-[9px] text-blue-700 font-mono pt-0.5 border-t border-slate-200 mt-1">
                    Source: yashveeeeeeer/india-geodata (GitHub)
                  </div>
                </div>
              </Tooltip>
            </Polygon>
          </>
        )}

        {/* Existing Land-Use Context Layers (Demo Visual Context) */}
        {activeLayers.landUse && (
          <>
            {/* Agricultural Buffer polygon */}
            <Polygon
              positions={[
                [28.34, 77.51],
                [28.345, 77.535],
                [28.33, 77.545],
                [28.32, 77.52],
              ]}
              pathOptions={{
                color: "#10b981",
                fillColor: "#10b981",
                fillOpacity: 0.15,
                weight: 1.5,
                dashArray: "4 4",
              }}
            >
              <Tooltip sticky>
                <div className="text-xs font-semibold text-emerald-900">
                  Existing Agricultural Zone (UP Revenue Code 2006)
                </div>
              </Tooltip>
            </Polygon>

            {/* Built-up corridor polygon */}
            <Polygon
              positions={[
                [28.31, 77.55],
                [28.318, 77.57],
                [28.305, 77.578],
                [28.298, 77.555],
              ]}
              pathOptions={{
                color: "#64748b",
                fillColor: "#64748b",
                fillOpacity: 0.15,
                weight: 1.5,
              }}
            >
              <Tooltip sticky>
                <div className="text-xs font-semibold text-slate-800">
                  Peri-Urban Settlement & Commercial Cluster
                </div>
              </Tooltip>
            </Polygon>
          </>
        )}

        {/* ─── Render AI Candidate Locations (If in AI Selection Mode) ─── */}
        {candidateZones && candidateZones.length > 0
          ? candidateZones.map((cand) => {
            const isSelected = cand.candidate_id === selectedCandidateId;
            return (
              <Polygon
                key={cand.candidate_id}
                positions={cand.rawCoordinates}
                eventHandlers={{
                  click: () => {
                    if (onSelectCandidate) onSelectCandidate(cand.candidate_id);
                  },
                }}
                pathOptions={
                  isSelected
                    ? {
                      color: "#0b2b50",
                      fillColor: "#f59e0b",
                      fillOpacity: 0.35,
                      weight: 3.5,
                      opacity: 1,
                    }
                    : {
                      color: "#d97706",
                      fillColor: "#fbbf24",
                      fillOpacity: 0.18,
                      weight: 2,
                      dashArray: "5 5",
                      opacity: 0.85,
                    }
                }
              >
                <Tooltip sticky>
                  <div className="text-xs p-0.5">
                    <div className="font-semibold text-[#0b2b50]">
                      {cand.label}: {cand.name.split(" - ")[1] || cand.name}
                    </div>
                    <div className="text-[10px] text-slate-600">
                      Area: {cand.areaAcres} acres • Suitability: <strong>{cand.suitability_score}/100</strong>
                    </div>
                    <div className="text-[9px] text-amber-700 font-semibold pt-0.5">
                      High relative suitability under current criteria
                    </div>
                  </div>
                </Tooltip>
              </Polygon>
            );
          })
          : allZones && allZones.length > 0 ? (
            allZones.map((zone) => {
              const isActive = activeZone?.zone_id === zone.zone_id;
              return (
                <React.Fragment key={zone.zone_id}>
                  <Polygon
                    positions={zone.rawCoordinates}
                    eventHandlers={{
                      click: () => {
                        if (onSelectZone) onSelectZone(zone.zone_id);
                      },
                    }}
                    pathOptions={
                      isActive
                        ? {
                          color: "#0b2b50",
                          fillColor: "#2563eb",
                          fillOpacity: 0.28,
                          weight: 3,
                          opacity: 1,
                        }
                        : {
                          color: "#64748b",
                          fillColor: "#94a3b8",
                          fillOpacity: 0.18,
                          weight: 2,
                          dashArray: "4 4",
                          opacity: 0.85,
                        }
                    }
                  >
                    <Popup>
                      <div className="p-1 space-y-1 text-xs">
                        <div className="font-semibold text-[#0b2b50]">{zone.name}</div>
                        <div className="text-[11px] text-slate-600">
                          Type: <span className="font-bold">{zone.zone_type}</span>
                        </div>
                        <div className="text-[11px] text-slate-600">
                          Area: <span className="font-bold">{zone.area} Hectares</span>
                        </div>
                        <div className="text-[11px] text-slate-600">
                          Perimeter: <span className="font-bold">{zone.perimeter} km</span>
                        </div>
                        {!isActive && (
                          <div className="text-[10px] text-[#0b2b50] font-bold pt-1">
                            Click to select & inspect
                          </div>
                        )}
                      </div>
                    </Popup>
                  </Polygon>

                  {/* Edit Handles only for the active zone */}
                  {isActive &&
                    drawingTool === "edit" &&
                    zone.rawCoordinates.map((pos, idx) => (
                      <Marker
                        key={`handle-${zone.zone_id}-${idx}`}
                        position={pos}
                        draggable={true}
                        icon={createVertexHandleIcon(idx === 0)}
                        eventHandlers={{
                          drag: (e) => handleVertexDrag(idx, e),
                        }}
                      >
                        <Tooltip permanent={false} direction="top" offset={[0, -10]}>
                          <span className="text-[10px] font-medium">Vertex #{idx + 1} (Drag to edit)</span>
                        </Tooltip>
                      </Marker>
                    ))}
                </React.Fragment>
              );
            })
          ) : activeZone && activeZone.rawCoordinates.length >= 3 ? (
            <>
              <Polygon
                positions={activeZone.rawCoordinates}
                pathOptions={{
                  color: "#0b2b50",
                  fillColor: "#2563eb",
                  fillOpacity: 0.28,
                  weight: 3,
                  opacity: 1,
                }}
              >
                <Popup>
                  <div className="p-1 space-y-1 text-xs">
                    <div className="font-semibold text-[#0b2b50]">{activeZone.name}</div>
                    <div className="text-[11px] text-slate-600">
                      Type: <span className="font-bold">{activeZone.zone_type}</span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Area: <span className="font-bold">{activeZone.area} Hectares</span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Perimeter: <span className="font-bold">{activeZone.perimeter} km</span>
                    </div>
                  </div>
                </Popup>
              </Polygon>

              {/* Draggable Vertex Handles in Edit Mode */}
              {drawingTool === "edit" &&
                activeZone.rawCoordinates.map((pos, idx) => (
                  <Marker
                    key={`handle-${idx}`}
                    position={pos}
                    draggable={true}
                    icon={createVertexHandleIcon(idx === 0)}
                    eventHandlers={{
                      drag: (e) => handleVertexDrag(idx, e),
                    }}
                  >
                    <Tooltip permanent={false} direction="top" offset={[0, -10]}>
                      <span className="text-[10px] font-medium">Vertex #{idx + 1} (Drag to edit)</span>
                    </Tooltip>
                  </Marker>
                ))}
            </>
          ) : null}

        {/* ─── In-Progress Drawing Previews ─── */}
        {/* Polygon in-progress */}
        {drawingTool === "polygon" && drawingPoints.length > 0 && (
          <>
            <Polyline
              positions={drawingPoints}
              pathOptions={{ color: "#0b2b50", weight: 2.5 }}
            />
            {previewPolygonCoords.length > 1 && (
              <Polygon
                positions={previewPolygonCoords}
                pathOptions={{
                  color: "#d97706",
                  fillColor: "#fbbf24",
                  fillOpacity: 0.2,
                  weight: 2,
                  dashArray: "6 6",
                }}
              />
            )}
            {drawingPoints.map((pt, idx) => (
              <CircleMarker
                key={`draw-pt-${idx}`}
                center={pt}
                radius={idx === 0 ? 7 : 5}
                pathOptions={{
                  color: "#0b2b50",
                  fillColor: idx === 0 ? "#f59e0b" : "#ffffff",
                  fillOpacity: 1,
                  weight: 2,
                }}
              />
            ))}
          </>
        )}

        {/* Rectangle in-progress */}
        {drawingTool === "rectangle" && previewRectCoords.length === 4 && (
          <Polygon
            positions={previewRectCoords}
            pathOptions={{
              color: "#2563eb",
              fillColor: "#60a5fa",
              fillOpacity: 0.25,
              weight: 2,
              dashArray: "5 5",
            }}
          />
        )}

        {/* Circle in-progress */}
        {drawingTool === "circle" && previewCircleCoords.length > 2 && (
          <Polygon
            positions={previewCircleCoords}
            pathOptions={{
              color: "#7c3aed",
              fillColor: "#a78bfa",
              fillOpacity: 0.25,
              weight: 2,
              dashArray: "5 5",
            }}
          />
        )}

        {/* Event engine */}
        <DrawingHandler
          drawingTool={drawingTool}
          setDrawingTool={setDrawingTool}
          drawingPoints={drawingPoints}
          setDrawingPoints={setDrawingPoints}
          tempMousePos={tempMousePos}
          setTempMousePos={setTempMousePos}
          rectStart={rectStart}
          setRectStart={setRectStart}
          circleCenter={circleCenter}
          setCircleCenter={setCircleCenter}
          onFinishDrawing={handleFinishDrawing}
          activeZone={activeZone}
        />

        {/* Zoom to fit bounds when a zone is loaded or drawn or district selected */}
        <BoundsFitter
          activeZone={activeZone}
          allZones={allZones}
          candidateZones={candidateZones}
          selectedCandidateId={selectedCandidateId}
          selectedDistrictBoundary={selectedDistrictBoundary}
        />
      </MapContainer>

      {/* ─── Map Coordinates & Scale Footer Readout ─── */}
      <div className="absolute bottom-2 right-2 z-[990] bg-white/90 backdrop-blur-xs border border-slate-200 px-3 py-1 rounded-lg text-[10px] text-slate-500 font-mono shadow-xs flex items-center gap-3">
        <span>EPSG:4326 (WGS84)</span>
        <span className="h-3 w-px bg-slate-200" />
        <span>DoLR / Bhu-Aadhaar Spatial Node</span>
      </div>
    </div>
  );
}
