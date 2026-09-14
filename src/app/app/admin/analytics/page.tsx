'use client'

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminAnalyticsPage() {
  const apiUsageData = [
    { name: 'NIC MeghRaj', requests: 45000 },
    { name: 'SVAMITVA', requests: 32000 },
    { name: 'DILRMP Node', requests: 89000 },
    { name: 'Public API', requests: 12000 },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-serif text-primary">Platform Usage Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-border p-4 rounded-md shadow-sm">
          <span className="text-xs font-semibold text-mutedForeground tracking-wider uppercase mb-1 block">Active Users</span>
          <div className="text-2xl font-serif font-bold text-primary">12,450</div>
        </div>
        <div className="bg-white border border-border p-4 rounded-md shadow-sm">
          <span className="text-xs font-semibold text-mutedForeground tracking-wider uppercase mb-1 block">Total Simulations Run</span>
          <div className="text-2xl font-serif font-bold text-primary">843</div>
        </div>
        <div className="bg-white border border-border p-4 rounded-md shadow-sm">
          <span className="text-xs font-semibold text-mutedForeground tracking-wider uppercase mb-1 block">Storage Used</span>
          <div className="text-2xl font-serif font-bold text-primary">4.2 TB</div>
        </div>
      </div>

      <div className="bg-white border border-border p-6 rounded-md shadow-sm mt-4">
        <h3 className="text-sm font-bold text-foreground mb-4">API Request Volume (Last 30 Days)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={apiUsageData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
              <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '4px', border: '1px solid #E2DCD0' }} />
              <Bar dataKey="requests" fill="#1B2A4A" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
