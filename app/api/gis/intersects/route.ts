import { NextResponse } from 'next/server';
import { generateAllSeedData } from '@/lib/gis-seed-data';
import { booleanIntersects, buffer, featureCollection } from '@turf/turf';

let cachedData: any = null;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { geometry, bufferDistance } = body;

    if (!geometry) {
      return NextResponse.json({ error: 'Geometry is required' }, { status: 400 });
    }

    if (!cachedData) {
      cachedData = generateAllSeedData();
    }

    // If bufferDistance is provided (for RouteImpactTool), buffer the geometry first
    let queryGeometry = geometry;
    if (bufferDistance) {
      // bufferDistance in km
      queryGeometry = buffer(geometry, bufferDistance, { units: 'kilometers' }).geometry;
    }

    // Perform ST_Intersects simulation using Turf.js
    const intersectingFeatures = cachedData.features.filter((feature: any) => {
      try {
        return booleanIntersects(queryGeometry, feature);
      } catch (e) {
        return false;
      }
    });

    // Calculate stats
    let totalValue = 0;
    let disputedCount = 0;
    const landUseBreakdown: Record<string, number> = {};

    intersectingFeatures.forEach((f: any) => {
      totalValue += f.properties.land_value || 0;
      if (f.properties.ownership_status === 'disputed' || f.properties.dispute_count > 0) {
        disputedCount++;
      }
      
      const type = f.properties.land_use_type;
      landUseBreakdown[type] = (landUseBreakdown[type] || 0) + 1;
    });

    // Simulate network/DB latency
    await new Promise(resolve => setTimeout(resolve, 400));

    return NextResponse.json({
      selectedFeatures: featureCollection(intersectingFeatures),
      stats: {
        totalParcels: intersectingFeatures.length,
        disputedParcels: disputedCount,
        estimatedValue: totalValue,
        landUseBreakdown
      }
    });

  } catch (error) {
    console.error('ST_Intersects Simulation Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
