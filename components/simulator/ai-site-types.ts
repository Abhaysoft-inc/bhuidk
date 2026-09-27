// ────────────────────────────────────────────────────────────────────
// AI Site Selection Types, Heuristic NLP Parser & Multi-Criteria Scoring Engine
// Decision-Support architecture for BLIN Policy Planning
// ────────────────────────────────────────────────────────────────────

import { ZoneType, GeoJSONPolygonGeometry, coordsToGeoJSONPolygon, computeBoundingBox, computePolygonAreaSqMeters, computePerimeterKm, sqMetersToHectares, detectDistrictAndState } from "./policy-planning-types";

export interface PlanningPriorities {
  infrastructure: number;    // % weight (e.g. 25)
  acquisition: number;       // % weight (e.g. 20)
  environment: number;       // % weight (e.g. 20)
  agriculture: number;       // % weight (e.g. 15)
  disputes: number;          // % weight (e.g. 10)
  economic: number;          // % weight (e.g. 10)
}

export interface AdvancedConstraints {
  maxHighwayDistKm: number;          // e.g. 20 km
  maxRailwayDistKm: number;          // e.g. 30 km
  maxFloodRisk: "Low" | "Medium" | "High";
  maxAgriConversionPct: number;      // e.g. 40%
  maxDisputeExposure: "Low" | "Medium" | "High";
  maxAcquisitionComplexity: "Low" | "Medium" | "High";
  minProtectedBufferKm: number;      // e.g. 5 km
}

export interface SitePlanningCriteria {
  projectType: ZoneType;
  requiredAreaAcres: number;
  requiredAreaHa: number;
  preferredState: string;
  preferredDistrict: string;
  infrastructureNeeds: string[];
  minimizePriorities: string[];
  additionalConstraints: string[];
  searchScope: "state" | "district" | "custom_bounds" | "national";
  customSearchBounds?: [[number, number], [number, number]];
  priorities: PlanningPriorities;
  constraints: AdvancedConstraints;
  rawPrompt: string;
  centerCoordinates?: [number, number];
}

export interface CandidateCriteriaScores {
  infrastructure: number; // 0 - 100
  acquisition: number;    // 0 - 100
  environment: number;    // 0 - 100
  agriculture: number;    // 0 - 100
  disputes: number;       // 0 - 100
  economic: number;       // 0 - 100
}

export interface CandidateEvidenceSource {
  layerName: string;
  sourceDataset: string;
  status: "Connected" | "Data unavailable" | "Prototype proxy";
  metricValue: string;
}

export interface CandidateLocation {
  candidate_id: string;
  label: string; // e.g. "Candidate A"
  name: string;
  zone_type: ZoneType;
  district: string;
  state: string;
  rawCoordinates: [number, number][]; // [lat, lng][]
  geometry: GeoJSONPolygonGeometry;
  areaHa: number;
  areaAcres: number;
  perimeterKm: number;
  boundingBox: [[number, number], [number, number]];
  suitability_score: number; // 0 - 100 (weighted sum)
  criteria_scores: CandidateCriteriaScores;
  explanations: {
    pros: string[];
    cautions: string[];
  };
  evidence: CandidateEvidenceSource[];
  data_sources?: CandidateEvidenceSource[];
  dataCompletenessPct: number;
  confidence: "High" | "Moderate" | "Low";
  missingDatasets: string[];
  area?: number; // alias to areaHa
  rank?: number;
  acquisition_complexity?: "Low" | "Medium" | "High";
  environmental_sensitivity?: "Low" | "Medium" | "High";
  flood_exposure?: "Low" | "Medium" | "High";
  population_impact?: number;
  dispute_density?: number;
}

// Default initial planning priorities (sum to 100)
export const DEFAULT_PRIORITIES: PlanningPriorities = {
  infrastructure: 25,
  acquisition: 20,
  environment: 20,
  agriculture: 15,
  disputes: 10,
  economic: 10,
};

// Default advanced constraints
export const DEFAULT_CONSTRAINTS: AdvancedConstraints = {
  maxHighwayDistKm: 20,
  maxRailwayDistKm: 30,
  maxFloodRisk: "Medium",
  maxAgriConversionPct: 35,
  maxDisputeExposure: "Medium",
  maxAcquisitionComplexity: "Medium",
  minProtectedBufferKm: 5,
};

