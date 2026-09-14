'use client'

import React from 'react';
import Link from 'next/link';

export default function AppInnovationPage() {
  return (
    <div className="flex-1 p-6 md:p-8 flex flex-col gap-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-end border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-serif text-primary">Innovation Hub</h1>
          <p className="text-sm text-mutedForeground mt-1">Manage hackathon submissions and discover grant opportunities.</p>
        </div>
        <button className="px-4 py-2 bg-primary text-background text-sm font-medium rounded-sm shadow-sm hover:bg-primary-light transition-colors">
          Submit New Solution
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Active Submissions / Challenges */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <h2 className="text-lg font-serif font-semibold text-primary border-b border-border pb-2">Your Active Submissions</h2>
          
          <div className="bg-white border border-border p-5 rounded-md shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-bold bg-success/10 text-success px-2 py-1 rounded-sm uppercase tracking-wider">Under Evaluation</span>
              <span className="text-xs text-mutedForeground">Submitted: Oct 12, 2025</span>
            </div>
            <h3 className="text-xl font-serif text-primary mb-2">BhoomiIntel Core Platform (SIH 2026)</h3>
            <p className="text-sm text-mutedForeground mb-4 line-clamp-2">
              A comprehensive digital public good for the Ministry of Rural Development featuring AI copilot, semantic repository, and predictive digital twins.
            </p>
            <div className="flex gap-4 border-t border-border pt-4">
              <div className="flex flex-col">
                <span className="text-xs text-mutedForeground font-medium">Upvotes</span>
                <span className="font-bold text-foreground">1,204</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-mutedForeground font-medium">Jury Score</span>
                <span className="font-bold text-foreground">Pending</span>
              </div>
            </div>
          </div>

          <h2 className="text-lg font-serif font-semibold text-primary border-b border-border pb-2 mt-4">Peer Review Queue</h2>
          
          <div className="bg-white border border-border p-4 rounded-md shadow-sm opacity-60 hover:opacity-100 transition-opacity">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-foreground">Automated Mutation Engine</h4>
                <p className="text-xs text-mutedForeground mt-1">Team BlockchainBros</p>
              </div>
              <button className="text-xs bg-muted text-foreground px-3 py-1.5 rounded-sm hover:bg-accent/10 hover:text-accent font-medium transition-colors">Review</button>
            </div>
          </div>
        </div>

        {/* Right: Grant Matchmaking */}
        <div className="flex flex-col gap-4">
          <div className="bg-accent/5 border border-accent/20 rounded-md p-5 flex flex-col gap-4 sticky top-24 shadow-sm">
            <div className="flex items-center gap-2 border-b border-accent/20 pb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              <h3 className="font-serif font-semibold text-primary">Grant Matchmaking</h3>
            </div>
            <p className="text-xs text-mutedForeground">
              Based on your active submissions and workspace drafts, our AI suggests these funding opportunities:
            </p>
            
            <div className="flex flex-col gap-3">
              <div className="bg-white p-3 border border-border rounded-sm shadow-sm">
                <h4 className="text-sm font-bold text-foreground leading-tight">Digital India Land Records Modernization Fund</h4>
                <div className="text-xs text-mutedForeground mt-1 mb-2">Matches: "BhoomiIntel Platform"</div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-border">
                  <span className="text-xs font-bold text-success">₹50 Lakhs</span>
                  <button className="text-[10px] font-bold text-primary uppercase hover:underline">Apply Now</button>
                </div>
              </div>
              
              <div className="bg-white p-3 border border-border rounded-sm shadow-sm">
                <h4 className="text-sm font-bold text-foreground leading-tight">National Geo-Spatial Research Grant</h4>
                <div className="text-xs text-mutedForeground mt-1 mb-2">Matches: "Digital Twin Mockup"</div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-border">
                  <span className="text-xs font-bold text-success">₹15 Lakhs</span>
                  <button className="text-[10px] font-bold text-primary uppercase hover:underline">Apply Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
