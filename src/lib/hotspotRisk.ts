export interface GridCellData {
  cellId: string;
  landUseChangeVelocity: number; // 0 to 1 scale (e.g. rapid conversion of agri to residential)
  populationDensityNormalized: number; // 0 to 1 scale
  historicalDisputeDensity: number; // 0 to 1 scale
}

export interface HotspotPrediction {
  cellId: string;
  riskScore: number; // 0 to 100
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  contributingFactors: {
    velocityImpact: number;
    densityImpact: number;
    historicalImpact: number;
  }
}

/**
 * Calculates a weighted dispute risk score for a geographic grid cell.
 * Weights: Land Use Velocity (40%), Historical Disputes (40%), Population Density (20%).
 */
export function calculateHotspotRisk(data: GridCellData): HotspotPrediction {
  const WEIGHT_VELOCITY = 0.40;
  const WEIGHT_HISTORICAL = 0.40;
  const WEIGHT_DENSITY = 0.20;

  const velocityImpact = data.landUseChangeVelocity * WEIGHT_VELOCITY;
  const historicalImpact = data.historicalDisputeDensity * WEIGHT_HISTORICAL;
  const densityImpact = data.populationDensityNormalized * WEIGHT_DENSITY;

  const totalScoreNormalized = velocityImpact + historicalImpact + densityImpact;
  const riskScore = Math.round(totalScoreNormalized * 100);

  let riskLevel: HotspotPrediction['riskLevel'] = 'Low';
  if (riskScore >= 80) riskLevel = 'Critical';
  else if (riskScore >= 60) riskLevel = 'High';
  else if (riskScore >= 40) riskLevel = 'Medium';

  return {
    cellId: data.cellId,
    riskScore,
    riskLevel,
    contributingFactors: {
      velocityImpact: Math.round(velocityImpact * 100),
      historicalImpact: Math.round(historicalImpact * 100),
      densityImpact: Math.round(densityImpact * 100)
    }
  };
}
