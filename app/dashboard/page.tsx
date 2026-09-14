import {
  FileText,
  MapPin,
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  ArrowUpRight,
  Database,
  Sparkles,
} from "lucide-react";

export default function DashboardPage() {
  const stats = [
    { label: "Research Papers", value: "14,250", change: "+124 this month", icon: FileText, color: "text-blue-600 bg-blue-50" },
    { label: "Geospatial Datasets", value: "852", change: "+18 this month", icon: MapPin, color: "text-emerald-600 bg-emerald-50" },
    { label: "Active Workspaces", value: "1,240", change: "+56 this month", icon: Users, color: "text-indigo-600 bg-indigo-50" },
    { label: "Policy Simulations", value: "328", change: "+12 this month", icon: Sparkles, color: "text-amber-600 bg-amber-50" },
  ];

  const recentActivity = [
    { title: "ULPIN Bhu-Aadhaar Integration Study uploaded", time: "2 hours ago", type: "Paper" },
    { title: "Maharashtra cadastral resurvey dataset updated", time: "5 hours ago", type: "Dataset" },
    { title: "New policy simulation: Model Tenancy Act", time: "Yesterday", type: "Simulation" },
    { title: "Rajasthan climate vulnerability report published", time: "2 days ago", type: "Report" },
    { title: "Workspace WG-04: Pune corridor study reviewed", time: "3 days ago", type: "Workspace" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Dashboard
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Welcome back, Dr. Ashok Sharma
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-extrabold text-slate-900">{stat.value}</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900">Recent Activity</h2>
            <button type="button" className="text-[11px] font-semibold text-[#0b2b50] hover:underline cursor-pointer">
              View all
            </button>
          </div>
          <div className="space-y-1">
            {recentActivity.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                    <Database className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800">{item.title}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {item.time}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                  {item.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: "Search Repository", desc: "Browse papers & datasets", icon: Database },
              { label: "Run Simulation", desc: "Test a policy scenario", icon: Sparkles },
              { label: "Open GIS Viewer", desc: "Explore spatial layers", icon: MapPin },
              { label: "View Analytics", desc: "National dashboards", icon: BarChart3 },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  type="button"
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#0b2b50]/5 text-[#0b2b50] flex items-center justify-center group-hover:bg-[#0b2b50] group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{action.label}</div>
                      <div className="text-[10px] text-slate-500">{action.desc}</div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0b2b50] transition-colors shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
