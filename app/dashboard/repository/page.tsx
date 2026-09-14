import { Database, Search, Filter } from "lucide-react";

export default function RepositoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Digital Repository</h1>
        <p className="text-xs text-slate-500 mt-0.5">Browse 14,250+ research papers, policy documents, and datasets</p>
      </div>

      {/* Search + Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search papers, datasets, legal frameworks..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0b2b50]/20"
          />
        </div>
        <button type="button" className="flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-200 cursor-pointer">
          <Filter className="w-3.5 h-3.5" /> Filters
        </button>
      </div>

      {/* Placeholder list */}
      <div className="space-y-3">
        {[
          { title: "Socio-Economic Impact of ULPIN on Agricultural Credit Flow", type: "Research Paper", year: 2026 },
          { title: "SOP for Drone-Based Cadastral Resurvey under SVAMITVA", type: "Policy Document", year: 2025 },
          { title: "National Land Dispute Precedent Database: ML Analysis", type: "Research Paper", year: 2026 },
          { title: "Urban-Rural Fringe Land Conversion Satellite Assessment", type: "Geospatial Dataset", year: 2026 },
          { title: "Model Land Leasing Act: Comparative Assessment MP & Odisha", type: "Case Study", year: 2025 },
        ].map((doc, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-shadow flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">{doc.title}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{doc.type} • {doc.year}</div>
              </div>
            </div>
            <button type="button" className="text-[11px] font-semibold text-[#0b2b50] hover:underline cursor-pointer shrink-0">View</button>
          </div>
        ))}
      </div>
    </div>
  );
}
