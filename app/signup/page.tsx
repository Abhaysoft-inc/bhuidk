"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  ShieldCheck,
  Building2,
  GraduationCap,
  Landmark,
  Globe,
  KeyRound,
  Check,
} from "lucide-react";

const roles = [
  {
    id: "researcher",
    label: "Researcher",
    desc: "Academic scholars, think tanks, PhD fellows",
    icon: GraduationCap,
  },
  {
    id: "policymaker",
    label: "Policymaker",
    desc: "NITI Aayog, policy analysts, advisors",
    icon: Landmark,
  },
  {
    id: "government",
    label: "Government Official",
    desc: "Central / State revenue officers, IAS",
    icon: Building2,
  },
  {
    id: "public",
    label: "Public User",
    desc: "Citizens, journalists, students",
    icon: Globe,
  },
  {
    id: "admin",
    label: "Admin",
    desc: "Platform administrators, NIC staff",
    icon: KeyRound,
  },
];

export default function SignupPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<string>("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Account created!\nName: ${name}\nEmail: ${email}\nOrganization: ${org}\nRole: ${selectedRole}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Tricolor */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg space-y-8">
          {/* Back */}
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-[#0b2b50] text-white flex items-center justify-center text-xl font-black mx-auto shadow-sm">
              भा
            </div>
            <div>
              <div className="text-[10px] font-semibold text-amber-700 uppercase tracking-widest">
                DoLR • Ministry of Rural Development
              </div>
              <h1 className="text-xl font-extrabold text-[#0b2b50] tracking-tight mt-1">
                Create your account
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                National Land Governance Platform
              </p>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${
                  step >= 1 ? "bg-[#0b2b50] text-white" : "bg-slate-200 text-slate-500"
                }`}
              >
                {step > 1 ? <Check className="w-3.5 h-3.5" /> : "1"}
              </div>
              <span className="text-xs font-semibold text-slate-700">Select Role</span>
            </div>
            <div className="w-8 h-[2px] bg-slate-200" />
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${
                  step >= 2 ? "bg-[#0b2b50] text-white" : "bg-slate-200 text-slate-500"
                }`}
              >
                2
              </div>
              <span className="text-xs font-semibold text-slate-500">Your Details</span>
            </div>
          </div>

          {/* Step 1: Role Selection */}
          {step === 1 && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">What best describes you?</h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  This determines your access level and dashboard.
                </p>
              </div>

              <div className="space-y-2">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-lg border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#0b2b50] bg-[#0b2b50]/5 ring-1 ring-[#0b2b50]/20"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? "bg-[#0b2b50] text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-slate-900">{role.label}</div>
                        <div className="text-[11px] text-slate-500">{role.desc}</div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? "border-[#0b2b50] bg-[#0b2b50]"
                            : "border-slate-300"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                disabled={!selectedRole}
                onClick={() => setStep(2)}
                className={`w-full font-bold py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                  selectedRole
                    ? "bg-[#0b2b50] hover:bg-[#164275] text-white"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2: Account Details */}
          {step === 2 && (
            <form
              onSubmit={handleSubmit}
              className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-5"
            >
              {/* Selected role badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Role:
                  </span>
                  <span className="text-xs font-bold text-[#0b2b50] bg-[#0b2b50]/5 px-2.5 py-1 rounded-full border border-[#0b2b50]/10 capitalize">
                    {selectedRole}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[11px] text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                >
                  Change
                </button>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="name" className="text-xs font-semibold text-slate-700 block">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dr. Ashok Sharma"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2b50]/20 focus:border-[#0b2b50] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="signup-email" className="text-xs font-semibold text-slate-700 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="signup-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ashok.sharma@institution.edu.in"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2b50]/20 focus:border-[#0b2b50] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="org" className="text-xs font-semibold text-slate-700 block">
                  Organization / Institution
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="org"
                    type="text"
                    required
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    placeholder="IIT Delhi / Revenue Dept, Maharashtra"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2b50]/20 focus:border-[#0b2b50] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="signup-password" className="text-xs font-semibold text-slate-700 block">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2b50]/20 focus:border-[#0b2b50] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0b2b50] hover:bg-[#164275] text-white font-bold py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                Create Account
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-[11px] text-slate-400 font-medium">or</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => alert("Redirecting to Jan Parichay (National SSO)...")}
                className="w-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-semibold py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                Register with Jan Parichay (National SSO)
              </button>
            </form>
          )}

          {/* Login Link */}
          <p className="text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-[#0b2b50] font-bold hover:underline">
              Sign in
            </Link>
          </p>

          {/* Footer note */}
          <div className="text-center text-[10px] text-slate-400 space-y-0.5">
            <div>Hosted on NIC MeghRaj Cloud • GIGW 3.0 Compliant</div>
            <div>© 2026 Department of Land Resources, Govt of India</div>
          </div>
        </div>
      </div>
    </div>
  );
}
