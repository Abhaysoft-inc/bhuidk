'use client'

import React from 'react';

export default function AdminApiKeysPage() {
  const keys = [
    { name: 'DILRMP Sync Node A', key: 'sk_live_dilrmp_****************a3f', created: '2026-01-10', lastUsed: '10 mins ago' },
    { name: 'SVAMITVA Readonly', key: 'sk_live_svamitva_****************b42', created: '2026-03-22', lastUsed: '5 hrs ago' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-serif text-primary">API Integrations</h2>
        <button className="px-4 py-2 bg-primary text-background text-sm font-medium rounded-sm shadow-sm hover:bg-primary-light transition-colors">
          Generate New Key
        </button>
      </div>

      <div className="bg-white border border-border rounded-md shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider text-mutedForeground font-semibold">
            <tr>
              <th className="px-6 py-4">Integration Name</th>
              <th className="px-6 py-4">Secret Key</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4">Last Used</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {keys.map((k, i) => (
              <tr key={i} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">{k.name}</td>
                <td className="px-6 py-4 font-mono text-xs text-mutedForeground">{k.key}</td>
                <td className="px-6 py-4 text-mutedForeground">{k.created}</td>
                <td className="px-6 py-4 text-mutedForeground">{k.lastUsed}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-xs text-danger font-medium hover:underline">Revoke</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
