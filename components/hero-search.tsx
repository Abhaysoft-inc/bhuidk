"use client";

import React, { useState } from "react";
import {
  Search,
  Sparkles,
  Database,
  FileText,
  MapPin,
  Scale,
  BookOpen,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Filter,
} from "lucide-react";

interface HeroSearchProps {
  language: "en" | "hi";
  onSearch: (query: string, category: string) => void;
  onNavigateTab: (tabId: string) => void;
}

export function HeroSearch({ language, onSearch, onNavigateTab }: HeroSearchProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", labelEn: "All Resources", labelHi: "सभी संसाधन", icon: Search },
    { id: "research", labelEn: "Research Papers", labelHi: "शोध पत्र", icon: BookOpen },
    { id: "policy", labelEn: "Policy Briefs & Acts", labelHi: "नीति एवं कानून", icon: Scale },
    { id: "geospatial", labelEn: "Geospatial Datasets", labelHi: "भू-स्थानिक डेटा", icon: MapPin },
    { id: "casestudy", labelEn: "State Case Studies", labelHi: "केस स्टडीज", icon: FileText },
  ];

  const popularTags = [
    "Bhu-Aadhaar (ULPIN)",
    "SVAMITVA Scheme",
    "Urban-Rural Land Transition",
    "Cadastral GIS Resurvey",
    "Land Dispute Resolution Index",
    "Climate Vulnerability & Desertification",
    "Conclusive Titling Reforms",
    "Forest Rights & FRA 2006",
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery, selectedCategory);
  };

  return (
    <section className="relative w-full bg-linear-to-b from-[#0b2b50] via-[#0d3461] to-[#12427a] text-white pt-8 pb-14 border-b border-slate-300">
      {/* Subtle Government Geometric Grid / Cadastral pattern watermark */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#ffffff 1.5px, transparent 1.5px), radial-gradient(#ffffff 1.5px, #0b2b50 1.5px)`,
          backgroundSize: "32px 32px",
          backgroundPosition: "0 0, 16px 16px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[11px] font-bold px-2.5 py-0.5 rounded">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {language === "hi"
              ? "एआई व भू-स्थानिक तकनीक आधारित नीति मंच"
              : "AI & Geospatial Intelligence Powered Policy Platform"}
          </span>
          <span className="inline-flex items-center text-slate-300 text-[11px] bg-slate-800/60 border border-slate-700 px-2.5 py-0.5 rounded">
            {language === "hi"
              ? "साक्ष्य-आधारित भूमि शासन एवं प्रशासनिक नवाचार"
              : "Evidence-Based Land Governance & Administrative Innovation"}
          </span>
          <span className="inline-flex items-center text-emerald-300 text-[11px] bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
            {language === "hi" ? "पी.एम.ई. प्रभाग, भारत सरकार" : "PME Division, Govt of India"}
          </span>
        </div>

        {/* Hero Title and Mandate */}
        <div className="max-w-4xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {language === "hi" ? (
              <>
                अनुसंधान, नीति नवाचार एवं साक्ष्य-आधारित भूमि शासन हेतु{" "}
                <span className="text-amber-400 underline decoration-amber-500/60 decoration-2">
                  राष्ट्रीय डिजिटल मंच
                </span>
              </>
            ) : (
              <>
                National Digital Platform for Research, Policy Innovation &{" "}
                <span className="text-amber-400 underline decoration-amber-500/60 decoration-2">
                  Evidence-Based Land Governance
                </span>
              </>
            )}
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-200 leading-relaxed max-w-3xl">
            {language === "hi"
              ? "भूमि एक सीमित और रणनीतिक संसाधन है। यह मंच शोधकर्ताओं, नीति निर्माताओं, शैक्षणिक संस्थानों, राज्य राजस्व विभागों और उद्योग विशेषज्ञों को एक एकीकृत डिजिटल पारिस्थितिकी तंत्र में जोड़ता है - जहां एआई एनालिटिक्स, उपग्रह रिमोट सेंसिंग और नीति अनुकरण के माध्यम से पारदर्शी और भविष्य-उन्मुख भूमि प्रशासन संभव होता है।"
              : "Land is a finite and strategic resource underpinning economic growth, food security, and social equity. This platform serves as the sovereign knowledge ecosystem uniting researchers, policymakers, academic institutions, and State revenue departments through AI-assisted research, satellite geospatial analytics, and predictive policy simulation."}
          </p>
        </div>

        {/* Universal AI Search Box */}
        <div className="mt-8 bg-white text-slate-900 rounded-lg p-3 sm:p-4 shadow-xl border-2 border-amber-400/80">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-semibold">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all whitespace-nowrap ${
                    isSelected
                      ? "bg-[#0b2b50] text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{language === "hi" ? cat.labelHi : cat.labelEn}</span>
                </button>
              );
            })}
          </div>

          {/* Search Form */}
          <form onSubmit={handleFormSubmit} className="mt-3 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1 flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === "hi"
                    ? "खोजें: 14,000+ शोध पत्र, यूलपिन (भू-आधार) नियम, उपग्रह सर्वेक्षण, विवाद निपटान..."
                    : "Search 14,250+ research papers, Bhu-Aadhaar/ULPIN acts, satellite cadastral layers, dispute indices..."
                }
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 text-slate-900 text-sm rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0b2b50] focus:border-transparent font-medium"
              />
            </div>

            <button
              type="submit"
              className="bg-[#0b2b50] hover:bg-[#071e3d] text-white font-bold px-6 py-2.5 rounded text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer border border-[#164275]"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span>{language === "hi" ? "खोजें (Search)" : "Search Portal"}</span>
            </button>
          </form>

          {/* Trending Knowledge Tags */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              {language === "hi" ? "लोकप्रिय विषय:" : "Trending Topics:"}
            </span>
            {popularTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setSearchQuery(tag);
                  onSearch(tag, selectedCategory);
                }}
                className="bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer border border-slate-200"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Direct Actions Strip */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <button
            type="button"
            onClick={() => onNavigateTab("repository")}
            className="flex items-center justify-between p-3 rounded bg-[#164275]/80 hover:bg-[#164275] border border-sky-400/30 text-left transition-all group"
          >
            <div>
              <div className="font-bold text-white flex items-center gap-1.5">
                <Database className="w-4 h-4 text-amber-400" />
                <span>{language === "hi" ? "डिजिटल रिपोजिटरी" : "Digital Repository"}</span>
              </div>
              <div className="text-[11px] text-sky-200 mt-0.5">
                {language === "hi" ? "14,200+ प्रकाशन एवं कानून" : "14,250+ Papers & Gazettes"}
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab("simulator")}
            className="flex items-center justify-between p-3 rounded bg-[#164275]/80 hover:bg-[#164275] border border-amber-400/40 text-left transition-all group"
          >
            <div>
              <div className="font-bold text-white flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>{language === "hi" ? "एआई नीति सिम्युलेटर" : "Policy Sandbox"}</span>
              </div>
              <div className="text-[11px] text-amber-200 mt-0.5">
                {language === "hi" ? "सुधार पूर्व परिणाम मॉडल" : "Simulate Reform Outcomes"}
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab("gis")}
            className="flex items-center justify-between p-3 rounded bg-[#164275]/80 hover:bg-[#164275] border border-emerald-400/30 text-left transition-all group"
          >
            <div>
              <div className="font-bold text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>{language === "hi" ? "जीआईएस व भुवन" : "Geospatial GIS"}</span>
              </div>
              <div className="text-[11px] text-emerald-200 mt-0.5">
                {language === "hi" ? "कैडस्ट्रल व उपग्रह विश्लेषण" : "Satellite Land Use Layers"}
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab("hackathon")}
            className="flex items-center justify-between p-3 rounded bg-[#164275]/80 hover:bg-[#164275] border border-rose-400/30 text-left transition-all group"
          >
            <div>
              <div className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-rose-400" />
                <span>{language === "hi" ? "नवाचार व अनुसंधान अनुदान" : "Research Grants"}</span>
              </div>
              <div className="text-[11px] text-rose-200 mt-0.5">
                {language === "hi" ? "₹5.00 करोड़ की चुनौतियां" : "₹5.00 Cr Challenge Grants"}
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform shrink-0" />
          </button>
        </div>
      </div>
    </section>
  );
}
