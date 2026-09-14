import { Users, PlusCircle, Clock } from "lucide-react";

export default function WorkspacesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Workspaces</h1>
          <p className="text-xs text-slate-500 mt-0.5">Collaborative research rooms for cross-institutional projects</p>
        </div>
        <button type="button" className="flex items-center gap-1.5 bg-[#0b2b50] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#164275] cursor-pointer transition-colors">
          <PlusCircle className="w-3.5 h-3.5" /> New Workspace
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { name: "Pune Cadastral Resurvey", members: 8, updated: "2h ago", status: "Active" },
          { name: "Model Tenancy Framework", members: 12, updated: "Yesterday", status: "Active" },
          { name: "Desertification Vulnerability Atlas", members: 6, updated: "4 days ago", status: "Active" },
          { name: "NE India Land Rights Study", members: 4, updated: "1 week ago", status: "Draft" },
        ].map((ws, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ws.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                {ws.status}
              </span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{ws.updated}</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">{ws.name}</h3>
            <div className="flex items-center justify-between mt-3">
              <span className="text-[11px] text-slate-500 flex items-center gap-1"><Users className="w-3 h-3" />{ws.members} members</span>
              <button type="button" className="text-[11px] font-semibold text-[#0b2b50] hover:underline cursor-pointer">Open →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
