'use client'

import React from 'react';

export default function AuditTrailPage() {
  const logs = [
    { id: 'TX-9482A', action: 'Simulation Run: Zonal FSI', user: 'admin@gov.in', time: '2026-09-14 14:32:01 UTC', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
    { id: 'TX-9481A', action: 'Policy Draft Published: Forest Clearances', user: 'jd.planning@mah.gov.in', time: '2026-09-13 09:12:44 UTC', hash: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92' },
    { id: 'TX-9480A', action: 'AI Metadata Auto-Tagging: SVAMITVA Update', user: 'system', time: '2026-09-12 18:45:00 UTC', hash: '3a7bd3e2360a3d29eea436fcfb7e44c735d117c42d1c1835420b6b9942dd4f1b' },
  ];

  return (
    <div className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-end border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-serif text-primary">Immutable Audit Trail</h1>
          <p className="text-sm text-mutedForeground mt-1">Hash-chained cryptographic logs of all platform decisions and simulations.</p>
        </div>
        <button className="px-4 py-2 border border-border bg-white text-sm font-medium rounded-sm shadow-sm flex items-center gap-2 hover:bg-muted transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          Export CSV Log
        </button>
      </div>

      <div className="bg-white border border-border rounded-md shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider text-mutedForeground font-semibold">
            <tr>
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">Timestamp (UTC)</th>
              <th className="px-6 py-4">Action / Event</th>
              <th className="px-6 py-4">Initiator</th>
              <th className="px-6 py-4">Verification Hash (SHA-256)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {logs.map(log => (
              <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-primary">{log.id}</td>
                <td className="px-6 py-4 text-mutedForeground">{log.time}</td>
                <td className="px-6 py-4 font-medium text-foreground">{log.action}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase ${log.user === 'system' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'}`}>
                    {log.user}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="truncate w-32 font-mono text-[10px] text-mutedForeground">{log.hash}</div>
                    <button className="text-primary hover:text-accent"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="bg-success/5 border border-success/20 p-4 rounded-md flex gap-3 mt-2">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <div>
          <h4 className="text-sm font-bold text-success">Blockchain Integrity Verified</h4>
          <p className="text-xs text-mutedForeground mt-0.5">All local ledger hashes match the remote NIC MeghRaj consortium ledger.</p>
        </div>
      </div>
    </div>
  );
}
