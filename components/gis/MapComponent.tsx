"use client";

import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  Polygon,
  FeatureGroup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { AlertTriangle, TrendingUp, Info } from "lucide-react";

// Fix Leaflet's default icon issue with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapComponentProps {
  activeLayers: string[];
  isPredictorActive: boolean;
  timePeriod: number;
}

const NEW_DELHI_CENTER: [number, number] = [28.6139, 77.209];

const CARTO_API_KEY = "cb1_3mee_1_f30f15bf5fbf414a09921b6c";

export default function MapComponent({
  activeLayers,
  isPredictorActive,
  timePeriod,
}: MapComponentProps) {
  // Simulated data for demo purposes
  const disputeHotspots: [number, number][] = [
    [28.625, 77.215],
    [28.61, 77.2],
    [28.63, 77.22],
  ];

  const predictedHotspots: [number, number][] = [
    [28.64, 77.23],
    [28.59, 77.19],
  ];

  const landUsePolygon: [number, number][] = [
    [28.615, 77.205],
    [28.615, 77.215],
    [28.605, 77.215],
    [28.605, 77.205],
  ];

  const infrastructurePolygon: [number, number][] = [
    [28.635, 77.195],
    [28.635, 77.205],
    [28.625, 77.205],
    [28.625, 77.195],
  ];

  return (
    <div className="h-[600px] w-full rounded-xl overflow-hidden border border-slate-300 shadow-sm relative z-0">
      <MapContainer
        center={NEW_DELHI_CENTER}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        {/* Base Map: CARTO Basemaps with API key */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={
            timePeriod < 2024
              ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              : `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${CARTO_API_KEY}`
          }
          subdomains="abcd"
          maxZoom={20}
        />

        {/* Land Use Layer */}
        {activeLayers.includes("landUse") && (
          <FeatureGroup>
            <Polygon
              positions={landUsePolygon}
              pathOptions={{ color: "#10b981", fillColor: "#10b981", fillOpacity: 0.4 }}
            >
              <Popup>
                <strong>Agricultural Zone</strong>
                <br />
                Verified land records available.
              </Popup>
            </Polygon>
          </FeatureGroup>
        )}

        {/* Infrastructure Layer */}
        {activeLayers.includes("infrastructure") && (
          <FeatureGroup>
            <Polygon
              positions={infrastructurePolygon}
              pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.4 }}
            >
              <Popup>
                <strong>Proposed Highway</strong>
                <br />
                Development planned for Q4 2024.
              </Popup>
            </Polygon>
          </FeatureGroup>
        )}

        {/* Climate Risk Layer (Simulated via overlay) */}
        {activeLayers.includes("climateRisk") && (
          <FeatureGroup>
            <CircleMarker
              center={[28.62, 77.21]}
              pathOptions={{ color: "transparent", fillColor: "#f59e0b", fillOpacity: 0.3 }}
              radius={100}
            >
              <Popup>
                <strong>Moderate Flood Risk</strong>
                <br />
                Area prone to waterlogging.
              </Popup>
            </CircleMarker>
          </FeatureGroup>
        )}

        {/* Disputes Layer */}
        {activeLayers.includes("disputes") && (
          <FeatureGroup>
            {disputeHotspots.map((pos, idx) => (
              <Marker key={idx} position={pos}>
                <Popup>
                  <strong>Active Dispute</strong>
                  <br />
                  Case #D-{idx + 1023} under review.
                </Popup>
              </Marker>
            ))}
          </FeatureGroup>
        )}

        {/* Dispute Hotspot Predictor */}
        {isPredictorActive && (
          <FeatureGroup>
            {predictedHotspots.map((pos, idx) => (
              <CircleMarker
                key={idx}
                center={pos}
                pathOptions={{ color: "#ef4444", fillColor: "#ef4444", fillOpacity: 0.6 }}
                radius={25}
              >
                <Popup>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-red-600 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" /> High Risk Zone
                    </span>
                    <span className="text-xs">84% probability of future land conflict based on rapid urbanization model.</span>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </FeatureGroup>
        )}
      </MapContainer>
      
      {/* Time Period Overlay indicator */}
      {timePeriod < 2024 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-slate-900/80 text-white px-4 py-2 rounded-full text-xs font-bold shadow-md flex items-center gap-2 backdrop-blur-sm">
          <Info className="w-4 h-4 text-blue-400" />
          Viewing Historical Data ({timePeriod})
        </div>
      )}
    </div>
  );
}
