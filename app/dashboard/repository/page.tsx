"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Calendar,
  BookOpen,
  Download,
  MoreHorizontal,
  FileText,
  Database,
  Globe,
  FlaskConical,
  SlidersHorizontal,
  Plus,
  ArrowUpRight,
  Star,
  Eye,
} from "lucide-react";

// ─── Config ─────────────────────────────────────────────────────────────────
const typeConfig: Record<string, {
  badgeBg: string; badgeText: string;
  iconBg: string;  iconColor: string;
  accentBar: string;
  icon: React.ElementType;
}> = {
  "Research Paper":  { badgeBg: "bg-blue-50",    badgeText: "text-blue-600",    iconBg: "bg-blue-100",    iconColor: "text-blue-600",    accentBar: "bg-blue-500",    icon: FileText    },
  "Policy Document": { badgeBg: "bg-emerald-50", badgeText: "text-emerald-700", iconBg: "bg-emerald-100", iconColor: "text-emerald-700", accentBar: "bg-emerald-500", icon: BookOpen    },
  "Dataset":         { badgeBg: "bg-indigo-50",  badgeText: "text-indigo-600",  iconBg: "bg-indigo-100",  iconColor: "text-indigo-600",  accentBar: "bg-indigo-500",  icon: Database    },
  "Geospatial Data": { badgeBg: "bg-amber-50",   badgeText: "text-amber-700",   iconBg: "bg-amber-100",   iconColor: "text-amber-700",   accentBar: "bg-amber-500",   icon: Globe       },
  "Case Study":      { badgeBg: "bg-rose-50",    badgeText: "text-rose-600",    iconBg: "bg-rose-100",    iconColor: "text-rose-600",    accentBar: "bg-rose-500",    icon: FlaskConical },
};

const TABS = ["All", "Research Paper", "Policy Document", "Dataset", "Geospatial Data", "Case Study"];

const documents = [
  {
    id: "1", type: "Research Paper", starred: true,
    title: "Socio-Economic Impact of ULPIN on Agricultural Credit Flow",
    publisher: "National Council of Applied Economic Research",
    abstract: "How ULPIN has reduced credit approval times for marginal farmers by 40% across 12 districts in Maharashtra.",
    tags: ["Credit", "ULPIN", "Agriculture"],
    state: "Maharashtra", year: 2026,
    avatars: ["AS", "RK", "PM"], views: "1.2k", citations: 45,
  },
  {
    id: "2", type: "Policy Document", starred: false,
    title: "SOP for Drone-Based Cadastral Resurvey under SVAMITVA",
    publisher: "Department of Land Resources (DoLR)",
    abstract: "Standard operating procedures for GCPs and flight path planning for rural abadi area digital mapping.",
    tags: ["SVAMITVA", "Drones", "Survey"],
    state: "National", year: 2025,
    avatars: ["DL", "NP"], views: "856", citations: 28,
  },
  {
    id: "3", type: "Dataset", starred: true,
    title: "National Land Dispute Precedent Database: ML Analysis",
    publisher: "NALSAR University of Law",
    abstract: "2.5 million anonymized land dispute judgments parsed into structured ML-ready components and schemas.",
    tags: ["AI/ML", "Legal", "Disputes"],
    state: "National", year: 2026,
    avatars: ["SK", "VR", "AM", "JD"], views: "3.4k", citations: 102,
  },
  {
    id: "4", type: "Geospatial Data", starred: false,
    title: "Urban-Rural Fringe Land Conversion Satellite Assessment",
    publisher: "ISRO / NRSC",
    abstract: "Time-series spatial data tracking unauthorized land-use changes in the Bangalore–Mysore corridor.",
    tags: ["GIS", "Urbanization", "LULC"],
    state: "Karnataka", year: 2026,
    avatars: ["GN", "TM"], views: "2.1k", citations: 67,
  },
  {
    id: "5", type: "Case Study", starred: false,
    title: "Model Land Leasing Act: Comparative Assessment MP & Odisha",
    publisher: "NITI Aayog",
    abstract: "Evaluating implementation challenges and economic benefits of formalized tenant farming across two states.",
    tags: ["Tenancy", "Policy", "Farming"],
    state: "Odisha & MP", year: 2025,
    avatars: ["SB", "AP", "KR"], views: "998", citations: 19,
  },
  {
    id: "6", type: "Research Paper", starred: true,
    title: "Blockchain-Backed Land Title Registry: Feasibility in Karnataka",
    publisher: "IISc Bengaluru",
    abstract: "Assessing the technical and legal feasibility of a distributed ledger for immutable land records.",
    tags: ["Blockchain", "Registry", "DLT"],
    state: "Karnataka", year: 2026,
    avatars: ["RN", "QA"], views: "547", citations: 11,
  },
];

