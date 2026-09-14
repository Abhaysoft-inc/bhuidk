'use client'

import React from 'react';
import MapViewer from '@/components/map/MapViewer';

export default function GISPage() {
  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
      {/* Overlay controls */}
      <div className="absolute top-20 left-6 z-10 w-72 bg-white/95 backdrop-blur-md border border-border shadow-card rounded-md p-4 flex flex-col gap-4">
        <div>
          <h2 className="font-serif font-bold text-primary mb-1">GIS Intelligence</h2>
          <p className="text-xs text-mutedForeground">Live spatial data & predictive models.</p>
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-foreground border-b border-border pb-1">Active Layers</label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="text-accent focus:ring-accent rounded-sm border-border" defaultChecked />
            Land Dispute Hotspots
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="text-accent focus:ring-accent rounded-sm border-border" defaultChecked />
            SVAMITVA Drone Survey Areas
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="text-accent focus:ring-accent rounded-sm border-border" />
            Ecologically Fragile Zones
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="text-accent focus:ring-accent rounded-sm border-border" />
            Proposed Highway Alignments
          </label>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <label className="text-sm font-semibold text-foreground border-b border-border pb-1">Time Slider (2015 - 2026)</label>
          <input type="range" min="2015" max="2026" defaultValue="2026" className="w-full accent-accent" />
          <div className="flex justify-between text-xs text-mutedForeground font-mono">
            <span>2015</span>
            <span className="font-bold text-accent">2026</span>
          </div>
        </div>

        <button className="mt-2 w-full py-2 bg-danger/10 text-danger hover:bg-danger/20 font-bold text-sm rounded-sm transition-colors flex items-center justify-center gap-2 border border-danger/20">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          Predict Dispute Hotspots
        </button>
      </div>

      <div className="flex-1 w-full h-full relative">
        <MapViewer />
      </div>
    </div>
  );
}
