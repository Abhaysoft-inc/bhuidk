import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

interface DistrictRecord {
  district: string;
  state: string;
  censusCode: number;
  stateCensusCode: number;
  districtCensusCode: number;
  displayName: string;
  center: [number, number];
  bounds: [[number, number], [number, number]];
  boundary: [number, number][];
  source: string;
}

interface DatasetFile {
  metadata: {
    source: string;
    license: string;
    totalDistricts: number;
    totalStates: number;
    extractedAt: string;
  };
  catalog: {
    name: string;
    id: string;
    districts: { district: string; censusCode: number }[];
  }[];
  districts: Record<string, DistrictRecord>;
}

// In-memory cache for fast lookup across requests
let cachedDataset: DatasetFile | null = null;

function loadDataset(): DatasetFile | null {
  if (cachedDataset) return cachedDataset;

  const jsonPath = path.join(process.cwd(), "public", "data", "census-2011-districts.json");
  if (!fs.existsSync(jsonPath)) {
    console.warn("census-2011-districts.json not found at", jsonPath);
    return null;
  }

  try {
    const raw = fs.readFileSync(jsonPath, "utf-8");
    cachedDataset = JSON.parse(raw);
    console.log(
      `[GIS API] Loaded official dataset from ${cachedDataset?.metadata?.source} (${cachedDataset?.metadata?.totalDistricts} districts)`
    );
    return cachedDataset;
  } catch (err) {
    console.error("[GIS API] Failed to parse census-2011-districts.json:", err);
    return null;
  }
}

function cleanKey(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Helper to simplify coordinates for 60fps Leaflet rendering if fallback is used
function simplifyRing(coords: [number, number][], maxPoints = 220): [number, number][] {
  if (coords.length <= maxPoints) return coords;
  const step = Math.ceil(coords.length / maxPoints);
  const simplified: [number, number][] = [];
  for (let i = 0; i < coords.length; i += step) {
    simplified.push(coords[i]);
  }
  if (
    simplified.length > 0 &&
    (simplified[0][0] !== simplified[simplified.length - 1][0] ||
      simplified[0][1] !== simplified[simplified.length - 1][1])
  ) {
    simplified.push(simplified[0]);
  }
  return simplified;
}

const COMMON_ALIASES: Record<string, string> = {
  ahmedabad: "ahmadabad",
  bengaluru: "bangalore",
  gurugram: "gurgaon",
  prayagraj: "allahabad",
  banaras: "varanasi",
  kashi: "varanasi",
  mysuru: "mysore",
  puducherry: "pondicherry",
  baroda: "vadodara",
  belagavi: "belgaum",
  vizag: "visakhapatnam",
  calicut: "kozhikode",
  cochin: "ernakulam",
  kochi: "ernakulam",
  trivandrum: "thiruvananthapuram",
  bombay: "mumbai",
};

function levenshteinDistance(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 3) return 99;
  const m = [];
  for (let i = 0; i <= b.length; i++) m[i] = [i];
  for (let j = 0; j <= a.length; j++) m[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        m[i][j] = m[i - 1][j - 1];
      } else {
        m[i][j] = Math.min(m[i - 1][j - 1] + 1, m[i][j - 1] + 1, m[i - 1][j] + 1);
      }
    }
  }
  return m[b.length][a.length];
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const dataset = loadDataset();

  // Return the full 641 district catalog list if requested
  if (searchParams.get("list") === "1" || searchParams.get("catalog") === "1") {
    if (dataset?.catalog) {
      return NextResponse.json(dataset.catalog);
    }
  }

  const district = searchParams.get("district")?.trim();
  const state = searchParams.get("state")?.trim();

  if (!district) {
    return NextResponse.json(
      { error: "District parameter is required (e.g. ?district=Pune&state=Maharashtra)" },
      { status: 400 }
    );
  }

  // 1. Resolve directly from the official GitHub Census 2011 Shapefile dataset
  if (dataset?.districts) {
    let dClean = cleanKey(district);
    const sClean = state ? cleanKey(state) : "";

    // Normalize through alias dictionary
    if (COMMON_ALIASES[dClean]) {
      dClean = COMMON_ALIASES[dClean];
    }

    // Candidate keys to check
    const candidateKeys = [
      `${dClean}_${sClean}`,
      `${dClean}${sClean}`,
      dClean,
    ];

    for (const key of candidateKeys) {
      const match = dataset.districts[key];
      if (match) {
        // If state was provided, ensure it matches or is compatible
        if (!sClean || cleanKey(match.state).includes(sClean) || sClean.includes(cleanKey(match.state))) {
          return NextResponse.json(match);
        }
      }
    }

    // Substring search through districts
    for (const [key, record] of Object.entries(dataset.districts)) {
      const recDClean = cleanKey(record.district);
      const recSClean = cleanKey(record.state);

      if (recDClean.includes(dClean) || dClean.includes(recDClean)) {
        if (!sClean || recSClean.includes(sClean) || sClean.includes(recSClean)) {
          return NextResponse.json(record);
        }
      }
    }

    // Levenshtein fuzzy match (e.g. small typos or minor transliteration differences)
    let bestMatch: DistrictRecord | null = null;
    let minDistance = 3;

    for (const record of Object.values(dataset.districts)) {
      const recDClean = cleanKey(record.district);
      const recSClean = cleanKey(record.state);

      if (!sClean || recSClean.includes(sClean) || sClean.includes(recSClean)) {
        const dist = levenshteinDistance(dClean, recDClean);
        if (dist < minDistance) {
          minDistance = dist;
          bestMatch = record;
        }
      }
    }

    if (bestMatch) {
      return NextResponse.json(bestMatch);
    }
  }

  // 2. Fallback to live Nominatim API if the district is newly formed (post-2011)
  const query = `${district} District, ${state || ""}, India`;
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&polygon_geojson=1&q=${encodeURIComponent(
      query
    )}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "BhoomiIntel-Platform/1.0",
        Accept: "application/json",
      },
    });

    if (res.ok) {
      const data = await res.json();
      const candidate =
        data.find(
          (item: any) =>
            item.geojson &&
            (item.geojson.type === "Polygon" || item.geojson.type === "MultiPolygon")
        ) || data[0];

      if (candidate && candidate.geojson) {
        const bbox = candidate.boundingbox;
        const south = parseFloat(bbox[0]);
        const north = parseFloat(bbox[1]);
        const west = parseFloat(bbox[2]);
        const east = parseFloat(bbox[3]);

        let rawRing: [number, number][] = [];
        if (candidate.geojson.type === "Polygon") {
          rawRing = candidate.geojson.coordinates[0].map((pt: [number, number]) => [pt[1], pt[0]]);
        } else if (candidate.geojson.type === "MultiPolygon") {
          rawRing = candidate.geojson.coordinates[0][0].map((pt: [number, number]) => [pt[1], pt[0]]);
        }

        const fallbackRecord: DistrictRecord = {
          district,
          state: state || "",
          censusCode: 0,
          stateCensusCode: 0,
          districtCensusCode: 0,
          displayName: candidate.display_name,
          center: [(south + north) / 2, (west + east) / 2],
          bounds: [
            [south, west],
            [north, east],
          ],
          boundary: simplifyRing(rawRing, 220),
          source: "osm-nominatim-live",
        };

        return NextResponse.json(fallbackRecord);
      }
    }
  } catch (err) {
    console.error("Fallback query error:", err);
  }

  return NextResponse.json(
    { error: `Could not find district boundary for ${district}` },
    { status: 404 }
  );
}
