"use client";

import React from "react";
import { AshokaEmblem, DigitalIndiaLogo, MeghRajLogo, NICBadge, ViksitBharatBadge } from "./gov-icons";

interface GovHeaderProps {
  language: "en" | "hi";
}

export function GovHeader({ language }: GovHeaderProps) {
  return (
    <header className="w-full bg-white border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: State Emblem and Ministry / Platform Titles */}
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="text-slate-900 shrink-0 flex flex-col items-center">
            <AshokaEmblem className="h-16 md:h-18 w-auto text-slate-800" />
          </div>

          <div className="h-14 w-[1px] bg-slate-200 hidden sm:block shrink-0" />
          
          <img src="/logo.jpg" alt="BhoomiIntel Logo" className="h-14 w-14 rounded-lg object-cover hidden sm:block shrink-0 shadow-sm" />

          <div className="h-14 w-[1px] bg-slate-200 hidden sm:block shrink-0" />

          <div className="flex flex-col">
            {/* Ministry Line */}
            <div className="text-[11px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider">
              {language === "hi"
                ? "ग्रामीण विकास मंत्रालय • भूमि संसाधन विभाग (DoLR)"
                : "Ministry of Rural Development • Department of Land Resources (DoLR)"}
            </div>
            <div className="text-[10px] sm:text-[11px] text-amber-800 font-medium tracking-tight">
              {language === "hi"
                ? "नीति, निगरानी एवं मूल्यांकन (PME) प्रभाग | भारत सरकार"
                : "Policy, Monitoring & Evaluation (PME) Division | Government of India"}
            </div>

            {/* Main Platform Title */}
            <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold text-[#0b2b50] tracking-tight leading-tight mt-0.5">
              {language === "hi" ? (
                <>राष्ट्रीय भूमि शासन अनुसंधान एवं नीति नवाचार मंच</>
              ) : (
                <>National Digital Platform for Research, Policy Innovation & Evidence-Based Land Governance</>
              )}
            </h1>

            {/* Sub-tag / Vision Statement */}
            <div className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5 flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center text-emerald-800 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                Bhu-Gyan Portal
              </span>
              <span>• Central Repository</span>
              <span>• AI Policy Lab</span>
              <span>• Geospatial GIS</span>
              <span>• Bhu-Aadhaar (ULPIN)</span>
              <span>• SVAMITVA</span>
            </div>
          </div>
        </div>

        {/* Right: National Initiatives Badges */}
        <div className="flex items-center gap-3 shrink-0">
          <ViksitBharatBadge />
          <div className="h-8 w-[1px] bg-slate-200 hidden lg:block" />
          <DigitalIndiaLogo />
          <div className="h-8 w-[1px] bg-slate-200 hidden sm:block" />
          <div className="hidden sm:flex flex-col gap-1">
            <MeghRajLogo />
          </div>
        </div>
      </div>
    </header>
  );
}
