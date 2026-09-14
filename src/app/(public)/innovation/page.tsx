'use client'

import React from 'react';

export default function InnovationPage() {
  return (
    <div className="flex-1 w-full bg-background px-6 py-12 max-w-7xl mx-auto flex flex-col gap-8">
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl md:text-4xl font-serif text-primary">Innovation Challenges</h1>
        <p className="text-mutedForeground max-w-2xl mt-2 text-balance">
          Participate in government-sponsored hackathons and data challenges to build the next generation of land governance tools.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          <div className="bg-white border border-border rounded-md p-6 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-success text-background px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-bl-sm">Active</div>
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-2xl font-serif text-primary">Smart India Hackathon 2026</h3>
                <p className="text-sm text-mutedForeground mt-1">Problem Statement: India's National Digital Platform for Research, Policy Innovation & Evidence-Based Land Governance</p>
              </div>
              <div className="flex flex-wrap gap-4 text-sm font-medium">
                <span className="flex items-center gap-1.5 text-foreground"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Ends in 12 days</span>
                <span className="flex items-center gap-1.5 text-accent"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> Prize: ₹1,00,000</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed pt-4 border-t border-border">
                Develop a functional prototype of BhoomiIntel that demonstrates semantic search, GIS mapping of SVAMITVA data, and predictive policy simulation.
              </p>
              <button className="bg-primary text-background px-6 py-2 rounded-sm text-sm font-medium w-fit hover:bg-primary-light transition-colors mt-2 shadow-sm">
                Submit Solution
              </button>
            </div>
          </div>

          <div className="bg-white border border-border rounded-md p-6 shadow-sm opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-xl font-serif text-primary">AI Legal Document Summarizer</h3>
                <p className="text-sm text-mutedForeground mt-1">Extract key metadata and summarize historical land acquisition notifications.</p>
              </div>
              <div className="flex flex-wrap gap-4 text-sm font-medium">
                <span className="flex items-center gap-1.5 text-mutedForeground">Ended Oct 2025</span>
                <span className="flex items-center gap-1.5 text-accent">Winner: Team GeoAI</span>
              </div>
            </div>
          </div>

        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white border border-border rounded-md p-6 shadow-sm">
            <h3 className="font-serif font-semibold text-primary mb-4 border-b border-border pb-2">Global Leaderboard</h3>
            <div className="flex flex-col gap-4 text-sm">
              {[
                { rank: 1, name: "DataDharmis", pts: 2450 },
                { rank: 2, name: "Team GeoAI", pts: 1890 },
                { rank: 3, name: "Null Pointers", pts: 1200 },
                { rank: 4, name: "Tech For Gov", pts: 950 },
              ].map((team) => (
                <div key={team.rank} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`font-bold w-5 h-5 flex items-center justify-center rounded-sm ${team.rank === 1 ? 'bg-accent text-background' : 'bg-muted text-mutedForeground'}`}>{team.rank}</span>
                    <span className="font-medium text-foreground">{team.name}</span>
                  </div>
                  <span className="text-mutedForeground font-mono">{team.pts} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
