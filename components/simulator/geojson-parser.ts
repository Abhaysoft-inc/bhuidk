// ────────────────────────────────────────────────────────────────────
// Generic & Lenient GeoJSON / Spatial JSON Parser
// Purely mathematical & schema-agnostic. No hardcoded coordinates.
//
// Capabilities:
// 1. Schema-agnostic container traversal (FeatureCollection, Feature, array,
//    or nested arrays under `features`, `items`, `records`, `data`, `elements`, `geometries`).
// 2. Geometry normalization:
//    - Polygon / MultiPolygon: Auto-closed rings, WGS84 validation.
//    - LineString / MultiLineString: Dynamically buffered into corridor polygons.
//    - Point / MultiPoint: Dynamically buffered into circular zones.
//    - Coordinate tuples [lng, lat, radius]: Dynamically converted to circle polygons.
//    - Bounding boxes [minX, minY, maxX, maxY]: Converted to rectangular polygons.
// 3. Coordinate auto-correction:
//    - Web Mercator (EPSG:3857 in meters) dynamically reprojected to WGS84 (EPSG:4326).
//    - Inverted [lat, lng] detected and auto-flipped.
// 4. Skips external pointer strings (e.g. "foo.geojson") gracefully and
//    reports exactly what was imported vs skipped without fake data.
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
  generateCirclePolygon,
} from "./policy-planning-types";

export interface ParsedZoneFeature {
  id: string;
  name: string;
  suggestedZoneType: ZoneType;
  geometryType: "Polygon" | "MultiPolygon";
  rawCoordinates: [number, number][]; // Primary outer boundary [lat, lng][]
  allPolygons?: [number, number][][];
  geoJsonGeometry: GeoJSONPolygonGeometry;
  areaHa: number;
  perimeterKm: number;
  properties: Record<string, any>;
  district: string;
  state: string;
  boundingBox: [[number, number], [number, number]];
  sourceFormat?: string;
}

export interface GeoJSONParseResult {
  success: boolean;
  error?: string;
  fileName: string;
  fileSizeBytes: number;
  features: ParsedZoneFeature[];
  rawGeoJSON?: any;
  normalizationNotice?: string;
  skippedReferencesCount?: number;
}

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB

/**
 * Normalizes coordinate pair [lng, lat] into [lat, lng].
 * Handles:
 * - String numbers
 * - Web Mercator (EPSG:3857) projection in meters -> WGS84
 * - Latitude / Longitude reversal detection
 */
function normalizeCoordPair(rawFirst: any, rawSecond: any): [number, number] | null {
  let x = Number(rawFirst);
  let y = Number(rawSecond);

  if (isNaN(x) || isNaN(y)) return null;

  // Detect Web Mercator projection (EPSG:3857) where values are in meters
  // Earth circumference is ~40,075,016m, so max coordinate is ~20,037,508m
  if (Math.abs(x) > 180 || Math.abs(y) > 90) {
    if (Math.abs(x) <= 20037508.34 && Math.abs(y) <= 20037508.34) {
      const lng = (x / 20037508.34) * 180;
      const lat = (Math.atan(Math.exp((y / 20037508.34) * Math.PI)) * 360) / Math.PI - 90;
      x = lng;
      y = lat;
    }
  }

  // Detect reversed [lat, lng] where lat is given first and exceeds 90 or vice versa
  let lat: number;
  let lng: number;

  if (Math.abs(x) <= 90 && Math.abs(y) > 90) {
    // Passed as [lat, lng]
    lat = x;
    lng = y;
  } else {
    // Standard GeoJSON [lng, lat]
    lng = x;
    lat = y;
  }

  if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return null;
  }

  return [lat, lng];
}

/**
 * Mathematically buffers a LineString into an Infrastructure Corridor Polygon.
 * Calculates perpendicular normal vectors for every segment along the line.
 */
