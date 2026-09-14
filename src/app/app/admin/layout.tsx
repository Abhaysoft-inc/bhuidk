'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { name: 'Users & Roles', href: '/app/admin/users' },
    { name: 'Moderation Queue', href: '/app/admin/moderation' },
    { name: 'Platform Analytics', href: '/app/admin/analytics' },
    { name: 'API Keys', href: '/app/admin/api-keys' },
  ];

  return (
    <div className="flex-1 p-6 md:p-8 flex flex-col max-w-7xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-serif text-primary mb-1">System Administration</h1>
        <p className="text-sm text-mutedForeground">Manage platform configuration, access control, and integrations.</p>
      </div>

      <div className="border-b border-border mb-6 flex gap-6">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link 
              key={tab.href}
              href={tab.href}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 ${isActive ? 'border-primary text-primary' : 'border-transparent text-mutedForeground hover:text-foreground'}`}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>

      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
