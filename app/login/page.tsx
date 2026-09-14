"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, Mail, ArrowRight, ArrowLeft, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Logging in with: ${email}`);
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
        <div className="w-full max-w-md space-y-8">
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
                Sign in to your account
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                National Land Governance Platform
              </p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-slate-700 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@institution.edu.in"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2b50]/20 focus:border-[#0b2b50] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-semibold text-slate-700">
                  Password
                </label>
                <a href="#" className="text-[11px] text-[#0b2b50] font-semibold hover:underline">
                  Forgot password?
                </a>
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
              Sign In
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-[11px] text-slate-400 font-medium">or continue with</span>
              </div>
            </div>

            {/* Jan Parichay SSO */}
            <button
              type="button"
              onClick={() => alert("Redirecting to Jan Parichay (National SSO)...")}
              className="w-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-semibold py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              Sign in with Jan Parichay (National SSO)
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-xs text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#0b2b50] font-bold hover:underline">
              Create account
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