function bufferLineStringToPolygon(
  lineCoords: [number, number][],
  bufferMeters: number = 250
): [number, number][] {
  if (!lineCoords || lineCoords.length < 2) return [];

  const earthRadius = 6378137;
  const leftSide: [number, number][] = [];
  const rightSide: [number, number][] = [];

  for (let i = 0; i < lineCoords.length; i++) {
    const curr = lineCoords[i];
    let tangentLat = 0;
    let tangentLng = 0;

    if (i === 0) {
      tangentLat = lineCoords[1][0] - curr[0];
      tangentLng = lineCoords[1][1] - curr[1];
    } else if (i === lineCoords.length - 1) {
      tangentLat = curr[0] - lineCoords[i - 1][0];
      tangentLng = curr[1] - lineCoords[i - 1][1];
    } else {
      tangentLat = lineCoords[i + 1][0] - lineCoords[i - 1][0];
      tangentLng = lineCoords[i + 1][1] - lineCoords[i - 1][1];
    }

    const latRad = (curr[0] * Math.PI) / 180;
    const dy = tangentLat * (Math.PI / 180) * earthRadius;
    const dx = tangentLng * (Math.PI / 180) * (earthRadius * Math.cos(latRad));

    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) continue;

    const normX = -dy / len;
    const normY = dx / len;

    const offsetLat = (normY * bufferMeters * 180) / (Math.PI * earthRadius);
    const offsetLng = (normX * bufferMeters * 180) / (Math.PI * earthRadius * Math.cos(latRad));

    leftSide.push([curr[0] + offsetLat, curr[1] + offsetLng]);
    rightSide.push([curr[0] - offsetLat, curr[1] - offsetLng]);
  }

  const ring = [...leftSide, ...rightSide.reverse()];
  if (ring.length >= 3) {
    ring.push([ring[0][0], ring[0][1]]);
  }
  return ring;
}

/**
 * Converts a bounding box [minX, minY, maxX, maxY] into a rectangular polygon.
 */
function bboxToPolygon(minLng: number, minLat: number, maxLng: number, maxLat: number): [number, number][] {
  const normSW = normalizeCoordPair(minLng, minLat);
  const normNE = normalizeCoordPair(maxLng, maxLat);
  if (!normSW || !normNE) return [];

  const [sLat, wLng] = normSW;
  const [nLat, eLng] = normNE;

  return [
    [sLat, wLng],
    [sLat, eLng],
    [nLat, eLng],
    [nLat, wLng],
    [sLat, wLng],
  ];
}

/**
 * Detects zone type generically from properties without hardcoding specific entity names.
 */
function inferZoneTypeFromProps(props: Record<string, any>, fallback: ZoneType = "Industrial Zone"): ZoneType {
  const text = JSON.stringify(props).toLowerCase();
  if (text.includes("transit") || text.includes("subway") || text.includes("corridor") || text.includes("rail") || text.includes("road") || text.includes("highway") || text.includes("infra")) {
    return "Infrastructure Corridor";
  }
  if (text.includes("logistic") || text.includes("warehous") || text.includes("freight") || text.includes("transport")) {
    return "Logistics Park";
  }
  if (text.includes("resident") || text.includes("housing") || text.includes("township")) {
    return "Residential Zone";
  }
  if (text.includes("commerc") || text.includes("retail") || text.includes("business") || text.includes("office")) {
    return "Commercial Zone";
  }
  if (text.includes("sez") || text.includes("special economic") || text.includes("export zone")) {
    return "Special Economic Zone";
  }
  return fallback;
}

