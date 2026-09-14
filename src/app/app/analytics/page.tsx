'use client'

import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const disputeData = [
  { month: 'Jan', disputes: 400 },
  { month: 'Feb', disputes: 300 },
  { month: 'Mar', disputes: 550 }, // The spike
  { month: 'Apr', disputes: 200 },
  { month: 'May', disputes: 120 },
  { month: 'Jun', disputes: 80 },
];

const policyData = [
  { name: 'SVAMITVA', score: 85 },
  { name: 'DILRMP', score: 92 },
  { name: 'Forest Act', score: 60 },
  { name: 'RERA', score: 78 },
];

export default function AnalyticsPage() {
  const [explainPopover, setExplainPopover] = useState<{x: number, y: number, show: boolean} | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChartClick = (data: any, e: any) => {
    if (data && data.activePayload && data.activePayload[0].payload.month === 'Mar') {
      setExplainPopover({ x: e.chartX, y: e.chartY, show: true });
    } else {
      setExplainPopover(null);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 flex flex-col gap-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-end border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-serif text-primary">Platform Analytics</h1>
          <p className="text-sm text-mutedForeground mt-1">Real-time performance metrics and policy tracking.</p>
        </div>
        <button className="px-4 py-2 bg-white border border-border text-primary text-sm font-medium rounded-sm shadow-sm hover:border-accent transition-colors flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v18M3 12h18"/></svg>
          Add Widget
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Parcels Digitized", val: "14.2M", inc: "+2.1%" },
          { title: "Avg Resolution Time", val: "42 Days", inc: "-15%" },
          { title: "Active API Integrations", val: "1,204", inc: "+8%" },
          { title: "Policy Compliance Score", val: "88/100", inc: "+4 pts" }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white border border-border p-5 rounded-md shadow-card hover:border-accent transition-colors cursor-move">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold text-mutedForeground tracking-wider uppercase">{kpi.title}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-mutedForeground opacity-50"><path d="M4 9h16M4 15h16"/></svg>
            </div>
            <div className="text-3xl font-serif font-bold text-primary">{kpi.val}</div>
            <div className={`text-xs mt-2 font-medium ${kpi.inc.startsWith('+') && !kpi.val.includes('Days') ? 'text-success' : (kpi.val.includes('Days') && kpi.inc.startsWith('-') ? 'text-success' : 'text-accent')}`}>
              {kpi.inc} vs last quarter
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
        {/* Trend Chart with Explainability */}
        <div className="bg-white border border-border p-6 rounded-md shadow-card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif font-semibold text-primary">Land Dispute Trends</h3>
            <span className="text-xs text-mutedForeground">Click on a spike for AI explanation</span>
          </div>
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={disputeData} onClick={handleChartClick} className="cursor-pointer">
                <defs>
                  <linearGradient id="colorDispute" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C97B4A" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#C97B4A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <Tooltip contentStyle={{ borderRadius: '4px', border: '1px solid #E2DCD0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="disputes" stroke="#C97B4A" strokeWidth={3} fillOpacity={1} fill="url(#colorDispute)" />
              </AreaChart>
            </ResponsiveContainer>

            <AnimatePresence>
              {explainPopover?.show && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute z-10 bg-background border border-accent/50 p-4 rounded-md shadow-xl w-72"
                  style={{ top: explainPopover.y - 120, left: explainPopover.x - 140 }}
                >
                  <button onClick={() => setExplainPopover(null)} className="absolute top-2 right-2 text-mutedForeground hover:text-foreground">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                  </button>
                  <h4 className="font-serif font-bold text-accent mb-1 flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    AI Explanation
                  </h4>
                  <p className="text-xs text-foreground leading-relaxed">
                    The 83% spike in March correlates strongly with the rollout of the new Zonal Reclassification policy in Maharashtra, triggering a wave of legacy boundary contests.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Policy Scorecard */}
        <div className="bg-white border border-border p-6 rounded-md shadow-card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif font-semibold text-primary">Policy Implementation Scorecard</h3>
            <button className="text-xs font-medium text-accent hover:underline">View Report</button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={policyData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2DCD0" />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#1B2A4A', fontWeight: 600 }} width={80} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '4px', border: '1px solid #E2DCD0' }} />
                <Bar dataKey="score" fill="#1B2A4A" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
