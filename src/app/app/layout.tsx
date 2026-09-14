import React from 'react';
import Link from 'next/link';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-background flex flex-col sticky top-0 h-screen hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
              <span className="text-background font-serif font-bold text-sm">BI</span>
            </div>
            <Link href="/app" className="font-serif font-semibold text-primary">BhoomiIntel</Link>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          <Link href="/app" className="flex items-center gap-3 px-3 py-2 rounded-sm text-sm font-medium text-foreground bg-muted hover:bg-muted/80 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Dashboard
          </Link>
          <Link href="/app/repository/upload" className="flex items-center gap-3 px-3 py-2 rounded-sm text-sm font-medium text-mutedForeground hover:bg-muted/50 hover:text-foreground transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            Upload Data
          </Link>
          <Link href="/app/gis" className="flex items-center gap-3 px-3 py-2 rounded-sm text-sm font-medium text-mutedForeground hover:bg-muted/50 hover:text-foreground transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/></svg>
            GIS Map
          </Link>
          <Link href="/app/simulation" className="flex items-center gap-3 px-3 py-2 rounded-sm text-sm font-medium text-mutedForeground hover:bg-muted/50 hover:text-foreground transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12h4l2-9 5 18 3-9h6"/></svg>
            Policy Studio
          </Link>
          <Link href="/app/copilot" className="flex items-center gap-3 px-3 py-2 rounded-sm text-sm font-medium text-accent hover:bg-muted/50 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
            AI Copilot
          </Link>
        </nav>
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 p-2 rounded-sm hover:bg-muted transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-primary text-background flex items-center justify-center text-xs font-medium">AD</div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Admin User</span>
              <span className="text-xs text-mutedForeground">admin@gov.in</span>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 border-b border-border bg-background flex items-center px-6 justify-between md:justify-end sticky top-0 z-40">
          <div className="md:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
              <span className="text-background font-serif font-bold text-sm">BI</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-mutedForeground hover:text-foreground">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            </button>
          </div>
        </header>
        <main className="flex-1 flex flex-col relative">
          {children}
        </main>
      </div>
    </div>
  );
}
