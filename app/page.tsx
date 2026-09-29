"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Database,
  Sparkles,
  Scale,
  FileText,
  Search,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Building2,
  Landmark,
  Compass,
  Award,
  Users,
  ChevronRight,
  Eye,
  Globe,
  BarChart3,
  Clock,
  Lock,
  Menu,
  X,
  FileCheck,
  ShieldCheck,
  LayoutDashboard,
  LogOut,
  KeyRound,
  UserCheck,
  GraduationCap,
  Crosshair,
  Radio,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Navigation,
} from "lucide-react";
import "./landing.css";

export default function Home() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLayer, setActiveLayer] = useState<"cadastral" | "svamitva" | "disputes">("cadastral");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [heroSearchQuery, setHeroSearchQuery] = useState("");
  const [selectedParcel, setSelectedParcel] = useState<"142_2" | "142_1" | "143">("142_2");

  // Authentication & Session Simulation via localStorage
  useEffect(() => {
    const loadUser = () => {
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("veda_user");
          if (stored) {
            setCurrentUser(JSON.parse(stored));
          } else {
            setCurrentUser(null);
          }
        } catch (e) {
          console.error("Error reading stored session", e);
          setCurrentUser(null);
        }
      }
    };

    loadUser();

    const handleStorageChange = () => loadUser();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("veda_user_updated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("veda_user_updated", handleStorageChange);
    };
  }, []);

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("veda_user");
      setCurrentUser(null);
      window.dispatchEvent(new Event("veda_user_updated"));
    }
  };

  const handleSwitchRole = (newRole: "admin" | "officer" | "researcher") => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      role: newRole,
      name:
        newRole === "admin"
          ? "Rajesh Kumar, IAS"
          : newRole === "officer"
          ? "Suresh Patil (ADM Revenue)"
          : "Dr. Ashok Sharma",
      email:
        newRole === "admin"
          ? "admin@veda.gov.in"
          : newRole === "officer"
          ? "officer.pune@veda.gov.in"
          : "ashok.sharma@niti.gov.in",
      department:
        newRole === "admin"
          ? "Dept. of Land Resources (DoLR), MoRD"
          : newRole === "officer"
          ? "District Revenue Collectorate, Pune"
          : "Centre for Land Governance Research",
      designation:
        newRole === "admin"
          ? "Central Platform Administrator"
          : newRole === "officer"
          ? "Additional District Magistrate"
          : "Senior Policy Fellow",
      avatarInitials: newRole === "admin" ? "RK" : newRole === "officer" ? "SP" : "AS",
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("veda_user", JSON.stringify(updated));
      window.dispatchEvent(new Event("veda_user_updated"));
    }
    setCurrentUser(updated);
    setRoleDropdownOpen(false);
  };

  // Helper to enforce auth: if logged in, go to target; if not, go to login with redirect param
  const getDestination = (target: string) => {
    if (currentUser) return target;
    return `/login?redirect=${encodeURIComponent(target)}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-[#eae4ff] selection:text-[#4A2BC2]">

      {/* ====================================================================
          CLEAN, MODERN GLASS NAVIGATION BAR (UX4G Digital Indigo Theme)
      ==================================================================== */}
      <header className="sticky top-0 z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/logo.svg"
              alt="VEDA Symbol"
              className="h-9 w-9 rounded-xl object-contain shadow-xs"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900 group-hover:text-[#4A2BC2] transition-colors">
                  VEDA
                </span>
                {currentUser && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                      currentUser.role === "admin"
                        ? "bg-[#f4f0ff] text-[#4A2BC2] border-[#eae4ff]"
                        : currentUser.role === "officer"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}
                  >
                    {currentUser.role}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                Dept. of Land Resources • Ministry of Rural Development, Govt. of India
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-600">
            <Link
              href={getDestination("/dashboard/repository")}
              className="px-3.5 py-2 rounded-lg hover:text-[#4A2BC2] hover:bg-[#f4f0ff]/60 transition-colors"
            >
              Repository
            </Link>
            <Link
              href={getDestination("/dashboard/gis")}
              className="px-3.5 py-2 rounded-lg hover:text-[#4A2BC2] hover:bg-[#f4f0ff]/60 transition-colors"
            >
              GIS Analytics
            </Link>
            <Link
              href={getDestination("/dashboard/simulator")}
              className="px-3.5 py-2 rounded-lg hover:text-[#4A2BC2] hover:bg-[#f4f0ff]/60 transition-colors"
            >
              Policy Simulator
            </Link>
            <Link
              href={getDestination("/dashboard/analytics")}
              className="px-3.5 py-2 rounded-lg hover:text-[#4A2BC2] hover:bg-[#f4f0ff]/60 transition-colors"
            >
              Dispute Trends
            </Link>
          </nav>

          {/* Auth Aware Action Buttons */}
          <div className="flex items-center gap-2.5">
            {currentUser ? (
              /* User is logged in: show profile info, role switcher, enter platform, sign out */
              <div className="hidden sm:flex items-center gap-2.5">
                {/* Role Switcher Pill */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:border-[#b9a4ff] hover:bg-[#f4f0ff] transition-all cursor-pointer shadow-2xs"
                    title="Click to Switch Demo Role (Admin / Officer / Researcher)"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#4A2BC2] text-white flex items-center justify-center text-[10px] font-bold">
                      {currentUser.avatarInitials || "VD"}
                    </span>
                    <span className="max-w-[120px] truncate">{currentUser.name?.split(" ")[0]}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        currentUser.role === "admin"
                          ? "bg-[#4A2BC2] text-white"
                          : "bg-emerald-600 text-white"
                      }`}
                    >
                      {currentUser.role}
                    </span>
                  </button>

                  {roleDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 text-xs">
                      <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Switch Active Role (RBAC)
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSwitchRole("admin")}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-[#f4f0ff] transition-colors ${
                          currentUser.role === "admin"
                            ? "font-bold text-[#4A2BC2] bg-[#f4f0ff]/50"
                            : "text-slate-700"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <KeyRound className="w-3.5 h-3.5 text-[#4A2BC2]" />
                          <span>Admin (Full RBAC)</span>
                        </span>
                        {currentUser.role === "admin" && <CheckCircle2 className="w-3.5 h-3.5 text-[#4A2BC2]" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSwitchRole("officer")}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-[#f4f0ff] transition-colors ${
                          currentUser.role === "officer"
                            ? "font-bold text-[#4A2BC2] bg-[#f4f0ff]/50"
                            : "text-slate-700"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Revenue Officer</span>
                        </span>
                        {currentUser.role === "officer" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSwitchRole("researcher")}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-[#f4f0ff] transition-colors ${
                          currentUser.role === "researcher"
                            ? "font-bold text-[#4A2BC2] bg-[#f4f0ff]/50"
                            : "text-slate-700"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                          <span>Policy Researcher</span>
                        </span>
                        {currentUser.role === "researcher" && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Enter Platform */}
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 bg-[#4A2BC2] hover:bg-[#3C1FA4] text-white px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all shadow-xs hover:shadow-md hover:shadow-[#4A2BC2]/20"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#b9a4ff]" />
                  <span>Platform</span>
                </Link>

                {/* Sign Out */}
                <button
                  type="button"
                  onClick={handleSignOut}
                  title="Sign out from simulated session"
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* User is NOT logged in: show Login & Register */
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-700 hover:text-[#4A2BC2] hover:bg-[#f4f0ff] transition-colors"
                >
                  Officer Sign In
                </Link>

                <Link
                  href="/signup"
                  className="inline-flex items-center gap-1.5 bg-[#4A2BC2] hover:bg-[#3C1FA4] text-white px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all shadow-xs hover:shadow-md hover:shadow-[#4A2BC2]/20"
                >
                  <span>Register</span>
                </Link>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              type="button"
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 pt-2 pb-4 border-t border-slate-200/80 bg-white shadow-lg space-y-1">
            {currentUser && (
              <div className="p-3 mb-2 rounded-lg bg-[#f4f0ff] border border-[#eae4ff] flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-500 capitalize">{currentUser.role} • {currentUser.department}</div>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-xs text-red-600 font-semibold hover:underline"
                >
                  Sign Out
                </button>
              </div>
            )}

            <Link
              href={getDestination("/dashboard/repository")}
              className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-[#f4f0ff]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Land Law Repository
            </Link>
            <Link
              href={getDestination("/dashboard/gis")}
              className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-[#f4f0ff]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Geospatial GIS Viewer
            </Link>
            <Link
              href={getDestination("/dashboard/simulator")}
              className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-[#f4f0ff]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Reform Simulator
            </Link>
            <Link
              href={getDestination("/dashboard/analytics")}
              className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-[#f4f0ff]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dispute Intelligence
            </Link>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              {currentUser ? (
                <Link
                  href="/dashboard"
                  className="w-full flex items-center justify-center gap-2 bg-[#4A2BC2] text-white px-4 py-2.5 rounded-lg text-xs font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Open Platform Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="w-full flex items-center justify-center gap-2 bg-[#4A2BC2] text-white px-4 py-2.5 rounded-lg text-xs font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Lock className="w-3.5 h-3.5 text-[#b9a4ff]" />
                    <span>Officer Sign In</span>
                  </Link>
                  <Link
                    href="/signup"
                    className="w-full flex items-center justify-center gap-2 border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Register New Account</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* ====================================================================
            HERO SECTION: CLEAN, AIRY, STATE-OF-THE-ART UX4G GOVTECH
        ==================================================================== */}
        <section className="hero-gradient-bg pt-10 sm:pt-14 pb-20 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-5">
              {/* Refined Pill Badge in UX4G Primary Colors */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f4f0ff] border border-[#eae4ff] text-xs font-semibold text-[#4A2BC2] shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#4A2BC2] animate-pulse" />
                <span>National Land Governance &amp; Geospatial Intelligence</span>
                <span className="text-[#b9a4ff]">•</span>
                <span className="text-[#006D75] font-semibold">DoLR, MoRD</span>
              </div>

              {/* Punchy Modern Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.12]">
                Land governance grounded in{" "}
                <span className="text-[#4A2BC2] underline decoration-[#006D75] decoration-4 underline-offset-8">
                  verified evidence
                </span>
                , not ambiguity.
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                Turning fragmented land records, satellite cadastral mapping, and multi-statute policies
                into instant, citation-grounded clarity for district administrators and policy researchers.
              </p>

              {/* Interactive Universal Statutory & Land Search Bar */}
              <div className="max-w-2xl mx-auto pt-2">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (heroSearchQuery.trim()) {
                      router.push(getDestination(`/dashboard/repository?query=${encodeURIComponent(heroSearchQuery.trim())}`));
                    }
                  }}
                  className="relative flex items-center bg-white rounded-2xl border-2 border-slate-200 hover:border-[#b9a4ff] focus-within:border-[#4A2BC2] shadow-lg shadow-indigo-900/5 transition-all p-1.5"
                >
                  <div className="pl-3 text-slate-400">
                    <Search className="w-5 h-5 text-[#4A2BC2]" />
                  </div>
                  <input
                    type="text"
                    value={heroSearchQuery}
                    onChange={(e) => setHeroSearchQuery(e.target.value)}
                    placeholder="Search 32,000+ Land Laws, ULPIN Survey Numbers (e.g. MH28-0914), or Tenancy SOPs..."
                    className="w-full px-3 py-2 text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 bg-[#4A2BC2] hover:bg-[#3C1FA4] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                {/* Popular Query Chips */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-3 text-xs">
                  <span className="text-slate-400 text-[11px] font-medium mr-1">Suggested Searches:</span>
                  {[
                    "Maharashtra Model Tenancy Act",
                    "Section 85 Partition Scheme",
                    "SVAMITVA Drone SOP",
                    "ULPIN 14-Digit Standard",
                  ].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => {
                        setHeroSearchQuery(chip);
                        router.push(getDestination(`/dashboard/repository?query=${encodeURIComponent(chip)}`));
                      }}
                      className="px-2.5 py-1 rounded-full bg-white hover:bg-[#f4f0ff] border border-slate-200 hover:border-[#b9a4ff] text-[11px] font-semibold text-slate-600 hover:text-[#4A2BC2] transition-colors shadow-2xs cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Direct CTAs */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  href={getDestination("/dashboard/gis")}
                  className="inline-flex items-center gap-2 bg-[#4A2BC2] hover:bg-[#3C1FA4] text-white px-6 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all shadow-md shadow-[#4A2BC2]/25 hover:shadow-lg"
                >
                  <MapPin className="w-4 h-4 text-[#b9a4ff]" />
                  <span>Open Geospatial GIS</span>
                  <ArrowRight className="w-4 h-4 text-[#b9a4ff]" />
                </Link>

                <Link
                  href={getDestination("/dashboard/repository")}
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-[#b9a4ff] px-6 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all shadow-2xs"
                >
                  <Database className="w-4 h-4 text-[#4A2BC2]" />
                  <span>Search Land Repository</span>
                </Link>

                <Link
                  href={getDestination("/dashboard/simulator")}
                  className="inline-flex items-center gap-2 bg-[#f4f0ff] hover:bg-[#eae4ff] text-[#4A2BC2] px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all border border-[#eae4ff]"
                >
                  <Sparkles className="w-4 h-4 text-[#783eed]" />
                  <span>Policy Simulator</span>
                </Link>
              </div>

              {/* Trust Subtext */}
              <p className="text-[11px] text-slate-400">
                Zero AI hallucinations • 100% statutory citations • 14-Digit Bhu-Aadhaar (ULPIN) verified
                {!currentUser && " • Sign in required for full workspace access"}
              </p>
            </div>

            {/* ====================================================================
                WORLD-CLASS GOVTECH INTELLIGENCE CONSOLE SHOWCASE (LIGHT & CRISP)
            ==================================================================== */}
            <div className="mt-12 max-w-5xl mx-auto">
              <div className="preview-screen bg-white border border-slate-200/90 rounded-2xl shadow-2xl shadow-indigo-950/10 overflow-hidden">
                {/* Console Top Window Header */}
                <div className="px-5 py-3.5 border-b border-slate-200/90 bg-slate-50/90 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <div className="h-4 w-px bg-slate-200" />
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>VEDA Geospatial Digital Twin • Pune District (Haveli Tehsil)</span>
                    </div>
                  </div>

                  {/* Layer Pills in UX4G Theme */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setActiveLayer("cadastral")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeLayer === "cadastral"
                          ? "bg-[#4A2BC2] text-white shadow-xs"
                          : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Bhu-Naksha Cadastre</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveLayer("svamitva")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeLayer === "svamitva"
                          ? "bg-[#006D75] text-white shadow-xs"
                          : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                      }`}
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>SVAMITVA Drone Ortho</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveLayer("disputes")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeLayer === "disputes"
                          ? "bg-rose-600 text-white shadow-xs"
                          : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Encroachment Audit</span>
                    </button>
                  </div>
                </div>

                {/* Console Two-Column Interactive Workspace */}
                <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
                  {/* Left 7 Columns: Photorealistic Drone Cadastral Orthomosaic Canvas */}
                  <div className="lg:col-span-7 relative h-[420px] sm:h-[480px] lg:h-auto overflow-hidden flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200/90 select-none">
                    {/* Background Drone Satellite Orthomosaic Imagery */}
                    <img
                      src="/cadastral-map.jpg"
                      alt="Cadastral Drone Satellite Orthomosaic"
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                        activeLayer === "svamitva"
                          ? "cadastral-filter-svamitva scale-[1.03]"
                          : activeLayer === "disputes"
                          ? "cadastral-filter-disputes"
                          : "cadastral-filter-normal"
                      }`}
                    />

                    {/* Gradient atmospheric vignettes for text legibility */}
                    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-slate-950/80 via-slate-950/30 to-transparent pointer-events-none z-10" />
                    <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent pointer-events-none z-10" />

                    {/* Active Radar Sweep Line */}
                    <div className="radar-scan-line" />

                    {/* Cartographic Coordinate Grid & Cadastral Vector SVG Overlay */}
                    <svg
                      className="absolute inset-0 w-full h-full pointer-events-none z-10"
                      viewBox="0 0 1000 650"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <filter id="glow-indigo" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="3.5" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="3.5" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="3.5" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        <pattern id="carto-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="0.8" />
                          <circle cx="0" cy="0" r="1.5" fill="rgba(255, 255, 255, 0.3)" />
                        </pattern>
                      </defs>

                      {/* Coordinate Grid Pattern */}
                      <rect width="100%" height="100%" fill="url(#carto-grid)" />

                      {/* Boundary Polygon: Khasra 142/2 */}
                      <polygon
                        points="160,130 470,110 520,400 190,430"
                        fill={selectedParcel === "142_2" ? "rgba(99, 102, 241, 0.32)" : "rgba(74, 43, 194, 0.12)"}
                        stroke={selectedParcel === "142_2" ? "#a5b4fc" : "rgba(255, 255, 255, 0.75)"}
                        strokeWidth={selectedParcel === "142_2" ? "3.5" : "1.8"}
                        strokeDasharray={selectedParcel === "142_2" ? "none" : "6 4"}
                        filter={selectedParcel === "142_2" ? "url(#glow-indigo)" : undefined}
                      />

                      {/* Boundary Polygon: Khasra 142/1 */}
                      <polygon
                        points="470,110 880,95 830,380 520,400"
                        fill={selectedParcel === "142_1" ? "rgba(16, 185, 129, 0.32)" : "rgba(16, 185, 129, 0.12)"}
                        stroke={selectedParcel === "142_1" ? "#6ee7b7" : "rgba(255, 255, 255, 0.75)"}
                        strokeWidth={selectedParcel === "142_1" ? "3.5" : "1.8"}
                        strokeDasharray={selectedParcel === "142_1" ? "none" : "6 4"}
                        filter={selectedParcel === "142_1" ? "url(#glow-emerald)" : undefined}
                      />

                      {/* Boundary Polygon: Khasra 143 (Canal Buffer) */}
                      <polygon
                        points="190,430 520,400 830,380 870,570 150,600"
                        fill={selectedParcel === "143" ? "rgba(249, 115, 22, 0.32)" : "rgba(249, 115, 22, 0.12)"}
                        stroke={selectedParcel === "143" ? "#fdba74" : "rgba(255, 255, 255, 0.6)"}
                        strokeWidth={selectedParcel === "143" ? "3.5" : "1.8"}
                        strokeDasharray={selectedParcel === "143" ? "none" : "8 5"}
                        filter={selectedParcel === "143" ? "url(#glow-amber)" : undefined}
                      />

                      {/* Active Vertex Anchors for Selected Parcel */}
                      {selectedParcel === "142_2" && (
                        <>
                          <circle cx="160" cy="130" r="5" fill="#ffffff" stroke="#4A2BC2" strokeWidth="2.5" />
                          <circle cx="470" cy="110" r="5" fill="#ffffff" stroke="#4A2BC2" strokeWidth="2.5" />
                          <circle cx="520" cy="400" r="5" fill="#ffffff" stroke="#4A2BC2" strokeWidth="2.5" />
                          <circle cx="190" cy="430" r="5" fill="#ffffff" stroke="#4A2BC2" strokeWidth="2.5" />
                          <text x="170" y="125" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace">A1</text>
                          <text x="480" y="105" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace">A2</text>
                          <text x="530" y="415" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace">A3</text>
                          <text x="170" y="445" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace">A4</text>
                          <text x="300" y="115" fill="#e0e7ff" fontSize="11" fontWeight="bold" fontFamily="monospace">118.4m</text>
                          <text x="505" y="260" fill="#e0e7ff" fontSize="11" fontWeight="bold" fontFamily="monospace">92.6m</text>
                        </>
                      )}

                      {selectedParcel === "142_1" && (
                        <>
                          <circle cx="470" cy="110" r="5" fill="#ffffff" stroke="#006D75" strokeWidth="2.5" />
                          <circle cx="880" cy="95" r="5" fill="#ffffff" stroke="#006D75" strokeWidth="2.5" />
                          <circle cx="830" cy="380" r="5" fill="#ffffff" stroke="#006D75" strokeWidth="2.5" />
                          <circle cx="520" cy="400" r="5" fill="#ffffff" stroke="#006D75" strokeWidth="2.5" />
                          <text x="480" y="105" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace">B1</text>
                          <text x="890" y="90" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace">B2</text>
                          <text x="840" y="395" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace">B3</text>
                          <text x="505" y="415" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace">B4</text>
                        </>
                      )}

                      {/* Dispute mode indicator */}
                      {activeLayer === "disputes" && (
                        <rect x="0" y="0" width="1000" height="650" fill="rgba(244, 63, 94, 0.08)" />
                      )}
                    </svg>

                    {/* Top HUD Telemetry Bar */}
                    <div className="relative z-20 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-2 text-white">
                      <div className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-[11px] font-mono shadow-lg">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="font-bold text-[#b9a4ff]">DRONE TRINETRA-04:</span>
                        <span className="text-slate-200">GSD 3.2cm • ALT 120m</span>
                      </div>

                      <div className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-[11px] font-mono shadow-lg">
                        <span className="text-emerald-400 font-bold">RTK FIXED</span>
                        <span className="text-slate-400">|</span>
                        <span className="text-slate-200">±0.03m (24 Sats)</span>
                      </div>
                    </div>

                    {/* Interactive Parcel Pin Overlay 1: Khasra 142/2 */}
                    <div
                      style={{ top: "28%", left: "26%" }}
                      className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                      onClick={() => setSelectedParcel("142_2")}
                    >
                      <div
                        className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all shadow-xl backdrop-blur-md border ${
                          selectedParcel === "142_2"
                            ? "bg-[#4A2BC2] text-white border-white ring-4 ring-[#4A2BC2]/40 scale-105"
                            : "bg-slate-900/85 hover:bg-slate-900 text-white border-white/30"
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-indigo-300 animate-ping" />
                        <span>Khasra 142/2</span>
                        <span className="text-[10px] opacity-80">(0.88 Ha)</span>
                      </div>
                    </div>

                    {/* Interactive Parcel Pin Overlay 2: Khasra 142/1 */}
                    <div
                      style={{ top: "25%", left: "68%" }}
                      className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                      onClick={() => setSelectedParcel("142_1")}
                    >
                      <div
                        className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all shadow-xl backdrop-blur-md border ${
                          selectedParcel === "142_1"
                            ? "bg-[#006D75] text-white border-white ring-4 ring-[#006D75]/40 scale-105"
                            : "bg-slate-900/85 hover:bg-slate-900 text-white border-white/30"
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-300" />
                        <span>Khasra 142/1</span>
                        <span className="text-[10px] opacity-80">(1.42 Ha)</span>
                      </div>
                    </div>

                    {/* Interactive Parcel Pin Overlay 3: Khasra 143 */}
                    <div
                      style={{ top: "72%", left: "48%" }}
                      className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                      onClick={() => setSelectedParcel("143")}
                    >
                      <div
                        className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all shadow-xl backdrop-blur-md border ${
                          selectedParcel === "143"
                            ? "bg-amber-600 text-white border-white ring-4 ring-amber-600/40 scale-105"
                            : "bg-slate-900/85 hover:bg-slate-900 text-white border-white/30"
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-amber-300" />
                        <span>Khasra 143</span>
                        <span className="text-[10px] opacity-80">Canal Buffer</span>
                      </div>
                    </div>

                    {/* Target Crosshair Centered on Selected Parcel */}
                    <div
                      className="absolute z-15 pointer-events-none transition-all duration-500"
                      style={{
                        top: selectedParcel === "142_2" ? "38%" : selectedParcel === "142_1" ? "34%" : "74%",
                        left: selectedParcel === "142_2" ? "33%" : selectedParcel === "142_1" ? "68%" : "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <div className="relative flex items-center justify-center">
                        <div className="crosshair-pulse-ring" />
                        <Crosshair className="w-9 h-9 text-indigo-300 drop-shadow-md" />
                        <div className="absolute top-11 whitespace-nowrap bg-slate-950/85 backdrop-blur-md border border-indigo-400/40 px-2 py-0.5 rounded text-[10px] font-mono text-indigo-200 shadow-md">
                          {selectedParcel === "142_2"
                            ? "18.5204° N, 73.8567° E • 558.4m ASL"
                            : selectedParcel === "142_1"
                            ? "18.5218° N, 73.8592° E • 559.1m ASL"
                            : "18.5192° N, 73.8575° E • 554.8m ASL"}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Floating Glassmorphism Inspector Card */}
                    <div className="relative z-20 p-3 sm:p-4 flex flex-col sm:flex-row items-end sm:items-center justify-between gap-3">
                      <div className="map-glass-card rounded-xl p-3 max-w-sm w-full space-y-1.5 shadow-2xl">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#4A2BC2]" />
                            <span className="font-extrabold text-xs text-slate-950">
                              {selectedParcel === "142_2"
                                ? "Khasra 142/2"
                                : selectedParcel === "142_1"
                                ? "Khasra 142/1"
                                : "Khasra 143 (Canal)"}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#f4f0ff] text-[#4A2BC2] border border-[#eae4ff]">
                            {selectedParcel === "142_2"
                              ? "MH28-0914-8831-02"
                              : selectedParcel === "142_1"
                              ? "MH28-0914-8831-01"
                              : "MH28-0914-8831-00"}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-600 flex items-center justify-between">
                          <span>
                            {selectedParcel === "142_2"
                              ? "Area: 0.88 Ha (8,800 m²)"
                              : selectedParcel === "142_1"
                              ? "Area: 1.42 Ha (14,200 m²)"
                              : "Public Irrigation Corridor (30m)"}
                          </span>
                          <span className="font-semibold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            {selectedParcel === "143" ? "Buffer Clear" : "0.00m Overlap"}
                          </span>
                        </div>
                      </div>

                      {/* Map Tool Controls (Compass, Scale, Zoom) */}
                      <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-white text-[11px] shadow-lg">
                        <div className="flex items-center gap-1 font-mono text-slate-300">
                          <Navigation className="w-3 h-3 text-indigo-400 rotate-45" />
                          <span>N</span>
                        </div>
                        <span className="text-slate-600">|</span>
                        <span className="font-mono text-[10px] text-slate-300">50m ─── 100m</span>
                        <span className="text-slate-600">|</span>
                        <Link
                          href={getDestination("/dashboard/gis")}
                          className="text-[#b9a4ff] hover:text-white font-bold flex items-center gap-1"
                        >
                          <Maximize2 className="w-3 h-3" />
                          <span>Full GIS</span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Right 5 Columns: Statutory Evidence & Collectorate Brief Panel */}
                  <div className="lg:col-span-5 bg-white p-6 flex flex-col justify-between space-y-4">
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-[#4A2BC2]" />
                          <span>Collectorate Statutory Brief</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          100% CITED
                        </span>
                      </div>

                      {/* Title Certainty KPI Bar */}
                      <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-emerald-900">Title Certainty Index</div>
                          <div className="text-[10px] text-emerald-700">
                            {selectedParcel === "142_2"
                              ? "Pre-dispute clearance verified"
                              : selectedParcel === "142_1"
                              ? "Full Khatedar mutation cleared"
                              : "Public buffer standard compliant"}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-black text-emerald-700">
                            {selectedParcel === "142_2" ? "99.4%" : selectedParcel === "142_1" ? "98.7%" : "95.0%"}
                          </div>
                          <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                            Clean Title
                          </div>
                        </div>
                      </div>

                      {/* Evidence Card 1 */}
                      <div className="p-3.5 rounded-xl bg-[#f4f0ff]/60 border border-[#eae4ff] space-y-1.5">
                        <div className="text-[11px] font-bold text-[#4A2BC2] flex items-center gap-1.5">
                          <Scale className="w-3.5 h-3.5" />
                          <span>
                            {selectedParcel === "142_2"
                              ? "Maharashtra Land Revenue Code, Sec 85"
                              : selectedParcel === "142_1"
                              ? "Bombay Prevention of Fragmentation Act, Sec 7"
                              : "Maharashtra Irrigation Act 1976, Sec 11"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          {selectedParcel === "142_2"
                            ? "Partition deed registered under Doc No. 1984/PNE-412 matches satellite cadastral boundaries within 0.04m tolerance. 0 boundary collisions detected against Khasra 142/1."
                            : selectedParcel === "142_1"
                            ? "Parcel size of 1.42 Ha satisfies minimum agricultural plot standards. Mutated to 2 joint owners under Mutation Entry No. 6712 with verified RoR."
                            : "Public canal buffer zone of 15.0m verified clear. Zero unauthorized agricultural or structural encroachment along the primary embankment."}
                        </p>
                      </div>

                      {/* Evidence Card 2 */}
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                        <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                          <Compass className="w-3.5 h-3.5 text-[#006D75]" />
                          <span>SVAMITVA High-Res Drone Orthomosaic</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          3.2cm GSD drone survey flight ID MH-PUN-088 verified against Survey of India CORS ground control stations. Abadi property card authenticated.
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 space-y-2">
                      <Link
                        href={getDestination("/dashboard/repository")}
                        className="w-full flex items-center justify-center gap-2 bg-[#4A2BC2] hover:bg-[#3C1FA4] text-white py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all shadow-sm cursor-pointer"
                      >
                        <FileCheck className="w-4 h-4 text-[#b9a4ff]" />
                        <span>Inspect Full Statutory Evidence</span>
                      </Link>
                      <Link
                        href={getDestination("/dashboard/gis")}
                        className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#4A2BC2]" />
                        <span>Open 3D Geospatial Viewer</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            CLEAN STATS COUNTER STRIP
        ==================================================================== */}
        <section className="py-12 bg-[#fafafa] border-b border-[#e5e5e5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  32.8+ Cr
                </div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  ULPIN Bhu-Aadhaars Generated
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  3.15+ Lakh
                </div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Villages Drone-Mapped (SVAMITVA)
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  95.8%
                </div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Land Records Digitized (DILRMP)
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#4A2BC2] tracking-tight">
                  &lt;40 Min
                </div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Collector Brief Preparation Time
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            CORE CAPABILITIES / PILLARS (Clean Bento Grid)
        ==================================================================== */}
        <section className="py-20 bg-white" id="solutions">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4A2BC2] bg-[#f4f0ff] px-2.5 py-1 rounded-md border border-[#eae4ff]">
                CORE CAPABILITIES
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mt-3">
                One evidence layer for resilient land decisions.
              </h2>
              <p className="text-slate-600 text-base mt-2">
                A focused platform addressing what is hardest to do today: finding the authoritative source,
                reconciling conflicting state policy, and delivering briefs an officer can stand behind.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1 */}
              <div className="modern-card flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#f4f0ff] text-[#4A2BC2] flex items-center justify-center">
                      <Database className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      LIVE
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">
                    Centralized Policy Repository
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Research papers, statutory circulars, case studies from DILRMP, SVAMITVA, and state revenue boards unified in one searchable index.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">01</span>
                  <Link href={getDestination("/dashboard/repository")} className="font-semibold text-[#4A2BC2] hover:underline">
                    Explore ↗
                  </Link>
                </div>
              </div>

              {/* Card 2 */}
              <div className="modern-card flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#f4f0ff] text-[#4A2BC2] flex items-center justify-center">
                      <Search className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      LIVE
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">
                    Citation-Grounded AI Synthesis
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Answers cite exact paragraphs and gazettes with click-to-source highlighting. Authentic evidence retrieval, not a black-box chatbot.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">02</span>
                  <Link href={getDestination("/dashboard/repository")} className="font-semibold text-[#4A2BC2] hover:underline">
                    Search ↗
                  </Link>
                </div>
              </div>

              {/* Card 3 */}
              <div className="modern-card flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#f4f0ff] text-[#4A2BC2] flex items-center justify-center">
                      <Scale className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      LIVE
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">
                    Contradiction Detection Engine
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Automatically surfaces where two policy sources disagree, such as a central guideline and a state tenancy circular.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">03</span>
                  <Link href={getDestination("/dashboard/repository")} className="font-semibold text-[#4A2BC2] hover:underline">
                    Verify ↗
                  </Link>
                </div>
              </div>

              {/* Card 4 */}
              <div className="modern-card flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#f4f0ff] text-[#4A2BC2] flex items-center justify-center">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      LIVE
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">
                    Dispute Intelligence Dashboard
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Trend analytics, cause breakdowns, and resolution-time metrics built on real land-dispute records for Collectorates.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">04</span>
                  <Link href={getDestination("/dashboard/analytics")} className="font-semibold text-[#4A2BC2] hover:underline">
                    View ↗
                  </Link>
                </div>
              </div>

              {/* Card 5 */}
              <div className="modern-card flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#f4f0ff] text-[#4A2BC2] flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      LIVE
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">
                    Reform Impact Sandbox
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Test proposed land policy changes against key indicators with transparent, on-screen mathematical formulas.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">05</span>
                  <Link href={getDestination("/dashboard/simulator")} className="font-semibold text-[#4A2BC2] hover:underline">
                    Simulate ↗
                  </Link>
                </div>
              </div>

              {/* Card 6 */}
              <div className="modern-card flex flex-col justify-between bg-slate-50/50">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#f0fdfa] text-[#006D75] flex items-center justify-center">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-[#006D75] border border-teal-200">
                      ROADMAP
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">
                    GIS &amp; Satellite Multi-Layers
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Land use, climate risk, and infrastructure layers over cadastral dispute and policy data.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">06</span>
                  <Link href={getDestination("/dashboard/gis")} className="font-semibold text-slate-700 hover:underline">
                    Preview ↗
                  </Link>
                </div>
              </div>

              {/* Card 7 */}
              <div className="modern-card flex flex-col justify-between bg-slate-50/50">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#f0fdfa] text-[#006D75] flex items-center justify-center">
                      <Layers className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-[#006D75] border border-teal-200">
                      ROADMAP
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">
                    Federated Architecture
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Direct API connectors to DILRMP, SVAMITVA, and ULPIN without forcing states to migrate data.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">07</span>
                  <Link href={getDestination("/dashboard/workspaces")} className="font-semibold text-slate-700 hover:underline">
                    Specs ↗
                  </Link>
                </div>
              </div>

              {/* Card 8 */}
              <div className="modern-card flex flex-col justify-between bg-slate-50/50">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#f0fdfa] text-[#006D75] flex items-center justify-center">
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-[#006D75] border border-teal-200">
                      ROADMAP
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">
                    Innovation Portal &amp; Grants
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Hackathons, research fellowships, and pilot tracking to sustain collaborative land tech growth.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">08</span>
                  <Link href={getDestination("/dashboard/grants")} className="font-semibold text-slate-700 hover:underline">
                    Grants ↗
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            MODI JI'S SECTION 1: LEADERSHIP VISION & DISTRICT WORKFLOW
            (PRESERVED, REFINED, CLEAN & UX4G THEMED)
        ==================================================================== */}
        <section className="modi-soft-bg py-20 border-t border-b border-slate-200/80" id="workflow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Portrait of Prime Minister Narendra Modi */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="relative w-full max-w-md mx-auto">
                  {/* Subtle soft backdrop ring with UX4G Indigo glow */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-[#f4f0ff] via-white to-[#f0fdfa] transform rotate-2" />

                  <div className="relative bg-white rounded-3xl p-6 border border-slate-200 shadow-xl overflow-hidden flex flex-col items-center text-center">
                    <img
                      src="/modiji2.png"
                      alt="Prime Minister Narendra Modi"
                      className="max-h-[380px] w-auto object-contain filter drop-shadow-md"
                    />

                    <div className="pt-4 border-t border-slate-100 w-full mt-2">
                      <div className="text-base font-extrabold text-slate-900">
                        Shri Narendra Modi
                      </div>
                      <div className="text-xs font-semibold text-[#4A2BC2]">
                        Hon&apos;ble Prime Minister of India
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        &ldquo;Technology that serves accountable public decisions&rdquo;
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Workflow Steps */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#4A2BC2] bg-[#f4f0ff] px-2.5 py-1 rounded-md border border-[#eae4ff]">
                    BUILT AROUND ONE REAL WORKFLOW
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mt-3">
                    A district land officer prepares a dispute brief in under 40 minutes.
                  </h2>
                  <p className="text-slate-600 text-base mt-2">
                    The platform is designed around a person and a decision, not a sprawling feature list.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="workflow-card">
                    <div className="text-xs font-extrabold text-[#4A2BC2] tracking-wider">
                      01 / FIND
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mt-1">
                      Search Across Multi-Sources
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      Search the repository across central and state sources simultaneously in seconds.
                    </p>
                  </div>

                  <div className="workflow-card">
                    <div className="text-xs font-extrabold text-[#4A2BC2] tracking-wider">
                      02 / VERIFY
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mt-1">
                      Citation-Grounded Passages
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      Read cited passages, inspect statutory conflicts, and click straight to the original source.
                    </p>
                  </div>

                  <div className="workflow-card">
                    <div className="text-xs font-extrabold text-[#4A2BC2] tracking-wider">
                      03 / UNDERSTAND
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mt-1">
                      Dispute Trends &amp; Metrics
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      Use the dispute dashboard to see root causes, trends, and resolution-time metrics.
                    </p>
                  </div>

                  <div className="workflow-card">
                    <div className="text-xs font-extrabold text-[#4A2BC2] tracking-wider">
                      04 / BRIEF
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mt-1">
                      Brief the Collector
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      Test a reform in the sandbox and take a transparent estimate directly to the Collector.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={getDestination("/dashboard")}
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#4A2BC2] hover:text-[#3C1FA4] group"
                  >
                    <span>Open Officer Workspace</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            MODI JI'S SECTION 2: PUBLIC TRUST & TRANSPARENCY (REAL VS. ROADMAP)
            (PRESERVED, REFINED, CLEAN & UX4G THEMED)
        ==================================================================== */}
        <section className="py-20 bg-white" id="trust">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Real vs. Roadmap Content */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                    REAL VS. ROADMAP
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mt-3">
                    We show the boundary clearly.
                  </h2>
                </div>

                <p className="text-slate-600 text-base leading-relaxed">
                  Repository, search, synthesis, contradiction detection, dashboard, and sandbox are{" "}
                  <strong className="text-slate-900">functional in the prototype</strong>. GIS, grants,
                  and full collaboration workspaces are shown as scoped mockups deliberately, not hidden behind a demo narrative.
                </p>

                {/* Legend Chips */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    <span>Functional Prototype (Active)</span>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#f0fdfa] text-[#006D75] border border-teal-200 border-dashed text-xs font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#006D75]" />
                    <span>Roadmap / Scoped Mockup</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 text-sm">6 Live Modules</div>
                    <p className="text-slate-500">Repository, AI Synthesis, Conflicts, Disputes, Sandbox</p>
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 text-sm">3 Scoped Gateways</div>
                    <p className="text-slate-500">Geospatial GIS, Grants Portal, Multi-District Workspaces</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Hon'ble Prime Minister Narendra Modi Portrait */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative max-w-sm">
                  <div className="bg-[#fafafa] rounded-3xl p-6 border border-[#e5e5e5] shadow-lg text-center overflow-hidden">
                    <img
                      src="/modiji3.png"
                      alt="Prime Minister Narendra Modi addressing the nation"
                      className="max-h-[340px] w-auto mx-auto object-contain filter drop-shadow-sm"
                    />
                    <div className="pt-4 border-t border-slate-200/80 mt-2">
                      <div className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                        Accountable Public Administration
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Transparency in digital evidence and governance
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ====================================================================
          CLEAN, REFINED GOVERNMENT FOOTER
      ==================================================================== */}
      <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800" id="footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Identity */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <img
                  src="/logo.svg"
                  alt="VEDA Symbol"
                  className="h-8 w-8 rounded-lg shadow-xs"
                />
                <span className="font-bold text-white text-sm">
                  VEDA • Government of India
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-md">
                Department of Land Resources (DoLR), Ministry of Rural Development.<br />
                National Digital Platform for Evidence-Based Land Governance and Geospatial Intelligence.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <div className="font-bold text-white text-xs uppercase tracking-wider mb-3">
                Platform Portals
              </div>
              <ul className="space-y-2">
                <li><Link href={getDestination("/dashboard/repository")} className="hover:text-white transition-colors">Land Law Repository</Link></li>
                <li><Link href={getDestination("/dashboard/gis")} className="hover:text-white transition-colors">Geospatial GIS Viewer</Link></li>
                <li><Link href={getDestination("/dashboard/simulator")} className="hover:text-white transition-colors">Policy Impact Simulator</Link></li>
                <li><Link href={getDestination("/dashboard/analytics")} className="hover:text-white transition-colors">Dispute Intelligence</Link></li>
                <li><Link href={getDestination("/dashboard/workspaces")} className="hover:text-white transition-colors">District Workspaces</Link></li>
              </ul>
            </div>

            {/* National Gateways */}
            <div>
              <div className="font-bold text-white text-xs uppercase tracking-wider mb-3">
                National Portals
              </div>
              <ul className="space-y-2">
                <li><a href="https://india.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">National Portal of India</a></li>
                <li><a href="https://dolr.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">DoLR Official Portal</a></li>
                <li><a href="https://digitalindia.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Digital India</a></li>
                <li><a href="https://svamitva.nic.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">SVAMITVA Portal</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
            <div>
              © 2026 Department of Land Resources, Ministry of Rural Development, Govt. of India.
            </div>
            <div>
              Conforming to UX4G 3.0 Design Tokens &amp; GIGW Digital Governance Mandate.
            </div>
          </div>
        </div>

      </footer>
    </div>
  );
}
