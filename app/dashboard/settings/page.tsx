import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">Account preferences and platform configuration</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
        {[
          { label: "Profile Information", desc: "Name, email, organization, role" },
          { label: "Security", desc: "Password, two-factor authentication" },
          { label: "Notifications", desc: "Email alerts, platform updates" },
          { label: "API Access", desc: "Manage API keys and tokens" },
          { label: "Data & Privacy", desc: "Download data, delete account" },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
            <div>
              <div className="text-xs font-bold text-slate-800">{item.label}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
            </div>
            <button type="button" className="text-[11px] font-semibold text-[#0b2b50] hover:underline cursor-pointer">Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
}
