'use client'

import React from 'react';

export default function ProfilePage() {
  return (
    <div className="flex-1 p-6 md:p-8 flex flex-col gap-8 max-w-4xl mx-auto w-full">
      <div className="flex justify-between items-end border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-serif text-primary">Account Settings</h1>
          <p className="text-sm text-mutedForeground mt-1">Manage your profile, preferences, and saved items.</p>
        </div>
        <button className="px-4 py-2 bg-primary text-background text-sm font-medium rounded-sm shadow-sm hover:bg-primary-light transition-colors">
          Save Changes
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Column: Profile Info */}
        <div className="flex-1 flex flex-col gap-6">
          <section className="bg-white border border-border p-6 rounded-md shadow-sm">
            <h2 className="text-lg font-serif font-semibold text-primary mb-4">Personal Information</h2>
            <div className="flex flex-col gap-4">
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-full bg-primary text-background flex items-center justify-center text-xl font-bold shadow-sm">
                  AD
                </div>
                <button className="text-xs font-medium text-accent hover:underline">Change Avatar</button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-mutedForeground">Full Name</label>
                  <input type="text" defaultValue="Admin User" className="w-full text-sm border border-border p-2 rounded-sm focus:outline-none focus:border-accent bg-muted/30" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-mutedForeground">Designation</label>
                  <input type="text" defaultValue="System Administrator" className="w-full text-sm border border-border p-2 rounded-sm focus:outline-none focus:border-accent bg-muted/30" />
                </div>
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-xs font-bold text-mutedForeground">Gov.in Email Address</label>
                  <input type="email" defaultValue="admin@gov.in" disabled className="w-full text-sm border border-border p-2 rounded-sm bg-muted text-mutedForeground cursor-not-allowed" />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white border border-border p-6 rounded-md shadow-sm">
            <h2 className="text-lg font-serif font-semibold text-primary mb-4">Saved Research</h2>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center p-3 border border-border rounded-sm hover:bg-muted/30 transition-colors cursor-pointer">
                <div>
                  <h4 className="text-sm font-medium text-foreground">Urban Heat Island Mitigation Strategies</h4>
                  <p className="text-xs text-mutedForeground mt-0.5">Saved from AI Copilot • 2 days ago</p>
                </div>
                <button className="text-mutedForeground hover:text-danger"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" fill="currentColor"/></svg></button>
              </div>
              <div className="flex justify-between items-center p-3 border border-border rounded-sm hover:bg-muted/30 transition-colors cursor-pointer">
                <div>
                  <h4 className="text-sm font-medium text-foreground">Pune Metro Line 3 ROI Report</h4>
                  <p className="text-xs text-mutedForeground mt-0.5">Saved from Repository • 1 week ago</p>
                </div>
                <button className="text-mutedForeground hover:text-danger"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" fill="currentColor"/></svg></button>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Preferences */}
        <div className="w-full md:w-80 flex flex-col gap-6 shrink-0">
          <section className="bg-white border border-border p-6 rounded-md shadow-sm">
            <h2 className="text-lg font-serif font-semibold text-primary mb-4">Preferences</h2>
            
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-mutedForeground">Platform Language</label>
                <select className="w-full p-2 border border-border rounded-sm bg-white text-sm focus:outline-none focus:border-accent">
                  <option value="en">English (UK)</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                  <option value="mr">Marathi (मराठी)</option>
                </select>
                <p className="text-[10px] text-mutedForeground mt-1">Multi-lingual support powered by Bhashini AI.</p>
              </div>

              <div className="h-px bg-border my-2" />

              <div>
                <label className="text-xs font-bold text-mutedForeground mb-3 block">Notification Alerts</label>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
                    <span className="text-sm text-foreground font-medium">Critical Geofence Alerts</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
                    <span className="text-sm text-foreground font-medium">Simulation Completions</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-primary" />
                    <span className="text-sm text-foreground font-medium">Weekly Analytics Report</span>
                  </label>
                </div>
              </div>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}