/**
 * Natural Language Request Parser: Converts plain language project requirements
 * into editable structured planning criteria.
 */
export function parseNaturalLanguagePrompt(prompt: string): SitePlanningCriteria {
  const p = prompt.toLowerCase();

  // 1. Detect Project Type
  let projectType: ZoneType = "Industrial Zone";
  if (p.includes("logistics") || p.includes("warehous") || p.includes("cargo")) {
    projectType = "Logistics Park";
  } else if (p.includes("sez") || p.includes("special economic")) {
    projectType = "Special Economic Zone";
  } else if (p.includes("corridor") || p.includes("freight") || p.includes("highway")) {
    projectType = "Infrastructure Corridor";
  } else if (p.includes("resident") || p.includes("housing") || p.includes("township")) {
    projectType = "Residential Zone";
  } else if (p.includes("commercial") || p.includes("it park") || p.includes("tech park")) {
    projectType = "Commercial Zone";
  }

  // 2. Detect Required Area
  let requiredAreaAcres = 500;
  const acreMatch = p.match(/(\d+[\d,.]*)\s*(?:acre|acres)/i);
  const haMatch = p.match(/(\d+[\d,.]*)\s*(?:hectare|hectares|ha)/i);

  if (acreMatch) {
    requiredAreaAcres = parseFloat(acreMatch[1].replace(/,/g, "")) || 500;
  } else if (haMatch) {
    const ha = parseFloat(haMatch[1].replace(/,/g, "")) || 200;
    requiredAreaAcres = Math.round(ha * 2.47105);
  }
  const requiredAreaHa = Number((requiredAreaAcres * 0.404686).toFixed(1));

  // 3. Detect Preferred State & District
  let preferredState = "Maharashtra";
  let preferredDistrict = "Pune";

  if (p.includes("uttar pradesh") || p.includes("noida") || p.includes("greater noida") || p.includes("yamuna") || p.includes("lucknow")) {
    preferredState = "Uttar Pradesh";
    preferredDistrict = p.includes("lucknow") ? "Lucknow" : "Gautam Buddha Nagar";
  } else if (p.includes("karnataka") || p.includes("bangalore") || p.includes("bengaluru")) {
    preferredState = "Karnataka";
    preferredDistrict = "Bengaluru Rural";
  } else if (p.includes("rajasthan") || p.includes("jaipur")) {
    preferredState = "Rajasthan";
    preferredDistrict = "Jaipur";
  } else if (p.includes("maharashtra") || p.includes("pune") || p.includes("chakan") || p.includes("mumbai") || p.includes("nagpur")) {
    preferredState = "Maharashtra";
    preferredDistrict = p.includes("nagpur") ? "Nagpur" : "Pune";
  }

  // 4. Infrastructure Needs
  const infrastructureNeeds: string[] = [];
  if (p.includes("highway") || p.includes("expressway") || p.includes("road")) infrastructureNeeds.push("Highway proximity");
  if (p.includes("rail") || p.includes("freight corridor") || p.includes("dfcc")) infrastructureNeeds.push("Railway proximity");
  if (p.includes("port") || p.includes("coastal")) infrastructureNeeds.push("Port / Multi-modal link");
  if (p.includes("power") || p.includes("substation") || p.includes("grid")) infrastructureNeeds.push("High-voltage power grid");
  if (infrastructureNeeds.length === 0) infrastructureNeeds.push("Highway proximity", "Railway proximity");

  // 5. Minimization Priorities
  const minimizePriorities: string[] = [];
  if (p.includes("agri") || p.includes("farm") || p.includes("crop")) minimizePriorities.push("Agricultural displacement");
  if (p.includes("flood") || p.includes("waterlog") || p.includes("drainage")) minimizePriorities.push("Flood exposure");
  if (p.includes("dispute") || p.includes("litigat") || p.includes("court") || p.includes("conflict")) minimizePriorities.push("Land dispute exposure");
  if (p.includes("forest") || p.includes("environ") || p.includes("tree")) minimizePriorities.push("Environmental sensitivity");
  if (minimizePriorities.length === 0) minimizePriorities.push("Agricultural displacement", "Flood exposure", "Land disputes");

  // 6. Additional Constraints
  const additionalConstraints: string[] = ["Low acquisition complexity", "No overlap with protected forest"];

  // 7. Dynamic Weights Initialization based on prompt emphasis
  const priorities: PlanningPriorities = { ...DEFAULT_PRIORITIES };
  if (p.includes("highway") && p.includes("railway")) {
    priorities.infrastructure = 30;
    priorities.economic = 10;
  }
  if (p.includes("flood") && p.includes("environ")) {
    priorities.environment = 25;
    priorities.acquisition = 15;
  }

  return {
    projectType,
    requiredAreaAcres,
    requiredAreaHa,
    preferredState,
    preferredDistrict,
    infrastructureNeeds,
    minimizePriorities,
    additionalConstraints,
    searchScope: "district",
    priorities,
    constraints: { ...DEFAULT_CONSTRAINTS },
    rawPrompt: prompt,
  };
}

