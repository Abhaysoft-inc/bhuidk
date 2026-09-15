"use client";

import React, { useState } from "react";
import Image from "next/image";

export function Hero() {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Searching for: ${searchQuery}`);
    }
  };

  const handleTagClick = (tagText: string) => {
    setSearchQuery(tagText);
  };

  return (
    <div className="bg-black text-white h-screen w-screen overflow-hidden flex flex-col font-sans antialiased">
      {/* 1. NAVBAR (Fixed Height 84px, Prevent Text Wrapping) */}
      <header className="w-full bg-[#0f0f12] h-[84px] px-8 xl:px-16 flex items-center shrink-0 border-b border-purple-900/30">
        <div className="w-full max-w-[1550px] mx-auto flex items-center justify-between gap-6">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3.5 shrink-0">
            <div className="w-10 h-10 bg-purple-600 rounded flex items-center justify-center font-bold text-lg text-white shrink-0">
              भूमि
            </div>
            <div className="whitespace-nowrap">
              <h1 className="text-base font-bold leading-tight tracking-tight text-white">
                BhoomiSetu{" "}
                <span className="text-xs font-normal text-purple-200/80">
                  | भूमि सेतु
                </span>
              </h1>
              <p className="text-[10px] text-gray-400 tracking-wider">
                National Land Intelligence & Policy Governance Platform | भारत
                सरकार
              </p>
            </div>
          </div>

          {/* Navigation Links - Single Line Unwrapped */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium whitespace-nowrap">
            <a
              href="#home"
              className="text-white border-b-2 border-purple-600 pb-0.5"
            >
              Home
            </a>
            <a
              href="#research"
              className="text-gray-300 hover:text-white transition"
            >
              Research & Insights
            </a>
            <a
              href="#datasets"
              className="text-gray-300 hover:text-white transition"
            >
              Geospatial Datasets
            </a>
            <a
              href="#lab"
              className="text-gray-300 hover:text-white transition"
            >
              AI Policy Lab
            </a>
            <a
              href="#gis"
              className="text-gray-300 hover:text-white transition"
            >
              Cadastral GIS
            </a>
            <a
              href="#grants"
              className="text-gray-300 hover:text-white transition"
            >
              Institutional Grants
            </a>
          </nav>

          {/* Header Controls */}
          <div className="flex items-center gap-3 shrink-0 whitespace-nowrap">
            <button
              type="button"
              onClick={() =>
                document.getElementById("main-search-input")?.focus()
              }
              className="hidden xl:flex items-center gap-2 bg-purple-950/60 text-gray-300 text-xs px-3.5 py-2 rounded border border-purple-700/40 hover:bg-purple-900/60 transition"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span>Quick Search</span>
              <kbd className="bg-black/60 px-1.5 py-0.5 text-[10px] rounded text-gray-400 border border-gray-700">
                Ctrl+K
              </kbd>
            </button>

            <a
              href="#sandbox"
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-2.5 rounded transition"
            >
              Explore Sandbox
            </a>

            <a
              href="#signin"
              className="bg-white text-black hover:bg-gray-200 text-xs font-semibold px-4 py-2.5 rounded transition flex items-center gap-2"
            >
              <svg
                className="w-3.5 h-3.5 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Sign In
            </a>
          </div>
        </div>
      </header>

      {/* 2. PROPER 2-COLUMN HERO (Fills remaining height: 100vh - 84px) */}
      <main className="w-full h-[calc(100vh-84px)] overflow-hidden">
        <div className="w-full h-full max-w-[1550px] mx-auto px-8 xl:px-16 grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] items-center gap-8">
          {/* LEFT CONTENT COLUMN */}
          <section className="flex flex-col justify-center py-8 z-10">
            {/* Expanded Hero Title */}
            <h2 className="max-w-[850px] text-[clamp(3.2rem,4.5vw,5.5rem)] font-extrabold leading-[0.98] tracking-[-0.04em] text-white">
              Bridging the Gap Between{" "}
              <span className="text-purple-600">Land Data</span> &{" "}
              <span className="text-purple-100">Policy Action</span>
            </h2>

            {/* Expanded Hero Description */}
            <p className="mt-6 max-w-[780px] text-[1.15rem] leading-[1.7] text-gray-300">
              India generates vast datasets through land records, cadastral
              surveys, satellite imagery, and GIS platforms — yet these remain
              underutilized for policymaking. BhoomiSetu transforms raw data
              into actionable insights through applied research and AI
              analytics.
            </p>

            {/* Sized Search Container (max 760px wide) */}
            <div className="mt-7 w-full max-w-[760px] bg-white rounded-lg p-3 text-black">
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-400 shrink-0 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  id="main-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cadastral parcel, research papers, ULPIN schema, state deed laws..."
                  className="w-full bg-transparent px-1 text-sm text-black outline-none placeholder:text-gray-500"
                  required
                />
                <button
                  type="button"
                  className="hidden sm:flex shrink-0 items-center gap-1.5 rounded bg-purple-50 px-3 py-2 text-xs font-medium text-purple-700 hover:bg-purple-100 transition"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                  Filter
                </button>
                <button
                  type="submit"
                  className="flex shrink-0 items-center gap-1.5 rounded bg-purple-600 px-5 py-2 text-xs font-semibold text-white hover:bg-purple-700 transition"
                >
                  Search
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </form>

              {/* Trending Keywords Bar */}
              <div className="mt-2.5 h-[36px] border-t border-gray-100 pt-2 flex items-center gap-2 overflow-x-auto text-[11px] whitespace-nowrap">
                <span className="shrink-0 font-semibold text-gray-500">
                  Trending:
                </span>
                <button
                  type="button"
                  onClick={() => handleTagClick("ULPIN adoption rates")}
                  className="rounded bg-purple-50 px-2 py-0.5 text-purple-900 hover:bg-purple-100 transition"
                >
                  ULPIN adoption rates
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleTagClick("Forest rights spatial analysis")
                  }
                  className="rounded bg-purple-50 px-2 py-0.5 text-purple-900 hover:bg-purple-100 transition"
                >
                  Forest rights spatial analysis
                </button>
                <button
                  type="button"
                  onClick={() => handleTagClick("SVAMITVA drone accuracy")}
                  className="rounded bg-purple-50 px-2 py-0.5 text-purple-900 hover:bg-purple-100 transition"
                >
                  SVAMITVA drone accuracy
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-[18px] flex flex-wrap items-center gap-3">
              <a
                href="#workbench"
                className="flex items-center gap-2 rounded bg-purple-600 px-6 py-3 text-xs font-semibold text-white hover:bg-purple-700 transition"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Launch Cadastral Workbench
              </a>
              <a
                href="#datasets"
                className="rounded border border-purple-700 px-6 py-3 text-xs font-semibold text-white hover:bg-purple-900/40 transition"
              >
                Explore Open Datasets
              </a>
            </div>

            {/* Status Line */}
            <div className="mt-4 flex items-center gap-2 text-[11px] text-gray-400">
              <span className="w-2 h-2 rounded-full bg-purple-600"></span>
              Updated Hourly via NIC-MeitY Gateway
            </div>
          </section>

          {/* RIGHT VISUAL COLUMN (Proportional Responsive Person Composition) */}
          <section className="relative hidden md:block w-full h-full min-h-[600px] overflow-hidden">
            <div className="relative w-full h-full">
              {/* Person 1 (Left background cutout) */}
              <div className="absolute left-[5%] bottom-0 w-[34%] h-[80%] z-10 flex items-end">
                <Image
                  src="/modiji2.png"
                  alt="PM Composition Left"
                  width={380}
                  height={570}
                  priority
                  className="w-full h-auto max-h-full object-contain object-bottom select-none pointer-events-none"
                />
              </div>

              {/* Person 2 (Center prominent cutout) */}
              <div className="absolute left-[30%] bottom-0 w-[44%] h-[92%] z-20 flex items-end">
                <Image
                  src="/modiji.png"
                  alt="PM Composition Center"
                  width={500}
                  height={750}
                  priority
                  className="w-full h-auto max-h-full object-contain object-bottom select-none pointer-events-none"
                />
              </div>

              {/* Person 3 (Right background cutout) */}
              <div className="absolute right-[2%] bottom-0 w-[36%] h-[82%] z-10 flex items-end">
                <Image
                  src="/modiji3.png"
                  alt="PM Composition Right"
                  width={380}
                  height={570}
                  priority
                  className="w-full h-auto max-h-full object-contain object-bottom select-none pointer-events-none"
                />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
