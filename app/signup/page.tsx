"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Compass,
} from "lucide-react";

const roles = [
  {
    id: "admin",
    label: "Platform Admin",
    desc: "Central & State super-administrators, user management",
    icon: KeyRound,
  },
  {
    id: "officer",
    label: "Government Officer",
    desc: "District Magistrates, ADMs, Tehsildars, Revenue Dept",
    icon: Building2,
  },
  {
    id: "researcher",
    label: "Policy Researcher",
    desc: "Academic scholars, think tanks, NITI Aayog analysts",
    icon: GraduationCap,
  },
  {
    id: "surveyor",
    label: "GIS / Survey Specialist",
    desc: "SVAMITVA drone pilots, cadastral cartographers",
    icon: Compass,
  },
  {
    id: "public",
    label: "Citizen / Landowner",
    desc: "General public, land title verifiers, applicants",
    icon: Globe,
  },
];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<string>("officer");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [designation, setDesignation] = useState("");
  const [stateName, setStateName] = useState("Maharashtra");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const initials = name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "VD";

    const userData = {
      name: name || "New User",
      email: email || "user@veda.gov.in",
      role: selectedRole,
      department: org || "Revenue Administration",
      designation: designation || (selectedRole === "admin" ? "Platform Administrator" : "Officer"),
      stateName: stateName,
      avatarInitials: initials,
      lastLogin: "Just now",
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("veda_user", JSON.stringify(userData));
      window.dispatchEvent(new Event("veda_user_updated"));

      // Append to registered users list in localStorage
      try {
        const storedUsers = JSON.parse(localStorage.getItem("veda_registered_users") || "[]");
        storedUsers.push({
          id: Date.now(),
          ...userData,
          status: selectedRole === "admin" ? "Active" : "Active",
          dateAdded: new Date().toLocaleDateString(),
        });
        localStorage.setItem("veda_registered_users", JSON.stringify(storedUsers));
      } catch (err) {
        console.error("Failed to update user list", err);
      }
    }

    setTimeout(() => {
      setLoading(false);
      if (selectedRole === "admin") {
        router.push("/dashboard/users");
      } else {
        router.push("/dashboard");
      }
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-slate-900 selection:bg-[#eae4ff] selection:text-[#4A2BC2]">

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl space-y-6">
          {/* Back button */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#4A2BC2] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to VEDA Home
          </Link>

          {/* Header */}
          <div className="text-center space-y-2">
            <Link href="/" className="inline-block group">
              <img
                src="/logo.svg"
                alt="VEDA Symbol"
                className="w-14 h-14 rounded-2xl mx-auto shadow-sm group-hover:scale-105 transition-transform"
              />
            </Link>
            <div>
              <div className="text-[10px] font-bold text-[#4A2BC2] uppercase tracking-widest bg-[#f4f0ff] inline-block px-2.5 py-0.5 rounded-full border border-[#eae4ff]">
                GOVERNMENT OF INDIA • VEDA PORTAL
              </div>
              <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight mt-2">
                Create your VEDA account
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                National Digital Platform for Land Governance &amp; Geospatial Intelligence
              </p>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
                step === 1
                  ? "bg-[#4A2BC2] text-white shadow-xs"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }`}
            >
              <span>1. Choose Role</span>
            </button>
            <div className="w-6 h-0.5 bg-slate-300" />
            <button
              type="button"
              onClick={() => setStep(2)}
              className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
                step === 2
                  ? "bg-[#4A2BC2] text-white shadow-xs"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }`}
            >
              <span>2. Profile Details</span>
            </button>
          </div>

          {/* Step 1: Role Selection */}
          {step === 1 && (
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-800">
                Select your primary role in the land governance ecosystem:
              </h2>

              <div className="grid grid-cols-1 gap-2.5">
                {roles.map((r) => {
                  const Icon = r.icon;
                  const isSelected = selectedRole === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRole(r.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                        isSelected
                          ? "border-[#4A2BC2] bg-[#f4f0ff]/70 shadow-xs ring-2 ring-[#4A2BC2]/20"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "bg-[#4A2BC2] text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{r.label}</div>
                          <div className="text-xs text-slate-500">{r.desc}</div>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                          isSelected
                            ? "border-[#4A2BC2] bg-[#4A2BC2] text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-[#4A2BC2] hover:bg-[#3C1FA4] text-white py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-all shadow-md shadow-[#4A2BC2]/20"
              >
                <span>Continue to Profile Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2: Form Details */}
          {step === 2 && (
            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-500">
                  Role: <strong className="text-[#4A2BC2] uppercase">{selectedRole}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-[#4A2BC2] font-bold hover:underline"
                >
                  Change Role
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
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
                      placeholder="e.g. Suresh Patil, IAS"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A2BC2]/20 focus:border-[#4A2BC2]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="email" className="text-xs font-semibold text-slate-700 block">
                    Official Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="officer@nic.in"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A2BC2]/20 focus:border-[#4A2BC2]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="org" className="text-xs font-semibold text-slate-700 block">
                    Department / Institution
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="org"
                      type="text"
                      required
                      value={org}
                      onChange={(e) => setOrg(e.target.value)}
                      placeholder="e.g. Revenue Department, Pune"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A2BC2]/20 focus:border-[#4A2BC2]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="designation" className="text-xs font-semibold text-slate-700 block">
                    Designation
                  </label>
                  <input
                    id="designation"
                    type="text"
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Tehsildar / ADM"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A2BC2]/20 focus:border-[#4A2BC2]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="state" className="text-xs font-semibold text-slate-700 block">
                  Assigned State / UT
                </label>
                <select
                  id="state"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A2BC2]/20 focus:border-[#4A2BC2]"
                >
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Central (MoRD / DoLR)">Central (MoRD / DoLR)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="text-xs font-semibold text-slate-700 block">
                  Set Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A2BC2]/20 focus:border-[#4A2BC2]"
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
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#4A2BC2] hover:bg-[#3C1FA4] text-white py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-all shadow-md shadow-[#4A2BC2]/20 cursor-pointer disabled:opacity-70 mt-2"
              >
                {loading ? (
                  <span>Registering...</span>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer note */}
          <div className="text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-[#4A2BC2] hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
