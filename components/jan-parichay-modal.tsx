"use client";

import React, { useState } from "react";
import { X, Lock, ShieldCheck, User, Building, Smartphone, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { AshokaEmblem, DigitalIndiaLogo, NICBadge } from "./gov-icons";

interface JanParichayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; role: string; org: string }) => void;
  language: "en" | "hi";
}

export function JanParichayModal({
  isOpen,
  onClose,
  onLoginSuccess,
  language,
}: JanParichayModalProps) {
  const [activeLoginTab, setActiveLoginTab] = useState<"quick" | "user" | "mobile" | "gov">("quick");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const quickProfiles = [
    {
      name: "Dr. K. S. Ramanujam",
      role: "Lead Policy Researcher",
      org: "IIM Ahmedabad & PME Division Fellow",
      badge: "Academic / Think Tank",
      color: "border-amber-400 bg-amber-50/50 hover:bg-amber-100/60",
    },
    {
      name: "Shri Rajeshwar Verma, IAS",
      role: "Joint Secretary (PME)",
      org: "Dept of Land Resources (DoLR), MoRD",
      badge: "Central Government Admin",
      color: "border-blue-400 bg-blue-50/50 hover:bg-blue-100/60",
    },
    {
      name: "Dr. Sunita Deshmukh",
      role: "Director of Land Records",
      org: "Revenue Department, Maharashtra",
      badge: "State Revenue Authority",
      color: "border-emerald-400 bg-emerald-50/50 hover:bg-emerald-100/60",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden border-2 border-slate-300">
        {/* Tricolor line */}
        <div className="h-1 w-full tiranga-border" />

        {/* Modal Header */}
        <div className="bg-[#0b2b50] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AshokaEmblem className="h-9 w-auto text-amber-300" />
            <div>
              <div className="text-sm font-extrabold flex items-center gap-2">
                <span>जन परिचय / MeriPehchan</span>
                <span className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded font-black">
                  National SSO
                </span>
              </div>
              <div className="text-[11px] text-slate-300">
                Single Sign-On for National Land Governance Portal
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 text-xs text-slate-700">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 mb-4 font-semibold text-[11px]">
            <button
              type="button"
              onClick={() => setActiveLoginTab("quick")}
              className={`pb-2 px-3 border-b-2 transition-colors ${
                activeLoginTab === "quick"
                  ? "border-[#0b2b50] text-[#0b2b50] font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Demo Quick Access (1-Click)
            </button>
            <button
              type="button"
              onClick={() => setActiveLoginTab("user")}
              className={`pb-2 px-3 border-b-2 transition-colors ${
                activeLoginTab === "user"
                  ? "border-[#0b2b50] text-[#0b2b50] font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Parichay ID / Password
            </button>
            <button
              type="button"
              onClick={() => setActiveLoginTab("mobile")}
              className={`pb-2 px-3 border-b-2 transition-colors ${
                activeLoginTab === "mobile"
                  ? "border-[#0b2b50] text-[#0b2b50] font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Mobile / Aadhaar OTP
            </button>
          </div>

          {activeLoginTab === "quick" && (
            <div className="space-y-3">
              <p className="text-[11px] text-slate-600">
                Select a verified stakeholder role to instantly enter the authenticated internal
                workspace with simulator, GIS viewer, and document access:
              </p>

              <div className="space-y-2">
                {quickProfiles.map((prof, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onLoginSuccess(prof)}
                    className={`w-full text-left p-3 rounded border text-xs transition-all flex items-center justify-between group ${prof.color}`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900">{prof.name}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-white text-slate-700 border border-slate-300">
                          {prof.badge}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 font-medium">{prof.role}</div>
                      <div className="text-[10px] text-slate-500">{prof.org}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeLoginTab === "user" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onLoginSuccess({
                  name: username || "Official Researcher",
                  role: "Registered Scholar",
                  org: "Ministry of Rural Development Portal",
                });
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Parichay / e-Pramaan Username or Email:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ashok.sharma@gov.in"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#0b2b50]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Password:
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#0b2b50]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#0b2b50] hover:bg-[#071e3d] text-white font-bold py-2 rounded text-xs flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sign In via Jan Parichay</span>
                </button>
              </div>
            </form>
          )}

          {activeLoginTab === "mobile" && (
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Aadhaar / Registered Mobile Number:
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    placeholder="Enter 10-digit mobile or 12-digit Aadhaar"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#0b2b50]"
                  />
                  <button
                    type="button"
                    onClick={() => alert("Mock OTP sent to registered number: 849201")}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-3 py-2 rounded text-xs whitespace-nowrap"
                  >
                    Send OTP
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  6-Digit OTP:
                </label>
                <input
                  type="text"
                  placeholder="Enter OTP (e.g. 849201)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#0b2b50]"
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  onLoginSuccess({
                    name: "Dr. K. S. Ramanujam",
                    role: "Lead Policy Researcher",
                    org: "IIM Ahmedabad Fellow",
                  })
                }
                className="w-full bg-[#0b2b50] hover:bg-[#071e3d] text-white font-bold py-2 rounded text-xs flex items-center justify-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Verify & Enter Workspace</span>
              </button>
            </div>
          )}

          {/* Security note */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>GIGW & NIC Security Certified</span>
            </div>
            <span className="font-mono">e-Pramaan v4.1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
