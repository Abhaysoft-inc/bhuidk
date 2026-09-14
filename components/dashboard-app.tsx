"use client";

import React, { useState } from "react";
import {
  Sparkles,
  MapPin,
  Database,
  Users,
  Lightbulb,
  LogOut,
  ShieldCheck,
  Building,
  FileCheck,
  Award,
  Clock,
  Send,
  PlusCircle,
  ExternalLink,
  Lock,
} from "lucide-react";
import { PolicySimulator } from "./policy-simulator";
import { GisExplorer } from "./gis-explorer";
import { RepositorySection } from "./repository-section";

interface DashboardAppProps {
  user: { name: string; role: string; org: string };
  onLogout: () => void;
  language: "en" | "hi";
  defaultTab?: string;
}

export function DashboardApp({
  user,
  onLogout,
  language,
  defaultTab = "simulator",
}: DashboardAppProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  const internalTabs = [
    { id: "simulator", labelEn: "AI Policy Simulator", labelHi: "नीति सिम्युलेटर", icon: Sparkles, badge: "AI Sandbox" },
    { id: "gis", labelEn: "Geospatial GIS Suite", labelHi: "भू-स्थानिक जीआईएस", icon: MapPin, badge: "ISRO Bhuvan" },
    { id: "repository", labelEn: "Curated Repository", labelHi: "शोध भंडार", icon: Database, badge: "14,250+ Papers" },
    { id: "workspaces", labelEn: "Collaborative Workspaces", labelHi: "सहयोगी कार्यक्षेत्र", icon: Users },
    { id: "grants", labelEn: "Innovation & Grants", labelHi: "अनुदान एवं हैकाथॉन", icon: Lightbulb, badge: "₹5.0 Cr Pool" },
  ];

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen">
      {/* Authenticated User Status Strip */}
      <div className="bg-[#071e3d] text-white border-b-2 border-amber-500 py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0 text-xs">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-100">{user.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified via Jan Parichay
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                {user.role} • <span className="text-amber-300 font-medium">{user.org}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
              Session ID: GOI-NDP-2026-X884
            </span>
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1.5 bg-red-900/80 hover:bg-red-800 text-red-100 px-3 py-1 rounded text-xs font-bold border border-red-700 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out to Landing Page</span>
            </button>
          </div>
        </div>
      </div>

      {/* Internal Navigation Ribbon */}
      <div className="bg-white border-b border-slate-200 shadow-2xs sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between overflow-x-auto py-2 gap-2">
            <div className="flex items-center space-x-2">
              {internalTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#0b2b50] text-white shadow-xs"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{language === "hi" ? tab.labelHi : tab.labelEn}</span>
                    {tab.badge && (
                      <span
                        className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                          isActive ? "bg-amber-400 text-slate-950 font-bold" : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="pb-16">
        {activeTab === "simulator" && <PolicySimulator language={language} />}

        {activeTab === "gis" && <GisExplorer language={language} />}

        {activeTab === "repository" && <RepositorySection language={language} />}

        {activeTab === "workspaces" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="pb-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest block">
                  Collaborative Research Network
                </span>
                <h3 className="text-2xl font-black text-[#0b2b50] tracking-tight">
                  Active Multi-Stakeholder Research Workspaces
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Joint working rooms linking Central Ministries, State Revenue Commissioners, and
                  National Academic Researchers.
                </p>
              </div>
              <button
                type="button"
                onClick={() => alert("Initiating new inter-institutional project under NDSAP guidelines.")}
                className="flex items-center gap-1.5 bg-[#0b2b50] hover:bg-[#071e3d] text-white px-4 py-2 rounded text-xs font-bold shadow-xs cursor-pointer self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4 text-amber-400" />
                <span>Create New Project Workspace</span>
              </button>
            </div>

            {/* Workspaces List */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
                    Active Study • WG-04
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Updated 2h ago
                  </span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">
                  Peri-Urban Cadastral Resurvey in Pune Corridor
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Collaborative evaluation between Maharashtra Land Records Directorate and IIT
                  Bombay on drone photogrammetry tolerances.
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">8 Co-Authors</span>
                  <button
                    type="button"
                    onClick={() => alert("Opening WG-04 Data Room.")}
                    className="text-[#0b2b50] font-bold hover:underline"
                  >
                    Open Workspace →
                  </button>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                    Policy Drafting • WG-09
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Updated yesterday
                  </span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">
                  Model Tenancy Framework & Crop Loan Eligibility
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Joint policy formulation with NIRD&PR and NALSAR analyzing legal protections for
                  unregistered tenant farmers.
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">12 Co-Authors</span>
                  <button
                    type="button"
                    onClick={() => alert("Opening WG-09 Data Room.")}
                    className="text-[#0b2b50] font-bold hover:underline"
                  >
                    Open Workspace →
                  </button>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                    GIS Spatial Hub • WG-12
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Updated 4d ago
                  </span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">
                  Desertification Vulnerability Atlas for WDC-PMKSY 2.0
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  ISRO NRSC and DoLR Watershed cell developing predictive soil moisture indices
                  using Sentinel synthetic aperture radar.
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">6 Co-Authors</span>
                  <button
                    type="button"
                    onClick={() => alert("Opening WG-12 Data Room.")}
                    className="text-[#0b2b50] font-bold hover:underline"
                  >
                    Open Workspace →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "grants" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="pb-6 border-b border-slate-200">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest block">
                Bhoomi Innovation Portal
              </span>
              <h3 className="text-2xl font-black text-[#0b2b50] tracking-tight">
                National Land Governance Hackathon & Innovation Challenges 2026
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Open challenge statements for researchers, GIS specialists, and AI innovators under
                the PME Innovation Fund.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {[
                {
                  id: "PS-01",
                  title: "Automated OCR & NLP Parsing of Urdu / Persian / Modi Script Legacy Land Records",
                  reward: "₹35,00,000 Grant",
                  deadline: "31 Oct 2026",
                  desc: "Develop high-accuracy deep learning models capable of transcribing colonial-era revenue registers and Jamabandi records across Punjab, Maharashtra, and UP.",
                },
                {
                  id: "PS-02",
                  title: "Drone-to-Cadastre Auto-Boundary Delineation using Graph Neural Networks",
                  reward: "₹50,00,000 Grant",
                  deadline: "15 Nov 2026",
                  desc: "Algorithms to automatically identify field bunds (Medh) and boundary stones from 5cm drone ortho-rectified imagery, minimizing manual digitized drafting.",
                },
                {
                  id: "PS-03",
                  title: "Pre-Litigation Land Dispute Prediction Engine based on Succession Genealogy",
                  reward: "₹40,00,000 Grant",
                  deadline: "30 Nov 2026",
                  desc: "Predict family mutation contestations by analyzing multi-generation succession trees and unpartitioned co-ownership shares in rural revenue khata records.",
                },
              ].map((chal) => (
                <div
                  key={chal.id}
                  className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-3xl">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#0b2b50] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        {chal.id}
                      </span>
                      <span className="text-emerald-700 font-bold text-xs">{chal.reward}</span>
                      <span className="text-slate-400 text-xs">• Deadline: {chal.deadline}</span>
                    </div>
                    <h4 className="font-extrabold text-[#0b2b50] text-sm">{chal.title}</h4>
                    <p className="text-xs text-slate-600">{chal.desc}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      alert(`Applying for Challenge ${chal.id}. Proposal submission template opened for ${user.name}.`)
                    }
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-4 py-2 rounded text-xs shadow-xs transition-colors shrink-0 cursor-pointer"
                  >
                    Submit Solution Pitch
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
