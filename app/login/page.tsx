"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  ShieldCheck,
  UserCheck,
  Building2,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"admin" | "officer" | "researcher">(
    redirectParam?.includes("/users") ? "admin" : "officer"
  );
  const [loading, setLoading] = useState(false);

  const handleLogin = (
    selectedRole?: "admin" | "officer" | "researcher",
    demoEmail?: string
  ) => {
    const finalRole = selectedRole || role;
    const finalEmail =
      demoEmail ||
      email ||
      (finalRole === "admin"
        ? "admin@veda.gov.in"
        : finalRole === "officer"
          ? "officer.pune@veda.gov.in"
          : "ashok.sharma@niti.gov.in");

    setLoading(true);

    const userData = {
      name:
        finalRole === "admin"
          ? "Rajesh Kumar, IAS"
          : finalRole === "officer"
            ? "Suresh Patil (ADM Revenue)"
            : "Dr. Ashok Sharma",
      email: finalEmail,
      role: finalRole,
      department:
        finalRole === "admin"
          ? "Department of Land Resources (DoLR), MoRD"
          : finalRole === "officer"
            ? "District Revenue Collectorate, Pune"
            : "Centre for Land Governance Research",
      designation:
        finalRole === "admin"
          ? "Central Platform Administrator"
          : finalRole === "officer"
            ? "Additional District Magistrate"
            : "Senior Policy Fellow",
      avatarInitials:
        finalRole === "admin" ? "RK" : finalRole === "officer" ? "SP" : "AS",
      lastLogin: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("veda_user", JSON.stringify(userData));
      window.dispatchEvent(new Event("veda_user_updated"));
    }

    setTimeout(() => {
      setLoading(false);

      // Check destination with RBAC enforcement
      let destination = "/dashboard";
      if (redirectParam && redirectParam.startsWith("/")) {
        if (redirectParam.startsWith("/dashboard/users")) {
          destination = finalRole === "admin" ? "/dashboard/users" : "/dashboard";
        } else {
          destination = redirectParam;
        }
      } else {
        destination = finalRole === "admin" ? "/dashboard/users" : "/dashboard";
      }

      router.push(destination);
    }, 350);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  const isAdminRequired = redirectParam?.includes("/users");

  return (
    <div className="w-full max-w-md space-y-6">
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
            Sign in to your account
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            National Digital Platform for Land Governance &amp; Geospatial Intelligence
          </p>
        </div>
      </div>



      {/* 1-Click Quick Demo Login by Role (For Testing & Verification) */}
      {/* <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
          <span>Quick Demo Login by Role</span>
          <span className="text-[10px] text-[#4A2BC2] font-semibold">1-Click Immediate Access</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleLogin("admin", "admin@veda.gov.in")}
            className="p-2.5 rounded-lg border border-[#eae4ff] bg-[#f4f0ff]/80 hover:bg-[#f4f0ff] hover:border-[#4A2BC2] text-center transition-all group cursor-pointer shadow-2xs"
          >
            <KeyRound className="w-4 h-4 mx-auto text-[#4A2BC2] group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-slate-900 mt-1">Admin</div>
            <div className="text-[10px] text-[#4A2BC2] font-semibold">Full Access (RBAC)</div>
          </button>

          <button
            type="button"
            onClick={() => handleLogin("officer", "officer.pune@veda.gov.in")}
            className="p-2.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-center transition-all group cursor-pointer shadow-2xs"
          >
            <Building2 className="w-4 h-4 mx-auto text-slate-700 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-slate-900 mt-1">Officer</div>
            <div className="text-[10px] text-slate-500">Revenue Dept</div>
          </button>

          <button
            type="button"
            onClick={() => handleLogin("researcher", "ashok.sharma@niti.gov.in")}
            className="p-2.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-center transition-all group cursor-pointer shadow-2xs"
          >
            <GraduationCap className="w-4 h-4 mx-auto text-slate-700 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-slate-900 mt-1">Researcher</div>
            <div className="text-[10px] text-slate-500">Policy / GIS</div>
          </button>
        </div>
      </div> */}

      {/* Regular Login Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-4"
      >
        {/* Role Radio Pills */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 block">
            Select Your Role
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setRole("admin");
                if (!email) setEmail("admin@veda.gov.in");
              }}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${role === "admin"
                ? "bg-[#4A2BC2] text-white border-[#4A2BC2]"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => {
                setRole("officer");
                if (!email) setEmail("officer.pune@veda.gov.in");
              }}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${role === "officer"
                ? "bg-[#4A2BC2] text-white border-[#4A2BC2]"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
            >
              Officer
            </button>
            <button
              type="button"
              onClick={() => {
                setRole("researcher");
                if (!email) setEmail("ashok.sharma@niti.gov.in");
              }}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${role === "researcher"
                ? "bg-[#4A2BC2] text-white border-[#4A2BC2]"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
            >
              Researcher
            </button>
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-semibold text-slate-700 block">
            Official Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={
                role === "admin"
                  ? "admin@veda.gov.in"
                  : role === "officer"
                    ? "officer.pune@veda.gov.in"
                    : "ashok.sharma@niti.gov.in"
              }
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A2BC2]/20 focus:border-[#4A2BC2] transition-colors"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-xs font-semibold text-slate-700">
              Password
            </label>
            <span className="text-[11px] text-[#4A2BC2] font-semibold cursor-pointer hover:underline">
              Demo: Any password
            </span>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A2BC2]/20 focus:border-[#4A2BC2] transition-colors"
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#4A2BC2] hover:bg-[#3C1FA4] text-white py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-all shadow-md shadow-[#4A2BC2]/20 cursor-pointer disabled:opacity-70"
        >
          {loading ? (
            <span>Authenticating...</span>
          ) : (
            <>
              <span>Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Government SSO Banner */}
        <div className="pt-2">
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-slate-200" />
            <span className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
              Or Sign In With
            </span>
            <div className="flex-1 border-t border-slate-200" />
          </div>

          <button
            type="button"
            onClick={() => handleLogin("officer", "meri.pehchaan@gov.in")}
            className="w-full flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 py-2.5 rounded-lg text-xs font-bold text-slate-700 transition-colors shadow-2xs cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Jan Parichay / MeriPehchaan (National SSO)</span>
          </button>
        </div>
      </form>

      {/* Footer note */}
      <div className="text-center text-xs text-slate-500">
        Don&apos;t have an account yet?{" "}
        <Link href="/signup" className="font-bold text-[#4A2BC2] hover:underline">
          Create an account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-slate-900 selection:bg-[#eae4ff] selection:text-[#4A2BC2]">

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Suspense
          fallback={
            <div className="p-8 text-center text-sm font-semibold text-slate-500">
              Loading VEDA Authentication Portal...
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
