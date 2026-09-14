'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function SatelliteChangePage() {
  const [sliderPos, setSliderPos] = useState(50);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleRunAI = () => {
    setIsAnalyzing(true);
    setShowAnalysis(false);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowAnalysis(true);
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
      <header className="px-6 py-4 border-b border-border bg-background flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-serif text-primary">Satellite Temporal Analysis</h1>
          <p className="text-sm text-mutedForeground mt-1">Detect unauthorized construction and deforestation via multispectral imagery.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-border rounded-sm text-sm font-medium bg-white shadow-sm hover:bg-muted transition-colors">
            Upload New Pair
          </button>
          <button 
            onClick={handleRunAI}
            disabled={isAnalyzing}
            className={`px-4 py-2 rounded-sm text-sm font-bold shadow-sm transition-colors flex items-center gap-2 ${isAnalyzing ? 'bg-muted text-mutedForeground' : 'bg-primary text-background hover:bg-primary-light'}`}
          >
            {isAnalyzing ? (
              <><svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Analyzing...</>
            ) : (
              <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> Run AI Detection</>
            )}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Comparison Viewer */}
        <div className="flex-1 bg-muted relative overflow-hidden group cursor-col-resize select-none"
             onMouseMove={(e) => {
               if (e.buttons === 1) {
                 const rect = e.currentTarget.getBoundingClientRect();
                 const pos = ((e.clientX - rect.left) / rect.width) * 100;
                 setSliderPos(Math.max(0, Math.min(100, pos)));
               }
             }}>
             
          {/* Before Image (Background) */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center grayscale opacity-80" />
          <div className="absolute top-4 left-4 bg-background/90 px-3 py-1 rounded-sm text-xs font-bold shadow-sm z-10 backdrop-blur-sm">2022 (Baseline)</div>

          {/* After Image (Clipped) */}
          <div 
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center" 
            style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
          />
          <div 
            className="absolute top-4 right-4 bg-background/90 px-3 py-1 rounded-sm text-xs font-bold shadow-sm z-10 backdrop-blur-sm"
            style={{ opacity: sliderPos < 80 ? 1 : 0 }}
          >
            2025 (Current)
          </div>

          {/* AI Overlay */}
          {showAnalysis && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute inset-0 pointer-events-none"
              style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
            >
              <div className="absolute top-1/3 right-1/4 w-32 h-32 border-2 border-danger bg-danger/20 rounded-md flex items-start p-1 backdrop-blur-[1px]">
                <span className="bg-danger text-white text-[10px] font-bold px-1 rounded-sm shadow-sm">Const. (98%)</span>
              </div>
              <div className="absolute bottom-1/4 right-1/3 w-48 h-24 border-2 border-accent bg-accent/20 rounded-md flex items-start p-1 backdrop-blur-[1px]">
                <span className="bg-accent text-white text-[10px] font-bold px-1 rounded-sm shadow-sm">Forest Loss (92%)</span>
              </div>
            </motion.div>
          )}

          {/* Slider Line */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg -translate-x-1/2 flex items-center justify-center pointer-events-none"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="w-8 h-8 bg-white border border-border rounded-full shadow-card flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 9l-4 3 4 3M16 9l4 3-4 3"/></svg>
            </div>
          </div>
        </div>

        {/* Right: Analysis Panel */}
        <div className="w-80 bg-background border-l border-border flex flex-col shrink-0">
          <div className="p-4 border-b border-border bg-muted/30">
            <h3 className="font-serif font-semibold text-primary">Metadata</h3>
            <div className="flex flex-col gap-1 mt-2 text-xs">
              <div className="flex justify-between"><span className="text-mutedForeground">Region</span><span className="font-medium">Sector 45, Gurugram</span></div>
              <div className="flex justify-between"><span className="text-mutedForeground">Resolution</span><span className="font-medium">0.5m / pixel</span></div>
              <div className="flex justify-between"><span className="text-mutedForeground">Source</span><span className="font-medium">Sentinel-2 / ISRO</span></div>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
            <h3 className="font-serif font-semibold text-primary">Change Classification</h3>
            
            {!showAnalysis && !isAnalyzing && (
              <p className="text-sm text-mutedForeground text-center mt-10">Run AI Detection to classify changes between the two temporal captures.</p>
            )}

            {isAnalyzing && (
              <div className="flex flex-col items-center justify-center gap-2 mt-10">
                <div className="w-6 h-6 border-2 border-muted border-t-accent rounded-full animate-spin"></div>
                <p className="text-xs text-mutedForeground font-medium">Extracting spectral differences...</p>
              </div>
            )}

            {showAnalysis && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
                <div className="bg-white border border-danger/30 rounded-md p-3 shadow-sm border-l-4 border-l-danger">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-bold text-foreground">Unauthorized Construction</span>
                    <span className="text-xs font-mono bg-danger/10 text-danger px-1 rounded-sm">98% Conf</span>
                  </div>
                  <p className="text-xs text-mutedForeground mt-1">2.4 acres of agricultural land converted to concrete structures without DILRMP update.</p>
                  <button className="text-xs font-medium text-primary mt-2 hover:underline">Issue Notice &rarr;</button>
                </div>

                <div className="bg-white border border-accent/30 rounded-md p-3 shadow-sm border-l-4 border-l-accent">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-bold text-foreground">Canopy Loss</span>
                    <span className="text-xs font-mono bg-accent/10 text-accent px-1 rounded-sm">92% Conf</span>
                  </div>
                  <p className="text-xs text-mutedForeground mt-1">Reduction in NDVI signature. Estimated 1.1 acres of tree cover removed.</p>
                  <button className="text-xs font-medium text-primary mt-2 hover:underline">Flag to Forest Dept &rarr;</button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
