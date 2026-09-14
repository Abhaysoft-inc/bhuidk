'use client'

import React from 'react';
import { motion } from 'framer-motion';
import MapViewer from '@/components/map/MapViewer';

export default function Home() {
  return (
    <div className="flex-1 p-6 md:p-8 flex flex-col gap-8 max-w-[1600px] mx-auto w-full">
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col gap-2 border-b border-border pb-6"
      >
        <h1 className="text-3xl md:text-4xl font-serif text-primary">National Land Governance Overview</h1>
        <p className="text-mutedForeground max-w-2xl text-balance">
          Real-time monitoring of land record digitization, dispute resolution, and policy implementation across all districts.
        </p>
      </motion.header>

      {/* KPI Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Digitized Parcels", value: "14.2M", sub: "Across 28 states and 8 Union Territories", change: "+4.2%", type: "success" },
          { label: "Active Disputes", value: "342k", sub: "Pending in revenue courts", change: "-1.1%", type: "danger" },
          { label: "Policy Compliance", value: "87%", sub: "SVAMITVA scheme adoption rate", change: "On Track", type: "success" }
        ].map((kpi, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="bg-background border border-border rounded-md p-6 shadow-card flex flex-col gap-4 hover:border-accent transition-colors"
          >
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-mutedForeground uppercase tracking-wider">{kpi.label}</span>
              <span className={`text-xs font-semibold px-2 py-1 rounded-sm ${kpi.type === 'success' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                {kpi.change}
              </span>
            </div>
            <div className="text-4xl font-serif text-primary">{kpi.value}</div>
            <div className="text-xs text-mutedForeground">{kpi.sub}</div>
          </motion.div>
        ))}
      </section>

      {/* Main Content Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        
        {/* Map Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="lg:col-span-2 flex flex-col gap-4 h-[600px] lg:h-auto"
        >
          <div className="flex justify-between items-end border-b border-border pb-2">
            <h2 className="text-lg font-serif font-medium text-primary">Spatial Distribution</h2>
            <div className="flex gap-2 text-xs">
              <button className="px-3 py-1 bg-muted text-mutedForeground rounded-sm hover:text-foreground">Digitization Status</button>
              <button className="px-3 py-1 bg-primary text-background rounded-sm shadow-card">Disputes Heatmap</button>
            </div>
          </div>
          <div className="flex-1 rounded-md overflow-hidden shadow-card border border-border">
            <MapViewer />
          </div>
        </motion.div>

        {/* Action/Feed Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-serif font-medium border-b border-border pb-2 text-primary">Recent Notifications</h2>
            <div className="flex flex-col gap-4">
              {[
                { state: "Maharashtra", text: "New industrial zone policy approved in Pune district.", time: "2 hours ago" },
                { state: "Uttar Pradesh", text: "Record digitization completed for 120 villages in Varanasi.", time: "5 hours ago" },
                { state: "Karnataka", text: "Land tribunal cleared 45 pending cases in Bengaluru Urban.", time: "1 day ago" },
                { state: "Kerala", text: "New ecological fragile land notification issued.", time: "2 days ago" }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 group cursor-pointer">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 group-hover:scale-150 transition-transform" />
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-primary">{item.state}</span>
                    <p className="text-sm text-foreground">{item.text}</p>
                    <span className="text-xs text-mutedForeground">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto bg-primary text-background p-6 rounded-md shadow-card relative overflow-hidden group">
            {/* Decorative background element */}
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-accent opacity-20 rounded-full blur-2xl group-hover:opacity-40 transition-opacity" />
            
            <h3 className="font-serif text-lg mb-2 relative z-10">BhoomiIntel Copilot</h3>
            <p className="text-sm opacity-80 mb-6 relative z-10 text-balance">
              Ask questions about land records, policies, or specific district data in English or Hindi.
            </p>
            <button className="w-full py-2.5 bg-accent hover:bg-accent-light text-primary font-bold rounded-sm shadow-card transition-colors text-sm flex items-center justify-center gap-2 relative z-10">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
              Initialize AI Assistant
            </button>
          </div>
        </motion.div>

      </section>
    </div>
  );
}
