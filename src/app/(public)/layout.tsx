import React from 'react';
import Link from 'next/link';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-background px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
            <span className="text-background font-serif font-bold">BI</span>
          </div>
          <Link href="/" className="text-xl font-serif font-semibold text-primary">BhoomiIntel</Link>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="text-mutedForeground hover:text-foreground transition-colors">Home</Link>
          <Link href="/about" className="text-mutedForeground hover:text-foreground transition-colors">About</Link>
          <Link href="/repository" className="text-mutedForeground hover:text-foreground transition-colors">Research Repository</Link>
          <Link href="/innovation" className="text-mutedForeground hover:text-foreground transition-colors">Innovation</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-primary hover:text-primary-light transition-colors">Sign In</Link>
          <Link href="/app" className="text-sm font-medium bg-accent hover:bg-accent-light text-primary px-4 py-2 rounded-sm transition-colors shadow-card">
            Go to App
          </Link>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <footer className="border-t border-border bg-primary text-background py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="flex flex-col gap-4 max-w-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-background rounded-sm flex items-center justify-center">
                <span className="text-primary font-serif font-bold">BI</span>
              </div>
              <span className="text-xl font-serif font-semibold">BhoomiIntel</span>
            </div>
            <p className="text-sm opacity-80 text-balance">
              India's National Digital Platform for Research, Policy Innovation & Evidence-Based Land Governance.
            </p>
          </div>
          <div className="flex gap-12 text-sm">
            <div className="flex flex-col gap-2">
              <h4 className="font-semibold font-serif mb-2 text-accent">Platform</h4>
              <Link href="/repository" className="opacity-80 hover:opacity-100 transition-opacity">Repository</Link>
              <Link href="/dashboard/public" className="opacity-80 hover:opacity-100 transition-opacity">Public Data</Link>
              <Link href="/innovation" className="opacity-80 hover:opacity-100 transition-opacity">Hackathons</Link>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="font-semibold font-serif mb-2 text-accent">Government</h4>
              <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Ministry of Rural Development</a>
              <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Department of Land Resources</a>
              <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">SVAMITVA Scheme</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
