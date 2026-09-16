"use client";

import React, { useState } from "react";
import { Trophy, ArrowUpCircle, Users, Clock, Flame, ChevronRight } from "lucide-react";

export function TechChallengesTab() {
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());

  const handleVote = (id: string) => {
    setVotedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const challenges = [
    {
      id: "TC-01",
      title: "Automated OCR for Legacy Land Records (Urdu/Modi Script)",
      reward: "₹35 Lakhs",
      deadline: "31 Oct 2026",
      participants: 42,
      submissions: [
        { id: "s1", title: "UrduNet: Transfer Learning for Damaged Manuscripts", author: "IIT Bombay Team", votes: 156 },
        { id: "s2", title: "ModiScript Vision: Transformer based pipeline", author: "C-DAC Pune", votes: 89 }
      ]
    },
    {
      id: "TC-02",
      title: "Drone-to-Cadastre Auto-Boundary via Graph Neural Networks",
      reward: "₹50 Lakhs",
      deadline: "15 Nov 2026",
      participants: 18,
      submissions: [
        { id: "s3", title: "GeoGraph: Semantic Segmentation + GNN", author: "SpatialAI Startup", votes: 210 },
      ]
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Featured Header */}
      <div className="bg-[#0b2b50] rounded-2xl overflow-hidden relative shadow-md">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-500 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Live Hackathon</span>
              <span className="flex items-center gap-1 text-xs text-blue-200 font-semibold"><Flame className="w-3.5 h-3.5 text-rose-400" /> High Priority</span>
            </div>
            <h2 className="text-2xl font-black mb-2 leading-tight">National Land Governance Innovation Challenge</h2>
            <p className="text-blue-100 text-sm max-w-xl">Build open-source AI tools to solve India's toughest land administration bottlenecks. Open to students, startups, and researchers.</p>
          </div>
          <div className="shrink-0 flex flex-col items-center bg-white/10 backdrop-blur border border-white/20 p-4 rounded-xl">
            <div className="text-xs text-blue-200 font-bold uppercase tracking-wider mb-1">Total Grant Pool</div>
            <div className="text-3xl font-black text-white">₹5.00 Cr</div>
          </div>
        </div>
      </div>

      {/* Challenges List */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col lg:flex-row">
              {/* Challenge Info */}
              <div className="p-6 lg:w-2/5 border-b lg:border-b-0 lg:border-r border-slate-100 bg-slate-50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold bg-[#0b2b50] text-white px-2 py-0.5 rounded">{challenge.id}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base leading-snug mb-4">{challenge.title}</h4>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
                  <div className="flex items-center gap-1.5"><Trophy className="w-4 h-4 text-amber-500" /> {challenge.reward}</div>
                  <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue-500" /> {challenge.deadline}</div>
                  <div className="flex items-center gap-1.5"><Users className="w-4 h-4 text-emerald-500" /> {challenge.participants} Teams</div>
                </div>

                <button className="mt-5 w-full bg-white border border-[#0b2b50] text-[#0b2b50] font-bold py-2 rounded-lg text-sm hover:bg-[#0b2b50] hover:text-white transition-colors">
                  Submit Solution
                </button>
              </div>

              {/* Submissions & Voting */}
              <div className="p-6 lg:w-3/5">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Community Submissions</div>
                <div className="space-y-3">
                  {challenge.submissions.map((sub) => {
                    const isVoted = votedIds.has(sub.id);
                    return (
                      <div key={sub.id} className="flex items-center justify-between gap-4 p-3 rounded-lg border border-slate-100 hover:border-slate-300 transition-colors bg-white group">
                        
                        {/* Vote Button */}
                        <button 
                          onClick={() => handleVote(sub.id)}
                          className={`flex flex-col items-center justify-center w-12 h-14 rounded-md border transition-all ${
                            isVoted 
                              ? "bg-blue-50 border-blue-200 text-blue-600 shadow-inner" 
                              : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                          }`}
                        >
                          <ArrowUpCircle className={`w-5 h-5 mb-1 ${isVoted ? "fill-blue-100 text-blue-600" : ""}`} />
                          <span className="text-xs font-bold leading-none">
                            {isVoted ? sub.votes + 1 : sub.votes}
                          </span>
                        </button>

                        <div className="flex-1">
                          <h5 className="font-bold text-sm text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">{sub.title}</h5>
                          <div className="text-xs text-slate-500 mt-0.5">by {sub.author}</div>
                        </div>

                        <button className="text-slate-400 hover:text-[#0b2b50] p-2 bg-slate-50 hover:bg-slate-100 rounded-md transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
