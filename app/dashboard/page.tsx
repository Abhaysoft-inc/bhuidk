"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  MapPin,
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  ArrowUpRight,
  Database,
  Sparkles,
  ShieldCheck,
  Building2,
  KeyRound,
  GraduationCap,
  Compass,
  ArrowRight,
} from "lucide-react";

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState({
    name: "Dr. Ashok Sharma",
    role: "officer",
    department: "District Collectorate, Pune",
    designation: "Additional District Magistrate (ADM)",
  });

  useEffect(() => {
    const loadUser = () => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("veda_user");
        if (stored) {
          try {
            setCurrentUser(JSON.parse(stored));
          } catch (e) {
            console.error(e);
          }
        }
      }
    };

    loadUser();

    // Listen for storage or custom events
    const handleStorageChange = () => loadUser();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("veda_user_updated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("veda_user_updated", handleStorageChange);
    };
  }, []);

  const stats = [
    { label: "Research Papers", value: "14,250", change: "+124 this month", icon: FileText, color: "text-blue-600 bg-blue-50" },
    { label: "Geospatial Datasets", value: "852", change: "+18 this month", icon: MapPin, color: "text-emerald-600 bg-emerald-50" },
    { label: "Active Workspaces", value: "1,240", change: "+56 this month", icon: Users, color: "text-indigo-600 bg-indigo-50" },
    { label: "Policy Simulations", value: "328", change: "+12 this month", icon: Sparkles, color: "text-amber-600 bg-amber-50" },
  ];

  const recentActivity = [
    { title: "ULPIN Bhu-Aadhaar Integration Study uploaded", time: "2 hours ago", type: "Paper" },
    { title: "Maharashtra cadastral resurvey dataset updated", time: "5 hours ago", type: "Dataset" },
    { title: "New policy simulation: Model Tenancy Act", time: "Yesterday", type: "Simulation" },
    { title: "Rajasthan climate vulnerability report published", time: "2 days ago", type: "Report" },
    { title: "Workspace WG-04: Pune corridor study reviewed", time: "3 days ago", type: "Workspace" },
  ];

  return (
    <div className="space-y-6">
      {/* Dynamic User & Role Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Dashboard
            </h1>
            {/* Dynamic Role Badge */}
            {currentUser.role === "admin" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#f4f0ff] text-[#4A2BC2] border border-[#eae4ff]">
                <KeyRound className="w-3.5 h-3.5" />
                PLATFORM ADMINISTRATOR
              </span>
            )}
            {currentUser.role === "officer" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Building2 className="w-3.5 h-3.5" />
                REVENUE OFFICER
              </span>
            )}
            {currentUser.role === "researcher" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                <GraduationCap className="w-3.5 h-3.5" />
                POLICY RESEARCHER
              </span>
            )}
            {currentUser.role === "surveyor" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                <Compass className="w-3.5 h-3.5" />
                GIS SURVEY SPECIALIST
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Welcome back, <strong className="text-slate-800">{currentUser.name}</strong> •{" "}
            <span>{currentUser.department || "Ministry of Rural Development"}</span>
          </p>
        </div>

        {currentUser.role === "admin" && (
          <Link
            href="/dashboard/users"
            className="inline-flex items-center gap-2 bg-[#4A2BC2] hover:bg-[#3C1FA4] text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-xs self-start sm:self-center"
          >
            <ShieldCheck className="w-4 h-4 text-[#b9a4ff]" />
            <span>Manage Users (Admin)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Admin Quick Notification Banner */}
      {currentUser.role === "admin" && (
        <div className="bg-[#f4f0ff] border border-[#d6cbff] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#4A2BC2] text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-[#4A2BC2]">Central Administrative Privileges Active:</span>{" "}
              <span className="text-slate-700">
                You have access to User &amp; Role Governance, district authorization logs, and federated API connectors.
              </span>
            </div>
          </div>
          <Link
            href="/dashboard/users"
            className="text-xs font-bold text-[#4A2BC2] hover:underline whitespace-nowrap"
          >
            Open User Console ➔
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-extrabold text-slate-900">{stat.value}</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900">Recent Activity</h2>
            <button type="button" className="text-[11px] font-semibold text-[#4A2BC2] hover:underline cursor-pointer">
              View all
            </button>
          </div>
          <div className="space-y-1">
            {recentActivity.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                    <Database className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800">{item.title}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {item.time}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                  {item.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              ...(currentUser.role === "admin"
                ? [
                    {
                      label: "User & Role Governance",
                      desc: "Manage officers & permissions",
                      icon: ShieldCheck,
                      href: "/dashboard/users",
                    },
                  ]
                : []),
              { label: "Search Repository", desc: "Browse papers & datasets", icon: Database, href: "/dashboard/repository" },
              { label: "Run Simulation", desc: "Test a policy scenario", icon: Sparkles, href: "/dashboard/simulator" },
              { label: "Open GIS Viewer", desc: "Explore spatial layers", icon: MapPin, href: "/dashboard/gis" },
              { label: "View Analytics", desc: "National dashboards", icon: BarChart3, href: "/dashboard/analytics" },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-[#b9a4ff] hover:bg-[#f4f0ff]/30 transition-all text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#f4f0ff] text-[#4A2BC2] flex items-center justify-center group-hover:bg-[#4A2BC2] group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{action.label}</div>
                      <div className="text-[10px] text-slate-500">{action.desc}</div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#4A2BC2] transition-colors shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
