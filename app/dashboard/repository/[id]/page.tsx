"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Download,
  Share2,
  BookmarkPlus,
  Calendar,
  MapPin,
  Building,
  Sparkles,
  Quote,
  Eye,
  TrendingUp,
  FileBadge,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Star,
  Users,
} from "lucide-react";

// ─── Animation Variants ───────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 22 },
  show:   { opacity: 1, y: 0, transition: { delay, type: "spring" as const, stiffness: 260, damping: 24 } },
});

const fadeLeft = (delay = 0) => ({
  hidden: { opacity: 0, x: 24 },
  show:   { opacity: 1, x: 0, transition: { delay, type: "spring" as const, stiffness: 260, damping: 24 } },
});

const staggerContainer = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08 } },
};

const staggerChild = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 280, damping: 24 } },
};

// ─── Metric Counter ───────────────────────────────────────────────────────────
function MetricItem({ icon: Icon, label, value, accent = false }: { icon: React.ElementType; label: string; value: string; accent?: boolean }) {
  return (
    <motion.div
      variants={staggerChild}
      className="flex items-center justify-between py-3.5 border-b border-slate-100 last:border-0"
    >
      <div className="flex items-center gap-2.5 text-sm font-medium text-slate-600">
        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-slate-500" />
        </div>
        {label}
      </div>
      <span className={`text-base font-black ${accent ? "text-emerald-600" : "text-slate-900"}`}>{value}</span>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DocumentDetailPage() {
  const [bookmarked, setBookmarked] = useState(false);
  const [copied,     setCopied]     = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const relatedDocs = [
    { title: "Credit Access Disparities in Tenant Farming: A Case Study of Odisha", type: "Case Study",      year: 2025, color: "bg-rose-100 text-rose-700"   },
    { title: "Digital India Land Records Modernization Programme: 10-Year Review",   type: "Policy Document", year: 2024, color: "bg-emerald-100 text-emerald-700" },
    { title: "Blockchain for Land Registries: Feasibility in Karnataka",              type: "Research Paper",  year: 2026, color: "bg-blue-100 text-blue-700"    },
  ];

  return (
    <div className="space-y-6 pb-16">

      {/* ── Back Nav ── */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      >
        <Link
          href="/dashboard/repository"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-[#0b2b50] transition-colors group"
        >
          <motion.span whileHover={{ x: -3 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
            <ArrowLeft className="w-4 h-4" />
          </motion.span>
          Back to Repository
        </Link>
      </motion.div>

      {/* ── Hero Header Card ── */}
      <motion.div
        variants={fadeUp(0.05)}
        initial="hidden"
        animate="show"
        className="relative bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm"
      >
        {/* Accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#0b2b50] via-indigo-500 to-blue-400" />

        <div className="p-7 md:p-10">
          <div className="flex flex-col md:flex-row gap-8 md:items-start">

            {/* Left: Meta + Title */}
            <div className="flex-1 space-y-5">
              {/* Badges */}
              <motion.div
                className="flex flex-wrap items-center gap-2"
                variants={staggerContainer}
                initial="hidden"
                animate="show"
              >
                {[
                  { label: "Research Paper", cls: "bg-blue-50 text-blue-700 border border-blue-200" },
                  { label: "Peer Reviewed",  cls: "bg-amber-50 text-amber-700 border border-amber-200", icon: FileBadge },
                  { label: "Open Access",    cls: "bg-emerald-50 text-emerald-700 border border-emerald-200", icon: CheckCircle },
                ].map(({ label, cls, icon: Icon }) => (
                  <motion.span
                    key={label}
                    variants={staggerChild}
                    className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${cls}`}
                  >
                    {Icon && <Icon className="w-3 h-3" />}
                    {label}
                  </motion.span>
                ))}
              </motion.div>

              {/* Title */}
              <motion.h1
                variants={fadeUp(0.1)}
                initial="hidden"
                animate="show"
                className="text-2xl md:text-3xl font-black text-slate-900 leading-snug tracking-tight"
              >
                Socio-Economic Impact of ULPIN on Agricultural Credit Flow
              </motion.h1>

              {/* Meta row */}
              <motion.div
                className="flex flex-wrap items-center gap-5 text-xs font-semibold text-slate-500"
                variants={staggerContainer}
                initial="hidden"
                animate="show"
              >
                {[
                  { icon: Building,  text: "National Council of Applied Economic Research" },
                  { icon: Calendar,  text: "Published: March 2026" },
                  { icon: MapPin,    text: "Maharashtra, India" },
                  { icon: Users,     text: "Dr. Ashok Sharma, Dr. Priya Rao" },
                ].map(({ icon: Icon, text }) => (
                  <motion.div key={text} variants={staggerChild} className="flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {text}
                  </motion.div>
                ))}
              </motion.div>

              {/* Tags */}
              <motion.div className="flex flex-wrap gap-2" variants={staggerContainer} initial="hidden" animate="show">
                {["Credit", "ULPIN", "Agriculture", "Rural Economy", "Maharashtra"].map(tag => (
                  <motion.span
                    key={tag}
                    variants={staggerChild}
                    whileHover={{ scale: 1.06 }}
                    className="text-[10px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md transition-colors cursor-default"
                  >
                    #{tag}
                  </motion.span>
                ))}
              </motion.div>
            </div>

            {/* Right: Actions */}
            <motion.div
              variants={fadeLeft(0.15)}
              initial="hidden"
              animate="show"
              className="flex flex-row md:flex-col gap-3 shrink-0"
            >
              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.96 }}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#0b2b50] text-white text-sm font-bold rounded-xl hover:bg-[#154278] transition-colors shadow-lg shadow-[#0b2b50]/25 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download PDF
              </motion.button>

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
                >
                  <Quote className="w-4 h-4 text-slate-400" />
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={copied ? "copied" : "cite"}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                    >
                      {copied ? "Copied!" : "Cite"}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.93 }}
                  className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-slate-400" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setBookmarked(b => !b)}
                  className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
                >
                  <Star className={`w-4 h-4 transition-colors ${bookmarked ? "fill-amber-400 text-amber-400" : "text-slate-400"}`} />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left: Content ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* AI Summary */}
          <motion.div
            variants={fadeUp(0.2)}
            initial="hidden"
            animate="show"
            className="relative rounded-2xl overflow-hidden border border-amber-200/70 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/50"
          >
            {/* Glowing orb bg */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-orange-300/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 p-6 md:p-8 space-y-5">
              <div className="flex items-center gap-2.5">
                <motion.div
                  animate={{ rotate: [0, 10, -8, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                >
                  <Sparkles className="w-5 h-5 text-amber-600" />
                </motion.div>
                <h2 className="text-[11px] font-black uppercase tracking-widest text-amber-700">AI-Generated Executive Summary</h2>
              </div>

              {/* Core Insight */}
              <motion.div
                variants={staggerChild}
                className="bg-white/70 backdrop-blur-sm rounded-xl p-5 border border-amber-100/80 shadow-sm"
              >
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-2">Core Insight</p>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  ULPIN implementation in Maharashtra reduced average agricultural credit approval time from <strong className="text-slate-900">42 days → 14 days</strong>, driving a <strong className="text-emerald-700">+15% increase</strong> in formal credit uptake among marginal farmers.
                </p>
              </motion.div>

              {/* Sub-cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    label: "Methodology",
                    text:  "Difference-in-differences (DiD) across 12 districts, comparing ULPIN-integrated tehsils vs. control groups over 24 months using bank disbursement data.",
                  },
                  {
                    label: "Policy Recommendations",
                    text:  "Direct ULPIN API integration with NABARD portals; subsidize mobile KYC for tenant farmers to eliminate remaining friction points.",
                  },
                ].map(({ label, text }) => (
                  <motion.div
                    key={label}
                    variants={staggerChild}
                    className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-amber-100/60"
                  >
                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-2">{label}</p>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">{text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Classic Academic Abstract */}
          <motion.div
            variants={fadeUp(0.3)}
            initial="hidden"
            animate="show"
            className="relative bg-[#fdfbf7] border border-[#e8e3da] rounded-sm shadow-[inset_0_0_60px_rgba(0,0,0,0.015)] overflow-hidden"
          >
            {/* Top rule */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0b2b50]/30 to-transparent" />
            {/* Bottom rule */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0b2b50]/15 to-transparent" />

            <div className="px-10 md:px-16 py-12">
              {/* Header ornament */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 text-[#b0a89a]">
                  <div className="h-px w-12 bg-[#b0a89a]" />
                  <span className="text-xs tracking-[0.3em] uppercase font-semibold">Abstract</span>
                  <div className="h-px w-12 bg-[#b0a89a]" />
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-[#3a3530] font-serif text-[17px] leading-[1.9] text-justify first-letter:text-6xl first-letter:font-bold first-letter:text-[#0b2b50] first-letter:float-left first-letter:mr-3 first-letter:leading-[0.85] first-letter:font-serif">
                  Land titling security is a critical prerequisite for agricultural credit access. This paper evaluates the socio-economic impacts of the Unique Land Parcel Identification Number (ULPIN) rollout in Maharashtra, India. By linking cadastral records directly to the banking infrastructure, ULPIN aims to mitigate title disputes and expedite collateral valuation. Using administrative data from 4 major public sector banks and a survey of 1,200 farming households, we find that ULPIN integration significantly reduces bureaucratic friction.
                </p>
                <p className="text-[#3a3530] font-serif text-[17px] leading-[1.9] text-justify">
                  The results suggest that digital land registries are highly effective in crowding-in formal credit, particularly benefiting smallholder farmers who previously relied on informal, high-interest lending channels. Furthermore, the analysis reveals a <em>22% reduction</em> in pending litigation related to plot boundaries in the surveyed tehsils, underscoring the necessity of interoperable digital public infrastructure in accelerating rural economic empowerment.
                </p>
              </div>

              {/* Footer ornament */}
              <div className="text-center mt-10 text-[#c8c0b4] tracking-[0.25em] text-xs">⁂</div>
            </div>
          </motion.div>
        </div>

        {/* ── Right Sidebar ── */}
        <div className="space-y-5">

          {/* Impact Metrics */}
          <motion.div
            variants={fadeLeft(0.2)}
            initial="hidden"
            animate="show"
            className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm"
          >
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">Impact Metrics</h3>
            <motion.div variants={staggerContainer} initial="hidden" animate="show">
              <MetricItem icon={Eye}        label="Views"     value="12,450"  />
              <MetricItem icon={Download}   label="Downloads" value="3,892"   />
              <MetricItem icon={TrendingUp} label="Citations" value="45"      accent />
              <MetricItem icon={Users}      label="Authors"   value="4"       />
            </motion.div>
          </motion.div>

          {/* Document Info */}
          <motion.div
            variants={fadeLeft(0.28)}
            initial="hidden"
            animate="show"
            className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4"
          >
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Document Info</h3>
            {[
              { label: "DOI",       value: "10.1234/bhoomi.2026.001" },
              { label: "Pages",     value: "48" },
              { label: "Language",  value: "English" },
              { label: "License",   value: "CC BY-NC 4.0" },
              { label: "Format",    value: "PDF / EPUB" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-400">{label}</span>
                <span className="font-bold text-slate-800">{value}</span>
              </div>
            ))}
          </motion.div>

          {/* Related Research */}
          <motion.div
            variants={fadeLeft(0.36)}
            initial="hidden"
            animate="show"
            className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm"
          >
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4">Related Research</h3>
            <motion.div className="space-y-4" variants={staggerContainer} initial="hidden" animate="show">
              {relatedDocs.map((item, i) => (
                <motion.div
                  key={i}
                  variants={staggerChild}
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 24 }}
                  className="group cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-[#0b2b50] line-clamp-2 leading-snug transition-colors flex-1">
                      {item.title}
                    </h4>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#0b2b50] shrink-0 mt-0.5 transition-colors" />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${item.color}`}>{item.type}</span>
                    <span className="text-[10px] font-semibold text-slate-400">{item.year}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full mt-5 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-[#0b2b50] border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
            >
              View More <ExternalLink className="w-3 h-3" />
            </motion.button>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
