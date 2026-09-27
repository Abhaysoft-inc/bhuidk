// ────────────────────────────────────────────────────────────────────
// India Administrative District & State Catalog (Official Census 2011)
// Sourced directly from github.com/yashveeeeeeer/india-geodata
// 35 States/UTs • 641 Districts with official Census Codes
// Spatial boundaries are fetched dynamically from the GitHub dataset
// via `/api/gis/district-boundary`
// ────────────────────────────────────────────────────────────────────

import rawCatalog from "@/public/data/india-districts-641.json";

export interface DistrictCatalogItem {
  id: string;
  name: string;
  state_id: string;
  state_name: string;
  censusCode: number;
  stateCensusCode: number;
  districtCensusCode: number;
  portal: string;
  record_type: string;
  description: string;
}

export interface StateCatalogItem {
  id: string;
  name: string;
  code: string;
  portal: string;
  record_type: string;
  districts: DistrictCatalogItem[];
}

export interface LiveDistrictBoundary {
  district: string;
  state: string;
  censusCode?: number;
  stateCensusCode?: number;
  districtCensusCode?: number;
  displayName: string;
  center: [number, number]; // [lat, lng]
  bounds: [[number, number], [number, number]]; // [[south, west], [north, east]]
  boundary: [number, number][]; // [lat, lng][] array
  source?: string;
  rawGeoJSON?: any;
}

// State portal metadata registry
const STATE_META: Record<string, { code: string; portal: string; record: string }> = {
  maharashtra: { code: "MH", portal: "MahaBhumi (Mahabhunaksha)", record: "7/12 & 8A Extract" },
  uttar_pradesh: { code: "UP", portal: "Bhulekh UP", record: "Khatauni & Khasra" },
  karnataka: { code: "KA", portal: "Bhoomi / Dishaank", record: "RTC Pahani (Form 16)" },
  gujarat: { code: "GJ", portal: "AnyROR @ Anywhere", record: "VF-7 & VF-8A Extract" },
  rajasthan: { code: "RJ", portal: "Apna Khata (E-Dharti)", record: "Jamabandi Nakal" },
  nct_of_delhi: { code: "DL", portal: "Delhi Revenue Dept", record: "RoR & Lal Dora Index" },
  tamil_nadu: { code: "TN", portal: "AnyROR / e-Services", record: "Patta Chitta & FMB" },
  west_bengal: { code: "WB", portal: "BanglarBhumi", record: "Khatian & Plot Record" },
  madhya_pradesh: { code: "MP", portal: "MP Bhulekh", record: "Khasra/Khatoni B1" },
  andhra_pradesh: { code: "AP", portal: "Meebhoomi", record: "Adangal & 1-B Record" },
  telangana: { code: "TS", portal: "Dharani Portal", record: "Passbook & Mutation RoR" },
  punjab: { code: "PB", portal: "PLRS Jamabandi", record: "Fard / Jamabandi" },
  haryana: { code: "HR", portal: "Jamabandi Haryana", record: "Nakalan Jamabandi" },
  bihar: { code: "BR", portal: "BiharBhumi", record: "Dakhil Kharij & Jamabandi" },
  odisha: { code: "OD", portal: "Bhulekh Odisha", record: "RoR Cadastral Extract" },
  kerala: { code: "KL", portal: "E-Rekha Kerala", record: "Thandapper Extract" },
  assam: { code: "AS", portal: "Dharitree Assam", record: "Jamabandi & Chitha" },
  chhattisgarh: { code: "CG", portal: "Bhuiyan CG", record: "B1 & P2 Khasra" },
  jharkhand: { code: "JH", portal: "Jharbhoomi", record: "Khatian & Register II" },
  uttarakhand: { code: "UK", portal: "Devbhoomi", record: "Khatauni Extract" },
  himachal_pradesh: { code: "HP", portal: "Himbhoomi", record: "Jamabandi Nakal" },
  goa: { code: "GA", portal: "Dharnakshatra Goa", record: "Form I & XIV" },
  jammu___kashmir: { code: "JK", portal: "Aapki Zameen Aapki Nigrani", record: "Jamabandi" },
};

function cleanId(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
}

// Generate the complete catalog across all 35 States and 641 Districts
export const INDIAN_STATES_CATALOG: StateCatalogItem[] = (rawCatalog as any[]).map((stateRaw) => {
  const stateId = cleanId(stateRaw.name);
  const meta = STATE_META[stateId] || {
    code: stateRaw.name.slice(0, 2).toUpperCase(),
    portal: `${stateRaw.name} Land Records Portal`,
    record: "Cadastral RoR Record",
  };

  const districts: DistrictCatalogItem[] = (stateRaw.districts || []).map((d: any) => {
    const districtId = cleanId(d.name);
    return {
      id: districtId,
      name: d.name,
      state_id: stateId,
      state_name: stateRaw.name,
      censusCode: d.censusCode,
      stateCensusCode: d.stateCensusCode,
      districtCensusCode: d.districtCensusCode,
      portal: meta.portal,
      record_type: meta.record,
      description: `Official Census 2011 District (Code: ${d.censusCode}) • Cadastral & Land Use Governance`,
    };
  });

  return {
    id: stateId,
    name: stateRaw.name,
    code: meta.code,
    portal: meta.portal,
    record_type: meta.record,
    districts,
  };
});

// Flat lookup index for all 641 districts
const DISTRICTS_MAP = new Map<string, DistrictCatalogItem>();
for (const state of INDIAN_STATES_CATALOG) {
  for (const district of state.districts) {
    DISTRICTS_MAP.set(district.id, district);
    DISTRICTS_MAP.set(`${district.id}_${state.id}`, district);
  }
}

// Helper to look up district metadata by ID
export function getDistrictCatalogItem(districtId: string): DistrictCatalogItem | null {
  return DISTRICTS_MAP.get(districtId) || null;
}

// Helper to look up state metadata by ID
export function getStateCatalogItem(stateId: string): StateCatalogItem | null {
  return INDIAN_STATES_CATALOG.find((s) => s.id === stateId) || null;
}

// Inverted world polygon mask generator (Leaflet multi-ring polygon with hole)
export function generateInvertedDistrictMask(districtBoundary: [number, number][]): [number, number][][] {
  const worldOuterRing: [number, number][] = [
    [-85, -180],
    [-85, 180],
    [85, 180],
    [85, -180],
  ];
  return [worldOuterRing, districtBoundary];
}
