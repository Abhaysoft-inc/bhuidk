'use client'

import React, { useState } from 'react';
import Link from 'next/link';

export default function RepositoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const documents = [
    { id: 1, title: 'Impact of SVAMITVA Scheme on Property Disputes in Haryana', author: 'National Institute of Rural Development', date: 'Oct 2025', type: 'Research Paper', match: '98%' },
    { id: 2, title: 'Digitization of Land Records: The Karnataka Model', author: 'Dept. of Land Resources', date: 'Aug 2024', type: 'Case Study', match: '85%' },
    { id: 3, title: 'Guidelines for Urban FSI Modifications', author: 'Ministry of Housing and Urban Affairs', date: 'Jan 2026', type: 'Policy Directive', match: '72%' },
    { id: 4, title: 'Agricultural Land Conversion Rates in Maharashtra 2020-2025', author: 'Center for Policy Research', date: 'Dec 2025', type: 'Data Report', match: '65%' },
  ];

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-serif text-primary">Research & Policy Repository</h1>
          <p className="text-mutedForeground max-w-2xl text-balance">
            Search across thousands of land governance policies, research papers, and digitized legal precedents.
          </p>
        </div>
        <div className="w-full md:w-auto relative">
          <input 
            type="text" 
            placeholder="Semantic Search (e.g. 'How does SVAMITVA affect...')" 
            className="w-full md:w-96 pl-4 pr-10 py-2.5 rounded-sm border border-border bg-white focus:outline-none focus:border-accent shadow-sm text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-accent transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 flex flex-col gap-6 flex-shrink-0">
          <div className="flex flex-col gap-3">
            <h3 className="font-serif font-semibold text-primary border-b border-border pb-2">Document Type</h3>
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input type="checkbox" className="rounded-sm border-border text-accent focus:ring-accent" defaultChecked />
              Policy Directives
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input type="checkbox" className="rounded-sm border-border text-accent focus:ring-accent" defaultChecked />
              Research Papers
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input type="checkbox" className="rounded-sm border-border text-accent focus:ring-accent" defaultChecked />
              Case Studies
            </label>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-serif font-semibold text-primary border-b border-border pb-2">State / Region</h3>
            <select className="w-full border border-border rounded-sm py-2 px-3 text-sm bg-white focus:outline-none focus:border-accent">
              <option>All States</option>
              <option>Maharashtra</option>
              <option>Karnataka</option>
              <option>Haryana</option>
              <option>Uttar Pradesh</option>
            </select>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-serif font-semibold text-primary border-b border-border pb-2">Publication Year</h3>
            <select className="w-full border border-border rounded-sm py-2 px-3 text-sm bg-white focus:outline-none focus:border-accent">
              <option>All Years</option>
              <option>2026</option>
              <option>2025</option>
              <option>2024</option>
            </select>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex justify-between items-center text-sm text-mutedForeground mb-2">
            <span>Showing {documents.length} results</span>
            <div className="flex items-center gap-2">
              Sort by: 
              <select className="bg-transparent font-medium text-foreground focus:outline-none cursor-pointer">
                <option>Semantic Match</option>
                <option>Newest First</option>
                <option>Most Cited</option>
              </select>
            </div>
          </div>

          {documents.map((doc) => (
            <Link href={`/repository/${doc.id}`} key={doc.id} className="bg-white border border-border rounded-md p-5 shadow-card hover:border-accent transition-colors flex flex-col gap-3 group">
              <div className="flex justify-between items-start gap-4">
                <h2 className="text-lg font-serif font-medium text-primary group-hover:text-accent transition-colors">{doc.title}</h2>
                <span className="text-xs font-semibold px-2 py-1 bg-success/10 text-success rounded-sm whitespace-nowrap">
                  {doc.match} Match
                </span>
              </div>
              <p className="text-sm text-mutedForeground">
                <span className="font-medium text-foreground">{doc.author}</span> • {doc.date}
              </p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-muted text-mutedForeground px-2 py-1 rounded-sm border border-border">
                  {doc.type}
                </span>
                <span className="text-xs bg-muted text-mutedForeground px-2 py-1 rounded-sm border border-border">
                  Land Records
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
