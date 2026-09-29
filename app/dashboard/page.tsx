"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  MapPin,
  Users,
  Sparkles,
  ChevronRight,
  Download,
  AlertCircle,
  FileCheck,
  Building,
  Landmark,
  ShieldCheck,
  FileSignature,
  Database,
  Headset,
  PhoneCall,
  ArrowRight
} from "lucide-react";

const Marquee = "marquee" as any;

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState({
    name: "Dr. Ashok Sharma",
    role: "officer",
    department: "District Collectorate, Pune",
    designation: "Additional District Magistrate (ADM)",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("veda_user");
      if (stored) {
        try {
          setCurrentUser(JSON.parse(stored));
        } catch (e) {}
      }
    }
  }, []);

  const stats = [
    { label: "Total ULPIN Generated", value: "8.4 Cr", icon: ShieldCheck, bg: "bg-indigo-50", text: "text-indigo-900", iconColor: "text-indigo-400" },
    { label: "Land Records Digitized", value: "94.2%", icon: FileCheck, bg: "bg-emerald-50", text: "text-emerald-900", iconColor: "text-emerald-400" },
    { label: "Villages Surveyed (SVAMITVA)", value: "2,45,120", icon: Building, bg: "bg-amber-50", text: "text-amber-900", iconColor: "text-amber-400" },
    { label: "Active Mutations", value: "12,450", icon: FileSignature, bg: "bg-purple-50", text: "text-purple-900", iconColor: "text-purple-400" },
  ];

  const recentActivity = [
    { title: "ULPIN Bhu-Aadhaar Integration Study uploaded", date: "29-09-2026", dept: "DoLR Central" },
    { title: "Maharashtra cadastral resurvey dataset updated", date: "28-09-2026", dept: "Revenue Dept, MH" },
    { title: "New policy simulation: Model Tenancy Act", date: "27-09-2026", dept: "Policy Cell" },
    { title: "Rajasthan climate vulnerability report published", date: "25-09-2026", dept: "NIC Rajasthan" },
    { title: "Workspace WG-04: Pune corridor study reviewed", date: "22-09-2026", dept: "Collectorate, Pune" },
  ];

  const coreServices = [
    { 
      title: "National Repository", 
      hindi: "राष्ट्रीय भंडार",
      desc: "Browse Policies & Datasets", 
      href: "/dashboard/repository", 
      img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
      icon: Database,
      color: "from-blue-600/80 to-blue-900/90"
    },
    { 
      title: "Bhu-Naksha (GIS)", 
      hindi: "भू-नक्शा",
      desc: "Geospatial Land Viewer", 
      href: "/dashboard/gis", 
      img: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80",
      icon: MapPin,
      color: "from-emerald-600/80 to-emerald-900/90"
    },
    { 
      title: "Policy Simulator", 
      hindi: "नीति सिम्युलेटर",
      desc: "Test Policy Scenarios", 
      href: "/dashboard/simulator", 
      img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      icon: Sparkles,
      color: "from-purple-600/80 to-purple-900/90"
    },
    { 
      title: "Workspaces", 
      hindi: "कार्यस्थल",
      desc: "Collaborative Projects", 
      href: "/dashboard/workspaces", 
      img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
      icon: Users,
      color: "from-amber-600/80 to-amber-900/90"
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Ultra-compact Marquee Updates (Dashboard Only) */}
      <div className="bg-amber-50 border border-amber-200/60 rounded-lg flex items-center overflow-hidden shadow-sm h-8">
        <div className="bg-amber-100 text-amber-800 px-3 py-0 h-full flex items-center text-[10px] uppercase font-bold tracking-wider whitespace-nowrap border-r border-amber-200/60 shrink-0">
          Alerts
        </div>
        <Marquee className="flex-1 font-normal text-xs text-amber-800/80 leading-8" onMouseOver={(e: any) => e.currentTarget.stop()} onMouseOut={(e: any) => e.currentTarget.start()}>
          <span className="mx-4">✨ New ULPIN Bhu-Aadhaar integration guidelines published.</span>
          <span className="mx-4">📊 Maharashtra Cadastral Resurvey data updated for Pune region.</span>
          <span className="mx-4">🔧 Scheduled maintenance for GIS servers on Sunday 2:00 AM.</span>
        </Marquee>
      </div>

      {/* Page Title */}
      <div className="flex items-center gap-3 pb-1">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard</h2>
        <span className="text-2xl font-normal text-slate-300">/</span>
        <h2 className="text-lg font-semibold text-slate-500 tracking-wide">मुख्य पृष्ठ</h2>
      </div>

      {/* Core Services Blocks - Real Images with Frosted Glass */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {coreServices.map((service, i) => (
          <Link key={i} href={service.href} className="group block rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 relative h-48">
            <img src={service.img} alt={service.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            
            {/* Smooth dark gradient at the bottom for contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            <div className="absolute inset-0 flex flex-col justify-between z-10">
               <div className="p-4 flex justify-between items-start">
                 <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-sm">
                   <service.icon className="w-5 h-5 text-white" />
                 </div>
                 <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-white/20">
                   <ArrowRight className="w-4 h-4 text-white" />
                 </div>
               </div>
               
               {/* Frosted Glass Text Panel */}
               <div className="p-4 bg-black/30 backdrop-blur-md border-t border-white/10 group-hover:bg-black/40 transition-colors">
                 <h3 className="font-bold text-lg tracking-tight mb-0.5 text-white drop-shadow-sm">{service.title}</h3>
                 <div className="flex items-center gap-2">
                   <span className="text-[11px] font-semibold uppercase tracking-wider text-white/90">{service.hindi}</span>
                   <span className="w-1 h-1 rounded-full bg-white/50"></span>
                   <span className="text-[10px] text-white/80 font-normal">{service.desc}</span>
                 </div>
               </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={`${stat.bg} ${stat.text} rounded-2xl p-5 border border-white/50 shadow-sm flex items-center justify-between transition-all hover:shadow-md`}>
              <div>
                <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                <div className="text-[11px] font-semibold uppercase mt-1 opacity-80 tracking-wider">{stat.label}</div>
              </div>
              <div className={`p-3 bg-white/60 rounded-xl ${stat.iconColor}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left/Middle Column: Recent Activity & Data */}
        <div className="lg:col-span-3 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Quick Links Box */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-emerald-50/50 border-b border-emerald-100 px-5 py-4">
                <h3 className="font-semibold text-emerald-800 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Quick Links / त्वरित लिंक
                </h3>
              </div>
              <div className="p-2 flex-1">
                <ul className="space-y-1">
                  {[
                    { label: "Update Revenue Records", href: "#" },
                    { label: "Download ULPIN Guidelines", href: "#" },
                    { label: "View Mutation Status", href: "#" },
                    { label: "Village Map Directory", href: "#" },
                    { label: "SVAMITVA Drone Survey Reports", href: "#" },
                  ].map((link, idx) => (
                    <li key={idx}>
                      <Link href={link.href} className="flex items-center justify-between px-4 py-3 text-xs text-slate-600 hover:bg-emerald-50/50 rounded-xl font-medium hover:text-emerald-700 transition-all group">
                        <span className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-emerald-400 transition-colors"></div>
                          {link.label}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" /> 
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden relative flex flex-col">
              <div className="absolute top-0 left-0 w-1 h-full bg-rose-400"></div>
              <div className="px-5 py-4 flex items-center gap-2 border-b border-rose-50/50">
                <div className="p-1.5 bg-rose-100 text-rose-600 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-slate-800 text-sm">Important Notice</h3>
              </div>
              <div className="p-5 text-xs text-slate-600 leading-relaxed bg-white flex-1 flex flex-col justify-between">
                <div>
                  <p className="mb-3">
                    <strong className="text-slate-800 font-semibold block mb-1">Attention all revenue officers:</strong>
                    The ULPIN linkage for the remaining cadastral parcels must be completed by <strong className="text-rose-600 bg-rose-50 px-1 rounded font-semibold">31-10-2026</strong>. Please utilize the Bhu-Naksha GIS tool to verify discrepancies.
                  </p>
                </div>
                <button className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors mt-4">
                  <Download className="w-3.5 h-3.5" /> Download Circular
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="bg-slate-50/50 border-b border-slate-100 px-6 py-4 flex justify-between items-center">
              <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                National Activity Log / नवीनतम गतिविधियां
              </h3>
              <button className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-wider">
                View All
              </button>
            </div>
            <div className="p-0 overflow-x-auto flex-1">
              <table className="w-full text-xs text-left whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-6 font-medium">Sr. No.</th>
                    <th className="py-3 px-6 font-medium">Subject</th>
                    <th className="py-3 px-6 font-medium">Department</th>
                    <th className="py-3 px-6 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentActivity.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-3 px-6 text-slate-400 font-normal">{i + 1}</td>
                      <td className="py-3 px-6 text-slate-700 font-medium group-hover:text-indigo-600 cursor-pointer transition-colors">
                        {item.title}
                      </td>
                      <td className="py-3 px-6 text-slate-500">
                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-[10px] font-medium">
                          {item.dept}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-slate-400 font-normal">{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Citizen Support Profile */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col text-center">
            <div className="w-full h-40 relative bg-indigo-600 overflow-hidden rounded-t-2xl">
               {/* Abstract Modern Gradient & Pattern for Support */}
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 via-indigo-600 to-indigo-900 z-10"></div>
               {/* Dot Pattern overlay */}
               <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] z-20"></div>
               {/* Large background icon */}
               <Headset className="absolute -bottom-6 -right-4 w-36 h-36 text-white opacity-10 z-20 rotate-12" />
               
               <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-slate-900/80 to-transparent z-20"></div>
               <h3 className="absolute bottom-4 left-5 text-white font-semibold text-sm tracking-wide z-30 text-left leading-tight">Help & Support Desk<br/><span className="text-[10px] font-normal text-indigo-200">Officer Assistance</span></h3>
            </div>
            
            <div className="p-5 flex flex-col items-center">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-3">
                <Headset className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-slate-800 text-sm">Need Assistance?</h4>
              <p className="text-[10px] text-slate-500 font-normal mt-1 mb-4">Our dedicated technical support team is available 24/7 for revenue officers.</p>
              
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors">
                <PhoneCall className="w-3.5 h-3.5" /> Call Toll Free
              </button>
              <div className="mt-4 pt-4 border-t border-slate-100 w-full">
                 <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Helpdesk: 1800-11-2233</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
