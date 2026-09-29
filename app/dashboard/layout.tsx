"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Database,
  Sparkles,
  MapPin,
  Users,
  Lightbulb,
  BarChart3,
} from "lucide-react";
import { TerritoryProvider } from "@/context/territory-context";

const baseNavItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/dashboard/repository", label: "National Repository", icon: Database },
  { href: "/dashboard/simulator", label: "Policy Simulator", icon: Sparkles },
  { href: "/dashboard/gis", label: "Bhu-Naksha (GIS)", icon: MapPin },
  { href: "/dashboard/workspaces", label: "Workspaces", icon: Users },
  { href: "/dashboard/grants", label: "Innovation", icon: Lightbulb },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const isHome = pathname === "/dashboard";

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
    } else {
      // Fallback: reload with Google Translate cookie
      document.cookie = `googtrans=/en/${lang}; path=/`;
      window.location.reload();
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("veda_user");
        if (!stored) {
          setAuthChecked(true);
          router.replace(`/login?redirect=${encodeURIComponent(pathname || "/dashboard")}`);
          return;
        }
        try {
          const user = JSON.parse(stored);
          setCurrentUser(user);
          setAuthChecked(true);
        } catch (e) {
          setAuthChecked(true);
          router.replace("/login");
        }
      }
    };
    checkAuth();
  }, [pathname, router]);

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("veda_user");
    }
    router.replace("/login");
  };

  if (!authChecked || !currentUser) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400">Loading...</div>;
  }

  return (
    <TerritoryProvider>
      <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
        
        {/* Show Massive Headers ONLY on Dashboard Home */}
        {isHome && (
          <>
            {/* Top Soft Strip */}
            <div className="bg-slate-100/80 backdrop-blur-sm text-slate-500 text-[11px] py-1.5 px-6 flex justify-between items-center border-b border-slate-200">
              <div className="flex space-x-4 font-medium tracking-wide">
                <span>भारत सरकार / Government of India</span>
                <span>ग्रामीण विकास मंत्रालय / Ministry of Rural Development</span>
              </div>
              <div className="flex space-x-4 items-center font-medium">
                <a href="#" className="hover:text-indigo-600 transition-colors">Skip to Main Content</a>
                <a href="#" className="hover:text-indigo-600 transition-colors">Screen Reader Access</a>
                <span className="flex space-x-1.5">
                  <button className="bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-50 w-5 h-5 flex items-center justify-center text-[9px] transition-colors">A-</button>
                  <button className="bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-50 w-5 h-5 flex items-center justify-center text-[10px] transition-colors">A</button>
                  <button className="bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-50 w-5 h-5 flex items-center justify-center text-[11px] transition-colors">A+</button>
                </span>
                <select onChange={handleLanguageChange} className="bg-transparent text-slate-600 border-none text-[11px] outline-none font-medium cursor-pointer hover:text-indigo-600">
                  <option value="en">English</option>
                  <option value="hi">हिन्दी</option>
                </select>
              </div>
            </div>

            {/* Header Section */}
            <div className="bg-white py-4 px-6 flex justify-between items-center shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
              <div className="flex items-center space-x-5">
                {/* Softened National Emblem Substitute */}
                <div className="w-10 h-14 bg-contain bg-no-repeat bg-center opacity-80" style={{backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg")'}}></div>
                <div>
                  <h1 className="text-xl font-extrabold text-indigo-950 tracking-tight leading-tight">Digital Land Records Modernization</h1>
                  <h2 className="text-sm font-semibold text-slate-600 mt-0.5">Department of Land Resources (DoLR)</h2>
                </div>
              </div>
              <div className="flex space-x-6 items-center">
                 <div className="w-20 h-10 bg-contain bg-no-repeat bg-center opacity-80" style={{backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/f/fc/Digital_India_logo.svg")'}}></div>
                 <div className="text-right border-l border-slate-200 pl-6">
                    <div className="text-xs font-bold text-slate-800">Welcome, {currentUser.name}</div>
                    <div className="text-[10px] text-slate-500 font-medium mt-0.5">{currentUser.designation}</div>
                    <button onClick={handleSignOut} className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold mt-1.5 transition-colors uppercase tracking-wider">Logout</button>
                 </div>
              </div>
            </div>
          </>
        )}

        {/* Soft Modern Nav Bar - Compact Mode Support */}
        <div className="bg-gradient-to-r from-orange-50/80 via-white to-emerald-50/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 shadow-sm">
          <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center overflow-x-auto scrollbar-none">
              
              {/* Compact Logo for Tools */}
              {!isHome && (
                 <Link href="/dashboard" className="hidden lg:flex items-center gap-2 border-r border-slate-200 pr-4 mr-2 shrink-0">
                   <div className="w-5 h-7 bg-contain bg-no-repeat bg-center opacity-80" style={{backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg")'}}></div>
                   <div className="flex flex-col">
                     <span className="font-black text-xs text-slate-800 leading-none">VEDA</span>
                   </div>
                 </Link>
              )}

              {baseNavItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-3.5 text-[11px] sm:text-xs font-bold transition-all border-b-2 whitespace-nowrap shrink-0 ${
                      isActive 
                        ? 'border-emerald-500 text-emerald-700 bg-emerald-50/50' 
                        : 'border-transparent text-slate-600 hover:text-emerald-600 hover:bg-white/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                )
              })}
            </div>

            {/* Compact Profile & Language for Tools */}
            {!isHome && (
               <div className="hidden lg:flex items-center gap-4 pl-4 ml-4 border-l border-slate-200 shrink-0">
                  <select onChange={handleLanguageChange} className="bg-transparent text-slate-600 border border-slate-200 rounded px-1.5 py-1 text-[10px] outline-none cursor-pointer hover:border-emerald-300 font-bold">
                    <option value="en">English</option>
                    <option value="hi">हिन्दी</option>
                  </select>
                  <div className="text-right flex flex-col items-end">
                    <div className="text-[10px] font-bold text-slate-800 leading-tight">{currentUser.name}</div>
                    <button onClick={handleSignOut} className="text-[9px] text-red-600 hover:underline font-bold uppercase tracking-wider mt-0.5">Logout</button>
                  </div>
               </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white text-slate-500 py-8 text-center text-[11px] mt-auto border-t border-slate-200">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <p className="mb-2 font-medium">This is the official platform of the Department of Land Resources, Ministry of Rural Development, Government of India.</p>
            <p>Designed, Developed and Hosted by <strong className="text-slate-700">National Informatics Centre (NIC)</strong></p>
            <div className="mt-5 space-x-6">
              <a href="#" className="hover:text-indigo-600 transition-colors font-medium">Website Policies</a>
              <a href="#" className="hover:text-indigo-600 transition-colors font-medium">Help</a>
              <a href="#" className="hover:text-indigo-600 transition-colors font-medium">Contact Us</a>
              <a href="#" className="hover:text-indigo-600 transition-colors font-medium">Web Information Manager</a>
            </div>
            <p className="mt-5 text-[10px] text-slate-400">© 2026 Department of Land Resources. All rights reserved.</p>
          </div>
        </footer>

      </div>
    </TerritoryProvider>
  );
}
