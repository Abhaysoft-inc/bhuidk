'use client'

import React, { useState } from 'react';

export default function WorkspacePage() {
  const [activeProject, setActiveProject] = useState<string | null>(null);

  if (activeProject) {
    return (
      <div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
        <header className="px-6 py-4 border-b border-border bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveProject(null)} className="p-1.5 hover:bg-muted rounded-sm transition-colors text-mutedForeground">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <div>
              <h1 className="text-xl font-serif text-primary">Draft: Zonal FSI Amendment 2026</h1>
              <div className="flex items-center gap-2 text-xs text-mutedForeground mt-0.5">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-success"></span> Saved to cloud</span>
                <span>•</span>
                <span>Last edited by <strong>admin@gov.in</strong></span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 border border-border rounded-sm text-sm font-medium hover:bg-muted transition-colors bg-white">Share</button>
            <button className="px-3 py-1.5 bg-primary text-background rounded-sm text-sm font-medium hover:bg-primary-light transition-colors shadow-sm">Publish to Repository</button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Editor */}
          <div className="flex-1 overflow-y-auto bg-background p-8 flex justify-center">
            <div className="max-w-3xl w-full bg-white border border-border rounded-md shadow-sm p-12 min-h-full">
              <div className="flex items-center gap-2 mb-8 border-b border-border pb-4">
                <span className="px-2 py-1 bg-muted rounded-sm text-xs font-bold text-mutedForeground">H1</span>
                <span className="px-2 py-1 hover:bg-muted cursor-pointer rounded-sm text-xs font-bold text-foreground">B</span>
                <span className="px-2 py-1 hover:bg-muted cursor-pointer rounded-sm text-xs font-bold text-foreground italic">I</span>
                <div className="w-px h-4 bg-border mx-2"></div>
                <span className="text-xs text-mutedForeground">Type '/' for commands</span>
              </div>
              
              <h1 className="text-4xl font-serif text-primary font-bold mb-6 outline-none" contentEditable suppressContentEditableWarning>
                Zonal FSI Amendment 2026
              </h1>
              <p className="text-foreground leading-relaxed mb-4 outline-none" contentEditable suppressContentEditableWarning>
                This amendment addresses the critical need for increased Floor Space Index (FSI) in transit-oriented development zones across Maharashtra. 
              </p>
              <div className="bg-accent/10 border-l-4 border-accent p-4 my-6 text-sm text-foreground">
                <strong className="text-primary font-serif block mb-1">AI Copilot Suggestion:</strong>
                Consider referencing the 2024 DILRMP impact study which showed a 12% decrease in disputes when FSI zoning boundaries were clearly demarcated via drone surveys.
                <div className="mt-2 flex gap-2">
                  <button className="text-xs font-bold text-accent hover:underline">Accept</button>
                  <button className="text-xs font-medium text-mutedForeground hover:underline">Dismiss</button>
                </div>
              </div>
              <p className="text-foreground leading-relaxed outline-none" contentEditable suppressContentEditableWarning>
                The preliminary simulation models suggest that bumping the base FSI from 2.5 to 3.0 within a 1km radius of upcoming metro corridors will not stress existing water infrastructure beyond the 85% capacity threshold.
              </p>
            </div>
          </div>

          {/* Right Sidebar: Comments & Versioning */}
          <div className="w-80 bg-white border-l border-border flex flex-col shrink-0">
            <div className="flex text-sm font-medium border-b border-border">
              <button className="flex-1 py-3 text-primary border-b-2 border-primary">Comments (2)</button>
              <button className="flex-1 py-3 text-mutedForeground hover:text-foreground">Versions</button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
              <div className="border border-border rounded-md p-3 shadow-sm flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-[10px] font-bold">JD</div>
                  <span className="text-xs font-bold text-foreground">Joint Director, Town Planning</span>
                </div>
                <p className="text-xs text-foreground leading-relaxed">
                  <span className="text-accent font-medium">@admin</span> Please ensure the simulation report for water infrastructure is attached as an appendix before publishing.
                </p>
                <div className="text-[10px] text-mutedForeground mt-1">2 hours ago</div>
              </div>

              <div className="border border-border rounded-md p-3 shadow-sm flex flex-col gap-2 ml-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary text-background flex items-center justify-center text-[10px] font-bold">AD</div>
                  <span className="text-xs font-bold text-foreground">Admin User</span>
                </div>
                <p className="text-xs text-foreground leading-relaxed">
                  Will do. I'll run the final twin simulation today.
                </p>
                <div className="text-[10px] text-mutedForeground mt-1">Just now</div>
              </div>
            </div>
            
            <div className="p-4 border-t border-border bg-background">
              <input type="text" placeholder="Reply or @mention..." className="w-full text-sm border border-border p-2 rounded-sm focus:outline-none focus:border-accent" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 md:p-8 flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex justify-between items-end border-b border-border pb-6 mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-serif text-primary">Policy Workspace</h1>
          <p className="text-sm text-mutedForeground mt-1">Collaborative drafting and project management.</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 border border-border rounded-sm bg-muted text-foreground"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="9" x2="9" y1="3" y2="21"/><line x1="15" x2="15" y1="3" y2="21"/></svg></button>
          <button className="p-2 border border-border rounded-sm bg-white text-mutedForeground hover:text-foreground"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg></button>
          <button className="ml-2 px-4 py-2 bg-primary text-background text-sm font-medium rounded-sm shadow-sm hover:bg-primary-light transition-colors">New Project</button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
        {/* Kanban Column: Planning */}
        <div className="w-80 shrink-0 flex flex-col gap-3">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">Planning (2)</h3>
            <button className="text-mutedForeground hover:text-foreground"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5v14"/></svg></button>
          </div>
          
          <div className="bg-white border border-border p-4 rounded-md shadow-sm cursor-grab active:cursor-grabbing hover:border-accent transition-colors" onClick={() => setActiveProject('1')}>
            <div className="flex gap-2 mb-2">
              <span className="text-[10px] font-bold bg-accent/10 text-accent px-1.5 py-0.5 rounded-sm">Amendment</span>
            </div>
            <h4 className="font-serif font-medium text-primary mb-1">Zonal FSI Amendment 2026</h4>
            <p className="text-xs text-mutedForeground line-clamp-2">Drafting the notification for increased transit corridor FSI.</p>
            <div className="mt-4 flex justify-between items-center text-xs">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full border-2 border-white bg-primary text-background flex items-center justify-center font-bold text-[8px]">AD</div>
                <div className="w-6 h-6 rounded-full border-2 border-white bg-muted text-foreground flex items-center justify-center font-bold text-[8px]">JD</div>
              </div>
              <span className="text-mutedForeground flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> 2</span>
            </div>
          </div>

          <div className="bg-white border border-border p-4 rounded-md shadow-sm cursor-grab active:cursor-grabbing hover:border-accent transition-colors">
            <div className="flex gap-2 mb-2">
              <span className="text-[10px] font-bold bg-danger/10 text-danger px-1.5 py-0.5 rounded-sm">Review</span>
            </div>
            <h4 className="font-serif font-medium text-primary mb-1">Forest Clearance Dispute Protocol</h4>
            <p className="text-xs text-mutedForeground line-clamp-2">Standardizing workflow for intersecting SVAMITVA and Forest Dept records.</p>
          </div>
        </div>

        {/* Kanban Column: In Review */}
        <div className="w-80 shrink-0 flex flex-col gap-3">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">In Review (1)</h3>
          </div>
          <div className="bg-white border border-border p-4 rounded-md shadow-sm cursor-grab active:cursor-grabbing hover:border-accent transition-colors">
            <div className="flex gap-2 mb-2">
              <span className="text-[10px] font-bold bg-success/10 text-success px-1.5 py-0.5 rounded-sm">Research</span>
            </div>
            <h4 className="font-serif font-medium text-primary mb-1">Drone Survey Guidelines V2</h4>
            <div className="w-full bg-muted rounded-full h-1.5 mt-3 mb-1">
              <div className="bg-success h-1.5 rounded-full w-[80%]"></div>
            </div>
            <span className="text-[10px] font-medium text-mutedForeground">80% Approved</span>
          </div>
        </div>
        
        {/* Kanban Column: Published */}
        <div className="w-80 shrink-0 flex flex-col gap-3">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">Published (0)</h3>
          </div>
          <div className="border-2 border-dashed border-border rounded-md h-32 flex items-center justify-center text-xs text-mutedForeground">
            Drop cards here to publish
          </div>
        </div>
      </div>
    </div>
  );
}
