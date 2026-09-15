"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, MessageSquare, History, Share2, Download, Bold, Italic, List, CheckSquare } from "lucide-react";

export default function SharedDocuments() {
  const [activeDoc, setActiveDoc] = useState("doc-1");
  const [isTyping, setIsTyping] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(true);

  // Simulate real-time collaboration cursor
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTyping(prev => !prev);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const documents = [
    { id: "doc-1", title: "Draft: Drone Survey Protocol", updated: "10 mins ago" },
    { id: "doc-2", title: "Meeting Notes: Land Records Sync", updated: "Yesterday" },
    { id: "doc-3", title: "Dispute Resolution Case Studies", updated: "Last week" },
  ];

  return (
    <div className="flex h-[75vh] w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* Sidebar: Documents List */}
      <div className="w-64 border-r border-slate-200 bg-slate-50 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-slate-200 font-bold text-sm text-slate-800 flex items-center justify-between">
          <span>Documents</span>
          <button className="text-[#0b2b50] hover:bg-blue-50 p-1 rounded"><FileText className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {documents.map((doc) => (
            <button
              key={doc.id}
              onClick={() => setActiveDoc(doc.id)}
              className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                activeDoc === doc.id ? "bg-[#0b2b50] text-white shadow-md" : "hover:bg-slate-200 text-slate-700"
              }`}
            >
              <div className="font-semibold truncate">{doc.title}</div>
              <div className={`text-[10px] mt-1 ${activeDoc === doc.id ? "text-blue-200" : "text-slate-500"}`}>
                Updated {doc.updated}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white relative">
        {/* Toolbar */}
        <div className="h-14 border-b border-slate-200 px-4 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-slate-100 rounded text-slate-600"><Bold className="w-4 h-4" /></button>
            <button className="p-2 hover:bg-slate-100 rounded text-slate-600"><Italic className="w-4 h-4" /></button>
            <div className="w-px h-6 bg-slate-300 mx-2" />
            <button className="p-2 hover:bg-slate-100 rounded text-slate-600"><List className="w-4 h-4" /></button>
            <button className="p-2 hover:bg-slate-100 rounded text-slate-600"><CheckSquare className="w-4 h-4" /></button>
          </div>
          <div className="flex items-center gap-2">
            {/* Live Avatars */}
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white text-white flex items-center justify-center text-xs font-bold z-20" title="You">Y</div>
              <div className="w-8 h-8 rounded-full bg-emerald-600 border-2 border-white text-white flex items-center justify-center text-xs font-bold z-10" title="Dr. Ashok">A</div>
            </div>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded ml-2" title="Version History"><History className="w-4 h-4" /></button>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded"><Share2 className="w-4 h-4" /></button>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded"><Download className="w-4 h-4" /></button>
            <button 
              onClick={() => setCommentsVisible(!commentsVisible)}
              className={`p-2 rounded flex items-center gap-1 ${commentsVisible ? "bg-blue-100 text-blue-700" : "text-slate-500 hover:bg-slate-100"}`}
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Editor Canvas Simulation */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 relative cursor-text">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-black text-slate-900 mb-6 focus:outline-none" contentEditable suppressContentEditableWarning>
              {documents.find(d => d.id === activeDoc)?.title}
            </h1>
            
            <div className="prose prose-sm max-w-none text-slate-700 space-y-4 focus:outline-none" contentEditable suppressContentEditableWarning>
              <p>The objective of this protocol is to establish a standardized operating procedure (SOP) for the deployment of UAVs (drones) in cadastral resurveys across peri-urban zones.</p>
              
              <h3>1. Pre-flight Preparation</h3>
              <ul>
                <li>Verify clearances from DGCA via the Digital Sky platform.</li>
                <li>Establish Ground Control Points (GCPs) utilizing DGPS rovers tied to the CORS network.</li>
                <li>Ensure a minimum overlap of 70% front and 60% side for photogrammetry.</li>
              </ul>

              <p>
                In cases of disputed boundaries, refer to the historical maps overlay.
              </p>
            </div>

            {/* Simulated Live Cursor */}
            <AnimatePresence>
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute left-1/2 top-1/3 flex items-center pointer-events-none"
                >
                  <div className="w-0.5 h-5 bg-emerald-500 animate-pulse"></div>
                  <div className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-r-md rounded-bl-md shadow-sm whitespace-nowrap ml-1">
                    Dr. Ashok is typing...
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Right Sidebar: Threaded Comments */}
      {commentsVisible && (
        <div className="w-72 border-l border-slate-200 bg-slate-50 flex flex-col">
          <div className="p-4 border-b border-slate-200 font-bold text-sm text-slate-800 flex justify-between items-center bg-white">
            Comments
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            
            {/* Comment Thread 1 */}
            <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm relative">
              {/* Highlight connector simulation */}
              <div className="absolute -left-3 top-4 w-3 h-px bg-amber-400"></div>
              
              <div className="flex items-start gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">R</div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Rajiv (Revenue Dept)</div>
                  <div className="text-[10px] text-slate-500">2 hours ago</div>
                </div>
              </div>
              <p className="text-xs text-slate-700 bg-amber-50 p-2 rounded border border-amber-100 mb-2">
                "In cases of disputed boundaries, refer to the historical maps overlay."
              </p>
              <p className="text-xs text-slate-700 mb-3">
                Can we also add a requirement to fetch the latest High Court stay order status via API here?
              </p>
              
              {/* Reply */}
              <div className="flex items-start gap-2 ml-4 pt-2 border-t border-slate-100">
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0">A</div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Dr. Ashok</div>
                  <p className="text-[11px] text-slate-600 mt-0.5">Good point. I'll integrate the eCourts API reference in section 2.</p>
                </div>
              </div>

              <div className="mt-3 pt-2">
                <input type="text" placeholder="Reply..." className="w-full text-xs bg-slate-100 border-none rounded px-2 py-1.5 focus:ring-1 focus:ring-blue-500 outline-none" />
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
