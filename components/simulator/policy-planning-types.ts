// ────────────────────────────────────────────────────────────────────
// Policy Planning Types & Spatial Math Architecture (Phase 1)
// Conforms to BLIN (Bhoomi Land Intelligence Network) GeoJSON standard
// ────────────────────────────────────────────────────────────────────

export type ZoneType =
  | "Industrial Zone"
  | "Residential Zone"
  | "Commercial Zone"
  | "Logistics Park"
  | "Infrastructure Corridor"
  | "Special Economic Zone"
  | "Custom";

export type DrawingTool = "polygon" | "rectangle" | "circle" | "edit" | "none";

export interface GeoJSONPolygonGeometry {
  type: "Polygon";
  coordinates: number[][][]; // GeoJSON standard: [ [ [lng, lat], ... ] ]
}

export interface ZoneAnalysisMetrics {
  affected_parcels: number;
  agricultural_area: number; // in hectares
  built_up_area: number; // in hectares
  forest_area: number; // in hectares
  water_area: number; // in hectares
  other_area: number; // in hectares
  agricultural_pct: number;
  built_up_pct: number;
  forest_pct: number;
  water_pct: number;
  other_pct: number;
  disputed_parcels: number;
  population_affected: number;
  acquisition_complexity: "Low" | "Medium" | "High";
  environmental_sensitivity: "Low" | "Medium" | "High";
  flood_exposure: "Low" | "Medium" | "High";
}

export type ZoneSource = "manual" | "upload" | "ai";

export interface ProposedZoneData {
  zone_id: string;
  source: ZoneSource;
  source_file?: string;
  zone_type: ZoneType;
  name: string;
  geometry: GeoJSONPolygonGeometry;
  properties?: Record<string, any>;
  area: number; // in hectares
  perimeter: number; // in kilometers
  state: string;
  district: string;
  analysis: ZoneAnalysisMetrics;
  rawCoordinates: [number, number][]; // [lat, lng][] array for Leaflet drawing
  allPolygons?: [number, number][][];
  createdAt: string;
  isBackendConnected?: boolean;
  isModified?: boolean;
  criteria?: Record<string, any>;
  evidence?: any[];
}

export interface MapLayerItem {
  id: string;
  label: string;
  desc: string;
  connected: boolean;
  statusText?: string;
  color: string;
  active: boolean;
}

// ─── Spatial Math Helpers ───

const EARTH_RADIUS_METERS = 6378137;

/**
 * Calculates spherical polygon area in square meters using Gauss's area formula on a sphere.
 * Coordinates are passed as [latitude, longitude] pairs.
 */
export function computePolygonAreaSqMeters(coords: [number, number][]): number {
  if (!coords || coords.length < 3) return 0;
  let total = 0;
  const len = coords.length;

  for (let i = 0; i < len; i++) {
    const p1 = coords[i];
    const p2 = coords[(i + 1) % len];
    const p1LatRad = (p1[0] * Math.PI) / 180;
    const p2LatRad = (p2[0] * Math.PI) / 180;
    const p1LngRad = (p1[1] * Math.PI) / 180;
    const p2LngRad = (p2[1] * Math.PI) / 180;

    total += (p2LngRad - p1LngRad) * (2 + Math.sin(p1LatRad) + Math.sin(p2LatRad));
  }

  const area = Math.abs((total * EARTH_RADIUS_METERS * EARTH_RADIUS_METERS) / 2);
  return area;
}

/**
 * Calculates Haversine distance in meters between two lat/lng coordinates.
 */
