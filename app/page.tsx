"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Database,
  Sparkles,
  FileText,
  Search,
  ArrowRight,
  CheckCircle2,
  Building2,
  Landmark,
  Award,
  Users,
  ChevronRight,
  Globe,
  BarChart3,
  Lock,
  Menu,
  X,
  FileCheck,
  ShieldCheck,
  LayoutDashboard,
  LogOut,
  KeyRound,
  GraduationCap,
  Phone,
  Mail,
  ExternalLink,
  TrendingUp,
  Map,
  Layers,
  Home as HomeIcon,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [heroSearchQuery, setHeroSearchQuery] = useState("");
  const [activeScheme, setActiveScheme] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80",
      caption: "Digital Land Records Repository"
    },
    {
      img: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80",
      caption: "Bhu-Naksha GIS Mapping"
    },
    {
      img: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80",
      caption: "Secure Officer Workspaces"
    },
    {
      img: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80",
      caption: "SVAMITVA Drone Surveys"
    }
  ];

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 4);
    }, 3500);
    return () => clearInterval(slideTimer);
  }, []);

  useEffect(() => {
    const loadUser = () => {
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("veda_user");
          setCurrentUser(stored ? JSON.parse(stored) : null);
        } catch (e) {
          setCurrentUser(null);
        }
      }
    };
    loadUser();
    window.addEventListener("storage", loadUser);
    window.addEventListener("veda_user_updated", loadUser);
    return () => {
      window.removeEventListener("storage", loadUser);
      window.removeEventListener("veda_user_updated", loadUser);
    };
  }, []);

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("veda_user");
      setCurrentUser(null);
      window.dispatchEvent(new Event("veda_user_updated"));
    }
  };

  const getDestination = (target: string) => {
    if (currentUser) return target;
    return `/login?redirect=${encodeURIComponent(target)}`;
  };

  const schemes = [
    { 
      name: "DILRMP", 
      full: "Digital India Land Records Modernization",
      desc: "A centralized programme to digitize all land records, cadastral maps, and ensure complete interoperability across states.",
      color: "border-blue-500 bg-blue-50",
      activeColor: "bg-blue-600",
      stats: "3.15L+ Villages",
      img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80"
    },
    { 
      name: "SVAMITVA", 
      full: "Survey of Villages Abadi & Mapping",
      desc: "Drone-based survey of inhabited land in rural villages, providing property rights to rural households.",
      color: "border-emerald-500 bg-emerald-50",
      activeColor: "bg-emerald-600",
      stats: "2.45L+ Villages",
      img: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&q=80"
    },
    { 
      name: "ULPIN / Bhu-Aadhaar", 
      full: "Unique Land Parcel Identification Number",
      desc: "A 14-digit unique identification number assigned to every land parcel in India, enabling seamless integration across systems.",
      color: "border-amber-500 bg-amber-50",
      activeColor: "bg-amber-500",
      stats: "8.4 Cr+ Generated",
      img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80"
    },
    { 
      name: "NGDRS", 
      full: "National Generic Document Registration",
      desc: "A standardized, IT-enabled document registration system that streamlines property registration across states.",
      color: "border-rose-500 bg-rose-50",
      activeColor: "bg-rose-600",
      stats: "18 States Onboarded",
      img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80"
    },
  ];

  const services = [
    {
      title: "National Repository",
      hindi: "राष्ट्रीय भंडार",
      desc: "Access 32,000+ land laws, policies, circulars, and research papers in one unified repository.",
      icon: Database,
      href: "/dashboard/repository",
      color: "bg-blue-600",
      lightColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Bhu-Naksha (GIS)",
      hindi: "भू-नक्शा",
      desc: "Visualize cadastral maps, inspect parcels, run drone surveys, and analyze spatial land data.",
      icon: Map,
      href: "/dashboard/gis",
      color: "bg-emerald-600",
      lightColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      title: "Policy Simulator",
      hindi: "नीति सिम्युलेटर",
      desc: "Model land reform scenarios, predict impact of policy changes on revenue and disputes.",
      icon: Sparkles,
      href: "/dashboard/simulator",
      color: "bg-rose-600",
      lightColor: "bg-rose-50",
      textColor: "text-rose-600",
    },
    {
      title: "Analytics & Intelligence",
      hindi: "विश्लेषण",
      desc: "Track national KPIs for DILRMP, SVAMITVA and ULPIN progress with live dashboards.",
      icon: BarChart3,
      href: "/dashboard/analytics",
      color: "bg-amber-500",
      lightColor: "bg-amber-50",
      textColor: "text-amber-600",
    },
  ];

  const stats = [
    { value: "32.8+ Cr", label: "ULPIN Bhu-Aadhaars Generated", icon: ShieldCheck },
    { value: "3.15+ Lakh", label: "Villages Cadastrally Digitized", icon: Globe },
    { value: "95.8%", label: "Land Records Digitized (DILRMP)", icon: FileCheck },
    { value: "18 States", label: "NGDRS Onboarded States", icon: Landmark },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">

      {/* ═══════════════════════════════════════════════════════
          GOI TOP ACCESSIBILITY STRIP
      ══════════════════════════════════════════════════════ */}
      <div className="bg-slate-100 text-slate-700 text-[10.5px] py-1.5 px-6 flex justify-between items-center border-b border-slate-200">
        <div className="flex items-center gap-5 text-slate-600 font-medium">
          <span>भारत सरकार / Government of India</span>
          <span className="hidden sm:inline">ग्रामीण विकास मंत्रालय / Ministry of Rural Development</span>
        </div>
        <div className="flex items-center gap-4 text-slate-500 font-medium">
          <a href="#main" className="hover:text-slate-900 transition-colors hidden md:inline">Skip to Main Content</a>
          <a href="#" className="hover:text-slate-900 transition-colors hidden md:inline">Screen Reader</a>
          <div className="flex gap-1">
            {["A-", "A", "A+"].map(a => (
              <button key={a} className="w-5 h-5 bg-white hover:bg-slate-50 border border-slate-300 rounded text-[9px] text-slate-700 transition-colors">{a}</button>
            ))}
          </div>
          <select className="bg-transparent text-slate-600 text-[10px] border-none outline-none cursor-pointer hover:text-slate-900 transition-colors">
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          MAIN PORTAL HEADER
      ══════════════════════════════════════════════════════ */}
      <div className="bg-white border-b border-slate-100 shadow-sm py-3 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-12 h-16 bg-contain bg-no-repeat bg-center opacity-90" style={{backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg")'}}></div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">
                VEDA <span className="text-blue-700">Platform</span>
              </h1>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">Digital Land Records & Geospatial Intelligence</p>
              <p className="text-[10px] text-slate-400 font-medium">Dept. of Land Resources (DoLR) • Ministry of Rural Development • Govt. of India</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <div className="w-24 h-10 bg-contain bg-no-repeat bg-center opacity-80" style={{backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/f/fc/Digital_India_logo.svg")'}}></div>
            <div className="text-right border-l border-slate-100 pl-6">
              {currentUser ? (
                <div>
                  <div className="text-xs font-bold text-slate-800">Welcome, {currentUser.name}</div>
                  <div className="text-[10px] text-slate-500">{currentUser.designation}</div>
                  <div className="flex gap-3 mt-1 justify-end">
                    <Link href="/dashboard" className="text-[10px] text-blue-700 hover:underline font-bold">Dashboard</Link>
                    <button onClick={handleSignOut} className="text-[10px] text-red-600 hover:underline font-bold">Logout</button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link href="/login" className="text-xs font-semibold text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg hover:border-blue-300 hover:text-blue-700 transition-colors">Sign In</Link>
                  <Link href="/signup" className="text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg transition-colors">Register</Link>
                </div>
              )}
            </div>
          </div>
          <button className="md:hidden p-2 text-slate-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          HORIZONTAL NAV BAR (GOI style)
      ══════════════════════════════════════════════════════ */}
      <nav className="bg-white text-slate-800 sticky top-0 z-50 border-b-4 border-amber-500 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center overflow-x-auto scrollbar-none">
          <Link href="/" className="flex items-center gap-1.5 px-5 py-3 text-xs font-bold bg-amber-500 text-white whitespace-nowrap shrink-0 border-r border-amber-400/40">
            <HomeIcon className="w-3.5 h-3.5" /> Home
          </Link>
          {[
            { label: "National Repository", href: getDestination("/dashboard/repository") },
            { label: "Bhu-Naksha (GIS)", href: getDestination("/dashboard/gis") },
            { label: "Policy Simulator", href: getDestination("/dashboard/simulator") },
            { label: "Workspaces", href: getDestination("/dashboard/workspaces") },
            { label: "Innovation", href: getDestination("/dashboard/grants") },
            { label: "Analytics", href: getDestination("/dashboard/analytics") },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="px-4 py-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-amber-600 transition-colors whitespace-nowrap border-r border-slate-100 shrink-0">
              {item.label}
            </Link>
          ))}
          <div className="ml-auto px-5 py-3 shrink-0">
            {currentUser ? (
              <Link href="/dashboard" className="flex items-center gap-1.5 text-xs font-bold bg-slate-100 text-slate-800 hover:bg-slate-200 px-3 py-1 rounded-lg transition-colors">
                <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
              </Link>
            ) : (
              <Link href="/login" className="flex items-center gap-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-lg transition-colors shadow-sm">
                <Lock className="w-3.5 h-3.5" /> Officer Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="bg-white text-slate-800 px-4 py-4 space-y-1 border-b border-slate-200 md:hidden shadow-lg">
          {[
            { label: "National Repository", href: getDestination("/dashboard/repository") },
            { label: "Bhu-Naksha (GIS)", href: getDestination("/dashboard/gis") },
            { label: "Policy Simulator", href: getDestination("/dashboard/simulator") },
          ].map(item => (
            <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm text-slate-600 hover:text-amber-600 hover:bg-slate-50 rounded-lg">
              {item.label}
            </Link>
          ))}
        </div>
      )}

      <main id="main" className="flex-1">

        {/* ═══════════════════════════════════════════════════════
            HERO SECTION — Bright, Official, GoI Style
        ══════════════════════════════════════════════════════ */}
        <section className="bg-gradient-to-b from-[#f8faff] via-white to-white pt-16 pb-24 overflow-hidden border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Left Content - Typography & CTA */}
              <div className="max-w-2xl relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 text-[10px] font-bold uppercase tracking-wider mb-6 border border-orange-200 shadow-sm">
                   <ShieldCheck className="w-3.5 h-3.5" />
                   Official Platform • Dept. of Land Resources
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-slate-900 leading-[1.1] tracking-tight mb-4">
                  Digital Land Records <br/>
                  <span className="text-[#00A859]">Modernization</span>
                </h1>
                
                <p className="text-lg text-slate-800 font-bold mb-3 border-l-4 border-amber-500 pl-3">डिजिटल भूमि अभिलेख आधुनिकीकरण (DILRMP)</p>
                
                <p className="text-sm text-slate-600 leading-relaxed mb-8 max-w-lg font-medium">
                  India's unified platform for land governance. Search 32,000+ land laws, inspect Bhu-Aadhaar parcels, simulate policy reforms, and access geospatial intelligence.
                </p>
                
                <div className="flex flex-wrap items-center gap-3">
                  <Link href={getDestination("/dashboard")} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-blue-900/20 flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    Access Platform
                  </Link>
                  <a href="#services" className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-6 py-3.5 rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center gap-2">
                    Explore Services <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
                
                {/* Quick Search Widget */}
                <div className="mt-10 p-3 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 flex items-center gap-3 max-w-lg relative group focus-within:border-blue-400 transition-colors">
                   <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                     <Search className="w-5 h-5 text-blue-600" />
                   </div>
                   <div className="flex-1">
                     <form onSubmit={(e) => {
                        e.preventDefault();
                        if (heroSearchQuery.trim()) {
                          router.push(getDestination(`/dashboard/repository?query=${encodeURIComponent(heroSearchQuery.trim())}`));
                        }
                      }}>
                       <input 
                         type="text" 
                         value={heroSearchQuery}
                         onChange={(e) => setHeroSearchQuery(e.target.value)}
                         placeholder="Search Khasra no, ULPIN, or Laws..." 
                         className="w-full text-sm outline-none text-slate-700 placeholder-slate-400 font-semibold bg-transparent" 
                       />
                     </form>
                   </div>
                   <button 
                     onClick={() => {
                        if (heroSearchQuery.trim()) {
                          router.push(getDestination(`/dashboard/repository?query=${encodeURIComponent(heroSearchQuery.trim())}`));
                        }
                     }}
                     className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shrink-0"
                   >
                     Search
                   </button>
                </div>
              </div>
              
              {/* Right Content - Visual Composition */}
              <div className="relative hidden lg:block">
                 {/* Soft glow background */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-blue-200/50 to-emerald-100/50 rounded-full blur-3xl opacity-60"></div>
                 
                 {/* Main Image Container - Slideshow */}
                 <div className="relative z-10 w-full aspect-[4/3] rounded-3xl shadow-2xl shadow-blue-900/10 border-[6px] border-white overflow-hidden bg-slate-100">
                    {heroSlides.map((slide, idx) => (
                      <div 
                        key={idx}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                      >
                        <img src={slide.img} alt={slide.caption} className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent p-5 pt-16">
                          <p className="text-white font-extrabold text-sm tracking-wide">{slide.caption}</p>
                        </div>
                      </div>
                    ))}
                    
                    {/* Slide Indicators */}
                    <div className="absolute bottom-5 right-5 z-20 flex gap-2">
                      {heroSlides.map((_, idx) => (
                        <button 
                          key={idx}
                          onClick={() => setCurrentSlide(idx)}
                          className={`h-2 rounded-full transition-all duration-300 ${currentSlide === idx ? 'bg-white w-6 shadow-sm' : 'bg-white/40 w-2 hover:bg-white/80'}`}
                          aria-label={`Go to slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                 </div>
                 
              </div>
              
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            TRICOLOR STATS STRIP
        ══════════════════════════════════════════════════════ */}
        <section className="bg-gradient-to-r from-[#ff9933]/10 via-white to-[#138808]/10 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="text-center group">
                    <div className="flex justify-center mb-2">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{s.value}</div>
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-1">{s.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            OUR 4 CORE SERVICES
        ══════════════════════════════════════════════════════ */}
        <section className="py-16 bg-[#f8fafc]" id="services">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full mb-3">Our Services / हमारी सेवाएं</span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Key Platform Services</h2>
              <p className="text-slate-500 text-sm mt-2">Access all national land governance tools from one secure platform</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((svc, i) => {
                const Icon = svc.icon;
                return (
                  <Link key={i} href={getDestination(svc.href)} className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden flex flex-col">
                    <div className="p-6 flex flex-col flex-1">
                      <div className={`w-12 h-12 rounded-xl ${svc.lightColor} ${svc.textColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-base mb-0.5">{svc.title}</h3>
                      <p className={`text-xs font-bold ${svc.textColor} mb-3 opacity-80`}>{svc.hindi}</p>
                      <p className="text-xs text-slate-500 leading-relaxed flex-1">{svc.desc}</p>
                      <div className={`mt-4 flex items-center gap-1.5 text-xs font-bold ${svc.textColor} group-hover:gap-2.5 transition-all`}>
                        Access Service <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            NATIONAL SCHEMES — TABBED SHOWCASE
        ══════════════════════════════════════════════════════ */}
        <section className="py-16 bg-white border-t border-slate-100" id="schemes">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full mb-3">National Schemes</span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Flagship Government Initiatives</h2>
              <p className="text-slate-500 text-sm mt-2">Supported by the Dept. of Land Resources under DILRMP 3.0</p>
            </div>

            {/* Scheme Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {schemes.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setActiveScheme(i)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${activeScheme === i ? `${s.activeColor} text-white border-transparent shadow-md` : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                >
                  {s.name}
                </button>
              ))}
            </div>

            {/* Active Scheme Card */}
            <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-lg grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-56 lg:h-auto min-h-[240px]">
                <img src={schemes[activeScheme].img} alt={schemes[activeScheme].name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent lg:bg-gradient-to-t lg:from-black/60 lg:to-transparent"></div>
                <div className="absolute bottom-5 left-5">
                  <span className="text-3xl font-black text-white">{schemes[activeScheme].name}</span>
                  <div className="text-white/70 text-xs mt-1 font-medium">{schemes[activeScheme].stats}</div>
                </div>
              </div>
              <div className="bg-white p-8 flex flex-col justify-center">
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">{schemes[activeScheme].full}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">{schemes[activeScheme].desc}</p>
                <div className="flex gap-3">
                  <Link href={getDestination("/dashboard")} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors">
                    Explore on Platform <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a href="#" className="inline-flex items-center gap-2 border border-slate-200 hover:border-slate-300 text-slate-700 px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" /> Official Site
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            WHY USE VEDA — Feature grid
        ══════════════════════════════════════════════════════ */}
        <section className="py-16 bg-[#f8fafc] border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-rose-700 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full mb-4">Why VEDA Platform</span>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">One Platform for All Land Governance Needs</h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">
                  VEDA integrates all national land governance programs into a single, secure, officer-grade workspace for Revenue Departments, IAS officers, Policy Researchers, and GIS Surveyors.
                </p>
                <div className="space-y-4">
                  {[
                    { icon: ShieldCheck, title: "Role-Based Access Control (RBAC)", desc: "District Collectors, Revenue Officers, and Researchers get tailored views with strict data permissions.", color: "text-blue-600 bg-blue-50" },
                    { icon: FileCheck, title: "AI-Powered Land Law Search", desc: "Search 32,000+ circulars, acts, and policies with AI-grounded citations and parcel-specific context.", color: "text-emerald-600 bg-emerald-50" },
                    { icon: Map, title: "Integrated Bhu-Naksha GIS", desc: "Live cadastral maps, parcel inspection, draw tools, and ULPIN-linked spatial data in one viewer.", color: "text-blue-600 bg-blue-50" },
                    { icon: Sparkles, title: "Policy Simulation Engine", desc: "Model land reforms, tenancy acts, and SVAMITVA rollout impacts before implementation.", color: "text-rose-600 bg-rose-50" },
                  ].map((f, i) => {
                    const Icon = f.icon;
                    return (
                      <div key={i} className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl ${f.color} flex items-center justify-center shrink-0 mt-0.5`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">{f.title}</h4>
                          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{f.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-100 h-[420px]">
                <img 
                  src="/images/indian_officers.jpg"
                  alt="Indian Revenue Officers reviewing digital land records"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b3e]/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-white">
                    <div className="text-xs font-semibold text-white/70 mb-1">Currently Active On Platform</div>
                    <div className="text-2xl font-black">1,240+ Officers</div>
                    <div className="text-xs text-white/60 mt-0.5">Across 28 States & 8 UTs</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            CTA — LOGIN BANNER
        ══════════════════════════════════════════════════════ */}
        <section className="bg-slate-50 py-16 border-t border-slate-200 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:24px_24px]"></div>
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-200 text-amber-700 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5">
              <Lock className="w-3 h-3" /> Secure Officer Access
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 tracking-tight">
              Ready to Access the Platform?
            </h2>
            <p className="text-slate-600 text-sm mb-8 max-w-lg mx-auto">
              Login with your departmental credentials to access your personalized dashboard, assigned districts, and all DILRMP tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login" className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-amber-900/30">
                <Lock className="w-4 h-4" />
                Officer Sign In
              </Link>
              <Link href="/signup" className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold px-8 py-3.5 rounded-xl text-sm transition-all shadow-sm">
                <Users className="w-4 h-4" />
                Register Your Dept.
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* ═══════════════════════════════════════════════════════
          NIC FOOTER
      ══════════════════════════════════════════════════════ */}
      <footer className="bg-white border-t border-slate-200 pt-8">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-10 bg-contain bg-no-repeat bg-center opacity-80" style={{backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg")'}}></div>
              <div>
                <div className="font-bold text-sm text-slate-900">VEDA Platform</div>
                <div className="text-[10px] text-slate-500">Dept. of Land Resources, MoRD</div>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              This is the official portal of the Department of Land Resources, Ministry of Rural Development, Government of India. Designed, Developed and Hosted by National Informatics Centre (NIC).
            </p>
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 mb-4 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              {["National Repository", "Bhu-Naksha GIS", "Policy Simulator", "Analytics", "Workspaces"].map(l => (
                <li key={l}><a href="#" className="text-xs text-slate-500 hover:text-amber-600 transition-colors flex items-center gap-1.5"><ChevronRight className="w-3 h-3" />{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 mb-4 uppercase tracking-wider">Contact & Help</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                Helpdesk: 1800-11-2233 (Toll Free)
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                support@veda.gov.in
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <a href="#" className="text-[11px] text-slate-500 hover:text-slate-900 transition-colors">Website Policies</a>
              <a href="#" className="text-[11px] text-slate-500 hover:text-slate-900 transition-colors">Accessibility</a>
              <a href="#" className="text-[11px] text-slate-500 hover:text-slate-900 transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-200 py-4 text-center text-[10px] text-slate-400 px-6">
          © 2026 Department of Land Resources, Ministry of Rural Development, Government of India. All rights reserved. | Powered by National Informatics Centre (NIC)
        </div>
      </footer>

    </div>
  );
}
