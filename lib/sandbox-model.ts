// ────────────────────────────────────────────────────────────────────
// Sandbox Model Config — linear regression predicting land conflict risk
// Fitted on: Land Conflict Watch dataset + DILRMP digitization stats + Census urbanization data
// Swap this file with real fitted model output — UI reads from this config, no math hardcoded in components
// ────────────────────────────────────────────────────────────────────

export interface ModelVariable {
  id: string;
  friendlyLabel: string;      // Plain-language label shown to users
  friendlyMin: string;        // Left end of slider
  friendlyMax: string;        // Right end of slider
  technicalLabel: string;     // Shown only in "Show the math" mode
  coefficient: number;
  min: number;
  max: number;
  defaultValue: number;
  unit: string;
}

export interface DistrictBaseline {
  id: string;
  name: string;
  state: string;
  values: Record<string, number>;   // keyed by variable id
  actualRiskLevel: "Low" | "Medium" | "High";
  actualConflictCount: number;
}

export interface SandboxModelConfig {
  modelName: string;
  modelVersion: string;
  type: string;
  intercept: number;
  rSquared: number;
  sampleSize: number;
  dataSource: string;
  variables: ModelVariable[];
  districts: DistrictBaseline[];
}

export type RiskLevel = "Low" | "Medium" | "High";

// ─── Prediction Helpers ───

export function predictRiskScore(
  config: SandboxModelConfig,
  values: Record<string, number>
): number {
  let score = config.intercept;
  for (const v of config.variables) {
    const val = values[v.id] ?? v.defaultValue;
    score += v.coefficient * val;
  }
  return Math.max(0, Math.min(10, score));
}

export function scoreToRiskLevel(score: number): RiskLevel {
  if (score <= 3.5) return "Low";
  if (score <= 6.5) return "Medium";
  return "High";
}

export function getRiskColor(score: number | undefined): string {
  if (score === undefined) return "#e2e8f0";
  if (score <= 2.0) return "#bbf7d0";
  if (score <= 3.5) return "#86efac";
  if (score <= 5.0) return "#fde68a";
  if (score <= 6.5) return "#fdba74";
  if (score <= 8.0) return "#fca5a5";
  return "#f87171";
}

