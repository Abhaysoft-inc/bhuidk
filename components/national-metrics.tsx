"use client";

import React from "react";
import {
  Building2,
  FileCheck,
  Globe2,
  SlidersHorizontal,
  Scale,
  GraduationCap,
  IndianRupee,
  Layers,
} from "lucide-react";

interface NationalMetricsProps {
  language: "en" | "hi";
}

export function NationalMetrics({ language }: NationalMetricsProps) {
  const metrics = [
    {
      id: "states",
      value: "28 + 8",
      labelEn: "States & UTs Integrated",
      labelHi: "राज्य व केंद्रशासित प्रदेश",
      subEn: "Universal Cadastral Coverage",
      subHi: "सार्वभौमिक कैडस्ट्रल कवरेज",
      icon: Building2,
      accent: "text-blue-700 bg-blue-50 border-blue-200",
    },
    {
      id: "papers",
      value: "14,250+",
      labelEn: "Peer-Reviewed Papers & Briefs",
      labelHi: "शोध पत्र एवं नीति दस्तावेज",
      subEn: "DoLR, IITs, IIMs, NALSAR",
      subHi: "आईआईटी, आईआईएम, नालसार",
      icon: FileCheck,
      accent: "text-amber-700 bg-amber-50 border-amber-200",
    },
    {
      id: "geospatial",
      value: "850+",
      labelEn: "Geospatial Datasets (ISRO)",
      labelHi: "भू-स्थानिक एवं उपग्रह डेटासेट",
      subEn: "Bhuvan & Survey of India",
      subHi: "भुवन व भारतीय सर्वेक्षण विभाग",
      icon: Globe2,
      accent: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
    {
      id: "sandboxes",
      value: "32",
      labelEn: "Live Policy Sandboxes",
      labelHi: "सक्रिय नीति सैंडबॉक्स",
      subEn: "Outcome simulation models",
      subHi: "परिणाम अनुकरण मॉडल",
      icon: SlidersHorizontal,
      accent: "text-indigo-700 bg-indigo-50 border-indigo-200",
    },
    {
      id: "disputes",
      value: "4,120+",
      labelEn: "Dispute Precedent Models",
      labelHi: "भूमि विवाद मिसाल मॉडल",
      subEn: "e-Courts & Revenue Tribunals",
      subHi: "ई-कोर्ट एवं राजस्व अधिकरण",
      icon: Scale,
      accent: "text-rose-700 bg-rose-50 border-rose-200",
    },
    {
      id: "workspaces",
      value: "1,240+",
      labelEn: "Registered Workspaces",
      labelHi: "सक्रिय शोध कार्यक्षेत्र",
      subEn: "Think tanks, Faculty, Officers",
      subHi: "शोधार्थी, थिंक टैंक, अधिकारी",
      icon: GraduationCap,
      accent: "text-cyan-700 bg-cyan-50 border-cyan-200",
    },
    {
      id: "ulpin",
      value: "22.4 Cr",
      labelEn: "Bhu-Aadhaar (ULPIN) Linked",
      labelHi: "भू-आधार (यूलपिन) लिंक भूखंड",
      subEn: "14-digit Unique Geo-ID",
      subHi: "14-अंकीय विशिष्ट पहचान",
      icon: Layers,
      accent: "text-violet-700 bg-violet-50 border-violet-200",
    },
    {
      id: "grants",
      value: "₹18.5 Cr",
      labelEn: "Research Grants Allocated",
      labelHi: "अनुसंधान अनुदान आवंटित",
      subEn: "PME Innovation Fund",
      subHi: "पी.एम.ई. नवाचार कोष",
      icon: IndianRupee,
      accent: "text-green-700 bg-green-50 border-green-200",
    },
  ];

  return (
    <section className="w-full bg-white border-b border-slate-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest block">
              {language === "hi" ? "राष्ट्रीय प्रदर्शन संकेतक" : "National Performance Indicators"}
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              {language === "hi"
                ? "भारतीय भूमि प्रशासन का वास्तविक सांख्यिकी तंत्र"
                : "Real-Time National Land Governance & Research Matrix"}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>
              {language === "hi" ? "लाइव डेटा फ़ीड • एनआईसी सिंक" : "Live Feed • Integrated via NIC API Gateway"}
            </span>
          </div>
        </div>

        {/* Flat Matrix Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {metrics.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="p-3.5 rounded border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {item.value}
                  </span>
                  <div className={`p-1.5 rounded border ${item.accent} shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="mt-2">
                  <div className="text-xs font-bold text-slate-800 leading-snug">
                    {language === "hi" ? item.labelHi : item.labelEn}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 leading-tight truncate">
                    {language === "hi" ? item.subHi : item.subEn}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
