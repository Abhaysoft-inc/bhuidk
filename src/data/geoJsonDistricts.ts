export const mockDistrictsGeoJson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "pune-01",
      properties: {
        district: "Pune",
        state: "Maharashtra",
        totalAreaSqKm: 15643,
        populationDensity: 603,
        fsiBase: 1.1,
        transitFsiMax: 4.0,
        landUseVelocity: 0.85, // Rapid urbanization
        historicalDisputeDensity: 0.65,
        waterStressIndex: 0.72,
        climateRisk: "Medium-High",
        predominantZoning: "Mixed-Use",
        ongoingSchemes: ["Smart Cities", "AMRUT 2.0", "PMAY"]
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [73.7, 18.4], [74.0, 18.4], [74.0, 18.7], [73.7, 18.7], [73.7, 18.4]
          ]
        ]
      }
    },
    {
      type: "Feature",
      id: "indore-01",
      properties: {
        district: "Indore",
        state: "Madhya Pradesh",
        totalAreaSqKm: 3898,
        populationDensity: 841,
        fsiBase: 1.25,
        transitFsiMax: 3.0,
        landUseVelocity: 0.70,
        historicalDisputeDensity: 0.45,
        waterStressIndex: 0.85,
        climateRisk: "High",
        predominantZoning: "Commercial/Residential",
        ongoingSchemes: ["Smart Cities", "SVAMITVA"]
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [75.8, 22.6], [76.0, 22.6], [76.0, 22.8], [75.8, 22.8], [75.8, 22.6]
          ]
        ]
      }
    },
    {
      type: "Feature",
      id: "surat-01",
      properties: {
        district: "Surat",
        state: "Gujarat",
        totalAreaSqKm: 4418,
        populationDensity: 1376,
        fsiBase: 1.8,
        transitFsiMax: 4.5,
        landUseVelocity: 0.92,
        historicalDisputeDensity: 0.35,
        waterStressIndex: 0.40,
        climateRisk: "Critical (Flood/Coastal)",
        predominantZoning: "Industrial/Commercial",
        ongoingSchemes: ["Smart Cities", "DILRMP"]
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [72.7, 21.0], [73.0, 21.0], [73.0, 21.3], [72.7, 21.3], [72.7, 21.0]
          ]
        ]
      }
    },
    {
      type: "Feature",
      id: "gurugram-01",
      properties: {
        district: "Gurugram",
        state: "Haryana",
        totalAreaSqKm: 1258,
        populationDensity: 1204,
        fsiBase: 1.75,
        transitFsiMax: 3.5,
        landUseVelocity: 0.95,
        historicalDisputeDensity: 0.80,
        waterStressIndex: 0.95,
        climateRisk: "Medium",
        predominantZoning: "Commercial",
        ongoingSchemes: ["RERA compliance drive"]
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [76.9, 28.3], [77.1, 28.3], [77.1, 28.5], [76.9, 28.5], [76.9, 28.3]
          ]
        ]
      }
    }
  ]
};
