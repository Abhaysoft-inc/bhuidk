"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  CheckCircle,
  RotateCcw,
  MoreHorizontal,
  ArrowUpDown,
} from "lucide-react";

// ─── Mock Data ───────────────────────────────────────────────
const lineData = [
  { month: "Jan", offline: 18, online: 22 },
  { month: "Feb", offline: 25, online: 30 },
  { month: "Mar", offline: 40, online: 68 },
  { month: "Apr", offline: 35, online: 50 },
  { month: "May", offline: 45, online: 55 },
  { month: "Jun", offline: 52, online: 60 },
  { month: "Jul", offline: 48, online: 65 },
];

const donutData = [
  { name: "Offline", value: 40, color: "#1e293b" },
  { name: "Online",  value: 35, color: "#f97316" },
  { name: "Trade",   value: 25, color: "#e2e8f0" },
];

const orderList = [
  { id: "#12594", date: "Mar 15, 2026", name: "Maharashtra Revenue Dept", location: "Mumbai, MH", amount: "₹2,40,000", status: "Completed" },
  { id: "#12595", date: "Mar 18, 2026", name: "DoLR Research Division",  location: "New Delhi",  amount: "₹1,80,500", status: "In Progress" },
  { id: "#12596", date: "Apr 02, 2026", name: "Karnataka DPAR",          location: "Bengaluru, KA", amount: "₹3,10,200", status: "New Order"  },
  { id: "#12597", date: "Apr 10, 2026", name: "NALSAR University",       location: "Hyderabad, TS", amount: "₹95,000",  status: "Completed" },
  { id: "#12598", date: "Apr 22, 2026", name: "NITI Aayog",              location: "New Delhi",  amount: "₹4,20,750", status: "In Progress" },
];

const statusStyle: Record<string, string> = {
  "Completed":   "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "In Progress": "bg-amber-50   text-amber-700   border border-amber-200",
  "New Order":   "bg-blue-50    text-blue-700    border border-blue-200",
};

const statusDot: Record<string, string> = {
  "Completed":   "bg-emerald-500",
  "In Progress": "bg-amber-500",
  "New Order":   "bg-blue-500",
};

const kpis = [
  {
    label:  "Research Papers",
    value:  "14,250",
    delta:  "+124",
    pct:    "+0.87%",
    up:     true,
    icon:   FileText,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
  },
  {
    label:  "Active Researchers",
    value:  "3,842",
    delta:  "+56",
    pct:    "+1.48%",
    up:     true,
    icon:   Users,
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-500",
  },
  {
    label:  "Policy Simulations",
    value:  "328",
    delta:  "-4",
    pct:    "-1.21%",
    up:     false,
    icon:   CheckCircle,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-500",
  },
  {
    label:  "Pending Reviews",
    value:  "1,094",
    delta:  "+72",
    pct:    "+6.58%",
    up:     true,
    icon:   RotateCcw,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-500",
  },
];

// ─── Custom Tooltip ───────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white shadow-2xl rounded-2xl p-4 border border-slate-100 text-xs min-w-[140px]">
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex justify-between gap-6 items-center mb-1">
          <span className="font-semibold text-slate-600 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color }}></span>
            {p.name}
          </span>
          <span className="font-black text-slate-900">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────
export default function AnalyticsDashboard() {
  const [period, setPeriod] = useState("Monthly");

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show:   (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, type: "spring", stiffness: 260, damping: 22 } }),
  };

  return (
    <div className="space-y-6 pb-12">

      {/* ── Page Header ── */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">National Analytics</h1>
          <p className="text-sm text-slate-400 mt-0.5 font-medium">Land governance performance overview</p>
        </div>
        <div className="flex gap-2">
          {["Weekly", "Monthly", "Yearly"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                period === p
                  ? "bg-[#0b2b50] text-white shadow-md shadow-[#0b2b50]/20"
                  : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <motion.div
              key={k.label}
              custom={i}
              initial="hidden"
              animate="show"
              variants={fadeUp}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${k.iconBg}`}>
                  <Icon className={`w-4 h-4 ${k.iconColor}`} />
                </div>
                <span className={`flex items-center gap-1 text-[11px] font-bold ${k.up ? "text-emerald-600" : "text-rose-500"}`}>
                  {k.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {k.pct}
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">{k.value}</div>
              <div className="text-xs text-slate-400 font-semibold mt-1">{k.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 220, damping: 22 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-black text-slate-800">Research Activity Analytics</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Submissions vs Publications — Jan to Jul 2026</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <span className="w-3 h-3 rounded-full bg-[#0b2b50]"></span> Submissions
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <span className="w-3 h-3 rounded-full bg-orange-400"></span> Publications
              </div>
            </div>
          </div>

          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: 600 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: 600 }} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="offline"
                  name="Submissions"
                  stroke="#0b2b50"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#0b2b50", strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "#0b2b50", stroke: "#fff", strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="online"
                  name="Publications"
                  stroke="#f97316"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#f97316", strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "#f97316", stroke: "#fff", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Donut Chart */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 220, damping: 22 }}
          className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-black text-slate-800">Source Breakdown</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">By org type</p>
            </div>
            <button className="text-slate-400 hover:text-slate-700 transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative">
              <PieChart width={180} height={180}>
                <Pie data={donutData} innerRadius={58} outerRadius={84} paddingAngle={3} dataKey="value" startAngle={90} endAngle={450} strokeWidth={0}>
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-900">₹452</span>
                <span className="text-[10px] text-slate-400 font-bold mt-0.5">Avg Grant</span>
              </div>
            </div>

            <div className="w-full mt-4 space-y-3">
              {donutData.map((d) => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }}></span>
                    <span className="text-xs font-semibold text-slate-600">{d.name}</span>
                  </div>
                  <span className="text-xs font-black text-slate-800">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Order / Activity List ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 220, damping: 22 }}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-black text-slate-800">Recent Activity Log</h2>
          <button className="text-xs font-bold text-[#0b2b50] hover:underline cursor-pointer">View All</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                {["ID", "Date", "Organization", "Location", "Grant Amount", "Status", "Action"].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                    <span className="flex items-center gap-1">
                      {h}
                      {["ID", "Grant Amount", "Status"].includes(h) && <ArrowUpDown className="w-3 h-3" />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orderList.map((row, i) => (
                <tr key={row.id} className={`border-b border-slate-50 hover:bg-slate-50/70 transition-colors ${i % 2 === 0 ? "" : "bg-slate-50/20"}`}>
                  <td className="px-6 py-3.5 font-bold text-slate-700 text-xs">{row.id}</td>
                  <td className="px-6 py-3.5 text-slate-500 text-xs font-medium">{row.date}</td>
                  <td className="px-6 py-3.5 font-semibold text-slate-800 text-xs">{row.name}</td>
                  <td className="px-6 py-3.5 text-slate-500 text-xs font-medium">{row.location}</td>
                  <td className="px-6 py-3.5 font-black text-slate-900 text-xs">{row.amount}</td>
                  <td className="px-6 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${statusStyle[row.status]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot[row.status]}`}></span>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <button className="text-slate-400 hover:text-slate-700 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
}