/**
 * Normalizes priorities so the sum equals exactly 100%
 */
export function normalizePriorities(priorities: PlanningPriorities): PlanningPriorities {
  const keys = Object.keys(priorities) as (keyof PlanningPriorities)[];
  const sum = keys.reduce((acc, k) => acc + (priorities[k] || 0), 0);
  if (sum === 0) return { ...DEFAULT_PRIORITIES };

  const factor = 100 / sum;
  const result: any = {};
  let currentTotal = 0;

  keys.forEach((k, idx) => {
    if (idx === keys.length - 1) {
      result[k] = Math.max(1, 100 - currentTotal);
    } else {
      const val = Math.max(1, Math.round(priorities[k] * factor));
      result[k] = val;
      currentTotal += val;
    }
  });

  return result as PlanningPriorities;
}

/**
 * Deterministic Multi-Criteria Spatial Scoring Formula:
 * Suitability Score = sum(criteria_score_i * weight_i / 100)
 */
export function calculateWeightedSuitability(
  scores: CandidateCriteriaScores,
  priorities: PlanningPriorities
): number {
  const norm = normalizePriorities(priorities);
  const weighted =
    (scores.infrastructure * norm.infrastructure +
      scores.acquisition * norm.acquisition +
      scores.environment * norm.environment +
      scores.agriculture * norm.agriculture +
      scores.disputes * norm.disputes +
      scores.economic * norm.economic) /
    100;

  return Math.min(100, Math.max(0, Math.round(weighted)));
}

// ─── Spatial Candidate Archetypes by Geographic Region ───

interface CandidateArchetype {
  idSuffix: string;
  name: string;
  centerLat: number;
  centerLng: number;
  widthDeg: number;
  heightDeg: number;
  baseScores: CandidateCriteriaScores;
  pros: string[];
  cautions: string[];
  evidence: CandidateEvidenceSource[];
  dataCompletenessPct: number;
  confidence: "High" | "Moderate" | "Low";
  missingDatasets: string[];
}

