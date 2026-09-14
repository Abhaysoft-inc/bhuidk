"use client";

import React from "react";
import Link from "next/link";


import {
  Search,
  Database,
  MapPin,
  Sparkles,
  Users,
  Lightbulb,
  BarChart3,
  ArrowRight,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      {/* ─── Tricolor Ribbon ─── */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      {/* ─── Slim Top Bar ─── */}
      <div className="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-600">
        <div className="max-w-6xl mx-auto px-6 py-1.5 flex items-center justify-between">
          <span className="font-semibold tracking-wide">
            GOVERNMENT OF INDIA &nbsp;•&nbsp; Ministry of Rural Development &nbsp;•&nbsp; Dept. of Land Resources
          </span>
          <div className="flex items-center gap-3">
            <a href="#main" className="hover:text-slate-900">Skip to Content</a>
            <span className="text-slate-300">|</span>
            <span className="font-semibold text-slate-800">EN</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-500 cursor-pointer hover:text-slate-800">हिन्दी</span>
          </div>
        </div>
      </div>

      {/* ─── Header ─── */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo + Title */}
          <div className="flex items-center gap-4">
            {/* Ashoka Emblem – simplified */}
            <div className="w-12 h-12 rounded-full bg-[#0b2b50] text-white flex items-center justify-center text-lg font-black shrink-0 shadow-sm">
              भा
            </div>
            <div>
              <div className="text-[10px] font-semibold text-amber-700 uppercase tracking-widest">
                PME Division • DoLR • भारत सरकार
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold text-[#0b2b50] leading-tight tracking-tight">
                National Land Governance Platform
              </h1>
            </div>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#about" className="hover:text-[#0b2b50] transition-colors">About</a>
            <a href="#features" className="hover:text-[#0b2b50] transition-colors">Features</a>
            <a href="#tech" className="hover:text-[#0b2b50] transition-colors">Technology</a>
            <a href="#stakeholders" className="hover:text-[#0b2b50] transition-colors">Stakeholders</a>
            <Link
              href="/login"
              className="bg-[#0b2b50] text-white px-4 py-2 rounded font-bold hover:bg-[#164275] transition-colors"
            >
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      <main id="main" className="flex-1">
        {/* ─── Hero ─── */}
        <section className="bg-[#0b2b50] text-white">
          <div className="max-w-6xl mx-auto px-6 py-16 sm:py-20">
            <div className="max-w-2xl space-y-5">
              <div className="inline-block bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[11px] font-bold px-3 py-1 rounded-full tracking-wide">
                Evidence-Based Policy Innovation
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight">
                Research & Innovation for{" "}
                <span className="text-amber-400">India&apos;s Land Governance</span>
              </h2>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                A centralized digital ecosystem connecting researchers, policymakers, and institutions through AI analytics, geospatial intelligence, and collaborative tools.
              </p>

              {/* Search Bar */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-1.5 flex gap-2 max-w-lg">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search research papers, datasets, policies..."
                    className="w-full pl-9 pr-3 py-2.5 bg-white text-slate-900 text-sm rounded placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded text-sm transition-colors cursor-pointer shrink-0"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl">
              {[
                { num: "14,250+", label: "Research Papers" },
                { num: "850+", label: "Geospatial Datasets" },
                { num: "36", label: "States & UTs" },
                { num: "₹18.5 Cr", label: "Grants Allocated" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-black text-white">{s.num}</div>
                  <div className="text-xs text-slate-400 font-medium mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── About (Brief) ─── */}
        <section id="about" className="py-16 bg-slate-50 border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-widest">
                Why This Platform?
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0b2b50] tracking-tight">
                Bridging the gap between land data and policy action
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                India generates vast datasets through land records, cadastral surveys, satellite
                imagery, and GIS platforms — yet these remain underutilized for policymaking. This
                platform transforms raw data into actionable insights through applied research,
                AI-driven analytics, and cross-institutional collaboration.
              </p>
            </div>
          </div>
        </section>

        {/* ─── Features Grid ─── */}
        <section id="features" className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-widest">
                Core Capabilities
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0b2b50] tracking-tight mt-1">
                What the platform offers
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  icon: Database,
                  title: "Digital Repository",
                  desc: "Centralized archive of research papers, policy documents, legal frameworks, and case studies from across India.",
                },
                {
                  icon: Sparkles,
                  title: "AI-Powered Discovery",
                  desc: "Smart search, recommendation engine, and literature synthesis to surface relevant research instantly.",
                },
                {
                  icon: MapPin,
                  title: "Geospatial Intelligence",
                  desc: "Integrated GIS visualization with ISRO Bhuvan satellite imagery, cadastral maps, and climate risk layers.",
                },
                {
                  icon: BarChart3,
                  title: "Policy Simulation",
                  desc: "Decision-support tools to model reform outcomes — dispute reduction, revenue impact — before implementation.",
                },
                {
                  icon: Users,
                  title: "Collaborative Workspaces",
                  desc: "Secure role-based spaces for government officials, academics, and researchers to co-author policy papers.",
                },
                {
                  icon: Lightbulb,
                  title: "Innovation & Grants",
                  desc: "Hackathons, pilot project funding, and research fellowships to foster technological adoption in land governance.",
                },
              ].map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    className="group p-6 rounded-xl border border-slate-200 hover:border-[#0b2b50]/30 hover:shadow-md transition-all bg-white"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#0b2b50]/5 text-[#0b2b50] flex items-center justify-center mb-4 group-hover:bg-[#0b2b50] group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{f.title}</h4>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── Tech Stack (Minimal) ─── */}
        <section id="tech" className="py-16 bg-slate-50 border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-10">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-widest">
                Built With
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0b2b50] tracking-tight mt-1">
                Technology Stack
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
              {[
                { label: "Database", items: "PostgreSQL, MongoDB, Elasticsearch" },
                { label: "Analytics", items: "Apache Spark, Pandas, NumPy" },
                { label: "Documents", items: "Elasticsearch, Solr, OCR" },
                { label: "Cloud", items: "NIC MeghRaj / GovCloud" },
                { label: "Collaboration", items: "Forums, Workflows, Tracking" },
              ].map((t) => (
                <div
                  key={t.label}
                  className="bg-white p-4 rounded-lg border border-slate-200 text-center"
                >
                  <div className="text-xs font-bold text-[#0b2b50] uppercase tracking-wide">
                    {t.label}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">{t.items}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Stakeholders ─── */}
        <section id="stakeholders" className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-10">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-widest">
                Ecosystem
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0b2b50] tracking-tight mt-1">
                Key Stakeholders
              </h3>
            </div>

            <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
              {[
                "Ministry of Rural Development",
                "State Governments",
                "Academic Institutions",
                "Research Organizations",
                "Think Tanks",
                "Survey of India",
                "ISRO / NRSC",
                "GIS Experts",
                "Policy Makers",
                "NGOs",
              ].map((name) => (
                <span
                  key={name}
                  className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs font-semibold text-slate-700"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA Banner ─── */}
        <section className="py-16 bg-[#0b2b50] text-white text-center">
          <div className="max-w-2xl mx-auto px-6 space-y-4">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to explore the platform?
            </h3>
            <p className="text-sm text-slate-300">
              Access research papers, geospatial datasets, policy simulation tools, and collaborative workspaces.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <Link
                href="/signup"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-3 rounded text-sm transition-colors flex items-center gap-2"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded text-sm transition-colors border border-white/20"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="bg-[#071e3d] text-slate-400 text-[11px]">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
            <div className="space-y-1">
              <div className="text-white font-bold text-xs">Department of Land Resources (DoLR)</div>
              <div>Ministry of Rural Development, Government of India</div>
              <div>PME Division • Nirman Bhawan, New Delhi - 110011</div>
              <div className="pt-1">support-landgov@nic.in &nbsp;•&nbsp; 1800-11-7890</div>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-1 text-[11px]">
              <div className="flex items-center gap-3 text-slate-500">
                <a href="#" className="hover:text-amber-400">Privacy Policy</a>
                <a href="#" className="hover:text-amber-400">Terms</a>
                <a href="#" className="hover:text-amber-400">Accessibility</a>
              </div>
              <div className="text-slate-500 mt-1">
                Hosted on NIC MeghRaj Cloud &nbsp;•&nbsp; GIGW 3.0 Compliant
              </div>
              <div className="text-slate-600 mt-0.5">
                © 2026 DoLR, MoRD, Govt of India. All rights reserved.
              </div>
            </div>
          </div>
        </div>
        {/* Bottom tricolor */}
        <div className="h-1 w-full flex">
          <div className="flex-1 bg-[#FF9933]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#138808]" />
        </div>
      </footer>
    </div>
  );
}
