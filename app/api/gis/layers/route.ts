import { NextResponse } from 'next/server';
import { generateAllSeedData, generateBorderConflicts } from '@/lib/gis-seed-data';

// In-memory cache to simulate DB
let cachedData: any = null;
let cachedConflicts: any = null;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'parcels';
  
  if (!cachedData) {
    cachedData = generateAllSeedData();
    cachedConflicts = generateBorderConflicts();
  }

  // Simulate network latency of a DB query
  await new Promise(resolve => setTimeout(resolve, 300));

  if (type === 'border-conflicts') {
    return NextResponse.json(cachedConflicts);
  }

  return NextResponse.json(cachedData);
}
