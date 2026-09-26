// ────────────────────────────────────────────────────────────────────
// GeoJSON Parsing & Validation Engine (Phase 1 Upload Feature)
// Validates file integrity, enforces geometry constraints (Polygon/MultiPolygon),
// and transforms coordinates into BLIN Normalized Proposed Zones.
// ────────────────────────────────────────────────────────────────────

import {
  computePolygonAreaSqMeters,
  computePerimeterKm,
  sqMetersToHectares,
  computeBoundingBox,
  detectDistrictAndState,
  ZoneType,
  GeoJSONPolygonGeometry,
  coordsToGeoJSONPolygon,
} from "./policy-planning-types";

export interface ParsedZoneFeature {
  id: string;
  name: string;
  suggestedZoneType: ZoneType;
  geometryType: "Polygon" | "MultiPolygon";
  rawCoordinates: [number, number][]; // Primary outer boundary [lat, lng][]
  allPolygons?: [number, number][][]; // MultiPolygon components if applicable
  geoJsonGeometry: GeoJSONPolygonGeometry;
  areaHa: number;
  perimeterKm: number;
  properties: Record<string, any>;
  district: string;
  state: string;
  boundingBox: [[number, number], [number, number]];
}

export interface GeoJSONParseResult {
  success: boolean;
  error?: string;
  fileName: string;
  fileSizeBytes: number;
  features: ParsedZoneFeature[];
  rawGeoJSON?: any;
}

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB

/**
 * Validates and parses an uploaded GeoJSON file string.
 */
