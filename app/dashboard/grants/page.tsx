import { Lightbulb, Award } from "lucide-react";

export default function GrantsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Grants & Innovation</h1>
        <p className="text-xs text-slate-500 mt-0.5">Hackathons, research fellowships, and pilot project funding</p>
      </div>

      <div className="space-y-3">
        {[
          { id: "PS-01", title: "Automated OCR for Legacy Land Records (Urdu/Modi Script)", grant: "₹35 Lakhs", deadline: "31 Oct 2026" },
          { id: "PS-02", title: "Drone-to-Cadastre Auto-Boundary via Graph Neural Networks", grant: "₹50 Lakhs", deadline: "15 Nov 2026" },
          { id: "PS-03", title: "Pre-Litigation Dispute Prediction from Succession Genealogy", grant: "₹40 Lakhs", deadline: "30 Nov 2026" },
        ].map((c) => (
          <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm transition-shadow flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold bg-[#0b2b50] text-white px-1.5 py-0.5 rounded">{c.id}</span>
                  <span className="text-[10px] text-emerald-700 font-bold">{c.grant}</span>
                  <span className="text-[10px] text-slate-400">Deadline: {c.deadline}</span>
                </div>
                <div className="text-xs font-bold text-slate-800 mt-1">{c.title}</div>
              </div>
            </div>
            <button type="button" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-[11px] cursor-pointer transition-colors shrink-0">
              Apply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
