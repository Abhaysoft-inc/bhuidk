'use client'

import React from 'react';

export default function NotificationsPage() {
  return (
    <div className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="flex justify-between items-end border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-serif text-primary">Notification Center</h1>
          <p className="text-sm text-mutedForeground mt-1">Platform alerts, AI insights, and task updates.</p>
        </div>
        <button className="text-sm font-medium text-mutedForeground hover:text-foreground transition-colors">
          Mark all as read
        </button>
      </div>

      <div className="flex flex-col gap-8">
        
        {/* Group 1: Critical Alerts (Disputes) */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-bold text-mutedForeground uppercase tracking-wider mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-danger animate-pulse"></span>
            Critical Geofence Alerts
          </h2>
          
          <div className="bg-white border border-danger/30 p-4 rounded-md shadow-sm border-l-4 border-l-danger flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-danger/10 text-danger flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-foreground">Dispute Hotspot Triggered: Sector 45, Gurugram</h4>
              <p className="text-xs text-mutedForeground mt-1">AI detected a 40% anomaly in title contestations within the last 48 hours for this zone.</p>
              <div className="text-[10px] text-mutedForeground mt-2">10 mins ago</div>
            </div>
            <button className="px-3 py-1.5 bg-background border border-border text-xs font-medium rounded-sm hover:bg-muted">View Map</button>
          </div>
        </section>

        {/* Group 2: AI & Analytics */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-bold text-mutedForeground uppercase tracking-wider mb-2">AI & Analytics</h2>
          
          <div className="bg-white border border-border p-4 rounded-md shadow-sm flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" x2="12" y1="22.08" y2="12"/></svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-foreground">Simulation Complete: Transit Corridor FSI</h4>
              <p className="text-xs text-mutedForeground mt-1">The Digital Twin simulation you initiated has finished rendering. Impact reports are ready.</p>
              <div className="text-[10px] text-mutedForeground mt-2">1 hour ago</div>
            </div>
            <button className="px-3 py-1.5 bg-background border border-border text-xs font-medium rounded-sm hover:bg-muted">View Report</button>
          </div>

          <div className="bg-white border border-border p-4 rounded-md shadow-sm flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-foreground">New Research Match</h4>
              <p className="text-xs text-mutedForeground mt-1">A new policy brief on "Urban Ecological Buffers" matching your saved Copilot query has been ingested.</p>
              <div className="text-[10px] text-mutedForeground mt-2">Yesterday</div>
            </div>
            <button className="px-3 py-1.5 bg-background border border-border text-xs font-medium rounded-sm hover:bg-muted">Read</button>
          </div>
        </section>

      </div>
    </div>
  );
}
