export const mockSimulationScenario = {
  id: 'SIM-PUNE-METRO-01',
  title: 'Pune Metro Line 3 Transit-Oriented Development (TOD) Zoning Change',
  description: 'Evaluating the impact of increasing base FSI from 1.1 to 4.0 within a 500m radius of the upcoming Metro Line 3 corridor in Hinjewadi, Pune.',
  inputs: {
    district: 'Pune',
    region: 'Hinjewadi - Wakad Corridor',
    zoningChange: 'Commercial & High-Density Residential',
    baseFsiIncrease: '1.1 → 4.0',
    bufferRadius: '500 meters'
  },
  impactReport: {
    economic: {
      score: 92, // out of 100
      summary: 'Highly positive economic impact due to increased commercial real estate supply.',
      details: [
        'Projected property tax revenue increase: +₹450 Cr annually by 2028.',
        'Estimated commercial space addition: 2.5 million sq ft.',
        'New jobs facilitated: ~45,000 direct roles in IT/ITeS.'
      ]
    },
    infrastructureStrain: {
      waterStress: {
        score: 85, // High risk
        summary: 'Critical water shortage risk if Mula river allocation is not increased.',
        details: [
          'Demand will outstrip current pipeline capacity by 35% in peak summer.',
          'Recommendation: Mandate grey-water recycling plants for all buildings > 2000 sq m.'
        ]
      },
      trafficLoad: {
        score: 60, // Medium risk
        summary: 'Traffic load manageable due to Metro, but last-mile feeder networks are deficient.',
        details: [
          'Estimated 40% shift to public transit within 500m buffer.',
          'Local arterial roads (Wakad junction) will still see 15% increase in congestion.'
        ]
      }
    },
    socialAndDisputes: {
      disputeProbability: 38, // % increase in disputes
      summary: 'Significant spike expected in boundary and easement rights disputes.',
      details: [
        'Historical Lookalike: 2018 Mumbai Metro Line 1 TOD resulted in a 32% spike in title disputes.',
        'Anticipated surge in \'shadow-casting\' and right-of-way contestations from existing low-rise owners.',
        'Actionable Insight: Pre-emptively deploy drones (SVAMITVA style) to lock boundary coordinates before policy announcement.'
      ]
    },
    environmental: {
      canopyLoss: '12%',
      urbanHeatIsland: '+1.5°C localized increase',
      mitigation: 'Implement strict mandatory green-roof policies.'
    }
  },
  audit: {
    transactionId: 'TX-8A9F21B',
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    timestamp: '2026-09-14T10:30:00Z',
    verified: true
  }
};