export function parseAndValidateGeoJSON(
  fileContent: string,
  fileName: string,
  fileSizeBytes: number
): GeoJSONParseResult {
  // 1. File size check
  if (fileSizeBytes > MAX_FILE_SIZE_BYTES) {
    return {
      success: false,
      error: "File size exceeds the 20 MB limit. Please optimize or simplify the boundary geometry.",
      fileName,
      fileSizeBytes,
      features: [],
    };
  }

  // 2. File extension check
  const lowerName = fileName.toLowerCase();
  if (!lowerName.endsWith(".geojson") && !lowerName.endsWith(".json")) {
    return {
      success: false,
      error: "Unsupported file format. Please upload a valid GeoJSON (.geojson or .json) file.",
      fileName,
      fileSizeBytes,
      features: [],
    };
  }

  // 3. JSON parse check
  let parsed: any;
  try {
    parsed = JSON.parse(fileContent);
  } catch {
    return {
      success: false,
      error: "The uploaded file could not be read. Please upload a valid, uncorrupted GeoJSON file.",
      fileName,
      fileSizeBytes,
      features: [],
    };
  }

  if (!parsed || typeof parsed !== "object") {
    return {
      success: false,
      error: "Invalid GeoJSON file structure.",
      fileName,
      fileSizeBytes,
      features: [],
    };
  }

  // 4. Extract raw features
  const rawFeatures: any[] = [];
  const type = parsed.type;

  if (type === "FeatureCollection") {
    if (!Array.isArray(parsed.features)) {
      return {
        success: false,
        error: "Invalid FeatureCollection: missing 'features' array.",
        fileName,
        fileSizeBytes,
        features: [],
      };
    }
    rawFeatures.push(...parsed.features);
  } else if (type === "Feature") {
    rawFeatures.push(parsed);
  } else if (type === "Polygon" || type === "MultiPolygon") {
    // Bare geometry object
    rawFeatures.push({
      type: "Feature",
      geometry: parsed,
      properties: {},
    });
  } else if (
    type === "Point" ||
    type === "MultiPoint" ||
    type === "LineString" ||
    type === "MultiLineString"
  ) {
    return {
      success: false,
      error: `This file contains unsupported geometry (${type}). Only Polygon and MultiPolygon boundaries can be used for Policy Zone Planning.`,
      fileName,
      fileSizeBytes,
      features: [],
    };
  } else {
    return {
      success: false,
      error: "Invalid GeoJSON file. Expected a FeatureCollection, Feature, or Polygon geometry.",
      fileName,
      fileSizeBytes,
      features: [],
    };
  }

  if (rawFeatures.length === 0) {
    return {
      success: false,
      error: "The uploaded GeoJSON file does not contain any features.",
      fileName,
      fileSizeBytes,
      features: [],
    };
  }

  // 5. Parse each feature and filter for Polygon / MultiPolygon
  const parsedFeatures: ParsedZoneFeature[] = [];
  let unsupportedCount = 0;

  for (let i = 0; i < rawFeatures.length; i++) {
    const feat = rawFeatures[i];
    if (!feat || !feat.geometry) {
      continue;
    }

    const geom = feat.geometry;
    const geomType = geom.type;

    if (geomType !== "Polygon" && geomType !== "MultiPolygon") {
      unsupportedCount++;
      continue;
    }

    const props = feat.properties && typeof feat.properties === "object" ? feat.properties : {};

    // Determine default name
    const propName =
      props.name ||
      props.zone_name ||
      props.ZoneName ||
      props.title ||
      props.Name ||
      props.ZONE_NAME ||
      props.id;

    const baseFileName = fileName.replace(/\.(geojson|json)$/i, "").replace(/[-_]/g, " ");
    const featureName =
      propName && typeof propName === "string"
        ? propName
        : rawFeatures.length > 1
        ? `${baseFileName} - Zone ${String(i + 1).padStart(2, "0")}`
        : baseFileName;

    // Detect zone type from properties if specified
    let detectedZoneType: ZoneType = "Industrial Zone";
    const typeStr = (props.zone_type || props.type || props.category || "").toLowerCase();
    if (typeStr.includes("resident")) detectedZoneType = "Residential Zone";
    else if (typeStr.includes("commerc")) detectedZoneType = "Commercial Zone";
    else if (typeStr.includes("logistic") || typeStr.includes("warehous"))
      detectedZoneType = "Logistics Park";
    else if (typeStr.includes("infra") || typeStr.includes("corridor") || typeStr.includes("road"))
      detectedZoneType = "Infrastructure Corridor";
    else if (typeStr.includes("sez") || typeStr.includes("special economic"))
      detectedZoneType = "Special Economic Zone";

    // Coordinate conversion: GeoJSON [lng, lat] -> Leaflet [lat, lng]
    if (geomType === "Polygon") {
      const rings = geom.coordinates;
      if (!Array.isArray(rings) || rings.length === 0) continue;
      const outerRing = rings[0];
      if (!Array.isArray(outerRing) || outerRing.length < 3) continue;

      const rawCoords: [number, number][] = outerRing
        .map((coord: any) => {
          if (!Array.isArray(coord) || coord.length < 2) return null;
          const lng = Number(coord[0]);
          const lat = Number(coord[1]);
          if (isNaN(lng) || isNaN(lat)) return null;
          return [lat, lng] as [number, number];
        })
        .filter((c: any): c is [number, number] => c !== null);

      if (rawCoords.length < 3) continue;

      const areaSqM = computePolygonAreaSqMeters(rawCoords);
      const areaHa = sqMetersToHectares(areaSqM);
      const perimeterKm = Number(computePerimeterKm(rawCoords).toFixed(2));
      const boundingBox = computeBoundingBox(rawCoords);

      const avgLat = rawCoords.reduce((acc, c) => acc + c[0], 0) / rawCoords.length;
      const avgLng = rawCoords.reduce((acc, c) => acc + c[1], 0) / rawCoords.length;
      const { district, state } = detectDistrictAndState(avgLat, avgLng);

      parsedFeatures.push({
        id: `ZONE-UPLOAD-${Date.now().toString().slice(-4)}-${i + 1}`,
        name: featureName,
        suggestedZoneType: detectedZoneType,
        geometryType: "Polygon",
        rawCoordinates: rawCoords,
        geoJsonGeometry: coordsToGeoJSONPolygon(rawCoords),
        areaHa,
        perimeterKm,
        properties: props,
        district,
        state,
        boundingBox,
      });
    } else if (geomType === "MultiPolygon") {
      const multiRings = geom.coordinates;
      if (!Array.isArray(multiRings) || multiRings.length === 0) continue;

      // Extract each polygon part as its own zone or combine
      for (let j = 0; j < multiRings.length; j++) {
        const polygonRings = multiRings[j];
        if (!Array.isArray(polygonRings) || polygonRings.length === 0) continue;
        const outerRing = polygonRings[0];
        if (!Array.isArray(outerRing) || outerRing.length < 3) continue;

        const rawCoords: [number, number][] = outerRing
          .map((coord: any) => {
            if (!Array.isArray(coord) || coord.length < 2) return null;
            const lng = Number(coord[0]);
            const lat = Number(coord[1]);
            if (isNaN(lng) || isNaN(lat)) return null;
            return [lat, lng] as [number, number];
          })
          .filter((c: any): c is [number, number] => c !== null);

        if (rawCoords.length < 3) continue;

        const areaSqM = computePolygonAreaSqMeters(rawCoords);
        const areaHa = sqMetersToHectares(areaSqM);
        const perimeterKm = Number(computePerimeterKm(rawCoords).toFixed(2));
        const boundingBox = computeBoundingBox(rawCoords);

        const avgLat = rawCoords.reduce((acc, c) => acc + c[0], 0) / rawCoords.length;
        const avgLng = rawCoords.reduce((acc, c) => acc + c[1], 0) / rawCoords.length;
        const { district, state } = detectDistrictAndState(avgLat, avgLng);

        parsedFeatures.push({
          id: `ZONE-UPLOAD-${Date.now().toString().slice(-4)}-${i + 1}-${j + 1}`,
          name: multiRings.length > 1 ? `${featureName} (Part ${j + 1})` : featureName,
          suggestedZoneType: detectedZoneType,
          geometryType: "MultiPolygon",
          rawCoordinates: rawCoords,
          geoJsonGeometry: coordsToGeoJSONPolygon(rawCoords),
          areaHa,
          perimeterKm,
          properties: props,
          district,
          state,
          boundingBox,
        });
      }
    }
  }

  if (parsedFeatures.length === 0) {
    if (unsupportedCount > 0) {
      return {
        success: false,
        error:
          "This file contains unsupported geometry (Point/LineString). Only Polygon and MultiPolygon boundaries are supported for zone planning.",
        fileName,
        fileSizeBytes,
        features: [],
      };
    }
    return {
      success: false,
      error: "No valid polygon geometry found in the uploaded file.",
      fileName,
      fileSizeBytes,
      features: [],
    };
  }

  return {
    success: true,
    fileName,
    fileSizeBytes,
    features: parsedFeatures,
    rawGeoJSON: parsed,
  };
}
