'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      simulateProcessing();
    }
  };

  const simulateProcessing = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
    }, 2500);
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-serif text-primary">Ingest Document to Repository</h1>
        <p className="text-mutedForeground text-sm mt-1">Upload research papers, policy briefs, or gazette notifications for AI tagging and semantic indexing.</p>
      </div>

      <div 
        className={`border-2 border-dashed rounded-md p-12 flex flex-col items-center justify-center text-center transition-colors ${dragActive ? 'border-accent bg-accent/5' : 'border-border bg-white'} ${file ? 'hidden' : 'flex'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-primary mb-4 pointer-events-none">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
        </div>
        <h3 className="font-serif text-lg font-medium text-primary mb-1 pointer-events-none">Drag and drop document here</h3>
        <p className="text-sm text-mutedForeground mb-6 pointer-events-none">Supports PDF, DOCX, and TXT up to 50MB</p>
        <label className="bg-primary text-background px-6 py-2 rounded-sm text-sm font-medium hover:bg-primary-light transition-colors cursor-pointer shadow-sm">
          Browse Files
          <input type="file" className="hidden" onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setFile(e.target.files[0]);
              simulateProcessing();
            }
          }} />
        </label>
      </div>

      {file && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          <div className="bg-white border border-border p-4 rounded-md shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-accent/10 text-accent rounded-sm flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </div>
              <div>
                <h4 className="font-medium text-foreground text-sm">{file.name}</h4>
                <p className="text-xs text-mutedForeground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button onClick={() => setFile(null)} className="text-mutedForeground hover:text-danger p-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
            </button>
          </div>

          {isProcessing ? (
            <div className="bg-white border border-border p-6 rounded-md shadow-sm flex flex-col items-center justify-center gap-4 py-12">
              <div className="w-8 h-8 border-4 border-muted border-t-accent rounded-full animate-spin" />
              <p className="text-sm font-medium text-primary">AI is analyzing document structure and extracting metadata...</p>
            </div>
          ) : (
            <div className="bg-white border border-border rounded-md shadow-sm overflow-hidden flex flex-col md:flex-row">
              <div className="flex-1 p-6 border-r border-border flex flex-col gap-4">
                <h3 className="font-serif font-medium text-primary border-b border-border pb-2">Extracted Metadata</h3>
                
                <div className="flex flex-col gap-3 text-sm">
                  <div>
                    <label className="text-xs text-mutedForeground uppercase tracking-wider block mb-1">Detected Title</label>
                    <input type="text" defaultValue={file.name.replace('.pdf', '')} className="w-full p-2 border border-border rounded-sm bg-background" />
                  </div>
                  <div>
                    <label className="text-xs text-mutedForeground uppercase tracking-wider block mb-1">Author / Issuer</label>
                    <input type="text" defaultValue="Ministry of Environment" className="w-full p-2 border border-border rounded-sm bg-background" />
                  </div>
                  <div>
                    <label className="text-xs text-mutedForeground uppercase tracking-wider block mb-1">Publication Date</label>
                    <input type="date" defaultValue="2026-01-15" className="w-full p-2 border border-border rounded-sm bg-background" />
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-80 p-6 bg-muted/30 flex flex-col gap-4">
                <h3 className="font-serif font-medium text-primary border-b border-border pb-2 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" x2="12" y1="22.08" y2="12"/></svg>
                  Auto-Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-medium bg-accent/10 text-accent px-2 py-1 rounded-sm border border-accent/20">Forestry</span>
                  <span className="text-xs font-medium bg-accent/10 text-accent px-2 py-1 rounded-sm border border-accent/20">Land Use</span>
                  <span className="text-xs font-medium bg-accent/10 text-accent px-2 py-1 rounded-sm border border-accent/20">Notification</span>
                  <span className="text-xs font-medium bg-background text-mutedForeground px-2 py-1 rounded-sm border border-border border-dashed cursor-pointer hover:bg-muted">+ Add Tag</span>
                </div>
                
                <div className="mt-auto pt-6">
                  <button className="w-full py-2 bg-primary text-background rounded-sm text-sm font-bold shadow-card hover:bg-primary-light transition-colors">
                    Confirm & Publish to Repository
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
