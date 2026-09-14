'use client'

import React from 'react';

export default function AdminModerationPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-serif text-primary">Content Moderation Queue</h2>
        <span className="text-sm font-medium text-mutedForeground">1 Item Pending</span>
      </div>

      <div className="bg-white border border-border rounded-md shadow-sm p-6 flex gap-6">
        <div className="w-1/3 bg-muted rounded-sm flex items-center justify-center border border-border h-48 overflow-hidden">
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center"></div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start">
            <span className="bg-accent/10 text-accent text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-sm mb-2">Automated Flag: Sensitive Coordinates</span>
            <span className="text-xs text-mutedForeground">Submitted by: a.patel@nic.in</span>
          </div>
          <h3 className="text-lg font-serif text-primary mb-2">Dataset: Pune Defense Perimeter Drone Survey</h3>
          <p className="text-sm text-foreground leading-relaxed">
            This dataset contains high-resolution drone imagery that overlaps with restricted defense zones in the Pune district. The AI copilot automatically halted publishing to the public repository.
          </p>
          <div className="mt-auto pt-4 flex gap-3">
            <button className="px-4 py-2 bg-success text-white text-sm font-medium rounded-sm shadow-sm hover:bg-success/90 transition-colors">Approve for Public</button>
            <button className="px-4 py-2 bg-danger text-white text-sm font-medium rounded-sm shadow-sm hover:bg-danger/90 transition-colors">Reject & Delete</button>
            <button className="px-4 py-2 bg-white border border-border text-foreground text-sm font-medium rounded-sm hover:bg-muted transition-colors">Request Redaction</button>
          </div>
        </div>
      </div>
    </div>
  );
}