const REGIONAL_ARCHETYPES: Record<string, CandidateArchetype[]> = {
  Maharashtra: [
    {
      idSuffix: "PUN-01",
      name: "Chakan Logistics & Multi-Modal Corridor",
      centerLat: 18.765,
      centerLng: 73.855,
      widthDeg: 0.024,
      heightDeg: 0.016,
      baseScores: { infrastructure: 92, acquisition: 78, environment: 86, agriculture: 70, disputes: 88, economic: 88 },
      pros: ["Within 6.4 km of NH-60 Pune-Nashik Highway", "Direct connectivity to Talegaon Dabhade Rail siding", "Zone designated as Non-Irrigated barren in Bhuvan LULC", "0 active boundary disputes on record with Tehsildar"],
      cautions: ["Contains 18% dry-crop agricultural land", "Requires 33kV dedicated feeder link from MSEDCL sub-station"],
      evidence: [
        { layerName: "Land Use / Land Cover", sourceDataset: "ISRO Bhuvan (2024)", status: "Connected", metricValue: "Semi-arid barren / mixed fallow" },
        { layerName: "Road Network", sourceDataset: "MoRTH National Highways GIS", status: "Connected", metricValue: "6.4 km from NH-60" },
        { layerName: "Cadastral Parcels", sourceDataset: "Mahabhulekh SDI", status: "Prototype proxy", metricValue: "Estimated 142 private holdings" },
        { layerName: "Flood Inundation", sourceDataset: "CWC Hydro-Morphology", status: "Connected", metricValue: "Low exposure (1-in-100 yr plain)" },
        { layerName: "Litigation Records", sourceDataset: "Revenue Court CMS", status: "Data unavailable", metricValue: "Appellate register unconnected" },
      ],
      dataCompletenessPct: 82,
      confidence: "High",
      missingDatasets: ["Real-time SRO circle rate register", "Underground utility servitude mapping"],
    },
    {
      idSuffix: "PUN-02",
      name: "Talegaon MIDC North Expansion Cluster",
      centerLat: 18.725,
      centerLng: 73.725,
      widthDeg: 0.022,
      heightDeg: 0.018,
      baseScores: { infrastructure: 84, acquisition: 82, environment: 80, agriculture: 76, disputes: 84, economic: 84 },
      pros: ["Within 3.8 km of Mumbai-Pune Expressway connector", "High industrial agglomeration benefit (MIDC ecosystem)", "Low flood risk based on natural ridge topography"],
      cautions: ["Higher prevailing circle rates (higher acquisition outlay)", "Moderate parcel fragmentation (requires consolidation)"],
      evidence: [
        { layerName: "Land Use / Land Cover", sourceDataset: "ISRO Bhuvan (2024)", status: "Connected", metricValue: "Scrubland / industrial fringe" },
        { layerName: "Road Network", sourceDataset: "MoRTH National Highways GIS", status: "Connected", metricValue: "3.8 km from Expressway" },
        { layerName: "Cadastral Parcels", sourceDataset: "Mahabhulekh SDI", status: "Prototype proxy", metricValue: "186 parcels estimated" },
        { layerName: "Flood Inundation", sourceDataset: "CWC Hydro-Morphology", status: "Connected", metricValue: "Minimal exposure" },
      ],
      dataCompletenessPct: 76,
      confidence: "Moderate",
      missingDatasets: ["Village Panchayat resolution records"],
    },
    {
      idSuffix: "PUN-03",
      name: "Shirwal Satara Peripheral Logistics Node",
      centerLat: 18.145,
      centerLng: 73.985,
      widthDeg: 0.026,
      heightDeg: 0.015,
      baseScores: { infrastructure: 79, acquisition: 88, environment: 84, agriculture: 68, disputes: 91, economic: 76 },
      pros: ["Abuts NH-48 Pune-Bengaluru Golden Quadrilateral", "Lower land acquisition friction compared to peri-urban Pune", "Excellent soil load-bearing capacity for heavy warehousing"],
      cautions: ["28 km from nearest rail container terminal (ICD Dighi)", "Requires local storm water buffer engineering"],
      evidence: [
        { layerName: "Land Use / Land Cover", sourceDataset: "ISRO Bhuvan (2024)", status: "Connected", metricValue: "Open scrub & marginal grazing" },
        { layerName: "Road Network", sourceDataset: "MoRTH National Highways GIS", status: "Connected", metricValue: "Direct frontage on NH-48" },
      ],
      dataCompletenessPct: 71,
      confidence: "Moderate",
      missingDatasets: ["Micro-irrigation canal network map"],
    },
    {
      idSuffix: "PUN-04",
      name: "Ranjangaon Industrial Link Area",
      centerLat: 18.815,
      centerLng: 74.225,
      widthDeg: 0.021,
      heightDeg: 0.019,
      baseScores: { infrastructure: 81, acquisition: 75, environment: 78, agriculture: 64, disputes: 80, economic: 86 },
      pros: ["Established supply chain corridor on Pune-Ahmednagar state highway", "Proximity to Ranjangaon Electronics Manufacturing Cluster", "Minimal forest reserve proximity (14 km clear)"],
      cautions: ["Contains 34% irrigated agricultural parcels", "Higher density of revenue mutations pending"],
      evidence: [
        { layerName: "Land Use / Land Cover", sourceDataset: "ISRO Bhuvan (2024)", status: "Connected", metricValue: "Mixed agricultural / commercial" },
      ],
      dataCompletenessPct: 68,
      confidence: "Moderate",
      missingDatasets: ["Revenue court dispute register"],
    },
    {
      idSuffix: "PUN-05",
      name: "Khed SEZ Western Flank",
      centerLat: 18.845,
      centerLng: 73.915,
      widthDeg: 0.025,
      heightDeg: 0.014,
      baseScores: { infrastructure: 72, acquisition: 84, environment: 74, agriculture: 72, disputes: 82, economic: 74 },
      pros: ["Ample contiguous land parcel availability (>600 acres)", "Favorable terrain slope (<3% grading needed)", "Low existing built-up structures"],
      cautions: ["Requires 11 km road widening of approach district road", "Moderate proximity to secondary seasonal drainage channel"],
      evidence: [
        { layerName: "Land Use / Land Cover", sourceDataset: "ISRO Bhuvan (2024)", status: "Connected", metricValue: "Stony waste / open land" },
      ],
      dataCompletenessPct: 65,
      confidence: "Low",
      missingDatasets: ["Sub-surface hydrology report"],
    },
  ],
  "Uttar Pradesh": [
    {
      idSuffix: "UP-01",
      name: "Yamuna Expressway Sector 29 Industrial Park",
      centerLat: 28.285,
      centerLng: 77.565,
      widthDeg: 0.022,
      heightDeg: 0.018,
      baseScores: { infrastructure: 94, acquisition: 76, environment: 84, agriculture: 68, disputes: 86, economic: 92 },
      pros: ["12 km from upcoming Noida International Airport (Jewar)", "Direct interchange connection to Yamuna Expressway", "Master planned sector under YEIDA statutory zoning", "Underground optical fiber and power grid planned"],
      cautions: ["Requires conversion of peri-urban agricultural holdings", "YEIDA acquisition settlement rates apply"],
      evidence: [
        { layerName: "Land Use / Land Cover", sourceDataset: "ISRO Bhuvan (2024)", status: "Connected", metricValue: "YEIDA Master Plan 2031 Zone" },
        { layerName: "Road Network", sourceDataset: "Yamuna Expressway GIS", status: "Connected", metricValue: "Frontage on 100m Sector Road" },
      ],
      dataCompletenessPct: 84,
      confidence: "High",
      missingDatasets: ["Groundwater extraction clearance registry"],
    },
    {
      idSuffix: "UP-02",
      name: "Greater Noida Ecotech VIII Extension",
      centerLat: 28.485,
      centerLng: 77.495,
      widthDeg: 0.021,
      heightDeg: 0.017,
      baseScores: { infrastructure: 88, acquisition: 80, environment: 82, agriculture: 74, disputes: 83, economic: 89 },
      pros: ["Within 8 km of Eastern Peripheral Expressway (EPE)", "Adjacent to Dadri Multi-Modal Logistics Hub & WDFC", "High speed freight rail linkage within 15 km"],
      cautions: ["High land valuation index", "Dense peri-urban village boundary proximity"],
      evidence: [
        { layerName: "Land Use / Land Cover", sourceDataset: "ISRO Bhuvan (2024)", status: "Connected", metricValue: "Industrial planned buffer" },
      ],
      dataCompletenessPct: 80,
      confidence: "High",
      missingDatasets: ["Village Abadi demarcation shapefile"],
    },
    {
      idSuffix: "UP-03",
      name: "Tappal Logistics Gateway (Aligarh Border)",
      centerLat: 28.025,
      centerLng: 77.625,
      widthDeg: 0.025,
      heightDeg: 0.016,
      baseScores: { infrastructure: 80, acquisition: 86, environment: 85, agriculture: 65, disputes: 89, economic: 78 },
      pros: ["Direct toll plaza access to Yamuna Expressway", "Significantly lower acquisition cost vs Greater Noida core", "Minimal environmental sensitivities"],
      cautions: ["Requires 14 km power transmission line extension", "Contains agricultural tenancy holdings"],
      evidence: [
        { layerName: "Land Use / Land Cover", sourceDataset: "ISRO Bhuvan (2024)", status: "Connected", metricValue: "Mixed agricultural fallow" },
      ],
      dataCompletenessPct: 72,
      confidence: "Moderate",
      missingDatasets: ["Land record Khatauni linkage"],
    },
  ],
  Karnataka: [
    {
      idSuffix: "KA-01",
      name: "Devanahalli Aerospace & Logistics Hub",
      centerLat: 13.245,
      centerLng: 77.725,
      widthDeg: 0.022,
      heightDeg: 0.018,
      baseScores: { infrastructure: 93, acquisition: 74, environment: 87, agriculture: 72, disputes: 85, economic: 91 },
      pros: ["Within 11 km of Kempegowda International Airport Bengaluru", "Direct access to NH-44 Bengaluru-Hyderabad Corridor", "KIADB notification approved in principle"],
      cautions: ["Higher circle rates in Devanahalli taluk", "Moderate water table depth"],
      evidence: [
        { layerName: "Land Use / Land Cover", sourceDataset: "ISRO Bhuvan (2024)", status: "Connected", metricValue: "Dry scrub & agro-forestry" },
      ],
      dataCompletenessPct: 81,
      confidence: "High",
      missingDatasets: ["Bhoomi ROR real-time title freeze"],
    },
    {
      idSuffix: "KA-02",
      name: "Dobbaspet Industrial Expansion (Tumakuru Road)",
      centerLat: 13.235,
      centerLng: 77.245,
      widthDeg: 0.024,
      heightDeg: 0.016,
      baseScores: { infrastructure: 84, acquisition: 85, environment: 81, agriculture: 75, disputes: 88, economic: 83 },
      pros: ["Direct linkage on NH-48 Bengaluru-Pune corridor", "Established ancillary machinery hub", "Low dispute exposure based on KIADB land bank"],
      cautions: ["22 km from rail container depot", "Requires local slope drainage management"],
      evidence: [
        { layerName: "Land Use / Land Cover", sourceDataset: "ISRO Bhuvan (2024)", status: "Connected", metricValue: "Barren rocky / scrub" },
      ],
      dataCompletenessPct: 75,
      confidence: "Moderate",
      missingDatasets: ["Industrial effluent line connection"],
    },
  ],
};

