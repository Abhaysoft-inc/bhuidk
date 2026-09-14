'use client'

import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const radarData = [
  { subject: 'Urban FSI', A: 120, fullMark: 150 },
  { subject: 'Drone Surveys', A: 98, fullMark: 150 },
  { subject: 'Dispute Resolution', A: 86, fullMark: 150 },
  { subject: 'Ecological Zones', A: 99, fullMark: 150 },
  { subject: 'Tribal Land Rights', A: 45, fullMark: 150 },
  { subject: 'Agri-Commercial Conv.', A: 65, fullMark: 150 },
];

export default function CopilotPage() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello, I am the BhoomiIntel AI Copilot. How can I assist your policy research or land governance tasks today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: 'Based on the semantic search of the repository, the correlation between SVAMITVA implementation and dispute resolution shows a 12% decrease in active court cases in mapped regions within 18 months.' }]);
    }, 1000);
  };

  return (
    <div className="flex-1 flex h-[calc(100vh-4rem)]">
      {/* Left Chat UI */}
      <div className="flex-1 flex flex-col border-r border-border bg-background">
        <header className="px-6 py-4 border-b border-border bg-background/50 backdrop-blur-sm sticky top-0">
          <h2 className="text-xl font-serif text-primary">Research Copilot</h2>
          <p className="text-xs text-mutedForeground">Multilingual Context-Aware RAG Assistant</p>
        </header>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-sm flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-primary text-background' : 'bg-accent/20 text-accent border border-accent/30'}`}>
                {msg.role === 'user' ? 'U' : 'BI'}
              </div>
              <div className={`p-4 rounded-md shadow-sm text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary text-background' : 'bg-white border border-border text-foreground'}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-muted/50 border-t border-border">
          <form onSubmit={handleSend} className="relative flex items-center">
            <button type="button" className="absolute left-3 text-mutedForeground hover:text-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question or use voice input (Hindi / English)..." 
              className="w-full pl-10 pr-12 py-3 rounded-sm border border-border bg-white focus:outline-none focus:border-accent shadow-sm"
            />
            <button type="submit" className="absolute right-2 p-1.5 bg-accent hover:bg-accent-light text-primary rounded-sm transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </form>
        </div>
      </div>

      {/* Right Panels (Sources + Radar) */}
      <div className="w-[400px] bg-muted/30 flex flex-col overflow-y-auto shrink-0">
        
        <div className="p-6 border-b border-border">
          <h3 className="font-serif font-semibold text-primary mb-4 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Live Sources & Citations
          </h3>
          <div className="flex flex-col gap-3">
            {[
              { id: 1, title: 'SVAMITVA Impact Assessment 2024', author: 'Ministry of Panchayati Raj', relevance: '94%' },
              { id: 2, title: 'Haryana Land Record Digitization Stats', author: 'State Govt Data API', relevance: '88%' }
            ].map(source => (
              <div key={source.id} className="bg-white p-3 rounded-sm border border-border shadow-sm text-sm flex flex-col gap-1 hover:border-accent cursor-pointer transition-colors">
                <span className="font-medium text-foreground line-clamp-1">{source.title}</span>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-mutedForeground">{source.author}</span>
                  <span className="text-success font-semibold">{source.relevance}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <h3 className="font-serif font-semibold text-primary mb-2 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
            Research Gap Radar
          </h3>
          <p className="text-xs text-mutedForeground mb-4 text-balance">
            Visualizing repository coverage across policy domains. Identify under-researched areas for new grants.
          </p>
          <div className="flex-1 w-full min-h-[250px] bg-white rounded-sm border border-border shadow-sm p-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#E2DCD0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B7280', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar name="Research Volume" dataKey="A" stroke="#C97B4A" fill="#C97B4A" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
