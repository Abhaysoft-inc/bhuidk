'use client'

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-24 pb-32">
        <div className="absolute inset-0 z-0 opacity-[0.03] bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80')] bg-cover bg-center" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 flex flex-col gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent w-fit text-sm font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Live Platform Beta
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-6xl font-serif text-primary leading-[1.1]"
            >
              Evidence-Based <br/><span className="text-accent">Land Governance</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-mutedForeground max-w-xl text-balance"
            >
              India's National Digital Platform for Research, Policy Innovation, and Real-time Dispute Resolution. Empowering policymakers with AI-driven insights.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center gap-4 mt-4"
            >
              <div className="relative flex-1 max-w-md">
                <input 
                  type="text" 
                  placeholder="Search repository, policies, or land records..." 
                  className="w-full pl-4 pr-12 py-3 rounded-sm border border-border bg-background focus:outline-none focus:border-accent shadow-sm"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:text-accent transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>
                </button>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex-1 w-full"
          >
            <div className="relative aspect-square md:aspect-auto md:h-[500px] w-full bg-muted border border-border rounded-md shadow-card overflow-hidden flex flex-col">
              <div className="bg-primary px-4 py-2 flex items-center justify-between">
                <span className="text-xs text-background font-medium tracking-wider uppercase">Live Network Status</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-danger" />
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <div className="w-2 h-2 rounded-full bg-success" />
                </div>
              </div>
              <div className="flex-1 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-multiply opacity-50 relative">
                {/* Mock live blips */}
                <div className="absolute top-[40%] left-[30%] w-3 h-3 rounded-full bg-accent shadow-[0_0_15px_rgba(201,123,74,0.8)] animate-ping" />
                <div className="absolute top-[60%] left-[40%] w-2 h-2 rounded-full bg-success shadow-[0_0_10px_rgba(35,79,53,0.8)] animate-ping" style={{ animationDelay: '0.5s' }} />
                <div className="absolute top-[30%] left-[50%] w-4 h-4 rounded-full bg-danger shadow-[0_0_20px_rgba(158,58,58,0.8)] animate-ping" style={{ animationDelay: '1.2s' }} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Animated Stats Section */}
      <section className="border-y border-border bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border">
          {[
            { label: "Land Parcels Digitized", value: "14.2M+" },
            { label: "Policy Documents", value: "8,405" },
            { label: "Disputes Resolved", value: "342K" },
            { label: "Active Researchers", value: "1,250" },
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center text-center px-4">
              <div className="text-3xl md:text-4xl font-serif text-primary mb-2">{stat.value}</div>
              <div className="text-sm text-mutedForeground font-medium uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-16">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">Core Capabilities</h2>
            <p className="text-mutedForeground">An integrated ecosystem designed for policymakers, researchers, and citizens to interact with land data transparently.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Research Repository", 
                desc: "Access thousands of policy papers, legal precedents, and case studies indexed with AI for semantic search.",
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>,
                link: "/repository"
              },
              { 
                title: "Policy Simulation Studio", 
                desc: "Model the impact of land-use changes, zoning laws, and infrastructure projects before they are enacted.",
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 12h4l2-9 5 18 3-9h6"/></svg>,
                link: "/app/simulation"
              },
              { 
                title: "GIS Intelligence Map", 
                desc: "Visualize spatial data layers, track SVAMITVA progress, and predict dispute hotspots with machine learning.",
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/></svg>,
                link: "/app/gis"
              }
            ].map((feature, idx) => (
              <Link href={feature.link} key={idx} className="group bg-white border border-border p-8 rounded-md shadow-card hover:border-accent hover:shadow-lg transition-all flex flex-col gap-4">
                <div className="w-12 h-12 bg-muted rounded-sm flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-background transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-serif text-primary">{feature.title}</h3>
                <p className="text-mutedForeground text-sm leading-relaxed">{feature.desc}</p>
                <div className="mt-auto pt-4 flex items-center text-sm font-medium text-accent group-hover:translate-x-1 transition-transform">
                  Explore Module &rarr;
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
