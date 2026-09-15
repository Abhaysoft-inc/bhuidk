"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Database,
  Search,
  Filter,
  MapPin,
  Calendar,
  Building,
  FileText,
  ChevronDown,
  ArrowRight,
  Download,
  BookOpen,
} from "lucide-react";

export default function RepositoryPage() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filters = [
    { id: "state", label: "State", icon: MapPin, options: ["Maharashtra", "Odisha", "Gujarat", "Karnataka"] },
    { id: "topic", label: "Topic", icon: BookOpen, options: ["Land Titling", "Dispute Resolution", "GIS Mapping", "Tenancy Laws"] },
    { id: "year", label: "Year", icon: Calendar, options: ["2026", "2025", "2024", "2023"] },
    { id: "org", label: "Org Type", icon: Building, options: ["Government", "Academic", "NGO", "Private"] },
  ];

  const documents = [
    {
      id: "1",
      title: "Socio-Economic Impact of ULPIN on Agricultural Credit Flow",
      type: "Research Paper",
      year: 2026,
      state: "Maharashtra",
      publisher: "National Council of Applied Economic Research",
      abstract: "An in-depth analysis of how the introduction of Unique Land Parcel Identification Number (ULPIN) has reduced credit approval times for marginal farmers by 40% across 12 districts.",
      tags: ["Credit", "ULPIN", "Agriculture"],
      color: "blue",
    },
    {
      id: "2",
      title: "SOP for Drone-Based Cadastral Resurvey under SVAMITVA",
      type: "Policy Document",
      year: 2025,
      state: "National",
      publisher: "Department of Land Resources (DoLR)",
      abstract: "Standard operating procedures for establishing Ground Control Points (GCPs) and flight path planning for rural abadi area mapping.",
      tags: ["SVAMITVA", "Drones", "Survey"],
      color: "emerald",
    },
    {
      id: "3",
      title: "National Land Dispute Precedent Database: ML Analysis",
      type: "Dataset",
      year: 2026,
      state: "National",
      publisher: "NALSAR University of Law",
      abstract: "A comprehensive machine learning dataset containing 2.5 million anonymized land dispute judgments parsed into structural components.",
      tags: ["AI/ML", "Legal", "Disputes"],
      color: "indigo",
    },
    {
      id: "4",
      title: "Urban-Rural Fringe Land Conversion Satellite Assessment",
      type: "Geospatial Data",
      year: 2026,
      state: "Karnataka",
      publisher: "ISRO / NRSC",
      abstract: "High-resolution time-series spatial data tracking unauthorized land use changes in the Bangalore-Mysore corridor.",
      tags: ["GIS", "Urbanization", "LULC"],
      color: "amber",
    },
    {
      id: "5",
      title: "Model Land Leasing Act: Comparative Assessment",
      type: "Case Study",
      year: 2025,
      state: "Odisha & MP",
      publisher: "NITI Aayog",
      abstract: "Evaluating the implementation challenges and economic benefits of formalized tenant farming in two distinct agrarian states.",
      tags: ["Tenancy", "Policy", "Farming"],
      color: "rose",
    },
  ];

  const getColorClasses = (color: string) => {
    const classes: Record<string, { bg: string; text: string; border: string }> = {
      blue: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
      emerald: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
      indigo: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
      amber: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
      rose: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
    };
    return classes[color] || classes.blue;
  };

  const filteredDocuments = documents.filter((doc) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      doc.title.toLowerCase().includes(q) ||
      doc.abstract.toLowerCase().includes(q) ||
      doc.publisher.toLowerCase().includes(q) ||
      doc.tags.some(tag => tag.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="bg-[#0b2b50] rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Database className="w-64 h-64" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-amber-300 mb-4">
            <BookOpen className="w-3.5 h-3.5" /> Open Access
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            Digital Land Repository
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed mb-8">
            Access over 14,250+ peer-reviewed research papers, government policy frameworks, and high-fidelity geospatial datasets driving evidence-based land governance in India.
          </p>

          {/* Search Bar */}
          <div className="relative flex items-center shadow-lg">
            <div className="absolute left-4 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search by keywords, title, author, or document ID..."
              className="w-full pl-12 pr-4 py-4 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-amber-500/30 transition-shadow bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="absolute right-2 px-6 py-2 bg-[#0b2b50] hover:bg-[#154278] text-white text-sm font-bold rounded-lg transition-colors cursor-pointer">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mr-2">
            <Filter className="w-4 h-4" /> Filters:
          </div>
          {filters.map((filter) => {
            const Icon = filter.icon;
            const isOpen = activeFilter === filter.id;
            return (
              <div key={filter.id} className="relative">
                <button
                  onClick={() => setActiveFilter(isOpen ? null : filter.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-colors cursor-pointer ${
                    isOpen
                      ? "bg-slate-800 text-white border-slate-800"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {filter.label}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {isOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-2">
                    {filter.options.map((opt) => (
                      <button
                        key={opt}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0b2b50] font-medium cursor-pointer"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="text-xs font-semibold text-slate-500 whitespace-nowrap">
          Showing 1 - {filteredDocuments.length} of 14,250 results
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-5">
        {filteredDocuments.map((doc) => {
          const colors = getColorClasses(doc.color);
          return (
            <div
              key={doc.id}
              className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col lg:flex-row gap-6"
            >
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${colors.bg} ${colors.text} ${colors.border}`}>
                    {doc.type}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                    <Calendar className="w-3 h-3" /> {doc.year}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                    <MapPin className="w-3 h-3" /> {doc.state}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#0b2b50] transition-colors line-clamp-2">
                    <Link href={`/dashboard/repository/${doc.id}`} className="hover:underline">
                      {doc.title}
                    </Link>
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mt-1.5">
                    <Building className="w-3.5 h-3.5" />
                    {doc.publisher}
                  </div>
                </div>

                <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                  {doc.abstract}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {doc.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-bold text-slate-400 border border-slate-200 px-2 py-0.5 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions Column */}
              <div className="lg:w-48 flex flex-col justify-center gap-3 lg:border-l border-slate-100 lg:pl-6">
                <Link
                  href={`/dashboard/repository/${doc.id}`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0b2b50] text-white text-xs font-bold rounded-lg hover:bg-[#154278] transition-colors cursor-pointer shadow-sm shadow-[#0b2b50]/20"
                >
                  View Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" /> Download PDF
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
