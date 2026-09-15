"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, PlusCircle, Clock, Search, Filter } from "lucide-react";

const WORKSPACES = [
  { id: "ws-1", name: "Pune Cadastral Resurvey", members: 8, updated: "2h ago", status: "Active", desc: "Joint pilot with Survey of India to test automated drone-based boundary detection." },
  { id: "ws-2", name: "Model Tenancy Framework", members: 12, updated: "Yesterday", status: "Active", desc: "Drafting state-specific adaptations of the Model Tenancy Act based on court dispute data." },
  { id: "ws-3", name: "Desertification Vulnerability Atlas", members: 6, updated: "4 days ago", status: "Active", desc: "Mapping arid region expansion using ISRO Bhuvan historical imagery." },
  { id: "ws-4", name: "NE India Land Rights Study", members: 4, updated: "1 week ago", status: "Draft", desc: "Analyzing customary land tenure systems in Schedule VI areas." },
];

export default function WorkspacesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = WORKSPACES.filter((ws) =>
    ws.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 w-full max-w-[1400px] mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Collaborative Workspaces</h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Secure, invite-only digital rooms where policymakers, GIS analysts, and researchers collaborate on land governance initiatives.
          </p>
        </div>
        <button type="button" className="flex items-center justify-center gap-2 bg-[#0b2b50] text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#164275] cursor-pointer transition-colors shadow-sm">
          <PlusCircle className="w-4 h-4" /> Create Workspace
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search workspaces..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          />
        </div>
        <button className="flex items-center gap-2 bg-white border border-slate-300 px-4 py-2.5 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
      >
        {filtered.map((ws) => (
          <motion.div
            key={ws.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col transition-all cursor-pointer group"
          >
            <div className="p-5 flex-1">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${ws.status === "Active" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-slate-100 text-slate-600 border border-slate-200"}`}>
                  {ws.status}
                </span>
                <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {ws.updated}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{ws.name}</h3>
              <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{ws.desc}</p>
            </div>
            
            <div className="bg-slate-50 border-t border-slate-100 p-4 flex items-center justify-between mt-auto">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-600">{ws.members} members</span>
              </div>
              <Link 
                href={`/dashboard/workspaces/${ws.id}`}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                Enter Workspace →
              </Link>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            No workspaces found matching your search.
          </div>
        )}
      </motion.div>
    </div>
  );
}