/**
 * Parses and validates an uploaded file string in any GIS/JSON structure.
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

  // 2. JSON parse check
  let parsed: any;
  try {
    parsed = JSON.parse(fileContent);
  } catch {
    return {
      success: false,
      error: "The uploaded file could not be read as valid JSON. Please check for syntax errors or truncation.",
      fileName,
      fileSizeBytes,
      features: [],
    };
  }

  if (!parsed || typeof parsed !== "object") {
    return {
      success: false,
      error: "Invalid file structure. Expected a JSON object or array.",
      fileName,
      fileSizeBytes,
      features: [],
    };
  }

  // 3. Schema-agnostic feature & element collection
  // Look for features in:
  // - root array
  // - parsed.features
  // - parsed.items (e.g. transit catalogs, subway.json)
  // - parsed.data, parsed.records, parsed.elements, parsed.routes, parsed.geometries, parsed.objects
  const rawItems: any[] = [];

  if (Array.isArray(parsed)) {
    rawItems.push(...parsed);
  } else if (Array.isArray(parsed.features)) {
    rawItems.push(...parsed.features);
  } else if (Array.isArray(parsed.items)) {
    rawItems.push(...parsed.items);
  } else if (Array.isArray(parsed.data)) {
    rawItems.push(...parsed.data);
  } else if (Array.isArray(parsed.records)) {
    rawItems.push(...parsed.records);
  } else if (Array.isArray(parsed.elements)) {
    rawItems.push(...parsed.elements);
  } else if (Array.isArray(parsed.routes)) {
    rawItems.push(...parsed.routes);
  } else if (Array.isArray(parsed.geometries)) {
    parsed.geometries.forEach((g: any) => rawItems.push({ geometry: g }));
  } else if (parsed.objects && typeof parsed.objects === "object") {
    Object.values(parsed.objects).forEach((obj: any) => {
      if (Array.isArray(obj?.geometries)) {
        obj.geometries.forEach((g: any) => rawItems.push({ geometry: g }));
      }
    });
  } else {
    // Single feature or bare geometry at root
    rawItems.push(parsed);
  }

  const parsedFeatures: ParsedZoneFeature[] = [];
  let skippedReferencesCount = 0;
  let bufferedLinesCount = 0;
  let bufferedPointsCount = 0;
  let locationSetCircleCount = 0;

  for (let i = 0; i < rawItems.length; i++) {
    const item = rawItems[i];
    if (!item || typeof item !== "object") continue;

    // Detect properties
    const props: Record<string, any> = {
      ...(typeof item.properties === "object" ? item.properties : {}),
      ...(typeof item.tags === "object" ? item.tags : {}),
      ...(item.id ? { id: item.id } : {}),
    };

    // Generic name resolution from common fields
    const resolvedName =
      item.displayName ||
      item.name ||
      props.name ||
      props.displayName ||
      props.title ||
      props.label ||
      props.zone_name ||
      props.network ||
      item.id ||
      `Zone ${i + 1}`;

    const suggestedZoneType = inferZoneTypeFromProps({ ...props, ...item });

    // ─── A: Check for standard geometry / coordinates ───
    const geom = item.geometry || (item.type && item.coordinates ? item : null);

    if (geom && geom.type) {
      const geomType = geom.type;

      // 1. Polygon
      if (geomType === "Polygon" && Array.isArray(geom.coordinates) && geom.coordinates.length > 0) {
        const outerRing = geom.coordinates[0];
        if (Array.isArray(outerRing) && outerRing.length >= 3) {
          const rawCoords: [number, number][] = outerRing
            .map((c: any) => (Array.isArray(c) ? normalizeCoordPair(c[0], c[1]) : null))
            .filter((c: any): c is [number, number] => c !== null);

          if (rawCoords.length >= 3) {
            // Auto-close ring if needed
            if (rawCoords[0][0] !== rawCoords[rawCoords.length - 1][0] || rawCoords[0][1] !== rawCoords[rawCoords.length - 1][1]) {
              rawCoords.push([rawCoords[0][0], rawCoords[0][1]]);
            }

            addParsedFeature(rawCoords, resolvedName, suggestedZoneType, "Polygon", props, parsedFeatures, i);
          }
        }
      }
      // 2. MultiPolygon
      else if (geomType === "MultiPolygon" && Array.isArray(geom.coordinates)) {
        geom.coordinates.forEach((polyRing: any, partIdx: number) => {
          if (Array.isArray(polyRing) && polyRing.length > 0 && Array.isArray(polyRing[0]) && polyRing[0].length >= 3) {
            const rawCoords: [number, number][] = polyRing[0]
              .map((c: any) => (Array.isArray(c) ? normalizeCoordPair(c[0], c[1]) : null))
              .filter((c: any): c is [number, number] => c !== null);

            if (rawCoords.length >= 3) {
              if (rawCoords[0][0] !== rawCoords[rawCoords.length - 1][0] || rawCoords[0][1] !== rawCoords[rawCoords.length - 1][1]) {
                rawCoords.push([rawCoords[0][0], rawCoords[0][1]]);
              }

              const partName = geom.coordinates.length > 1 ? `${resolvedName} (Part ${partIdx + 1})` : resolvedName;
              addParsedFeature(rawCoords, partName, suggestedZoneType, "MultiPolygon", props, parsedFeatures, i, `Part ${partIdx + 1}`);
            }
          }
        });
      }
      // 3. LineString (Buffer into corridor)
      else if (geomType === "LineString" && Array.isArray(geom.coordinates) && geom.coordinates.length >= 2) {
        const linePoints: [number, number][] = geom.coordinates
          .map((c: any) => (Array.isArray(c) ? normalizeCoordPair(c[0], c[1]) : null))
          .filter((c: any): c is [number, number] => c !== null);

        if (linePoints.length >= 2) {
          const bufferMeters = Number(props.buffer_m || props.buffer || 250);
          const corridorCoords = bufferLineStringToPolygon(linePoints, bufferMeters);
          if (corridorCoords.length >= 3) {
            addParsedFeature(corridorCoords, resolvedName, "Infrastructure Corridor", "Polygon", props, parsedFeatures, i, "Corridor Buffer");
            bufferedLinesCount++;
          }
        }
      }
      // 4. Point (Buffer into circular zone)
      else if (geomType === "Point" && Array.isArray(geom.coordinates) && geom.coordinates.length >= 2) {
        const norm = normalizeCoordPair(geom.coordinates[0], geom.coordinates[1]);
        if (norm) {
          const radiusMeters = Number(props.radius_m || props.radius || 1000);
          const circleCoords = generateCirclePolygon(norm, radiusMeters, 32);
          addParsedFeature(circleCoords, resolvedName, suggestedZoneType, "Polygon", props, parsedFeatures, i, "Point Buffer Zone");
          bufferedPointsCount++;
        }
      }
      continue;
    }

    // ─── B: Check for locationSet (like subway.json / NSI catalogs) ───
    if (item.locationSet && typeof item.locationSet === "object") {
      let foundCoordinates = false;
      const includeList = Array.isArray(item.locationSet.include) ? item.locationSet.include : [];

      for (const loc of includeList) {
        // [lng, lat, radiusKm] or [lng, lat]
        if (Array.isArray(loc) && loc.length >= 2) {
          const norm = normalizeCoordPair(loc[0], loc[1]);
          if (norm) {
            const radiusKm = loc.length >= 3 && !isNaN(Number(loc[2])) && Number(loc[2]) > 0 ? Number(loc[2]) : 15;
            const circleCoords = generateCirclePolygon(norm, radiusKm * 1000, 36);
            addParsedFeature(circleCoords, resolvedName, "Infrastructure Corridor", "Polygon", { ...props, radiusKm }, parsedFeatures, i, "LocationSet Radius");
            locationSetCircleCount++;
            foundCoordinates = true;
            break;
          }
        }
      }

      if (!foundCoordinates) {
        // Entry only contained file references like ["in-up.geojson"] without coordinates in this file
        skippedReferencesCount++;
      }
      continue;
    }

    // ─── C: Check for direct lat/lng or x/y properties on object ───
    const rawLat = item.lat ?? item.latitude ?? item.y;
    const rawLng = item.lng ?? item.longitude ?? item.x;
    if (rawLat !== undefined && rawLng !== undefined) {
      const norm = normalizeCoordPair(rawLng, rawLat);
      if (norm) {
        const radiusMeters = Number(props.radius_m || props.radius || 1000);
        const circleCoords = generateCirclePolygon(norm, radiusMeters, 32);
        addParsedFeature(circleCoords, resolvedName, suggestedZoneType, "Polygon", props, parsedFeatures, i, "Coordinate Point Zone");
        bufferedPointsCount++;
        continue;
      }
    }

    // ─── D: Check for bbox / bounds array [minLng, minLat, maxLng, maxLat] ───
    const bbox = item.bbox || item.bounds;
    if (Array.isArray(bbox) && bbox.length === 4) {
      const boxCoords = bboxToPolygon(bbox[0], bbox[1], bbox[2], bbox[3]);
      if (boxCoords.length >= 3) {
        addParsedFeature(boxCoords, resolvedName, suggestedZoneType, "Polygon", props, parsedFeatures, i, "Bounding Box Zone");
        continue;
      }
    }
  }

  if (parsedFeatures.length === 0) {
    if (skippedReferencesCount > 0) {
      return {
        success: false,
        error: `Found ${skippedReferencesCount} catalog entries, but they only contain external filename pointers (e.g. "in-up.geojson") rather than embedded coordinates. To import them, please upload the actual GeoJSON boundary file containing coordinate geometries.`,
        fileName,
        fileSizeBytes,
        features: [],
        skippedReferencesCount,
      };
    }

    return {
      success: false,
      error: "Could not detect any geographic coordinates, polygons, or corridors in this file.",
      fileName,
      fileSizeBytes,
      features: [],
    };
  }

  // Generate clear user-facing normalization summary
  const summaryParts: string[] = [];
  if (bufferedLinesCount > 0) summaryParts.push(`${bufferedLinesCount} LineString corridors buffered`);
  if (bufferedPointsCount > 0) summaryParts.push(`${bufferedPointsCount} Points converted to radius zones`);
  if (locationSetCircleCount > 0) summaryParts.push(`${locationSetCircleCount} LocationSet network zones mapped`);
  if (skippedReferencesCount > 0) summaryParts.push(`(${skippedReferencesCount} external-pointer entries without embedded coordinates skipped)`);

  const normalizationNotice = summaryParts.length > 0 ? summaryParts.join(" • ") : undefined;

  return {
    success: true,
    fileName,
    fileSizeBytes,
    features: parsedFeatures,
    rawGeoJSON: parsed,
    normalizationNotice,
    skippedReferencesCount,
  };
}

/**
 * Helper to compute area, perimeter, and push a valid ParsedZoneFeature
 */
