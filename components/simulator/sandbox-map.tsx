"use client";

import React, { useEffect, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { getRiskColor } from "@/lib/sandbox-model";

export const CARTO_API_KEY = "cb1_3mee_1_f30f15bf5fbf414a09921b6c";

// Fix Leaflet default icon issue in bundlers
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface SandboxMapProps {
  geoJsonData: GeoJSON.FeatureCollection | null;
  stateRiskMap: Record<string, number>;
  selectedState: string | null;
  onStateClick: (stateName: string) => void;
}

// Zooms map to selected state bounds
function MapUpdater({
  selectedState,
  geoJsonData,
}: {
  selectedState: string | null;
  geoJsonData: GeoJSON.FeatureCollection | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedState && geoJsonData) {
      const feature = geoJsonData.features.find(
        (f) => f.properties?.ST_NM === selectedState
      );
      if (feature) {
        const bounds = L.geoJSON(feature as GeoJSON.Feature).getBounds();
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 7 });
      }
    } else if (!selectedState) {
      // Reset to India view
      map.setView([22.5, 82], 5);
    }
  }, [selectedState, geoJsonData, map]);

  return null;
}

export default function SandboxMap({
  geoJsonData,
  stateRiskMap,
  selectedState,
  onStateClick,
}: SandboxMapProps) {
  const riskMapKey = useMemo(
    () => JSON.stringify(stateRiskMap) + (selectedState || ""),
    [stateRiskMap, selectedState]
  );

  const styleFeature = (feature: GeoJSON.Feature | undefined) => {
    if (!feature?.properties) return {};
    const stateName = feature.properties.ST_NM as string;
    const risk = stateRiskMap[stateName];
    const isSelected = stateName === selectedState;

    return {
      fillColor: getRiskColor(risk),
      fillOpacity: risk !== undefined ? 0.7 : 0.15,
      color: isSelected ? "#0b2b50" : "#94a3b8",
      weight: isSelected ? 3 : 1,
      opacity: 1,
    };
  };

  const onEachFeature = (feature: GeoJSON.Feature, layer: L.Layer) => {
    const stateName = feature.properties?.ST_NM as string;
    const risk = stateRiskMap[stateName];

    // Tooltip
    const riskText = risk !== undefined ? `Risk: ${risk.toFixed(1)}/10` : "No data";
    (layer as L.Path).bindTooltip(
      `<strong>${stateName}</strong><br/>${riskText}`,
      { sticky: true, className: "leaflet-tooltip-custom" }
    );

    // Click handler
    (layer as L.Path).on("click", () => {
      onStateClick(stateName);
    });

    // Hover
    (layer as L.Path).on("mouseover", () => {
      (layer as L.Path).setStyle({ fillOpacity: 0.85, weight: 2 });
    });
    (layer as L.Path).on("mouseout", () => {
      const isSelected = stateName === selectedState;
      (layer as L.Path).setStyle({
        fillOpacity: risk !== undefined ? 0.7 : 0.15,
        weight: isSelected ? 3 : 1,
      });
    });
  };

  return (
    <MapContainer
      center={[22.5, 82]}
      zoom={5}
      scrollWheelZoom={true}
      className="w-full h-full rounded-xl"
      style={{ background: "#ffffff" }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url={`https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png?key=${CARTO_API_KEY}`}
        subdomains="abcd"
        maxZoom={20}
      />
      {geoJsonData && (
        <GeoJSON
          key={riskMapKey}
          data={geoJsonData}
          style={styleFeature}
          onEachFeature={onEachFeature}
        />
      )}
      <MapUpdater selectedState={selectedState} geoJsonData={geoJsonData} />
    </MapContainer>
  );
}