const avatarColors = [
  "bg-blue-500", "bg-emerald-500", "bg-indigo-500",
  "bg-amber-500", "bg-rose-500", "bg-purple-500",
];

// ─── Animation Variants ──────────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show:   { opacity: 1, y: 0,  scale: 1, transition: { type: "spring", stiffness: 260, damping: 24 } },
  exit:   { opacity: 0, y: -12, scale: 0.96, transition: { duration: 0.18 } },
};

const headerVariants = {
  hidden: { opacity: 0, y: -16 },
  show:   { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 24 } },
};

const tabVariants = {
  hidden: { opacity: 0, x: -12 },
  show:   (i: number) => ({ opacity: 1, x: 0, transition: { delay: i * 0.04, type: "spring", stiffness: 300, damping: 26 } }),
};

// ─── Component ───────────────────────────────────────────────────────────────
export default function RepositoryPage() {
  const [activeTab,   setActiveTab]   = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [starred,     setStarred]     = useState<Record<string, boolean>>(
    Object.fromEntries(documents.map(d => [d.id, d.starred]))
  );

  const filteredDocs = documents.filter((doc) => {
    const matchTab    = activeTab === "All" || doc.type === activeTab;
    const q           = searchQuery.toLowerCase();
    const matchSearch = !q
      || doc.title.toLowerCase().includes(q)
      || doc.abstract.toLowerCase().includes(q)
      || doc.publisher.toLowerCase().includes(q)
      || doc.tags.some(t => t.toLowerCase().includes(q));
    return matchTab && matchSearch;
  });

  return (
    <div className="space-y-7 pb-12">

      {/* ── Header ── */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-5"
      >
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1"
          >
            Dashboard › Repository
          </motion.p>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Digital Repository
            <motion.span
              animate={{ rotate: [0, 15, -10, 15, 0] }}
              transition={{ duration: 1.2, delay: 0.5, ease: "easeInOut" }}
              className="text-amber-400 text-2xl"
            >
              ✦
            </motion.span>
          </h1>
          <p className="text-sm text-slate-400 font-medium mt-1">
            14,250+ curated research papers, datasets & policy documents
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 260 }}
          className="flex items-center gap-3"
        >
          <div className="flex items-center -space-x-2">
            {["AS", "RK", "DL", "SK"].map((a, i) => (
              <motion.div
                key={a}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.05, type: "spring", stiffness: 300 }}
                className={`w-8 h-8 rounded-full border-2 border-white text-white text-[10px] font-bold flex items-center justify-center shadow-sm ${avatarColors[i]}`}
              >
                {a}
              </motion.div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 text-slate-500 text-[10px] font-bold flex items-center justify-center">+6</div>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0b2b50] text-white text-xs font-bold rounded-xl hover:bg-[#154278] active:scale-95 transition-all duration-150 shadow-lg shadow-[#0b2b50]/25 cursor-pointer">
            <Plus className="w-3.5 h-3.5" /> Add Document
          </button>
        </motion.div>
      </motion.div>

      {/* ── Search + Filter ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 24 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#0b2b50] transition-colors" />
          <input
            type="text"
            placeholder="Search documents, authors, topics..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0b2b50]/10 focus:border-[#0b2b50]/40 transition-all shadow-sm placeholder:text-slate-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4" /> Filter & Sort
        </motion.button>
      </motion.div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {TABS.map((tab, i) => {
          const count  = tab === "All" ? documents.length : documents.filter(d => d.type === tab).length;
          const isActive = activeTab === tab;
          return (
            <motion.button
              key={tab}
              custom={i}
              variants={tabVariants}
              initial="hidden"
              animate="show"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab(tab)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-[#0b2b50] text-white shadow-md shadow-[#0b2b50]/20"
                  : "bg-white border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              {tab}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-black ${isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                {count}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* ── Result Count ── */}
      <motion.p
        key={filteredDocs.length}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-[11px] font-bold text-slate-400 uppercase tracking-widest"
      >
        {filteredDocs.length} result{filteredDocs.length !== 1 ? "s" : ""} found
      </motion.p>

      {/* ── Cards Grid ── */}
      <motion.div
        key={activeTab + searchQuery}
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
      >
        <AnimatePresence mode="popLayout">
          {filteredDocs.map((doc) => {
            const cfg  = typeConfig[doc.type] || typeConfig["Research Paper"];
            const Icon = cfg.icon;
            const isStarred = starred[doc.id];

            return (
              <motion.div
                key={doc.id}
                variants={cardVariants}
                layout
                exit="exit"
                whileHover={{ y: -4, boxShadow: "0 20px 40px -8px rgba(0,0,0,0.10)" }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="group relative bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col"
              >
                {/* Accent top bar */}
                <div className={`h-1 w-full ${cfg.accentBar} opacity-80`} />

                <div className="p-5 flex flex-col gap-4 flex-1">
                  {/* Top row: badge + star + menu */}
                  <div className="flex items-start justify-between">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${cfg.badgeBg} ${cfg.badgeText}`}>
                      <Icon className="w-3 h-3" />
                      {doc.type}
                    </span>
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.85 }}
                        onClick={() => setStarred(prev => ({ ...prev, [doc.id]: !prev[doc.id] }))}
                        className="p-1"
                      >
                        <Star className={`w-3.5 h-3.5 transition-colors ${isStarred ? "fill-amber-400 text-amber-400" : "text-slate-300 hover:text-amber-400"}`} />
                      </motion.button>
                      <button className="text-slate-300 hover:text-slate-600 transition-colors p-1">
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title + Abstract */}
                  <div className="flex-1 space-y-2">
                    <Link href={`/dashboard/repository/${doc.id}`}>
                      <h3 className="text-sm font-extrabold text-slate-800 line-clamp-2 leading-snug hover:text-[#0b2b50] transition-colors">
                        {doc.title}
                      </h3>
                    </Link>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-medium">
                      {doc.abstract}
                    </p>
                  </div>

                  {/* Publisher */}
                  <div className="flex items-center gap-2.5 py-3 border-y border-slate-100">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${cfg.iconBg}`}>
                      <Icon className={`w-3.5 h-3.5 ${cfg.iconColor}`} />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600 truncate leading-tight">{doc.publisher}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {doc.tags.map((tag) => (
                      <motion.span
                        key={tag}
                        whileHover={{ scale: 1.05 }}
                        className="text-[10px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-md transition-colors cursor-default"
                      >
                        #{tag}
                      </motion.span>
                    ))}
                  </div>

                  {/* Footer: avatars + meta + actions */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center -space-x-1.5">
                      {doc.avatars.slice(0, 3).map((av, idx) => (
                        <div
                          key={av + idx}
                          title={av}
                          className={`w-6 h-6 rounded-full border-2 border-white text-white text-[9px] font-bold flex items-center justify-center ${avatarColors[idx % avatarColors.length]}`}
                        >
                          {av}
                        </div>
                      ))}
                      {doc.avatars.length > 3 && (
                        <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 text-slate-500 text-[9px] font-bold flex items-center justify-center">
                          +{doc.avatars.length - 3}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-400">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{doc.views}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{doc.year}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{doc.state}</span>
                    </div>
                  </div>

                  {/* Action row */}
                  <div className="flex gap-2 pt-1">
                    <Link
                      href={`/dashboard/repository/${doc.id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#0b2b50] text-white text-[11px] font-bold rounded-xl hover:bg-[#154278] active:scale-95 transition-all shadow-sm shadow-[#0b2b50]/20"
                    >
                      View <ArrowUpRight className="w-3 h-3" />
                    </Link>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.93 }}
                      className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* ── Empty State ── */}
      <AnimatePresence>
        {filteredDocs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="flex flex-col items-center justify-center py-28 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <Search className="w-7 h-7 text-slate-400" />
            </div>
            <h3 className="text-base font-extrabold text-slate-700">No documents found</h3>
            <p className="text-sm text-slate-400 mt-1 font-medium">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
