"use client";

import React, { useState } from "react";
import { Search, MapPin, AlertCircle, FileText, ChevronDown, ArrowRight, Building2, Flame, Lightbulb, Pickaxe, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ClaimGapModal } from "@/components/grants/ClaimGapModal";
import { QuickGrantsTab } from "@/components/grants/QuickGrantsTab";
import { TechChallengesTab } from "@/components/grants/TechChallengesTab";

export default function GrantsPage() {
  const [activeTab, setActiveTab] = useState("Research Gaps");
  const [selectedGap, setSelectedGap] = useState<any>(null);

  const tabs = [
    { id: "Research Gaps", icon: AlertCircle },
    { id: "Active Projects", icon: FileText },
    { id: "Quick Grants", icon: Flame },
    { id: "Tech Challenges", icon: Pickaxe },
    { id: "Impact", icon: Award },
  ];

  const gaps = [
    {
      id: "GAP-2026-081",
      urgency: "High",
      category: "Disputes",
      location: "Odisha, Sambalpur",
      title: "Sambalpur, Odisha: 42% Spike in Land Disputes Following Canal Network Expansion",
      desc: "District revenue court filings surged 42% along the Hirakud Command Area since 2023. No existing policy research or standard operating procedure addresses easement rights across newly canalized command areas, leaving 1,420 smallholder petitions unresolved.",
      source: "Dispute Intelligence - [D3] Sambalpur Land Consolidation Act (1972) vs [D9] Water Resources Canal Alignment Notification (2021)",
      tags: ["DoLR Digital India Land Records Programme", "UNDP India Resilient Land Governance Initiative"],
      type: "Standard (₹2L-10L)",
      amount: "₹5.8 Lakhs",
    },
    {
      id: "GAP-2026-084",
      urgency: "High",
      category: "Land Use",
      location: "Uttar Pradesh, Jhansi & Lalitpur",
      title: "Bundelkhand, UP: Statutory Contradiction on Tree-Harvest Rights on Recorded Holdings",
      desc: "Contradiction engine detected conflicting statutory clauses: Section 13 grants bhumidhars unrestricted timber rights on ancestral private parcels, while 2018 Transit Rules mandate Divisional Forest Officer transit permits, halting agro-forestry commercialization across 40,000 hectares.",
      source: "Policy Simulator - UP Revenue Code (2006) vs UP Tree Protection Act (1976)",
      tags: ["National Agroforestry Policy", "Ministry of Environment & Forests"],
      type: "Major (₹10L-50L)",
      amount: "₹12.5 Lakhs",
    },
    {
      id: "GAP-2026-092",
      urgency: "Medium",
      category: "Urban Expansion",
      location: "Karnataka, Bengaluru Rural",
      title: "Doddaballapura: Peri-Urban Land Value Assessment Anomalies",
      desc: "Significant discrepancies found between registered guidance values and actual transaction rates in recently converted industrial zones. Requires empirical study to propose an automated valuation model (AVM) for peri-urban transition zones.",
      source: "Analytics Engine - IGRS Karnataka Registration Data (2025)",
      tags: ["State Revenue Department", "Smart Cities Mission"],
      type: "Standard (₹2L-10L)",
      amount: "₹4.0 Lakhs",
    }
  ];

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] w-full pb-10">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Grants & Innovation</h1>
            <p className="text-sm text-slate-500 mt-1">Fund research on data gaps detected by the platform's dispute and contradiction engines</p>
          </div>
          <div className="flex items-center gap-2 text-sm shrink-0">
            <span className="text-slate-500">Viewing as:</span>
            <button className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg font-bold text-slate-700 hover:bg-slate-100 transition-colors">
              Researcher <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 mt-6">
        
        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-slate-200 overflow-x-auto no-scrollbar mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-1 border-b-2 font-bold text-sm transition-colors shrink-0 ${
                  isActive ? "border-[#0b2b50] text-[#0b2b50]" : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#0b2b50]" : "text-slate-400"}`} /> {tab.id}
              </button>
            );
          })}
        </div>

        {activeTab === "Research Gaps" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            
            {/* Filter Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-2">
              <div className="flex items-center justify-between w-full lg:w-auto">
                <span className="font-bold text-slate-800">{gaps.length} research gaps detected</span>
                <button className="lg:hidden flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700">
                  <Building2 className="w-3.5 h-3.5" /> View co-funding partners
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Search by district, state, or keyword..." 
                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2b50] transition-shadow shadow-sm"
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select className="bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0b2b50] shadow-sm flex-1 sm:flex-none">
                    <option>All States</option>
                  </select>
                  <select className="bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0b2b50] shadow-sm flex-1 sm:flex-none">
                    <option>All Urgencies</option>
                  </select>
                  <select className="bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0b2b50] shadow-sm flex-1 sm:flex-none">
                    <option>All Topics</option>
                  </select>
                </div>
                <button className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200 transition-colors shrink-0">
                  <Building2 className="w-3.5 h-3.5" /> View co-funding partners
                </button>
              </div>
            </div>

            {/* Gap Cards */}
            <div className="space-y-5">
              {gaps.map((gap) => (
                <div key={gap.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#0b2b50] to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Meta */}
                  <div className="flex items-center gap-3 text-[11px] font-bold mb-3">
                    <span className="bg-[#1e293b] text-white px-2 py-0.5 rounded tracking-wide">{gap.id}</span>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <span className={`w-2 h-2 rounded-full ${gap.urgency === 'High' ? 'bg-red-500' : 'bg-amber-500'}`}></span>
                      {gap.urgency}
                    </div>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-600">{gap.category}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-600 flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {gap.location}</span>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-black text-slate-900 mb-2 leading-snug">{gap.title}</h3>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">{gap.desc}</p>
                  
                  {/* Source */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded border border-slate-100 w-fit">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      Source: {gap.source}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    {gap.tags.map(tag => (
                      <span key={tag} className="bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-bold px-2.5 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-slate-500">{gap.type}</span>
                      <span className="text-sm font-black text-emerald-600">{gap.amount}</span>
                    </div>
                    <button 
                      onClick={() => setSelectedGap(gap)}
                      className="bg-[#0b2b50] hover:bg-[#164275] text-white font-bold px-5 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 shadow-sm"
                    >
                      Claim This Gap <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
          </motion.div>
        )}

        {activeTab === "Quick Grants" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <QuickGrantsTab />
          </motion.div>
        )}

        {activeTab === "Tech Challenges" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <TechChallengesTab />
          </motion.div>
        )}

        {/* Placeholders for other tabs */}
        {(activeTab === "Active Projects" || activeTab === "Impact") && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Lightbulb className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Coming Soon</h3>
            <p className="text-sm text-slate-500 max-w-sm">The {activeTab} section is currently under development. Check back later for updates.</p>
          </div>
        )}

      </div>
      
      {/* Modal Integration */}
      <ClaimGapModal 
        isOpen={!!selectedGap} 
        onClose={() => setSelectedGap(null)} 
        gap={selectedGap} 
      />
    </div>
  );
}
