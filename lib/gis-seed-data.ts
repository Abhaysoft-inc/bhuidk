import { featureCollection, polygon, point } from "@turf/turf";

// Realistic center coordinates for 5 Indian districts
const DISTRICTS = {
  Pune: { lng: 73.8567, lat: 18.5204 },
  Lucknow: { lng: 80.9462, lat: 26.8467 },
  Jaipur: { lng: 75.7873, lat: 26.9124 },
  Bengaluru: { lng: 77.5946, lat: 12.9716 },
  Bhubaneswar: { lng: 85.8245, lat: 20.2961 },
};

const LAND_USE_TYPES = ["Agricultural", "Residential", "Commercial", "Industrial", "Forest", "Water Body"];
const OWNERSHIP_STATUS = ["clear", "disputed", "unclear"];

// Generate a grid of parcels around a center point
function generateParcelsForDistrict(center: { lng: number; lat: number }, count: number, prefix: string) {
  const parcels = [];
  const gridSize = Math.ceil(Math.sqrt(count));
  const step = 0.005; // Approx 500m
  
  let idCounter = 1;
  
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (idCounter > count) break;
      
      const lng = center.lng + (i - gridSize/2) * step;
      const lat = center.lat + (j - gridSize/2) * step;
      
      // Leave a small gap between parcels to represent streets/paths
      const gap = step * 0.05;
      
      const p1 = [lng + gap, lat + gap];
      const p2 = [lng + step - gap, lat + gap];
      const p3 = [lng + step - gap, lat + step - gap];
      const p4 = [lng + gap, lat + step - gap];

      const p = polygon([[
        p1,
        p2,
        p3,
        p4,
        p1 // close polygon exactly with the first point
      ]], {
        ulpin_id: `${prefix}-${10000 + idCounter}`,
        land_use_type: LAND_USE_TYPES[Math.floor(Math.random() * LAND_USE_TYPES.length)],
        dispute_count: Math.random() > 0.8 ? Math.floor(Math.random() * 3) + 1 : 0,
        climate_risk_score: Math.floor(Math.random() * 100),
        last_change_detected_date: `202${Math.floor(Math.random() * 4) + 2}-0${Math.floor(Math.random() * 9) + 1}-15`,
        ownership_status: OWNERSHIP_STATUS[Math.floor(Math.random() * OWNERSHIP_STATUS.length)],
        litigation_risk_score: Math.floor(Math.random() * 100),
        land_value: Math.floor(Math.random() * 5000000) + 1000000,
        district: prefix
      });
      
      parcels.push(p);
      idCounter++;
    }
  }
  
  return parcels;
}

export function generateAllSeedData() {
  const allParcels = [
    ...generateParcelsForDistrict(DISTRICTS.Pune, 200, "MH-PUN"),
    ...generateParcelsForDistrict(DISTRICTS.Lucknow, 200, "UP-LKO"),
    ...generateParcelsForDistrict(DISTRICTS.Jaipur, 200, "RJ-JAI"),
    ...generateParcelsForDistrict(DISTRICTS.Bengaluru, 200, "KA-BLR"),
    ...generateParcelsForDistrict(DISTRICTS.Bhubaneswar, 200, "OD-BBI"),
  ];
  
  return featureCollection(allParcels);
}

// Generate interstate border conflicts
export function generateBorderConflicts() {
  const conflicts = [
    polygon([[
      [74.5, 16.5],
      [74.6, 16.5],
      [74.6, 16.6],
      [74.5, 16.6],
      [74.5, 16.5]
    ]], {
      id: "BC-01",
      title: "Belagavi Border Dispute",
      states_involved: ["Maharashtra", "Karnataka"],
      description: "Historical linguistic and administrative claim dispute dating back to the States Reorganisation Act, 1956.",
      status: "Supreme Court Pending"
    })
  ];
  return featureCollection(conflicts);
}
