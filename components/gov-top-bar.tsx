"use client";

import React from "react";
import { Eye, Type, Globe, Volume2 } from "lucide-react";

interface GovTopBarProps {
  fontSizeLevel: number;
  setFontSizeLevel: (level: number) => void;
  isHighContrast: boolean;
  setIsHighContrast: (val: boolean) => void;
  language: "en" | "hi";
  setLanguage: (lang: "en" | "hi") => void;
}

export function GovTopBar({
  fontSizeLevel,
  setFontSizeLevel,
  isHighContrast,
  setIsHighContrast,
  language,
  setLanguage,
}: GovTopBarProps) {
  return (
    <div className="w-full bg-[#f1f5f9] border-b border-slate-200 text-[11px] text-slate-700 select-none">
      {/* National Tricolor Top Ribbon */}
      <div className="h-1 w-full tiranga-border" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 flex flex-wrap items-center justify-between gap-2">
        {/* Left: Ministry & Country affiliation */}
        <div className="flex items-center space-x-3 text-slate-700 font-medium">
          <span className="font-semibold text-slate-900 tracking-wide">
            {language === "hi" ? "भारत सरकार" : "GOVERNMENT OF INDIA"}
          </span>
          <span className="text-slate-300">|</span>
          <span className="hidden sm:inline text-slate-600">
            {language === "hi"
              ? "ग्रामीण विकास मंत्रालय"
              : "Ministry of Rural Development"}
          </span>
          <span className="hidden md:inline text-slate-300">|</span>
          <span className="hidden md:inline text-slate-600">
            {language === "hi"
              ? "भूमि संसाधन विभाग (DoLR)"
              : "Department of Land Resources (DoLR)"}
          </span>
        </div>

        {/* Right: GIGW Accessibility & Language controls */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <a
            href="#main-content"
            className="hover:underline text-slate-600 hover:text-slate-900 font-medium focus:outline-2 focus:outline-blue-700"
          >
            {language === "hi" ? "मुख्य सामग्री पर जाएं" : "Skip to Main Content"}
          </a>

          <div className="hidden lg:flex items-center space-x-1 text-slate-600" title="Screen Reader Access">
            <Volume2 className="w-3.5 h-3.5 text-slate-500" />
            <a href="#accessibility" className="hover:underline">
              {language === "hi" ? "स्क्रीन रीडर" : "Screen Reader"}
            </a>
          </div>

          {/* Font Sizer Controls */}
          <div className="flex items-center border border-slate-300 rounded bg-white overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => setFontSizeLevel(Math.max(-1, fontSizeLevel - 1))}
              className={`px-1.5 py-0.5 text-[10px] font-bold border-r border-slate-200 transition-colors ${
                fontSizeLevel === -1 ? "bg-slate-200 text-slate-900" : "text-slate-700 hover:bg-slate-100"
              }`}
              title="Decrease Font Size"
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => setFontSizeLevel(0)}
              className={`px-1.5 py-0.5 text-[11px] font-bold border-r border-slate-200 transition-colors ${
                fontSizeLevel === 0 ? "bg-slate-200 text-slate-900" : "text-slate-700 hover:bg-slate-100"
              }`}
              title="Default Font Size"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => setFontSizeLevel(Math.min(2, fontSizeLevel + 1))}
              className={`px-1.5 py-0.5 text-[12px] font-bold transition-colors ${
                fontSizeLevel >= 1 ? "bg-slate-200 text-slate-900" : "text-slate-700 hover:bg-slate-100"
              }`}
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          {/* High Contrast Toggle */}
          <button
            type="button"
            onClick={() => setIsHighContrast(!isHighContrast)}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] font-semibold transition-colors ${
              isHighContrast
                ? "bg-black text-yellow-300 border-yellow-300"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
            }`}
            title="Toggle High Contrast Mode"
          >
            <Eye className="w-3 h-3" />
            <span>{isHighContrast ? "Normal" : "Contrast"}</span>
          </button>

          {/* Language Toggle */}
          <div className="flex items-center bg-white border border-slate-300 rounded overflow-hidden text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`px-2 py-0.5 transition-colors ${
                language === "en" ? "bg-[#0b2b50] text-white" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage("hi")}
              className={`px-2 py-0.5 transition-colors ${
                language === "hi" ? "bg-[#0b2b50] text-white" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