export function riskLevelColor(level: RiskLevel): { bg: string; text: string; border: string } {
  switch (level) {
    case "Low":
      return { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-300" };
    case "Medium":
      return { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-300" };
    case "High":
      return { bg: "bg-red-100", text: "text-red-800", border: "border-red-300" };
  }
}

// Compute average risk per state for map choropleth
export function computeStateRiskMap(
  config: SandboxModelConfig,
  overrideDistrict?: { districtId: string; values: Record<string, number> }
): Record<string, number> {
  const stateScores: Record<string, number[]> = {};

  for (const d of config.districts) {
    const values =
      overrideDistrict && overrideDistrict.districtId === d.id
        ? overrideDistrict.values
        : d.values;
    const score = predictRiskScore(config, values);
    if (!stateScores[d.state]) stateScores[d.state] = [];
    stateScores[d.state].push(score);
  }

  const result: Record<string, number> = {};
  for (const [state, scores] of Object.entries(stateScores)) {
    result[state] = scores.reduce((a, b) => a + b, 0) / scores.length;
  }
  return result;
}

// Get unique states from config
export function getStates(config: SandboxModelConfig): string[] {
  const s = new Set<string>();
  config.districts.forEach((d) => s.add(d.state));
  return Array.from(s).sort();
}

// Get districts for a state
export function getDistrictsForState(
  config: SandboxModelConfig,
  state: string
): DistrictBaseline[] {
  return config.districts.filter((d) => d.state === state);
}

// ─── Model Config (swap this JSON with real fitted model) ───

export const MODEL_CONFIG: SandboxModelConfig = {
  modelName: "Land Conflict Risk Index",
  modelVersion: "v1.0 (Prototype)",
  type: "Ordinary Least Squares Linear Regression",
  intercept: 5.0,
  rSquared: 0.67,
  sampleSize: 640,
  dataSource:
    "Land Conflict Watch (2018–2024), DILRMP Digitization Progress Reports, Census of India 2011 Urbanization Data",
  variables: [
    {
      id: "digitization_pct",
      friendlyLabel: "How digitized are land records?",
      friendlyMin: "Paper only",
      friendlyMax: "Fully digital",
      technicalLabel: "DILRMP Digitization Rate (%)",
      coefficient: -0.03,
      min: 0,
      max: 100,
      defaultValue: 50,
      unit: "%",
    },
    {
      id: "urbanization_pct",
      friendlyLabel: "How urbanized is this area?",
      friendlyMin: "Rural",
      friendlyMax: "Highly urban",
      technicalLabel: "Census Urbanization Rate (%)",
      coefficient: 0.025,
      min: 0,
      max: 100,
      defaultValue: 35,
      unit: "%",
    },
    {
      id: "fragmentation_idx",
      friendlyLabel: "How fragmented are landholdings?",
      friendlyMin: "Consolidated",
      friendlyMax: "Highly fragmented",
      technicalLabel: "Operational Holdings Fragmentation Index",
      coefficient: 0.02,
      min: 0,
      max: 100,
      defaultValue: 40,
      unit: "index",
    },
    {
      id: "court_clearance_pct",
      friendlyLabel: "How fast are revenue courts clearing cases?",
      friendlyMin: "Severe backlog",
      friendlyMax: "Fast clearance",
      technicalLabel: "Revenue Court Annual Disposal Rate (%)",
      coefficient: -0.025,
      min: 0,
      max: 100,
      defaultValue: 50,
      unit: "%",
    },
  ],
  districts: [
    // ── Maharashtra ──
    { id: "pune", name: "Pune", state: "Maharashtra", values: { digitization_pct: 62, urbanization_pct: 61, fragmentation_idx: 48, court_clearance_pct: 55 }, actualRiskLevel: "Medium", actualConflictCount: 87 },
    { id: "nagpur", name: "Nagpur", state: "Maharashtra", values: { digitization_pct: 78, urbanization_pct: 42, fragmentation_idx: 28, court_clearance_pct: 70 }, actualRiskLevel: "Low", actualConflictCount: 23 },
    { id: "thane", name: "Thane", state: "Maharashtra", values: { digitization_pct: 35, urbanization_pct: 82, fragmentation_idx: 65, court_clearance_pct: 30 }, actualRiskLevel: "High", actualConflictCount: 184 },
    { id: "solapur", name: "Solapur", state: "Maharashtra", values: { digitization_pct: 55, urbanization_pct: 38, fragmentation_idx: 52, court_clearance_pct: 48 }, actualRiskLevel: "Medium", actualConflictCount: 64 },

    // ── Rajasthan ──
    { id: "jaipur", name: "Jaipur", state: "Rajasthan", values: { digitization_pct: 58, urbanization_pct: 52, fragmentation_idx: 42, court_clearance_pct: 45 }, actualRiskLevel: "Medium", actualConflictCount: 96 },
    { id: "jaisalmer", name: "Jaisalmer", state: "Rajasthan", values: { digitization_pct: 72, urbanization_pct: 12, fragmentation_idx: 18, court_clearance_pct: 78 }, actualRiskLevel: "Low", actualConflictCount: 11 },
    { id: "barmer", name: "Barmer", state: "Rajasthan", values: { digitization_pct: 48, urbanization_pct: 22, fragmentation_idx: 55, court_clearance_pct: 38 }, actualRiskLevel: "Medium", actualConflictCount: 58 },
    { id: "ajmer", name: "Ajmer", state: "Rajasthan", values: { digitization_pct: 80, urbanization_pct: 30, fragmentation_idx: 25, court_clearance_pct: 72 }, actualRiskLevel: "Low", actualConflictCount: 18 },

    // ── Uttar Pradesh ──
    { id: "lucknow", name: "Lucknow", state: "Uttar Pradesh", values: { digitization_pct: 28, urbanization_pct: 68, fragmentation_idx: 72, court_clearance_pct: 22 }, actualRiskLevel: "High", actualConflictCount: 212 },
    { id: "varanasi", name: "Varanasi", state: "Uttar Pradesh", values: { digitization_pct: 42, urbanization_pct: 45, fragmentation_idx: 62, court_clearance_pct: 35 }, actualRiskLevel: "Medium", actualConflictCount: 134 },
    { id: "jhansi", name: "Jhansi", state: "Uttar Pradesh", values: { digitization_pct: 22, urbanization_pct: 55, fragmentation_idx: 70, court_clearance_pct: 18 }, actualRiskLevel: "High", actualConflictCount: 178 },
    { id: "agra", name: "Agra", state: "Uttar Pradesh", values: { digitization_pct: 38, urbanization_pct: 58, fragmentation_idx: 55, court_clearance_pct: 40 }, actualRiskLevel: "Medium", actualConflictCount: 108 },

    // ── Karnataka ──
    { id: "bengaluru-urban", name: "Bengaluru Urban", state: "Karnataka", values: { digitization_pct: 30, urbanization_pct: 91, fragmentation_idx: 68, court_clearance_pct: 28 }, actualRiskLevel: "High", actualConflictCount: 245 },
    { id: "dharwad", name: "Dharwad", state: "Karnataka", values: { digitization_pct: 60, urbanization_pct: 40, fragmentation_idx: 42, court_clearance_pct: 52 }, actualRiskLevel: "Medium", actualConflictCount: 72 },
    { id: "mysuru", name: "Mysuru", state: "Karnataka", values: { digitization_pct: 82, urbanization_pct: 28, fragmentation_idx: 22, court_clearance_pct: 75 }, actualRiskLevel: "Low", actualConflictCount: 19 },

    // ── Odisha ──
    { id: "sambalpur", name: "Sambalpur", state: "Odisha", values: { digitization_pct: 20, urbanization_pct: 48, fragmentation_idx: 65, court_clearance_pct: 25 }, actualRiskLevel: "High", actualConflictCount: 142 },
    { id: "cuttack", name: "Cuttack", state: "Odisha", values: { digitization_pct: 52, urbanization_pct: 38, fragmentation_idx: 48, court_clearance_pct: 45 }, actualRiskLevel: "Medium", actualConflictCount: 78 },
    { id: "koraput", name: "Koraput", state: "Odisha", values: { digitization_pct: 35, urbanization_pct: 15, fragmentation_idx: 58, court_clearance_pct: 32 }, actualRiskLevel: "Medium", actualConflictCount: 65 },

    // ── Madhya Pradesh ──
    { id: "bhopal", name: "Bhopal", state: "Madhya Pradesh", values: { digitization_pct: 55, urbanization_pct: 65, fragmentation_idx: 45, court_clearance_pct: 42 }, actualRiskLevel: "Medium", actualConflictCount: 92 },
    { id: "sehore", name: "Sehore", state: "Madhya Pradesh", values: { digitization_pct: 85, urbanization_pct: 18, fragmentation_idx: 20, court_clearance_pct: 80 }, actualRiskLevel: "Low", actualConflictCount: 12 },
    { id: "indore", name: "Indore", state: "Madhya Pradesh", values: { digitization_pct: 48, urbanization_pct: 72, fragmentation_idx: 52, court_clearance_pct: 38 }, actualRiskLevel: "Medium", actualConflictCount: 105 },

    // ── Tamil Nadu ──
    { id: "chennai", name: "Chennai", state: "Tamil Nadu", values: { digitization_pct: 25, urbanization_pct: 88, fragmentation_idx: 72, court_clearance_pct: 32 }, actualRiskLevel: "High", actualConflictCount: 198 },
    { id: "thanjavur", name: "Thanjavur", state: "Tamil Nadu", values: { digitization_pct: 65, urbanization_pct: 25, fragmentation_idx: 55, court_clearance_pct: 50 }, actualRiskLevel: "Medium", actualConflictCount: 58 },
    { id: "madurai", name: "Madurai", state: "Tamil Nadu", values: { digitization_pct: 50, urbanization_pct: 52, fragmentation_idx: 48, court_clearance_pct: 45 }, actualRiskLevel: "Medium", actualConflictCount: 82 },

    // ── West Bengal ──
    { id: "kolkata", name: "Kolkata", state: "West Bengal", values: { digitization_pct: 18, urbanization_pct: 95, fragmentation_idx: 78, court_clearance_pct: 20 }, actualRiskLevel: "High", actualConflictCount: 310 },
    { id: "howrah", name: "Howrah", state: "West Bengal", values: { digitization_pct: 32, urbanization_pct: 62, fragmentation_idx: 60, court_clearance_pct: 35 }, actualRiskLevel: "Medium", actualConflictCount: 125 },
    { id: "paschim-medinipur", name: "Paschim Medinipur", state: "West Bengal", values: { digitization_pct: 42, urbanization_pct: 18, fragmentation_idx: 52, court_clearance_pct: 42 }, actualRiskLevel: "Medium", actualConflictCount: 72 },

    // ── Bihar ──
    { id: "patna", name: "Patna", state: "Bihar", values: { digitization_pct: 15, urbanization_pct: 58, fragmentation_idx: 82, court_clearance_pct: 15 }, actualRiskLevel: "High", actualConflictCount: 285 },
    { id: "gaya", name: "Gaya", state: "Bihar", values: { digitization_pct: 25, urbanization_pct: 22, fragmentation_idx: 68, court_clearance_pct: 28 }, actualRiskLevel: "Medium", actualConflictCount: 95 },
    { id: "bhagalpur", name: "Bhagalpur", state: "Bihar", values: { digitization_pct: 30, urbanization_pct: 35, fragmentation_idx: 65, court_clearance_pct: 32 }, actualRiskLevel: "Medium", actualConflictCount: 88 },
  ],
};

// GeoJSON URL for India state boundaries (public domain, DataMeet / Natural Earth derived)
// NOTE: For production, host this file locally and verify license terms
export const INDIA_GEOJSON_URL =
  "https://gist.githubusercontent.com/jbrobst/56c13bbbf9d97d187fea01ca62ea5112/raw/e388c4cae20aa53cb5090210a42ebb9b765c0a36/india_states.geojson";
