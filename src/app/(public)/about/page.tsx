'use client'

import React from 'react';

export default function AboutPage() {
  return (
    <div className="flex-1 w-full bg-background">
      <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col gap-12">
        
        <section className="flex flex-col gap-4 text-center items-center">
          <div className="w-16 h-16 bg-primary text-background rounded-sm flex items-center justify-center font-serif text-2xl font-bold mb-4 shadow-card">BI</div>
          <h1 className="text-4xl md:text-5xl font-serif text-primary">About BhoomiIntel</h1>
          <p className="text-lg text-mutedForeground text-balance max-w-2xl">
            A unified digital intelligence platform designed to transform land governance in India through data, artificial intelligence, and transparency.
          </p>
        </section>

        <section className="bg-white border border-border p-8 rounded-md shadow-sm">
          <h2 className="text-2xl font-serif text-primary mb-4 border-b border-border pb-2">The Mission</h2>
          <p className="text-foreground leading-relaxed mb-4">
            Under the aegis of the <strong>Department of Land Resources (DoLR)</strong> and the <strong>Ministry of Rural Development</strong>, BhoomiIntel aims to bridge the gap between policy formulation, research, and ground-level implementation. 
          </p>
          <p className="text-foreground leading-relaxed">
            By aggregating disjointed land records, satellite imagery, policy directives, and legal precedents into a single semantic repository, we empower researchers and policymakers to make evidence-based decisions that minimize disputes and maximize sustainable land use.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-border p-6 rounded-md shadow-sm">
            <h3 className="text-xl font-serif text-accent mb-3 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              For Policymakers
            </h3>
            <ul className="list-disc list-inside text-sm text-foreground flex flex-col gap-2">
              <li>Predictive simulation of land-use changes.</li>
              <li>Real-time monitoring of digitization progress.</li>
              <li>AI-assisted review of complex legal notifications.</li>
            </ul>
          </div>
          
          <div className="bg-white border border-border p-6 rounded-md shadow-sm">
            <h3 className="text-xl font-serif text-accent mb-3 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              For Researchers
            </h3>
            <ul className="list-disc list-inside text-sm text-foreground flex flex-col gap-2">
              <li>Semantic search across a national repository.</li>
              <li>Identify research gaps using the AI Copilot.</li>
              <li>Access aggregated, anonymized GIS data.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
