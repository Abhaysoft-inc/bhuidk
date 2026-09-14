'use client'

import React, { useState } from 'react';

export default function ApiDocsPage() {
  const [activeEndpoint, setActiveEndpoint] = useState(0);

  const endpoints = [
    { 
      method: 'GET', 
      path: '/v1/parcels/{id}', 
      desc: 'Retrieve unified land parcel data including DILRMP and SVAMITVA records.',
      response: '{\n  "parcel_id": "PN-492-B",\n  "owner": "State Government",\n  "zoning": "Transit Corridor",\n  "area_sqm": 4500,\n  "disputed": false\n}'
    },
    { 
      method: 'POST', 
      path: '/v1/simulations/run', 
      desc: 'Trigger a new policy impact simulation on the Digital Twin.',
      response: '{\n  "job_id": "sim_9482A",\n  "status": "processing",\n  "eta_seconds": 120\n}'
    },
    { 
      method: 'GET', 
      path: '/v1/audits/{transaction_id}', 
      desc: 'Fetch the cryptographic proof for a specific platform action.',
      response: '{\n  "transaction_id": "TX-9482A",\n  "hash": "e3b0c442...",\n  "verified": true\n}'
    }
  ];

  return (
    <div className="flex-1 flex h-[calc(100vh-4rem)] bg-white overflow-hidden">
      {/* Sidebar navigation for APIs */}
      <div className="w-64 border-r border-border bg-muted/30 p-6 flex flex-col gap-4 overflow-y-auto shrink-0">
        <h2 className="font-serif font-semibold text-primary">API Reference</h2>
        <div className="text-xs text-mutedForeground">v1.2.0 (MeghRaj Compliant)</div>
        
        <div className="flex flex-col gap-1 mt-4">
          {endpoints.map((ep, idx) => (
            <button 
              key={idx} 
              onClick={() => setActiveEndpoint(idx)}
              className={`text-left px-3 py-2 rounded-sm text-xs font-mono transition-colors ${activeEndpoint === idx ? 'bg-primary text-background' : 'hover:bg-muted text-foreground'}`}
            >
              <span className={`mr-2 font-bold ${activeEndpoint === idx ? 'text-accent' : (ep.method === 'GET' ? 'text-success' : 'text-accent')}`}>{ep.method}</span>
              {ep.path.split('/').pop()}
            </button>
          ))}
        </div>
      </div>

      {/* Main Documentation Area */}
      <div className="flex-1 overflow-y-auto p-8 lg:p-12">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <header>
            <h1 className="text-3xl font-serif text-primary">BhoomiIntel API</h1>
            <p className="text-sm text-foreground mt-2 leading-relaxed">
              Integrate directly with the BhoomiIntel unified data lake. All API requests require a valid Bearer token passed in the <code className="bg-muted px-1 rounded-sm">Authorization</code> header.
            </p>
          </header>

          <div className="border-t border-border pt-8 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-sm text-xs font-bold font-mono ${endpoints[activeEndpoint].method === 'GET' ? 'bg-success/10 text-success' : 'bg-accent/10 text-accent'}`}>
                {endpoints[activeEndpoint].method}
              </span>
              <span className="font-mono text-lg text-foreground">{endpoints[activeEndpoint].path}</span>
            </div>
            
            <p className="text-sm text-mutedForeground">
              {endpoints[activeEndpoint].desc}
            </p>

            <div>
              <h3 className="text-sm font-bold text-foreground mb-3">Example Request</h3>
              <div className="bg-[#0F182B] rounded-md p-4 overflow-x-auto">
                <pre className="text-xs font-mono text-[#E2DCD0]">
                  <code>
                    curl -X {endpoints[activeEndpoint].method} https://api.bhoomiintel.gov.in{endpoints[activeEndpoint].path.replace('{id}', 'PN-492-B').replace('{transaction_id}', 'TX-9482A')} \<br/>
                    &nbsp;&nbsp;-H "Authorization: Bearer sk_live_..."
                  </code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-foreground mb-3">Response</h3>
              <div className="bg-[#0F182B] rounded-md p-4 overflow-x-auto">
                <pre className="text-xs font-mono text-success">
                  <code>
                    {endpoints[activeEndpoint].response}
                  </code>
                </pre>
              </div>
            </div>
            
            <button className="self-start px-6 py-2 bg-primary text-background text-sm font-medium rounded-sm shadow-sm hover:bg-primary-light transition-colors mt-4">
              Test Endpoint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