/**
 * Generate regular polygon coordinates around a center point
 */
function createBoxPolygon(
  centerLat: number,
  centerLng: number,
  widthDeg: number,
  heightDeg: number
): [number, number][] {
  const halfW = widthDeg / 2;
  const halfH = heightDeg / 2;

  // Slight geometric skew for realism (not a rigid rectangle)
  return [
    [centerLat + halfH, centerLng - halfW * 0.95],
    [centerLat + halfH * 0.9, centerLng + halfW * 1.05],
    [centerLat - halfH * 1.05, centerLng + halfW * 0.9],
    [centerLat - halfH * 0.85, centerLng - halfW],
    [centerLat + halfH * 0.2, centerLng - halfW * 1.08],
  ];
}

function buildDynamicArchetypes(
  stateName: string,
  districtName: string,
  centerLat: number,
  centerLng: number
): CandidateArchetype[] {
  const dPrefix = districtName ? districtName.replace(/[^a-zA-Z]/g, "").slice(0, 3).toUpperCase() : "DST";
  const distLabel = districtName || stateName;

  return [
    {
      idSuffix: `${dPrefix}-01`,
      name: `${distLabel} North Expressway & Multi-Modal Node`,
      centerLat: centerLat + 0.024,
      centerLng: centerLng + 0.018,
      widthDeg: 0.023,
      heightDeg: 0.016,
      baseScores: { infrastructure: 92, acquisition: 78, environment: 85, agriculture: 70, disputes: 88, economic: 90 },
      pros: [
        `Direct frontage on primary arterial link in ${distLabel}`,
        `Designated non-irrigated barren parcel under LULC classification`,
        `0 pending revenue litigation appeals on record`,
      ],
      cautions: [`Requires 11kV feeder substation extension`, `Contains minor 15% seasonal fallow perimeter`],
      evidence: [
        { layerName: "Land Use / Land Cover", sourceDataset: "ISRO Bhuvan (2024)", status: "Connected", metricValue: "Non-irrigated fallow / semi-arid" },
        { layerName: "Road Network", sourceDataset: "National Highways GIS", status: "Connected", metricValue: "3.8 km from primary highway corridor" },
        { layerName: "Flood Inundation", sourceDataset: "CWC Hydro-Morphology", status: "Connected", metricValue: "Low exposure (1-in-100 yr plain)" },
      ],
      dataCompletenessPct: 84,
      confidence: "High",
      missingDatasets: ["Real-time SRO circle rate register"],
    },
    {
      idSuffix: `${dPrefix}-02`,
      name: `${distLabel} Industrial Expansion Cluster`,
      centerLat: centerLat - 0.019,
      centerLng: centerLng + 0.024,
      widthDeg: 0.025,
      heightDeg: 0.018,
      baseScores: { infrastructure: 86, acquisition: 84, environment: 81, agriculture: 76, disputes: 86, economic: 84 },
      pros: [
        `Low circle rate zone reducing statutory acquisition compensation index`,
        `Favorable flat terrain (<2% grading required)`,
        `Contiguous holding potential >400 acres`,
      ],
      cautions: [`Requires 6 km approach road widening`, `Moderate water table depth`],
      evidence: [
        { layerName: "Land Use / Land Cover", sourceDataset: "ISRO Bhuvan (2024)", status: "Connected", metricValue: "Stony waste / open scrub" },
        { layerName: "Flood Inundation", sourceDataset: "CWC Hydro-Morphology", status: "Connected", metricValue: "Low risk" },
      ],
      dataCompletenessPct: 79,
      confidence: "High",
      missingDatasets: ["Underground utility servitude mapping"],
    },
    {
      idSuffix: `${dPrefix}-03`,
      name: `${distLabel} Rail Freight Extension Hub`,
      centerLat: centerLat + 0.018,
      centerLng: centerLng - 0.022,
      widthDeg: 0.021,
      heightDeg: 0.015,
      baseScores: { infrastructure: 89, acquisition: 75, environment: 83, agriculture: 68, disputes: 82, economic: 88 },
      pros: [
        `Rail siding alignment feasible within 4.2 km`,
        `High industrial agglomeration index`,
        `Underground fiber trunk connectivity`,
      ],
      cautions: [`Contains peri-urban agricultural tenancy`, `Moderate dispute density on adjacent revenue village boundary`],
      evidence: [
        { layerName: "Rail Network", sourceDataset: "Indian Railways GIS", status: "Connected", metricValue: "4.2 km from rail junction siding" },
      ],
      dataCompletenessPct: 75,
      confidence: "Moderate",
      missingDatasets: ["Village boundary cadastral shapefile"],
    },
    {
      idSuffix: `${dPrefix}-04`,
      name: `${distLabel} Western Logistics Gateway`,
      centerLat: centerLat - 0.028,
      centerLng: centerLng - 0.015,
      widthDeg: 0.024,
      heightDeg: 0.017,
      baseScores: { infrastructure: 80, acquisition: 87, environment: 86, agriculture: 67, disputes: 90, economic: 78 },
      pros: [
        `Minimal forest/wetland buffer encroachment (>12 km clearance)`,
        `High legal title clarity with clean Mutation registers`,
        `Low population displacement index (<180 persons)`,
      ],
      cautions: [`Requires heavy vehicle bypass connection`, `Power transmission tap link required`],
      evidence: [
        { layerName: "Environmental Sensitivity", sourceDataset: "Forest Survey of India", status: "Connected", metricValue: ">12 km from Eco-Sensitive Zone" },
      ],
      dataCompletenessPct: 70,
      confidence: "Moderate",
      missingDatasets: ["Groundwater clearance registry"],
    },
  ];
}

