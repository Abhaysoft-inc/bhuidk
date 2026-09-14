"use client";

import React, { useState } from "react";
import {
  Menu,
  X,
  Lock,
  ChevronDown,
  Layers,
  Sparkles,
  Database,
  FileText,
  MapPin,
  Cpu,
  BarChart3,
  Lightbulb,
} from "lucide-react";

interface GovNavBarProps {
  language: "en" | "hi";
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenLogin: () => void;
}

export function GovNavBar({
  language,
  activeTab,
  setActiveTab,
  onOpenLogin,
}: GovNavBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "overview", labelEn: "Overview", labelHi: "मुख्य पृष्ठ", icon: Layers },
    { id: "repository", labelEn: "Digital Repository", labelHi: "ज्ञान रिपोजिटरी", icon: Database },
    { id: "simulator", labelEn: "AI Policy Simulator", labelHi: "नीति सिम्युलेटर", icon: Sparkles, badge: "AI" },
    { id: "gis", labelEn: "Geospatial GIS Suite", labelHi: "भू-स्थानिक जीआईएस", icon: MapPin },
    { id: "workspaces", labelEn: "Collaborative Workspaces", labelHi: "शोध कार्यक्षेत्र", icon: FileText },
    { id: "hackathon", labelEn: "Innovation & Grants", labelHi: "नवाचार एवं अनुदान", icon: Lightbulb, badge: "Live" },
    { id: "architecture", labelEn: "Tech Architecture", labelHi: "तकनीकी ढांचा", icon: Cpu },
    { id: "dashboards", labelEn: "National Dashboards", labelHi: "डैशबोर्ड्स", icon: BarChart3 },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full bg-[#0b2b50] text-white shadow-md border-b-2 border-amber-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-md text-white hover:bg-[#164275] focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-1.5 overflow-x-auto py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    const el = document.getElementById(item.id);
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`relative flex items-center gap-1 px-2.5 lg:px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-slate-100 hover:bg-[#164275] hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0 opacity-90" />
                  <span>{language === "hi" ? item.labelHi : item.labelEn}</span>
                  {item.badge && (
                    <span
                      className={`ml-1 px-1 py-0.2 text-[9px] font-bold rounded ${
                        item.badge === "Live"
                          ? "bg-emerald-500 text-white animate-pulse"
                          : "bg-sky-400 text-slate-900"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Action: Jan Parichay Login */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-3 py-1.5 rounded text-xs shadow-xs transition-all cursor-pointer border border-amber-300"
            >
              <Lock className="w-3.5 h-3.5 text-slate-950" />
              <span>{language === "hi" ? "जन परिचय (SSO)" : "Jan Parichay (SSO)"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#071e3d] border-t border-slate-700 px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                  const el = document.getElementById(item.id);
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-semibold ${
                  isActive ? "bg-amber-600 text-white" : "text-slate-200 hover:bg-[#164275]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{language === "hi" ? item.labelHi : item.labelEn}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] rounded bg-emerald-500 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}