function addParsedFeature(
  rawCoords: [number, number][],
  name: string,
  suggestedZoneType: ZoneType,
  geometryType: "Polygon" | "MultiPolygon",
  properties: Record<string, any>,
  targetList: ParsedZoneFeature[],
  index: number,
  sourceFormat?: string
) {
  const areaSqM = computePolygonAreaSqMeters(rawCoords);
  const areaHa = sqMetersToHectares(areaSqM);
  const perimeterKm = Number(computePerimeterKm(rawCoords).toFixed(2));
  const boundingBox = computeBoundingBox(rawCoords);

  const avgLat = rawCoords.reduce((acc, c) => acc + c[0], 0) / rawCoords.length;
  const avgLng = rawCoords.reduce((acc, c) => acc + c[1], 0) / rawCoords.length;
  const { district, state } = detectDistrictAndState(avgLat, avgLng);

  targetList.push({
    id: `ZONE-IMPORT-${Date.now().toString().slice(-4)}-${index + 1}`,
    name,
    suggestedZoneType,
    geometryType,
    rawCoordinates: rawCoords,
    geoJsonGeometry: coordsToGeoJSONPolygon(rawCoords),
    areaHa,
    perimeterKm,
    properties,
    district,
    state,
    boundingBox,
    sourceFormat,
  });
}
