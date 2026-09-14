import { Sparkles } from "lucide-react";

export default function SimulatorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Policy Simulator</h1>
        <p className="text-xs text-slate-500 mt-0.5">AI-powered decision-support for land governance reforms</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-sm font-bold text-slate-800 mt-4">Policy Simulation Sandbox</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Select a policy intervention and adjust parameters to simulate projected outcomes on disputes, revenue, and turnaround time.</p>
        <button type="button" className="mt-4 bg-[#0b2b50] text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-[#164275] cursor-pointer transition-colors">
          Start New Simulation
        </button>
      </div>
    </div>
  );
}
