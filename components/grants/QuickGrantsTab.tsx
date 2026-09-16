"use client";

import React from "react";
import { Zap, Clock, Banknote, ArrowRight } from "lucide-react";

export function QuickGrantsTab() {
  const grants = [
    {
      id: "QG-1",
      title: "GIS Conference Travel Grant",
      amount: "₹50,000",
      desc: "Instant approval for PhD scholars presenting papers on Indian land governance at recognized international conferences.",
      time: "24h Approval"
    },
    {
      id: "QG-2",
      title: "Data Transcription Micro-Grant",
      amount: "₹1,00,000",
      desc: "Funding to hire local transcribers for digitizing localized historical land records or customary laws.",
      time: "48h Approval"
    },
    {
      id: "QG-3",
      title: "Cloud Compute Credits",
      amount: "₹75,000",
      desc: "AWS/Azure credits for running heavy ML models on large cadastral datasets or satellite imagery.",
      time: "Instant"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {grants.map(grant => (
        <div key={grant.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap className="w-24 h-24 text-amber-500" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded">Fast-Track</span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500"><Clock className="w-3 h-3" /> {grant.time}</span>
            </div>
            
            <h3 className="text-lg font-black text-slate-900 mb-2">{grant.title}</h3>
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold mb-4">
              <Banknote className="w-4 h-4" /> {grant.amount}
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{grant.desc}</p>
          </div>

          <button className="relative z-10 mt-6 w-full bg-slate-50 hover:bg-[#0b2b50] hover:text-white border border-slate-200 hover:border-[#0b2b50] text-slate-700 font-bold py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
            Apply Instantly <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
