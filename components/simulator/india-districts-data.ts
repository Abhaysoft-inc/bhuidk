// ────────────────────────────────────────────────────────────────────
// India States & Districts Geo-Registry for BhoomiIntel / BLIN
// Enables territorial filtering, camera auto-flight, and jurisdiction tagging
// ────────────────────────────────────────────────────────────────────

export interface DistrictGeoData {
  id: string;
  name: string;
  state_id: string;
  state_name: string;
  portal: string;
  record_type: string;
  center: [number, number]; // [lat, lng]
  zoom: number;
  bounds: [[number, number], [number, number]]; // [[south, west], [north, east]]
  boundary: [number, number][]; // [lat, lng][] perimeter for boundary stroke & mask
  tehsils: string[];
  description: string;
}

export interface StateGeoData {
  id: string;
  name: string;
  code: string;
  portal: string;
  center: [number, number];
  zoom: number;
  bounds: [[number, number], [number, number]];
  districts: DistrictGeoData[];
}

export const INDIAN_STATES: StateGeoData[] = [
  {
    id: "maharashtra",
    name: "Maharashtra",
    code: "MH",
    portal: "MahaBhumi (7/12 & 8A)",
    center: [19.7515, 75.7139],
    zoom: 7,
    bounds: [
      [15.6, 72.6],
      [22.1, 80.9],
    ],
    districts: [
      {
        id: "pune",
        name: "Pune",
        state_id: "maharashtra",
        state_name: "Maharashtra",
        portal: "MahaBhumi Portal (Mahabhunaksha)",
        record_type: "7/12 & 8A Extract",
        center: [18.5204, 73.8567],
        zoom: 11,
        bounds: [
          [18.05, 73.30],
          [19.25, 74.85],
        ],
        boundary: [
          [19.23, 73.85],
          [19.12, 74.25],
          [18.85, 74.75],
          [18.55, 74.85],
          [18.25, 74.70],
          [18.08, 74.30],
          [18.15, 73.70],
          [18.35, 73.35],
          [18.70, 73.40],
          [18.95, 73.55],
          [19.23, 73.85],
        ],
        tehsils: ["Haveli", "Khed (Chakan)", "Maval (Talegaon)", "Shirur", "Baramati", "Daund", "Ambegaon"],
        description: "Automotive, Engineering & IT Hub • Chakan Phase I-V, Talegaon MIDC, Hinjewadi",
      },
      {
        id: "mumbai_suburban",
        name: "Mumbai Suburban",
        state_id: "maharashtra",
        state_name: "Maharashtra",
        portal: "MahaBhumi Portal",
        record_type: "Property Card (PR Card)",
        center: [19.1136, 72.8697],
        zoom: 12,
        bounds: [
          [19.00, 72.75],
          [19.35, 73.05],
        ],
        boundary: [
          [19.32, 72.85],
          [19.30, 72.98],
          [19.15, 73.02],
          [19.00, 72.92],
          [19.02, 72.82],
          [19.18, 72.78],
          [19.32, 72.85],
        ],
        tehsils: ["Andheri", "Borivali", "Kurla"],
        description: "High-density urban commercial and residential zones with CTS cadastral indexing.",
      },
      {
        id: "thane",
        name: "Thane",
        state_id: "maharashtra",
        state_name: "Maharashtra",
        portal: "MahaBhumi Portal",
        record_type: "7/12 & 8A Extract",
        center: [19.2183, 72.9781],
        zoom: 11,
        bounds: [
          [19.10, 72.85],
          [19.70, 73.50],
        ],
        boundary: [
          [19.68, 73.15],
          [19.55, 73.45],
          [19.25, 73.42],
          [19.12, 73.10],
          [19.15, 72.90],
          [19.40, 72.92],
          [19.68, 73.15],
        ],
        tehsils: ["Thane", "Kalyan", "Bhiwandi", "Ulhasnagar", "Ambarnath"],
        description: "Major warehousing, chemical clusters, and JNPT logistics connectivity.",
      },
      {
        id: "nagpur",
        name: "Nagpur",
        state_id: "maharashtra",
        state_name: "Maharashtra",
        portal: "MahaBhumi Portal",
        record_type: "7/12 & 8A Extract",
        center: [21.1458, 79.0882],
        zoom: 11,
        bounds: [
          [20.55, 78.50],
          [21.75, 79.60],
        ],
        boundary: [
          [21.65, 79.00],
          [21.50, 79.45],
          [21.10, 79.55],
          [20.70, 79.25],
          [20.65, 78.75],
          [21.05, 78.60],
          [21.40, 78.75],
          [21.65, 79.00],
        ],
        tehsils: ["Nagpur Urban", "Nagpur Rural", "Hingna", "Kamthi", "Umred"],
        description: "Multi-Modal International Cargo Hub and Airport at Nagpur (MIHAN SEZ).",
      },
      {
        id: "nashik",
        name: "Nashik",
        state_id: "maharashtra",
        state_name: "Maharashtra",
        portal: "MahaBhumi Portal",
        record_type: "7/12 & 8A Extract",
        center: [19.9975, 73.7898],
        zoom: 11,
        bounds: [
          [19.50, 73.20],
          [20.70, 74.80],
        ],
        boundary: [
          [20.60, 73.90],
          [20.45, 74.60],
          [19.90, 74.70],
          [19.60, 74.10],
          [19.65, 73.40],
          [20.10, 73.35],
          [20.60, 73.90],
        ],
        tehsils: ["Nashik", "Sinnar", "Igatpuri", "Niphad", "Dindori"],
        description: "Defense aviation (HAL Ozar), agro-processing, and DMIC node (Sinnar).",
      },
    ],
  },
  {
    id: "uttar_pradesh",
    name: "Uttar Pradesh",
    code: "UP",
    portal: "Bhulekh UP (Khatauni & Khasra)",
    center: [26.8467, 80.9462],
    zoom: 7,
    bounds: [
      [23.8, 77.0],
      [30.4, 84.6],
    ],
    districts: [
      {
        id: "gautam_buddha_nagar",
        name: "Gautam Buddha Nagar (Noida)",
        state_id: "uttar_pradesh",
        state_name: "Uttar Pradesh",
        portal: "Bhulekh UP & BhuNaksha UP",
        record_type: "Khatauni (RoR) & Khasra",
        center: [28.3245, 77.5312],
        zoom: 11,
        bounds: [
          [28.10, 77.30],
          [28.65, 77.75],
        ],
        boundary: [
          [28.62, 77.35],
          [28.60, 77.62],
          [28.40, 77.72],
          [28.15, 77.65],
          [28.12, 77.40],
          [28.35, 77.32],
          [28.62, 77.35],
        ],
        tehsils: ["Noida", "Dadri", "Jewar"],
        description: "Yamuna Expressway Industrial Development Authority (YEIDA), Jewar Airport, Electronic City.",
      },
      {
        id: "lucknow",
        name: "Lucknow",
        state_id: "uttar_pradesh",
        state_name: "Uttar Pradesh",
        portal: "Bhulekh UP",
        record_type: "Khatauni",
        center: [26.8467, 80.9462],
        zoom: 11,
        bounds: [
          [26.50, 80.60],
          [27.20, 81.35],
        ],
        boundary: [
          [27.15, 80.90],
          [27.05, 81.25],
          [26.70, 81.30],
          [26.55, 80.95],
          [26.65, 80.65],
          [26.95, 80.68],
          [27.15, 80.90],
        ],
        tehsils: ["Lucknow Sadar", "Bakshi Ka Talab", "Mohanlalganj", "Malihabad"],
        description: "Capital administrative hub, Lucknow-Kanpur Industrial Corridor, Purvanchal Expressway.",
      },
      {
        id: "kanpur_nagar",
        name: "Kanpur Nagar",
        state_id: "uttar_pradesh",
        state_name: "Uttar Pradesh",
        portal: "Bhulekh UP",
        record_type: "Khatauni",
        center: [26.4499, 80.3319],
        zoom: 11,
        bounds: [
          [26.10, 79.90],
          [26.80, 80.65],
        ],
        boundary: [
          [26.75, 80.20],
          [26.65, 80.55],
          [26.30, 80.60],
          [26.15, 80.25],
          [26.20, 79.95],
          [26.55, 79.98],
          [26.75, 80.20],
        ],
        tehsils: ["Kanpur Sadar", "Bilhaur", "Ghatampur"],
        description: "Textile, defense manufacturing node, leather cluster and heavy engineering.",
      },
      {
        id: "agra",
        name: "Agra",
        state_id: "uttar_pradesh",
        state_name: "Uttar Pradesh",
        portal: "Bhulekh UP",
        record_type: "Khatauni",
        center: [27.1767, 78.0081],
        zoom: 11,
        bounds: [
          [26.70, 77.40],
          [27.45, 78.50],
        ],
        boundary: [
          [27.40, 77.85],
          [27.35, 78.35],
          [26.95, 78.45],
          [26.75, 77.95],
          [26.85, 77.50],
          [27.20, 77.52],
          [27.40, 77.85],
        ],
        tehsils: ["Agra Sadar", "Fatehabad", "Etmadpur", "Kheragarh", "Bah"],
        description: "Taj Trapezium Zone (TTZ environmental regulations), Yamuna & Agra-Lucknow Expressways.",
      },
    ],
  },
  {
    id: "karnataka",
    name: "Karnataka",
    code: "KA",
    portal: "Bhoomi (RTC / Pahani & Mojini)",
    center: [15.3173, 75.7139],
    zoom: 7,
    bounds: [
      [11.5, 74.0],
      [18.5, 78.6],
    ],
    districts: [
      {
        id: "bengaluru_urban",
        name: "Bengaluru Urban",
        state_id: "karnataka",
        state_name: "Karnataka",
        portal: "Bhoomi & Mojini (KSRSAC)",
        record_type: "RTC (Pahani) & Khata",
        center: [12.9716, 77.5946],
        zoom: 11,
        bounds: [
          [12.75, 77.40],
          [13.20, 77.85],
        ],
        boundary: [
          [13.18, 77.55],
          [13.12, 77.78],
          [12.85, 77.82],
          [12.78, 77.55],
          [12.85, 77.42],
          [13.05, 77.45],
          [13.18, 77.55],
        ],
        tehsils: ["Bengaluru North", "Bengaluru South", "Bengaluru East", "Anekal"],
        description: "Silicon Valley of India • Electronics City, Whitefield, ITPL, KIADB aerospace park.",
      },
      {
        id: "bengaluru_rural",
        name: "Bengaluru Rural",
        state_id: "karnataka",
        state_name: "Karnataka",
        portal: "Bhoomi & Mojini",
        record_type: "RTC (Pahani)",
        center: [13.2500, 77.6500],
        zoom: 11,
        bounds: [
          [13.00, 77.35],
          [13.55, 77.95],
        ],
        boundary: [
          [13.52, 77.60],
          [13.45, 77.90],
          [13.15, 77.88],
          [13.05, 77.48],
          [13.20, 77.38],
          [13.52, 77.60],
        ],
        tehsils: ["Devanahalli (KIA)", "Doddaballapur", "Hoskote", "Nelamangala"],
        description: "Kempegowda International Airport cluster, logistics corridors, STRR growth zones.",
      },
      {
        id: "mysuru",
        name: "Mysuru",
        state_id: "karnataka",
        state_name: "Karnataka",
        portal: "Bhoomi",
        record_type: "RTC (Pahani)",
        center: [12.2958, 76.6394],
        zoom: 11,
        bounds: [
          [11.75, 75.95],
          [12.65, 77.20],
        ],
        boundary: [
          [12.60, 76.45],
          [12.55, 76.95],
          [12.10, 77.10],
          [11.85, 76.60],
          [11.95, 76.10],
          [12.35, 76.05],
          [12.60, 76.45],
        ],
        tehsils: ["Mysuru", "Nanjangud", "Hunsur", "T. Narasipura"],
        description: "Heritage & clean manufacturing belt on the 10-lane Bengaluru-Mysuru Expressway.",
      },
    ],
  },
  {
    id: "telangana",
    name: "Telangana",
    code: "TS",
    portal: "Dharani Portal (Integrated Land Records)",
    center: [17.8749, 78.1008],
    zoom: 7,
    bounds: [
      [15.8, 77.2],
      [19.9, 81.8],
    ],
    districts: [
      {
        id: "hyderabad",
        name: "Hyderabad",
        state_id: "telangana",
        state_name: "Telangana",
        portal: "Dharani Portal",
        record_type: "e-Passbook & RoR-1B",
        center: [17.3850, 78.4867],
        zoom: 12,
        bounds: [
          [17.20, 78.30],
          [17.55, 78.60],
        ],
        boundary: [
          [17.52, 78.45],
          [17.48, 78.58],
          [17.32, 78.56],
          [17.25, 78.42],
          [17.35, 78.35],
          [17.52, 78.45],
        ],
        tehsils: ["Shaikpet", "Asifnagar", "Secunderabad", "Khairatabad"],
        description: "HITEC City, Financial District, Genome Valley, and Outer Ring Road (ORR).",
      },
      {
        id: "rangareddy",
        name: "Rangareddy",
        state_id: "telangana",
        state_name: "Telangana",
        portal: "Dharani Portal",
        record_type: "e-Passbook",
        center: [17.2000, 78.3500],
        zoom: 11,
        bounds: [
          [16.85, 77.80],
          [17.60, 78.90],
        ],
        boundary: [
          [17.55, 78.25],
          [17.50, 78.80],
          [17.00, 78.85],
          [16.90, 78.20],
          [17.15, 77.90],
          [17.55, 78.25],
        ],
        tehsils: ["Shamshabad (RGIA)", "Rajendranagar", "Ibrahimpatnam", "Maheshwaram"],
        description: "Rajiv Gandhi International Airport (RGIA) aerotropolis and hardware/electronic clusters.",
      },
    ],
  },
  {
    id: "gujarat",
    name: "Gujarat",
    code: "GJ",
    portal: "AnyRoR Gujarat (7/12 & 8A)",
    center: [22.2587, 71.1924],
    zoom: 7,
    bounds: [
      [20.1, 68.1],
      [24.7, 74.5],
    ],
    districts: [
      {
        id: "ahmedabad",
        name: "Ahmedabad",
        state_id: "gujarat",
        state_name: "Gujarat",
        portal: "AnyRoR & e-Dhara",
        record_type: "7/12 & 8A",
        center: [23.0225, 72.5714],
        zoom: 11,
        bounds: [
          [22.40, 71.80],
          [23.40, 73.10],
        ],
        boundary: [
          [23.35, 72.45],
          [23.25, 72.95],
          [22.65, 73.05],
          [22.45, 72.35],
          [22.80, 71.95],
          [23.35, 72.45],
        ],
        tehsils: ["Sanand", "Dholera", "Daskroi", "Bavla", "Viramgam"],
        description: "Sanand Auto Hub, Dholera Special Investment Region (DSIR semiconductor hub).",
      },
      {
        id: "surat",
        name: "Surat",
        state_id: "gujarat",
        state_name: "Gujarat",
        portal: "AnyRoR",
        record_type: "7/12 & 8A",
        center: [21.1702, 72.8311],
        zoom: 11,
        bounds: [
          [20.80, 72.60],
          [21.50, 73.40],
        ],
        boundary: [
          [21.45, 72.75],
          [21.42, 73.30],
          [20.95, 73.35],
          [20.85, 72.85],
          [21.05, 72.65],
          [21.45, 72.75],
        ],
        tehsils: ["Chorasi", "Olpad", "Mangrol", "Palsana", "Bardoli"],
        description: "Diamond research & mercantile city, Hazira port manufacturing cluster, textiles.",
      },
    ],
  },
  {
    id: "haryana",
    name: "Haryana",
    code: "HR",
    portal: "Jamabandi Haryana (HALRIS)",
    center: [29.0588, 76.0856],
    zoom: 8,
    bounds: [
      [27.6, 74.4],
      [30.9, 77.6],
    ],
    districts: [
      {
        id: "gurugram",
        name: "Gurugram",
        state_id: "haryana",
        state_name: "Haryana",
        portal: "Jamabandi Haryana (HALRIS)",
        record_type: "Nakhal Jamabandi (RoR)",
        center: [28.4595, 77.0266],
        zoom: 11,
        bounds: [
          [28.25, 76.75],
          [28.60, 77.20],
        ],
        boundary: [
          [28.58, 76.95],
          [28.52, 77.15],
          [28.32, 77.12],
          [28.28, 76.85],
          [28.42, 76.78],
          [28.58, 76.95],
        ],
        tehsils: ["Gurugram", "Manesar", "Sohna", "Farrukhnagar", "Pataudi"],
        description: "Cyber City, DLF CyberHub, IMT Manesar automobile cluster, KMP Expressway.",
      },
    ],
  },
  {
    id: "rajasthan",
    name: "Rajasthan",
    code: "RJ",
    portal: "Apna Khata (E-Dharti)",
    center: [27.0238, 74.2179],
    zoom: 7,
    bounds: [
      [23.0, 69.5],
      [30.2, 78.3],
    ],
    districts: [
      {
        id: "jaipur",
        name: "Jaipur",
        state_id: "rajasthan",
        state_name: "Rajasthan",
        portal: "Apna Khata (E-Dharti)",
        record_type: "Jamabandi Nakal",
        center: [26.9124, 75.7873],
        zoom: 11,
        bounds: [
          [26.40, 75.20],
          [27.40, 76.30],
        ],
        boundary: [
          [27.35, 75.75],
          [27.15, 76.25],
          [26.65, 76.20],
          [26.45, 75.60],
          [26.75, 75.25],
          [27.35, 75.75],
        ],
        tehsils: ["Jaipur", "Sanganer", "Amer", "Chaksu", "Kotputli"],
        description: "Mahindra World City SEZ, Sitapura Industrial Area, Delhi-Mumbai Industrial Corridor.",
      },
    ],
  },
];

// Helper to look up district by ID across all states
export function getDistrictById(districtId: string): DistrictGeoData | null {
  for (const state of INDIAN_STATES) {
    const found = state.districts.find((d) => d.id === districtId);
    if (found) return found;
  }
  return null;
}

// Helper to look up state by ID
export function getStateById(stateId: string): StateGeoData | null {
  return INDIAN_STATES.find((s) => s.id === stateId) || null;
}

// Generates an inverted world polygon mask with the district polygon as a hole
// Leaflet Polygon: [outerWorldRing, districtHoleRing]
export function generateInvertedDistrictMask(districtBoundary: [number, number][]): [number, number][][] {
  const worldOuterRing: [number, number][] = [
    [-85, -180],
    [-85, 180],
    [85, 180],
    [85, -180],
  ];
  return [worldOuterRing, districtBoundary];
}
