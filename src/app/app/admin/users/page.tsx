'use client'

import React from 'react';

export default function AdminUsersPage() {
  const users = [
    { id: 1, name: 'Sanjay Kumar', role: 'District Magistrate', email: 'dm.pune@gov.in', status: 'Active' },
    { id: 2, name: 'Priya Sharma', role: 'Surveyor', email: 'p.sharma@survey.mah.gov.in', status: 'Pending Approval' },
    { id: 3, name: 'Admin Account', role: 'Super Admin', email: 'admin@gov.in', status: 'Active' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-serif text-primary">Role Management & Approvals</h2>
        <button className="px-4 py-2 bg-primary text-background text-sm font-medium rounded-sm shadow-sm hover:bg-primary-light transition-colors">
          Invite User
        </button>
      </div>

      <div className="bg-white border border-border rounded-md shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider text-mutedForeground font-semibold">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">{user.name}</td>
                <td className="px-6 py-4 text-mutedForeground">{user.email}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-muted rounded-sm text-xs font-medium">{user.role}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase ${user.status === 'Active' ? 'bg-success/10 text-success' : 'bg-accent/10 text-accent'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {user.status === 'Pending Approval' ? (
                    <div className="flex justify-end gap-2">
                      <button className="text-xs text-success font-medium hover:underline">Approve</button>
                      <button className="text-xs text-danger font-medium hover:underline">Deny</button>
                    </div>
                  ) : (
                    <button className="text-xs text-primary font-medium hover:underline">Edit</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
