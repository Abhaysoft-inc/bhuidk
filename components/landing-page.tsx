"use client";

import React from "react";
import {
  Database,
  Sparkles,
  MapPin,
  FileText,
  Lightbulb,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  Building2,
  CheckCircle2,
  BookOpen,
  Cpu,
  Layers,
  Scale,
  Users,
  Search,
  ExternalLink,
  Award,
  Globe,
  Lock,
} from "lucide-react";
import { NationalMetrics } from "./national-metrics";

interface LandingPageProps {
  language: "en" | "hi";
  onOpenLogin: () => void;
  onExplorePillar: (pillarId: string) => void;
}

export function LandingPage({
  language,
  onOpenLogin,
  onExplorePillar,
}: LandingPageProps) {
  const pillars = [
    {
      id: "repository",
      titleEn: "Centralized Digital Knowledge Repository",
      titleHi: "केंद्रीकृत डिजिटल ज्ञान भंडार",
      descEn:
        "Sovereign archive integrating 14,250+ research publications, state cadastral manuals, land acts, court precedents, and multi-temporal geospatial datasets.",
      descHi:
        "14,250+ शोध प्रकाशनों, राज्य कैडस्ट्रल नियमावलियों, भूमि कानूनों और न्यायालयी मिसालों का संप्रभु भंडार।",
      icon: Database,
      accent: "border-blue-300 bg-blue-50/50 text-blue-900",
      badgeEn: "14,250+ Resources",
      badgeHi: "14,250+ संसाधन",
    },
    {
      id: "simulator",
      titleEn: "AI Policy Simulation & Decision Support",
      titleHi: "एआई नीति अनुकरण एवं निर्णय समर्थन",
      descEn:
        "Pre-test legislative reforms and administrative notifications. Simulates expected dispute decline, revenue impact, and turnaround latency before gazetting.",
      descHi:
        "सुधार लागू करने से पहले नीतिगत परिणामों, विवाद में कमी और राजस्व प्रभाव का कृत्रिम बुद्धिमत्ता आधारित अनुकरण।",
      icon: Sparkles,
      accent: "border-amber-300 bg-amber-50/50 text-amber-900",
      badgeEn: "32 Sandboxes Live",
      badgeHi: "32 सैंडबॉक्स लाइव",
    },
    {
      id: "gis",
      titleEn: "Geospatial GIS & Remote Sensing Suite",
      titleHi: "भू-स्थानिक जीआईएस एवं उपग्रह रिमोट सेंसिंग",
      descEn:
        "Convergence of ISRO Bhuvan satellite imagery, Survey of India CORS precision network, and cadastral maps for monitoring land degradation and urban fringes.",
      descHi:
        "इसरो भुवन उपग्रह इमेजरी, भारतीय सर्वेक्षण विभाग और कैडस्ट्रल मानचित्रों का त्रि-आयामी समन्वय।",
      icon: MapPin,
      accent: "border-emerald-300 bg-emerald-50/50 text-emerald-900",
      badgeEn: "ISRO / Bhuvan Synced",
      badgeHi: "भुवन एवं सर्वे समन्वित",
    },
    {
      id: "workspaces",
      titleEn: "Collaborative Research Workspaces",
      titleHi: "सहयोगी शोध कार्यक्षेत्र",
      descEn:
        "Secure role-based workspaces enabling MoRD officials, State Revenue Commissioners, IITs, IIMs, and NALSAR researchers to co-author policy papers.",
      descHi:
        "मंत्रालय के अधिकारियों, राज्य राजस्व आयुक्तों और राष्ट्रीय संस्थानों के शोधकर्ताओं हेतु सुरक्षित सहयोगी मंच।",
      icon: Users,
      accent: "border-indigo-300 bg-indigo-50/50 text-indigo-900",
      badgeEn: "1,240+ Researchers",
      badgeHi: "1,240+ शोधार्थी",
    },
    {
      id: "hackathon",
      titleEn: "Innovation Challenges & Research Grants",
      titleHi: "नवाचार चुनौतियां एवं अनुसंधान अनुदान",
      descEn:
        "Support hackathons, pilot projects, and PME Division research fellowships to foster indigenous technological adoption in cadastral governance.",
      descHi:
        "भूमि शासन में स्वदेशी तकनीकी अपनाने को बढ़ावा देने हेतु हैकाथॉन, पायलट प्रोजेक्ट्स एवं शोध फैलोशिप।",
      icon: Lightbulb,
      accent: "border-rose-300 bg-rose-50/50 text-rose-900",
      badgeEn: "₹5.0 Cr Grant Pool",
      badgeHi: "₹5.0 करोड़ अनुदान",
    },
    {
      id: "dashboards",
      titleEn: "National Evidence Dashboards",
      titleHi: "राष्ट्रीय साक्ष्य डैशबोर्ड्स",
      descEn:
        "Executive visualizations monitoring land dispute resolution rates, ULPIN/Bhu-Aadhaar coverage, SVAMITVA property cards, and climate resilience targets.",
      descHi:
        "भूमि विवाद समाधान, यूलपिन कवरेज, स्वामित्व प्रॉपर्टी कार्ड और जलवायु लचीलापन लक्ष्यों की वास्तविक समय निगरानी।",
      icon: BarChart3,
      accent: "border-cyan-300 bg-cyan-50/50 text-cyan-900",
      badgeEn: "28 States & 8 UTs",
      badgeHi: "28 राज्य व 8 यूटी",
    },
  ];

  const stakeholders = [
    {
      name: "Ministry of Rural Development (MoRD)",
      sub: "Department of Land Resources (DoLR)",
      type: "Nodal Ministry",
    },
    {
      name: "Survey of India (SOI)",
      sub: "National Geodesy & Cadastral Mapping Agency",
      type: "Survey Agency",
    },
    {
      name: "ISRO / NRSC (Bhuvan)",
      sub: "National Remote Sensing Centre",
      type: "Geospatial Partner",
    },
    {
      name: "National Informatics Centre (NIC)",
      sub: "Cloud & Sovereign Digital Infrastructure",
      type: "Tech Infrastructure",
    },
    {
      name: "IITs & IIMs Consortium",
      sub: "IIT Bombay, IIT Delhi, IIM Ahmedabad",
      type: "Academic Research",
    },
    {
      name: "NALSAR & National Law Universities",
      sub: "Centre for Land Governance & Spatial Law",
      type: "Legal Analytics",
    },
    {
      name: "State Revenue Departments",
      sub: "28 States & 8 Union Territories",
      type: "Implementing Authority",
    },
    {
      name: "NIRD&PR Hyderabad",
      sub: "National Institute of Rural Development",
      type: "Training & Capacity",
    },
  ];

  return (
    <div className="w-full bg-[#f8fafc]">
      {/* Hero Section */}
      <section className="relative w-full bg-[#0b2b50] text-white pt-10 pb-16 border-b-4 border-amber-500">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#ffffff 1.5px, transparent 1.5px), radial-gradient(#ffffff 1.5px, #0b2b50 1.5px)`,
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            {/* National Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[11px] font-bold px-2.5 py-0.5 rounded">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                {language === "hi"
                  ? "नीति, निगरानी एवं मूल्यांकन (PME) प्रभाग"
                  : "Policy, Monitoring & Evaluation (PME) Division"}
              </span>
              <span className="inline-flex items-center text-slate-300 text-[11px] bg-slate-800/80 border border-slate-700 px-2.5 py-0.5 rounded">
                {language === "hi"
                  ? "डिजिटल भारत • साक्ष्य-आधारित नीति निर्माण"
                  : "Digital India • Evidence-Based Policymaking"}
              </span>
            </div>

            {/* Platform Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {language === "hi" ? (
                <>
                  अनुसंधान, नीति नवाचार एवं साक्ष्य-आधारित भूमि शासन हेतु{" "}
                  <span className="text-amber-400 underline decoration-amber-500/50">
                    राष्ट्रीय डिजिटल मंच
                  </span>
                </>
              ) : (
                <>
                  National Digital Platform for Research, Policy Innovation &{" "}
                  <span className="text-amber-400 underline decoration-amber-500/50">
                    Evidence-Based Land Governance
                  </span>
                </>
              )}
            </h1>

            {/* Concise Mission Statement */}
            <p className="mt-4 text-sm sm:text-base text-slate-200 leading-relaxed max-w-3xl">
              {language === "hi"
                ? "भूमि एक सीमित और रणनीतिक संसाधन है। यह राष्ट्रीय मंच नीति निर्माताओं, शोधकर्ताओं, राज्य सरकारों और शैक्षणिक संस्थानों को जोड़कर एआई एनालिटिक्स, रिमोट सेंसिंग और साक्ष्य-आधारित प्रयोगों द्वारा भारत के भूमि प्रशासन को सशक्त बनाता है।"
                : "Land is a finite and strategic resource underpinning economic development, environmental sustainability, food security, and social equity. This apex sovereign platform bridges academic research with administrative reform through advanced AI analytics, satellite remote sensing, and predictive policy simulation."}
            </p>

            {/* Public Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onOpenLogin}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold px-5 py-3 rounded text-sm shadow-md transition-all cursor-pointer border border-amber-300"
              >
                <Lock className="w-4 h-4 text-slate-950" />
                <span>
                  {language === "hi"
                    ? "जन परिचय (SSO) द्वारा कार्यक्षेत्र में प्रवेश करें"
                    : "Sign In via Jan Parichay (SSO)"}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-950 ml-1" />
              </button>

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("pillars");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3 rounded text-sm transition-colors border border-white/20"
              >
                <Layers className="w-4 h-4 text-amber-400" />
                <span>
                  {language === "hi" ? "प्रमुख स्तंभों को देखें" : "Explore Key Pillars"}
                </span>
              </button>
            </div>

            {/* Highlights bullet strip */}
            <div className="mt-6 pt-4 border-t border-slate-700/80 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Bhu-Aadhaar (ULPIN) Integration</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>SVAMITVA Drone Cadastre</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>ISRO Bhuvan Spatial Layers</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>GIGW 3.0 & STQC Certified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time National Metrics */}
      <NationalMetrics language={language} />

      {/* Strategic Background & Problem Statement Section */}
      <section className="w-full py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Context: The Challenge */}
            <div className="lg:col-span-6 space-y-4">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest block">
                {language === "hi" ? "पृष्ठभूमि एवं रणनीतिक आवश्यकता" : "Background & Strategic Context"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b2b50] tracking-tight leading-tight">
                {language === "hi"
                  ? "कार्यान्वयन-उन्मुख प्रशासन से साक्ष्य-आधारित नीति नवाचार की ओर"
                  : "Transitioning from Implementation-Centric to Evidence-Based Land Governance"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                India&apos;s land administration ecosystem has historically remained
                implementation-focused, with limited institutional capacity for applied research,
                interdisciplinary policy experimentation, and scientific impact evaluation.
              </p>
              <div className="bg-amber-50/80 border-l-4 border-amber-500 p-3.5 rounded-r text-xs text-amber-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <span>The Core Challenge:</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-900">
                  Despite vast datasets generated through computerized Records of Rights (RoR),
                  cadastral drone surveys, satellite imagery, and e-Courts, these resources have
                  remained fragmented and underutilized for formulating actionable, forward-looking
                  policymaking.
                </p>
              </div>
            </div>

            {/* Right Context: The Platform Solution */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="w-7 h-7 rounded bg-blue-100 text-blue-800 flex items-center justify-center font-bold mb-2">
                  1
                </div>
                <h4 className="font-bold text-slate-900 text-xs">Centralized Sovereign Repository</h4>
                <p className="text-[11px] text-slate-600 mt-1">
                  Single access point for research papers, gazettes, state tenancy codes, and spatial
                  layers.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="w-7 h-7 rounded bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-2">
                  2
                </div>
                <h4 className="font-bold text-slate-900 text-xs">AI Policy Experimentation</h4>
                <p className="text-[11px] text-slate-600 mt-1">
                  Machine learning modules simulating the socio-economic outcomes of proposed reforms
                  prior to notification.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="w-7 h-7 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-2">
                  3
                </div>
                <h4 className="font-bold text-slate-900 text-xs">Geospatial Intelligence</h4>
                <p className="text-[11px] text-slate-600 mt-1">
                  Integration of ISRO satellite imagery, CORS network, and GIS for climate and
                  urban-rural fringe planning.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="w-7 h-7 rounded bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold mb-2">
                  4
                </div>
                <h4 className="font-bold text-slate-900 text-xs">Collaborative Workspaces</h4>
                <p className="text-[11px] text-slate-600 mt-1">
                  Role-based collaborative rooms for Central/State officials, think tanks, and
                  academic researchers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Six Core Pillars Section (Pillars Overview) */}
      <section id="pillars" className="w-full py-14 bg-[#f8fafc] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest block">
              {language === "hi" ? "मंच के छह प्रमुख स्तंभ" : "Six Core Platform Pillars"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b2b50] tracking-tight mt-1">
              {language === "hi"
                ? "भूमि शासन के अनुसंधान एवं नवाचार का संपूर्ण तंत्र"
                : "Integrated Architecture for Evidence-Based Land Governance"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Each module serves as a specialized operational pillar. Sign in through Jan Parichay to
              access the full interactive toolset, datasets, and simulation sandboxes.
            </p>
          </div>

          {/* Pillars Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.id}
                  className="bg-white rounded-lg border border-slate-200 hover:border-slate-400 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Tag & Icon */}
                    <div className="flex items-center justify-between gap-2">
                      <div className={`p-2 rounded border ${pillar.accent}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {language === "hi" ? pillar.badgeHi : pillar.badgeEn}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#0b2b50] mt-3.5 leading-snug">
                      {language === "hi" ? pillar.titleHi : pillar.titleEn}
                    </h3>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {language === "hi" ? pillar.descHi : pillar.descEn}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => onExplorePillar(pillar.id)}
                      className="text-xs font-bold text-[#0b2b50] hover:text-[#164275] flex items-center gap-1 group cursor-pointer"
                    >
                      <span>
                        {language === "hi" ? "कार्यक्षेत्र में खोलें" : "Access in Workspace"}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-600 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <span className="text-[10px] text-slate-400 font-medium">SSO Required</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Innovation Challenge & Research Grant Banner */}
      <section className="w-full py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#0b2b50] via-[#0d3461] to-[#164275] rounded-xl p-6 sm:p-8 text-white shadow-md border-2 border-amber-400/60 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="bg-red-700 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  Call for Proposals 2026-27
                </span>
                <span className="text-amber-300 text-xs font-bold">
                  PME Innovation Fund
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                National Land Governance Research & Innovation Challenge
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Grant pool of <strong>₹5.00 Crore</strong> for academic institutions, start-ups, and
                independent think tanks proposing novel AI cadastral resurvey models, automated land
                dispute mediation engines, and climate resilience planning frameworks.
              </p>
              <div className="text-xs text-amber-200 font-medium pt-1">
                Grant awards: ₹25 Lakhs to ₹75 Lakhs per approved research cohort • Submission Deadline: 31 Oct 2026
              </div>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={onOpenLogin}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-5 py-2.5 rounded text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Award className="w-4 h-4 text-slate-950" />
                <span>Submit Research Proposal</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Suggested Technology Architecture Overview */}
      <section className="w-full py-12 bg-[#f8fafc] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest block">
              {language === "hi" ? "तकनीकी घटक एवं वास्तुकला" : "Technical Stack & Architecture Blueprint"}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0b2b50] tracking-tight mt-1">
              Enterprise Government Stack as per Ministry Guidelines
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Engineered with open-standard, secure, and scalable national digital public infrastructure (DPI)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            <div className="bg-white p-4 rounded border border-slate-200 shadow-2xs">
              <div className="font-bold text-[#0b2b50] text-xs pb-1 border-b border-slate-100 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-blue-700" />
                <span>Database Layer</span>
              </div>
              <ul className="mt-2 space-y-1 text-[11px] text-slate-600">
                <li className="font-semibold text-slate-800">• PostgreSQL / PostGIS</li>
                <li>• MongoDB (Document Store)</li>
                <li>• Elasticsearch (Vector Index)</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded border border-slate-200 shadow-2xs">
              <div className="font-bold text-[#0b2b50] text-xs pb-1 border-b border-slate-100 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-amber-700" />
                <span>Data Analytics</span>
              </div>
              <ul className="mt-2 space-y-1 text-[11px] text-slate-600">
                <li className="font-semibold text-slate-800">• Apache Spark Clusters</li>
                <li>• Pandas, NumPy, GeoPandas</li>
                <li>• AI / ML Predictive Models</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded border border-slate-200 shadow-2xs">
              <div className="font-bold text-[#0b2b50] text-xs pb-1 border-b border-slate-100 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-700" />
                <span>Document Management</span>
              </div>
              <ul className="mt-2 space-y-1 text-[11px] text-slate-600">
                <li className="font-semibold text-slate-800">• Elasticsearch & Solr</li>
                <li>• Multilingual OCR Engine</li>
                <li>• Metadata Indexing Engine</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded border border-slate-200 shadow-2xs">
              <div className="font-bold text-[#0b2b50] text-xs pb-1 border-b border-slate-100 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-700" />
                <span>Cloud Infrastructure</span>
              </div>
              <ul className="mt-2 space-y-1 text-[11px] text-slate-600">
                <li className="font-semibold text-slate-800">• NIC Cloud (MeghRaj)</li>
                <li>• Sovereign GovCloud</li>
                <li>• 99.9% High Availability</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded border border-slate-200 shadow-2xs">
              <div className="font-bold text-[#0b2b50] text-xs pb-1 border-b border-slate-100 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-rose-700" />
                <span>Collaboration & APIs</span>
              </div>
              <ul className="mt-2 space-y-1 text-[11px] text-slate-600">
                <li className="font-semibold text-slate-800">• Jan Parichay (SSO)</li>
                <li>• Open REST & NDSAP APIs</li>
                <li>• DILRMP & Bhuvan Gateways</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stakeholders & Partner Network */}
      <section className="w-full py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest block">
              {language === "hi" ? "हितधारक एवं संस्थागत नेटवर्क" : "Stakeholder Ecosystem & Partner Network"}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0b2b50] tracking-tight mt-1">
              Multi-Institutional Governance & Research Network
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stakeholders.map((stk, idx) => (
              <div
                key={idx}
                className="p-3 rounded border border-slate-200 bg-slate-50/50 hover:bg-white transition-colors"
              >
                <div className="text-[9px] font-bold text-amber-800 uppercase tracking-wider">
                  {stk.type}
                </div>
                <div className="text-xs font-extrabold text-slate-900 mt-1 leading-tight">
                  {stk.name}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">{stk.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Public Call to Action */}
      <section className="w-full py-12 bg-[#071e3d] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Empowering Evidence-Based Land Governance for India @2047
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Join verified researchers, revenue commissioners, and geospatial specialists working
            together to build a resilient, transparent, and dispute-free land administration
            ecosystem.
          </p>
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={onOpenLogin}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-6 py-3 rounded text-xs shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4 text-slate-950" />
              <span>Login with Jan Parichay (National SSO)</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
