"use client";

import React, { useState, useEffect } from "react";
import { Bell, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

interface GovTickerProps {
  language: "en" | "hi";
}

export function GovTicker({ language }: GovTickerProps) {
  const announcementsEn = [
    "MoRD & DoLR Announce National Land Governance Innovation Challenge 2026: Grant pool of ₹5.00 Crore for Applied Geospatial AI Research.",
    "Department of Land Resources releases SOP for Cadastral Resurvey using High-Resolution Satellite & Drone Imagery.",
    "ULPIN (Bhu-Aadhaar) Milestone: Over 22.4 Crore rural land parcels uniquely geocoded across 28 States & UTs.",
    "Call for Papers: Special Volume on 'Climate Resilience, Urban-Rural Land Transitions & Dispute Resolution' - Apply before Oct 31, 2026.",
    "Policy Simulation Sandbox v2.8 deployed: Automated mutation & registration alignment engine now accessible for State Revenue Departments.",
  ];

  const announcementsHi = [
    "ग्रामीण विकास मंत्रालय एवं DoLR द्वारा राष्ट्रीय भूमि शासन नवाचार चुनौती 2026 घोषित: भू-स्थानिक एआई अनुसंधान हेतु ₹5 करोड़ अनुदान।",
    "भूमि संसाधन विभाग ने उच्च-रिज़ॉल्यूशन उपग्रह व ड्रोन द्वारा कैडस्ट्रल सर्वेक्षण के लिए मानक संचालन प्रक्रिया (SOP) जारी की।",
    "यूलपिन (भू-आधार) उपलब्धि: 28 राज्यों व केंद्र शासित प्रदेशों में 22.4 करोड़ से अधिक भूखंडों को विशिष्ट भू-कोड प्रदान किया गया।",
    "शोध पत्र आमंत्रण: 'जलवायु लचीलापन, शहरी-ग्रामीण भूमि संक्रमण एवं विवाद समाधान' पर विशेष अंक - 31 अक्टूबर तक आवेदन करें।",
    "नीति अनुकरण सैंडबॉक्स v2.8 सक्रिय: राज्य राजस्व विभागों हेतु स्वचालित दाखिल-खारिज मूल्यांकन मॉड्यूल उपलब्ध।",
  ];

  const announcements = language === "hi" ? announcementsHi : announcementsEn;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPlaying, announcements.length]);

  return (
    <div className="w-full bg-amber-50 border-b border-amber-200 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-3">
        {/* Badge */}
        <div className="flex items-center gap-1.5 bg-red-700 text-white font-bold px-2.5 py-0.5 rounded text-[11px] shrink-0 uppercase tracking-wide">
          <Bell className="w-3.5 h-3.5 animate-bounce" />
          <span>{language === "hi" ? "नवीनतम सूचनाएं" : "Latest Updates"}</span>
        </div>

        {/* Scrolling text display */}
        <div className="flex-1 overflow-hidden">
          <div className="font-medium text-slate-800 truncate transition-all duration-300">
            {announcements[currentIndex]}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 shrink-0 text-slate-600">
          <button
            type="button"
            onClick={() =>
              setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length)
            }
            className="p-1 hover:bg-amber-100 rounded text-slate-700"
            aria-label="Previous Notice"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 hover:bg-amber-100 rounded text-slate-700"
            aria-label={isPlaying ? "Pause Ticker" : "Play Ticker"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={() =>
              setCurrentIndex((prev) => (prev + 1) % announcements.length)
            }
            className="p-1 hover:bg-amber-100 rounded text-slate-700"
            aria-label="Next Notice"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
