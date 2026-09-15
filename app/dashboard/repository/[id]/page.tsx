import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Share2,
  BookmarkPlus,
  Calendar,
  MapPin,
  Building,
  FileText,
  Sparkles,
  Quote,
  Eye,
  TrendingUp,
  FileBadge,
} from "lucide-react";

export default function DocumentDetailPage() {
  return (
    <div className="space-y-6 pb-12">
      {/* Back Button */}
      <div>
        <Link
          href="/dashboard/repository"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0b2b50] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Repository
        </Link>
      </div>

      {/* Main Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
          <div className="space-y-4 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border bg-blue-50 text-blue-700 border-blue-200">
                Research Paper
              </span>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
                <FileBadge className="w-3 h-3" /> Peer Reviewed
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
              Socio-Economic Impact of ULPIN on Agricultural Credit Flow
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
              <div className="flex items-center gap-1.5">
                <Building className="w-4 h-4 text-slate-400" />
                National Council of Applied Economic Research
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                Published: March 2026
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                Maharashtra, India
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {["Credit", "ULPIN", "Agriculture", "Rural Economy"].map(tag => (
                <span key={tag} className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row md:flex-col gap-3 shrink-0">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0b2b50] text-white text-sm font-bold rounded-lg hover:bg-[#154278] transition-colors shadow-sm shadow-[#0b2b50]/20">
              <Download className="w-4 h-4" /> Download PDF
            </button>
            <div className="flex gap-3">
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors">
                <Quote className="w-4 h-4 text-slate-400" /> Cite
              </button>
              <button className="p-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                <Share2 className="w-4 h-4 text-slate-400" />
              </button>
              <button className="p-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                <BookmarkPlus className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Summary Panel */}
          <div className="relative bg-gradient-to-br from-amber-50 via-white to-orange-50 rounded-2xl border border-amber-200 p-6 overflow-hidden">
            <div className="absolute -top-10 -right-10 opacity-20 pointer-events-none">
              <Sparkles className="w-48 h-48 text-amber-500" />
            </div>
            
            <div className="relative z-10 space-y-5">
              <div className="flex items-center gap-2 text-amber-700">
                <Sparkles className="w-5 h-5" />
                <h2 className="text-sm font-extrabold tracking-wide uppercase">AI-Generated Executive Summary</h2>
              </div>

              <div className="space-y-4">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-amber-100">
                  <h3 className="text-xs font-bold text-slate-800 mb-2">Core Insight</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    The implementation of ULPIN in Maharashtra has reduced the average time for agricultural credit approval from 42 days to 14 days, driving a 15% increase in formal credit uptake among marginal farmers.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-amber-100">
                    <h3 className="text-xs font-bold text-slate-800 mb-2">Methodology</h3>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Difference-in-differences (DiD) approach across 12 districts, comparing ULPIN-integrated tehsils with control groups over a 24-month period using bank disbursement data.
                    </p>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-amber-100">
                    <h3 className="text-xs font-bold text-slate-800 mb-2">Policy Recommendations</h3>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Integration of ULPIN API directly with NABARD portals and subsidizing mobile-based KYC for tenant farmers to further reduce friction.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Classic Academic Abstract Area */}
          <div className="bg-[#fdfbf7] rounded-sm border border-[#e5e0d8] p-8 md:p-12 shadow-[inset_0_0_40px_rgba(0,0,0,0.02)] relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#0b2b50]/20 to-transparent"></div>
            
            <h2 className="text-2xl font-serif font-bold text-[#2b2b2b] mb-6 text-center tracking-wide uppercase border-b border-[#e5e0d8] pb-4">
              Abstract
            </h2>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-[#3f3a36] font-serif text-lg leading-loose text-justify first-letter:text-6xl first-letter:font-bold first-letter:text-[#0b2b50] first-letter:float-left first-letter:mr-3 first-letter:-mt-2">
                Land titling security is a critical prerequisite for agricultural credit access. This paper evaluates the socio-economic impacts of the Unique Land Parcel Identification Number (ULPIN) rollout in Maharashtra, India. By linking cadastral records directly to the banking infrastructure, ULPIN aims to mitigate title disputes and expedite collateral valuation. Using administrative data from 4 major public sector banks and a survey of 1,200 farming households, we find that ULPIN integration significantly reduces bureaucratic friction. The results suggest that digital land registries are highly effective in crowding-in formal credit, particularly benefiting smallholder farmers who previously relied on informal, high-interest lending channels.
              </p>
              
              <p className="text-[#3f3a36] font-serif text-lg leading-loose text-justify mt-6">
                Furthermore, the analysis reveals secondary benefits in dispute resolution efficiency, noting a 22% reduction in pending litigation related to plot boundaries in the surveyed tehsils. These findings underscore the necessity of interoperable digital public infrastructure in accelerating rural economic empowerment.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Metrics Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Impact Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <Eye className="w-4 h-4 text-slate-400" /> Views
                </div>
                <div className="text-sm font-bold text-slate-900">12,450</div>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <Download className="w-4 h-4 text-slate-400" /> Downloads
                </div>
                <div className="text-sm font-bold text-slate-900">3,892</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <TrendingUp className="w-4 h-4 text-slate-400" /> Citations
                </div>
                <div className="text-sm font-bold text-emerald-600">45</div>
              </div>
            </div>
          </div>

          {/* Related Research */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Related Research</h3>
            <div className="space-y-4">
              {[
                { title: "Credit Access Disparities in Tenant Farming: A Case Study of Odisha", type: "Case Study", year: 2025 },
                { title: "Digital India Land Records Modernization Programme: 10-Year Review", type: "Policy Document", year: 2024 },
                { title: "Blockchain for Land Registries: Feasibility in Karnataka", type: "Research Paper", year: 2026 },
              ].map((item, i) => (
                <div key={i} className="group cursor-pointer">
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-[#0b2b50] group-hover:underline line-clamp-2 leading-snug">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] font-semibold text-slate-500">
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded">{item.type}</span>
                    <span>{item.year}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-5 py-2 text-xs font-bold text-[#0b2b50] border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              View More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
