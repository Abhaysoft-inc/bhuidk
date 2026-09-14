'use client'

import React, { useState } from 'react';
import MapViewer from '@/components/map/MapViewer';

export default function DigitalTwin({ params }: { params: { districtId: string } }) {
  const [groundWater, setGroundWater] = useState(65);
  const [trafficLoad, setTrafficLoad] = useState(40);
  const [zoneOverlay, setZoneOverlay] = useState('mixed');

  return (
    <div className="flex-1 flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Left Panel: Stats and Controls */}
      <div className="w-96 bg-background border-r border-border p-6 flex flex-col gap-6 overflow-y-auto shrink-0 z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-accent/10 text-accent text-xs font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">Live Twin</span>
            <span className="text-mutedForeground text-xs">ID: {params.districtId}</span>
          </div>
          <h1 className="text-3xl font-serif text-primary">Pune District</h1>
          <p className="text-sm text-mutedForeground mt-1 text-balance">
            Real-time multisensor digital twin integrating land records, IoT sensors, and GIS geometry.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border border-border p-3 rounded-md shadow-sm">
            <div className="text-xs text-mutedForeground mb-1 font-medium">Population Dens.</div>
            <div className="text-xl font-serif font-bold text-foreground">12,405</div>
            <div className="text-xs text-danger flex items-center gap-1 mt-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 16 4-4 4 4 8-8"/><path d="M15 8h4v4"/></svg>
              +2.4%
            </div>
          </div>
          <div className="bg-white border border-border p-3 rounded-md shadow-sm">
            <div className="text-xs text-mutedForeground mb-1 font-medium">Active Disputes</div>
            <div className="text-xl font-serif font-bold text-foreground">342</div>
            <div className="text-xs text-success flex items-center gap-1 mt-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 8 4 4 4-4 8 8"/><path d="M15 16h4v-4"/></svg>
              -12.1%
            </div>
          </div>
        </div>

        <div className="h-px bg-border my-2" />

        <div className="flex flex-col gap-6">
          <h3 className="font-serif font-semibold text-primary text-lg">Live Parameters</h3>
          
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-foreground">Groundwater Stress</span>
              <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded-sm">{groundWater}%</span>
            </div>
            <input 
              type="range" min="0" max="100" 
              value={groundWater} 
              onChange={(e) => setGroundWater(Number(e.target.value))} 
              className="w-full accent-danger" 
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-foreground">Transit Load</span>
              <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded-sm">{trafficLoad}%</span>
            </div>
            <input 
              type="range" min="0" max="100" 
              value={trafficLoad} 
              onChange={(e) => setTrafficLoad(Number(e.target.value))} 
              className="w-full accent-accent" 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Zoning Overlay Filter</label>
            <select 
              className="w-full p-2 border border-border rounded-sm bg-white text-sm focus:outline-none focus:border-accent shadow-sm"
              value={zoneOverlay}
              onChange={(e) => setZoneOverlay(e.target.value)}
            >
              <option value="mixed">All Mixed Use</option>
              <option value="residential">Residential Only</option>
              <option value="commercial">Commercial / SEZ</option>
              <option value="agricultural">Agricultural Greenbelt</option>
            </select>
          </div>
        </div>

        <div className="mt-auto pt-6">
          <button className="w-full py-2.5 bg-primary text-background text-sm font-bold rounded-sm shadow-card hover:bg-primary-light transition-colors">
            Generate Twin Report
          </button>
        </div>
      </div>

      {/* Right Panel: Map */}
      <div className="flex-1 relative bg-muted">
        {/* We reuse the MapViewer but pretend it's zoomed in to the district */}
        <MapViewer />
        
        {/* Overlay data visualizations that simulate the "Digital Twin" feel */}
        <div className="absolute top-6 right-6 flex flex-col gap-4 pointer-events-none">
          <div className="bg-background/90 backdrop-blur-md border border-border p-4 rounded-md shadow-card flex flex-col gap-2 w-64">
            <span className="text-xs font-bold text-mutedForeground tracking-wider">SYSTEM STATUS</span>
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground">IoT Sensor Sync</span>
              <span className="text-xs text-success font-mono font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span> ONLINE
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground">Last DILRMP Sync</span>
              <span className="text-xs text-mutedForeground font-mono">2 mins ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