export function computeHaversineDistance(
  p1: [number, number],
  p2: [number, number]
): number {
  const dLat = ((p2[0] - p1[0]) * Math.PI) / 180;
  const dLng = ((p2[1] - p1[1]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1[0] * Math.PI) / 180) *
      Math.cos((p2[0] * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_METERS * c;
}

/**
 * Calculates the total perimeter of a polygon in kilometers.
 */
export function computePerimeterKm(coords: [number, number][]): number {
  if (!coords || coords.length < 2) return 0;
  let distMeters = 0;
  for (let i = 0; i < coords.length; i++) {
    const p1 = coords[i];
    const p2 = coords[(i + 1) % coords.length];
    distMeters += computeHaversineDistance(p1, p2);
  }
  return distMeters / 1000;
}

/**
 * Converts square meters to Hectares (1 Ha = 10,000 sq m)
 */
export function sqMetersToHectares(sqMeters: number): number {
  return Number((sqMeters / 10000).toFixed(2));
}

/**
 * Converts [lat, lng][] to GeoJSON coordinate array: [[[lng, lat], ... , [lng0, lat0]]]
 */
export function coordsToGeoJSONPolygon(coords: [number, number][]): GeoJSONPolygonGeometry {
  if (!coords || coords.length === 0) {
    return { type: "Polygon", coordinates: [] };
  }
  const ring = coords.map(([lat, lng]) => [Number(lng.toFixed(6)), Number(lat.toFixed(6))]);
  // Ensure closed ring
  if (
    ring.length > 0 &&
    (ring[0][0] !== ring[ring.length - 1][0] || ring[0][1] !== ring[ring.length - 1][1])
  ) {
    ring.push([ring[0][0], ring[0][1]]);
  }
  return {
    type: "Polygon",
    coordinates: [ring],
  };
}

/**
 * Generates an approximated regular polygon from a center and radius (meters).
 */
export function generateCirclePolygon(
  center: [number, number],
  radiusMeters: number,
  points: number = 36
): [number, number][] {
  const [centerLat, centerLng] = center;
  const coords: [number, number][] = [];
  const latRad = (centerLat * Math.PI) / 180;
  const earthRadius = 6378137;

  for (let i = 0; i < points; i++) {
    const angle = (i * 360) / points;
    const angleRad = (angle * Math.PI) / 180;

    const dLat = (radiusMeters * Math.cos(angleRad)) / earthRadius;
    const dLng = (radiusMeters * Math.sin(angleRad)) / (earthRadius * Math.cos(latRad));

    const lat = centerLat + (dLat * 180) / Math.PI;
    const lng = centerLng + (dLng * 180) / Math.PI;
    coords.push([lat, lng]);
  }

  return coords;
}

/**
 * Computes bounding box [[minLat, minLng], [maxLat, maxLng]]
 */
export function computeBoundingBox(coords: [number, number][]): [[number, number], [number, number]] {
  if (!coords || coords.length === 0) {
    return [[20, 77], [22, 79]];
  }
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;

  coords.forEach(([lat, lng]) => {
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
  });

  return [[minLat, minLng], [maxLat, maxLng]];
}

/**
 * Resolves approximate District & State from centroid coordinates.
 */
export function detectDistrictAndState(centerLat: number, centerLng: number): { district: string; state: string } {
  // NCR / Greater Noida / Yamuna Corridor
  if (centerLat >= 28.0 && centerLat <= 28.8 && centerLng >= 77.0 && centerLng <= 78.0) {
    return { district: "Gautam Buddha Nagar", state: "Uttar Pradesh" };
  }
  // Pune / Pimpri-Chinchwad / Chakan
  if (centerLat >= 18.2 && centerLat <= 19.1 && centerLng >= 73.5 && centerLng <= 74.3) {
    return { district: "Pune", state: "Maharashtra" };
  }
  // Bengaluru Urban / Rural
  if (centerLat >= 12.7 && centerLat <= 13.4 && centerLng >= 77.3 && centerLng <= 78.0) {
    return { district: "Bengaluru Urban", state: "Karnataka" };
  }
  // Lucknow
  if (centerLat >= 26.5 && centerLat <= 27.2 && centerLng >= 80.6 && centerLng <= 81.3) {
    return { district: "Lucknow", state: "Uttar Pradesh" };
  }
  // Jaipur
  if (centerLat >= 26.6 && centerLat <= 27.2 && centerLng >= 75.5 && centerLng <= 76.2) {
    return { district: "Jaipur", state: "Rajasthan" };
  }
  // Default to National Capital Region (Greater Noida / UP)
  return { district: "Gautam Buddha Nagar", state: "Uttar Pradesh" };
}

/**
 * Computes preliminary Prototype Estimates based on zone type and drawn area.
 * ALL values are explicitly labeled as Prototype Estimates until GIS layers are connected.
 */
export function computeZoneAnalysis(areaHectares: number, zoneType: ZoneType): ZoneAnalysisMetrics {
  const safeArea = Math.max(0.1, areaHectares);

  // Land use breakdown percentages per zone archetype
  let agriculturalPct = 62;
  let builtUpPct = 18;
  let forestPct = 7;
  let waterPct = 3;
  let otherPct = 10;

  switch (zoneType) {
    case "Industrial Zone":
      agriculturalPct = 62;
      builtUpPct = 18;
      forestPct = 7;
      waterPct = 3;
      otherPct = 10;
      break;
    case "Residential Zone":
      agriculturalPct = 48;
      builtUpPct = 32;
      forestPct = 6;
      waterPct = 4;
      otherPct = 10;
      break;
    case "Commercial Zone":
      agriculturalPct = 25;
      builtUpPct = 56;
      forestPct = 3;
      waterPct = 2;
      otherPct = 14;
      break;
    case "Logistics Park":
      agriculturalPct = 70;
      builtUpPct = 13;
      forestPct = 5;
      waterPct = 2;
      otherPct = 10;
      break;
    case "Infrastructure Corridor":
      agriculturalPct = 54;
      builtUpPct = 22;
      forestPct = 11;
      waterPct = 4;
      otherPct = 9;
      break;
    case "Special Economic Zone":
      agriculturalPct = 65;
      builtUpPct = 15;
      forestPct = 6;
      waterPct = 3;
      otherPct = 11;
      break;
    case "Custom":
      agriculturalPct = 50;
      builtUpPct = 25;
      forestPct = 10;
      waterPct = 5;
      otherPct = 10;
      break;
  }

  const agriculturalArea = Number(((safeArea * agriculturalPct) / 100).toFixed(1));
  const builtUpArea = Number(((safeArea * builtUpPct) / 100).toFixed(1));
  const forestArea = Number(((safeArea * forestPct) / 100).toFixed(1));
  const waterArea = Number(((safeArea * waterPct) / 100).toFixed(1));
  const otherArea = Number(
    Math.max(0, safeArea - (agriculturalArea + builtUpArea + forestArea + waterArea)).toFixed(1)
  );

  // Affected parcels estimate (~1.15 Hectares per average peri-urban cadastral parcel in India)
  const affectedParcels = Math.max(1, Math.round(safeArea / 1.15));

  // Disputed parcels estimate (~14% average title/boundary friction in peri-urban corridors)
  const disputedParcels = Math.max(0, Math.round(affectedParcels * 0.14));

  // Population potentially affected (~6.5 people/hectare for mixed agricultural/fringe land)
  const populationDensityFactor = zoneType === "Residential Zone" ? 14 : 6.5;
  const populationAffected = Math.round(safeArea * populationDensityFactor);

  // Neutral Risk Categorization (Low / Medium / High)
  let acquisitionComplexity: "Low" | "Medium" | "High" = "Low";
  if (affectedParcels > 300) {
    acquisitionComplexity = "High";
  } else if (affectedParcels > 80) {
    acquisitionComplexity = "Medium";
  }

  let environmentalSensitivity: "Low" | "Medium" | "High" = "Low";
  if (forestPct + waterPct > 13) {
    environmentalSensitivity = "High";
  } else if (forestPct + waterPct > 6) {
    environmentalSensitivity = "Medium";
  }

  let floodExposure: "Low" | "Medium" | "High" = "Low";
  if (waterPct > 4) {
    floodExposure = "High";
  } else if (waterPct >= 2) {
    floodExposure = "Medium";
  }

  return {
    affected_parcels: affectedParcels,
    agricultural_area: agriculturalArea,
    built_up_area: builtUpArea,
    forest_area: forestArea,
    water_area: waterArea,
    other_area: otherArea,
    agricultural_pct: agriculturalPct,
    built_up_pct: builtUpPct,
    forest_pct: forestPct,
    water_pct: waterPct,
    other_pct: otherPct,
    disputed_parcels: disputedParcels,
    population_affected: populationAffected,
    acquisition_complexity: acquisitionComplexity,
    environmental_sensitivity: environmentalSensitivity,
    flood_exposure: floodExposure,
  };
}

// ─── Default Sample Zones for 1-Click Demonstration ───

export const SAMPLE_ZONES: Record<string, { name: string; type: ZoneType; coords: [number, number][] }> = {
  greater_noida_420: {
    name: "Proposed Yamuna Industrial Zone - Sector 28",
    type: "Industrial Zone",
    // Creates a ~420 Ha polygon near Greater Noida / Yamuna Expressway
    coords: [
      [28.3245, 77.5312],
      [28.3262, 77.5548],
      [28.3110, 77.5615],
      [28.3045, 77.5482],
      [28.3075, 77.5285],
    ],
  },
  pune_chakan_360: {
    name: "Proposed Chakan Auto Cluster Expansion Phase-V",
    type: "Special Economic Zone",
    coords: [
      [18.7612, 73.8425],
      [18.7695, 73.8682],
      [18.7510, 73.8745],
      [18.7425, 73.8510],
    ],
  },
};
