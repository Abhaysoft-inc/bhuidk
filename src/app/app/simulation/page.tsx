'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function SimulationStudio() {
  const [isRunning, setIsRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleRunSimulation = () => {
    setIsRunning(true);
    setShowResults(false);
    setTimeout(() => {
      setIsRunning(false);
      setShowResults(true);
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      <header className="px-6 py-4 border-b border-border bg-background flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-serif text-primary">Policy Simulation Studio</h1>
          <p className="text-sm text-mutedForeground">Model the impact of land-use and zoning changes.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-border rounded-sm text-sm font-medium hover:bg-muted transition-colors shadow-sm bg-white">
            Save Scenario
          </button>
          <button className="px-4 py-2 bg-primary text-background rounded-sm text-sm font-medium hover:bg-primary-light transition-colors shadow-card flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Export PDF Report
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Control Panel */}
        <div className="w-80 border-r border-border bg-white p-6 overflow-y-auto shrink-0 flex flex-col gap-6 shadow-sm z-10">
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-serif font-semibold text-primary">Target Region</label>
            <select className="w-full border border-border rounded-sm py-2 px-3 text-sm focus:outline-none focus:border-accent">
              <option>Pune District, Maharashtra</option>
              <option>Bengaluru Urban, Karnataka</option>
              <option>Gurugram, Haryana</option>
            </select>
          </div>

          <div className="h-px bg-border my-2" />

          <h3 className="font-serif font-semibold text-primary text-lg">Policy Levers</h3>
          
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-foreground">Base FSI (Floor Space Index)</label>
                <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded-sm">2.5</span>
              </div>
              <input type="range" min="1" max="5" step="0.1" defaultValue="2.5" className="w-full accent-accent" />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-foreground">Agricultural to Commercial %</label>
                <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded-sm">15%</span>
              </div>
              <input type="range" min="0" max="100" defaultValue="15" className="w-full accent-accent" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Zoning Overlay</label>
              <select className="w-full border border-border rounded-sm py-2 px-3 text-sm focus:outline-none focus:border-accent bg-background">
                <option>Transit-Oriented Development</option>
                <option>Special Economic Zone</option>
                <option>Green Belt Conservation</option>
              </select>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-border">
            <button 
              onClick={handleRunSimulation}
              disabled={isRunning}
              className={`w-full py-3 rounded-sm font-bold text-sm shadow-card transition-all flex items-center justify-center gap-2 ${isRunning ? 'bg-muted text-mutedForeground cursor-not-allowed' : 'bg-accent text-primary hover:bg-accent-light'}`}
            >
              {isRunning ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Running Models...
                </>
              ) : 'Run Simulation'}
            </button>
          </div>
        </div>

        {/* Right Content Area (Map + Reports) */}
        <div className="flex-1 bg-muted relative overflow-hidden flex flex-col">
          {!showResults && !isRunning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white p-6 rounded-md shadow-card border border-border max-w-sm text-center flex flex-col gap-2">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 0 1 9-9"/></svg>
                </div>
                <h3 className="font-serif font-semibold text-primary">Ready to Simulate</h3>
                <p className="text-sm text-mutedForeground">Adjust the policy levers on the left and run the simulation to see the projected impact.</p>
              </div>
            </div>
          )}

          {isRunning && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 relative flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-muted"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-accent border-t-transparent animate-spin"></div>
                  <span className="font-serif font-bold text-primary text-xs">AI</span>
                </div>
                <span className="text-sm font-medium text-primary animate-pulse">Running geospatial impact models...</span>
              </div>
            </div>
          )}

          {showResults && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col h-full overflow-hidden"
            >
              {/* Split Map View (Mock) */}
              <div className="h-1/2 flex w-full relative">
                <div className="flex-1 relative border-r-2 border-primary/20">
                  <div className="absolute top-4 left-4 bg-background/90 px-3 py-1 rounded-sm border border-border shadow-sm text-xs font-bold text-primary z-10 backdrop-blur-sm">Current (Base)</div>
                  <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/India_relief_location_map.jpg/1024px-India_relief_location_map.jpg')] bg-cover bg-center mix-blend-multiply opacity-30" />
                </div>
                <div className="flex-1 relative">
                  <div className="absolute top-4 left-4 bg-accent/90 px-3 py-1 rounded-sm border border-border shadow-sm text-xs font-bold text-background z-10 backdrop-blur-sm">Simulated (Projected)</div>
                  <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/India_relief_location_map.jpg/1024px-India_relief_location_map.jpg')] bg-cover bg-center mix-blend-overlay opacity-60 bg-accent/10" />
                  
                  {/* Mock Hotspots */}
                  <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-danger/30 rounded-full blur-xl" />
                  <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-success/30 rounded-full blur-xl" />
                </div>
                
                {/* Drag Handle Mock */}
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white shadow-lg cursor-col-resize -translate-x-1/2 flex items-center justify-center">
                  <div className="w-6 h-8 bg-white border border-border shadow-card rounded-sm flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 9l-4 3 4 3M16 9l4 3-4 3"/></svg>
                  </div>
                </div>
              </div>

              {/* Impact Reports */}
              <div className="h-1/2 bg-background border-t border-border p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-serif text-xl text-primary font-semibold">Predicted Impact Analysis</h3>
                  <button className="text-xs flex items-center gap-1 text-accent font-medium hover:underline">
                    View Explainability Details
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: "Price Impact", val: "+12.4%", desc: "Avg. land value increase", type: "success" },
                    { title: "Displacement Risk", val: "High", desc: "For low-income zones", type: "danger" },
                    { title: "Dispute Likelihood", val: "+8.2%", desc: "Predicted title contestations", type: "danger" },
                    { title: "Infra Stress", val: "Critical", desc: "Water & transit capacity", type: "danger" }
                  ].map((metric, idx) => (
                    <div key={idx} className="bg-white border border-border p-4 rounded-md shadow-card">
                      <div className="text-xs font-medium text-mutedForeground uppercase tracking-wider mb-2">{metric.title}</div>
                      <div className={`text-2xl font-serif font-bold ${metric.type === 'danger' ? 'text-danger' : 'text-success'}`}>{metric.val}</div>
                      <div className="text-xs text-mutedForeground mt-1">{metric.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