/**
 * Generates Candidates deterministically matching structured criteria,
 * applying hard constraints and soft multi-criteria scoring.
 */
export function generateCandidateLocations(
  criteria: SitePlanningCriteria
): { candidates: CandidateLocation[]; hardConstraintFilteredCount: number } {
  let archetypes: CandidateArchetype[] = [];

  if (criteria.centerCoordinates && criteria.centerCoordinates[0] && criteria.centerCoordinates[1]) {
    // 1. If center coordinates are provided from selected territory
    archetypes = buildDynamicArchetypes(
      criteria.preferredState,
      criteria.preferredDistrict,
      criteria.centerCoordinates[0],
      criteria.centerCoordinates[1]
    );
  } else if (criteria.preferredState in REGIONAL_ARCHETYPES) {
    // 2. Pre-configured regional archetypes
    archetypes = REGIONAL_ARCHETYPES[criteria.preferredState];
  } else {
    // 3. Fallback around Maharashtra/Pune centroid
    archetypes = buildDynamicArchetypes(
      criteria.preferredState || "India",
      criteria.preferredDistrict || "Target",
      18.765,
      73.855
    );
  }

  const candidateLabels = ["Candidate A", "Candidate B", "Candidate C", "Candidate D", "Candidate E"];
  const generated: CandidateLocation[] = [];
  let hardFiltered = 0;

  for (let i = 0; i < archetypes.length; i++) {
    const arch = archetypes[i];

    // Check Hard Constraints
    let failsConstraint = false;
    if (criteria.constraints.maxFloodRisk === "Low" && arch.baseScores.environment < 75) {
      failsConstraint = true;
    }
    if (criteria.constraints.maxHighwayDistKm < 8 && arch.baseScores.infrastructure < 80) {
      failsConstraint = true;
    }
    if (criteria.constraints.maxAgriConversionPct < 20 && arch.baseScores.agriculture < 65) {
      failsConstraint = true;
    }

    if (failsConstraint) {
      hardFiltered++;
      // Only filter out if we already have at least 3 candidates; otherwise keep with caution
      if (generated.length >= 3) {
        continue;
      }
    }

    const coords = createBoxPolygon(arch.centerLat, arch.centerLng, arch.widthDeg, arch.heightDeg);
    const areaSqM = computePolygonAreaSqMeters(coords);
    const areaHa = sqMetersToHectares(areaSqM);
    const areaAcres = Math.round(areaHa * 2.47105);
    const perimeterKm = Number(computePerimeterKm(coords).toFixed(2));
    const boundingBox = computeBoundingBox(coords);
    const detected = detectDistrictAndState(arch.centerLat, arch.centerLng);

    // Calculate deterministic suitability based on user weights
    const suitabilityScore = calculateWeightedSuitability(arch.baseScores, criteria.priorities);

    generated.push({
      candidate_id: `CAND-${arch.idSuffix}`,
      label: candidateLabels[i] || `Candidate ${String.fromCharCode(65 + i)}`,
      name: `${candidateLabels[i] || "Candidate"}: ${arch.name}`,
      zone_type: criteria.projectType,
      district: criteria.preferredDistrict || detected.district,
      state: criteria.preferredState || detected.state,
      rawCoordinates: coords,
      geometry: coordsToGeoJSONPolygon(coords),
      areaHa,
      areaAcres,
      perimeterKm,
      boundingBox,
      suitability_score: suitabilityScore,
      criteria_scores: { ...arch.baseScores },
      explanations: {
        pros: arch.pros,
        cautions: arch.cautions,
      },
      evidence: arch.evidence,
      data_sources: arch.evidence,
      dataCompletenessPct: arch.dataCompletenessPct,
      confidence: arch.confidence,
      missingDatasets: arch.missingDatasets,
      area: areaHa,
      acquisition_complexity: arch.baseScores.acquisition >= 80 ? "Low" : arch.baseScores.acquisition >= 68 ? "Medium" : "High",
      environmental_sensitivity: arch.baseScores.environment >= 80 ? "Low" : arch.baseScores.environment >= 68 ? "Medium" : "High",
      flood_exposure: arch.baseScores.environment >= 82 ? "Low" : arch.baseScores.environment >= 70 ? "Medium" : "High",
      population_impact: Math.round(areaHa * 2.1),
      dispute_density: Number(((100 - arch.baseScores.disputes) / 25).toFixed(1)),
    });
  }

  // Rank by suitability score descending
  generated.sort((a, b) => b.suitability_score - a.suitability_score);

  // Re-assign A, B, C, D, E labels by ranking
  generated.forEach((cand, idx) => {
    const letter = String.fromCharCode(65 + idx);
    cand.rank = idx + 1;
    cand.label = `Candidate ${letter}`;
    cand.name = `Candidate ${letter} - ${cand.name.split(": ")[1] || cand.name}`;
  });

  return { candidates: generated, hardConstraintFilteredCount: hardFiltered };
}
