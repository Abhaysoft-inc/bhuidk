"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Users, Settings, LayoutDashboard, FileText, Activity } from "lucide-react";
import KanbanBoard from "@/components/workspaces/KanbanBoard";
import SharedDocuments from "@/components/workspaces/SharedDocuments";

const WORKSPACE_DATA = {
  "ws-1": { name: "Pune Cadastral Resurvey", members: 8, status: "Active" },
  "ws-2": { name: "Model Tenancy Framework", members: 12, status: "Active" },
  "ws-3": { name: "Desertification Vulnerability Atlas", members: 6, status: "Active" },
  "ws-4": { name: "NE India Land Rights Study", members: 4, status: "Draft" },
};

export default function WorkspaceDetail() {
  const params = useParams();
  const id = params.id as string;
  const wsData = WORKSPACE_DATA[id as keyof typeof WORKSPACE_DATA] || { name: "Untitled Workspace", members: 1, status: "Draft" };
  
  const [activeTab, setActiveTab] = useState<"board" | "docs" | "activity">("board");

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] w-full">
      {/* Workspace Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link href="/dashboard/workspaces" className="text-slate-400 hover:text-slate-700 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${wsData.status === "Active" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>
              {wsData.status}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 ml-8">{wsData.name}</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2 mr-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white text-white flex items-center justify-center text-xs font-bold z-30">A</div>
            <div className="w-8 h-8 rounded-full bg-emerald-600 border-2 border-white text-white flex items-center justify-center text-xs font-bold z-20">R</div>
            <div className="w-8 h-8 rounded-full bg-amber-500 border-2 border-white text-white flex items-center justify-center text-xs font-bold z-10">S</div>
            <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white text-slate-600 flex items-center justify-center text-[10px] font-bold z-0">+{wsData.members - 3}</div>
          </div>
          <button className="flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-md text-xs font-bold hover:bg-slate-200 transition-colors">
            <Users className="w-3.5 h-3.5" /> Share
          </button>
          <button className="text-slate-400 hover:text-slate-700 transition-colors p-1.5">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 shrink-0 overflow-x-auto">
        <div className="flex items-center gap-6 min-w-max">
          <button 
            onClick={() => setActiveTab("board")}
            className={`flex items-center gap-2 py-3 px-1 border-b-2 font-bold text-sm transition-colors ${activeTab === "board" ? "border-blue-600 text-blue-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}
          >
            <LayoutDashboard className="w-4 h-4" /> Task Board
          </button>
          <button 
            onClick={() => setActiveTab("docs")}
            className={`flex items-center gap-2 py-3 px-1 border-b-2 font-bold text-sm transition-colors ${activeTab === "docs" ? "border-blue-600 text-blue-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}
          >
            <FileText className="w-4 h-4" /> Shared Documents
          </button>
          <button 
            onClick={() => setActiveTab("activity")}
            className={`flex items-center gap-2 py-3 px-1 border-b-2 font-bold text-sm transition-colors ${activeTab === "activity" ? "border-blue-600 text-blue-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}
          >
            <Activity className="w-4 h-4" /> Activity Log
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden bg-[#f4f7fb] p-6 relative">
        {activeTab === "board" && <KanbanBoard />}
        
        {activeTab === "docs" && <SharedDocuments />}
        
        {activeTab === "activity" && (
          <div className="w-full max-w-2xl bg-white p-6 rounded-xl border border-slate-200 shadow-sm mx-auto h-full overflow-y-auto">
            <h3 className="font-bold text-slate-800 mb-6">Recent Activity</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              {/* Activity Items */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-blue-100 text-blue-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-slate-800 text-sm">Dr. Ashok edited a document</div>
                    <time className="text-[10px] font-medium text-slate-500">10 min ago</time>
                  </div>
                  <div className="text-xs text-slate-600">Updated "Draft: Drone Survey Protocol"</div>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-emerald-100 text-emerald-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <LayoutDashboard className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-slate-800 text-sm">Rajiv moved a task</div>
                    <time className="text-[10px] font-medium text-slate-500">2 hrs ago</time>
                  </div>
                  <div className="text-xs text-slate-600">Moved "Compile local zoning dispute cases" to To Do</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
