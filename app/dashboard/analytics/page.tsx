import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Analytics</h1>
        <p className="text-xs text-slate-500 mt-0.5">National land governance dashboards and performance indicators</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mx-auto">
          <BarChart3 className="w-6 h-6" />
        </div>
        <h2 className="text-sm font-bold text-slate-800 mt-4">National Dashboards</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Interactive visualizations for dispute resolution rates, ULPIN coverage, SVAMITVA progress, and climate resilience metrics.</p>
        <button type="button" className="mt-4 bg-[#0b2b50] text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-[#164275] cursor-pointer transition-colors">
          Load Dashboards
        </button>
      </div>
    </div>
  );
}
