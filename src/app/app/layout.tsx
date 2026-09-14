'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  /* eslint-disable @typescript-eslint/no-explicit-any */
  // Voice Assistant Logic
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (!isVoiceAssistantOpen) {
      setIsListening(false);
      return;
    }
    
    // Initialize Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'hi-IN'; // Multilingual default

      recognition.onstart = () => setIsListening(true);
      
      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      try {
        recognition.start();
      } catch (e) {
        console.error(e);
      }

      return () => {
        recognition.stop();
      };
    }
  }, [isVoiceAssistantOpen]);

  // Handle Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsVoiceAssistantOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const navLinks = [
    { group: 'INTELLIGENCE', items: [
      { name: 'Dashboard', href: '/app', icon: <><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></> },
      { name: 'GIS Base Map', href: '/app/gis', icon: <><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/></> },
      { name: 'Digital Twin', href: '/app/digital-twin/pune-01', icon: <><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/></> },
      { name: 'Analytics', href: '/app/analytics', icon: <><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></> },
      { name: 'Satellite Change', href: '/app/satellite-change', icon: <><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></> },
    ]},
    { group: 'TOOLS', items: [
      { name: 'Policy Studio', href: '/app/simulation', icon: <><path d="M2 12h4l2-9 5 18 3-9h6"/></> },
      { name: 'AI Copilot', href: '/app/copilot', icon: <><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></>, special: true },
      { name: 'Upload Data', href: '/app/repository/upload', icon: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></> },
      { name: 'Workspace', href: '/app/workspace', icon: <><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/><polyline points="14 2 14 8 20 8"/><path d="M2 15h10"/><path d="m9 18 3-3-3-3"/></> },
      { name: 'Innovation Hub', href: '/app/innovation', icon: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></> },
    ]},
    { group: 'SYSTEM', items: [
      { name: 'Alerts', href: '/app/notifications', icon: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></> },
      { name: 'Audit Trail', href: '/app/audit-trail', icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></> },
      { name: 'API Docs', href: '/app/docs/api', icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></> },
      { name: 'Admin', href: '/app/admin/users', icon: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></> },
    ]},
  ];

  // Flatten links for search
  const allLinks = navLinks.flatMap(g => g.items);
  const filteredLinks = allLinks.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarCollapsed ? 80 : 256 }}
        className="border-r border-border bg-background flex flex-col sticky top-0 h-screen hidden md:flex shrink-0 overflow-hidden"
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-sm overflow-hidden flex items-center justify-center shrink-0 shadow-sm border border-border">
              <img src="/logo.jpg" alt="BhoomiIntel Logo" className="w-full h-full object-cover" />
            </div>
            {!isSidebarCollapsed && (
              <Link href="/app" className="font-serif font-semibold text-primary whitespace-nowrap">BhoomiIntel</Link>
            )}
          </div>
          <button onClick={toggleSidebar} className="text-mutedForeground hover:text-foreground p-1 shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isSidebarCollapsed ? <path d="m13 17 5-5-5-5M6 17l5-5-5-5"/> : <path d="m11 17-5-5 5-5M18 17l-5-5 5-5"/>}
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-6 custom-scrollbar">
          {navLinks.map((group, gIdx) => (
            <div key={gIdx} className="flex flex-col gap-1">
              {!isSidebarCollapsed && (
                <span className="text-[10px] font-semibold text-mutedForeground tracking-widest px-3 mb-1 truncate">{group.group}</span>
              )}
              {isSidebarCollapsed && <div className="h-px bg-border my-1 mx-2" />}
              
              {group.items.map((item, iIdx) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={iIdx} 
                    href={item.href} 
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-colors ${isActive ? 'bg-muted text-foreground' : 'text-mutedForeground hover:bg-muted/50 hover:text-foreground'} ${item.special && !isActive ? 'text-accent' : ''}`}
                    title={isSidebarCollapsed ? item.name : undefined}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">{item.icon}</svg>
                    {!isSidebarCollapsed && <span className="truncate">{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-border shrink-0">
          <Link href="/app/profile" className="flex items-center gap-3 p-2 rounded-sm hover:bg-muted transition-colors cursor-pointer overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-primary text-background flex items-center justify-center text-xs font-medium shrink-0">AD</div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col truncate">
                <span className="text-sm font-medium truncate">Admin User</span>
                <span className="text-xs text-mutedForeground truncate">admin@gov.in</span>
              </div>
            )}
          </Link>
        </div>
      </motion.aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        
        {/* Topbar */}
        <header className="h-16 border-b border-border bg-white flex items-center px-6 justify-between sticky top-0 z-40 shrink-0 shadow-sm">
          <div className="flex items-center gap-4 flex-1">
            <div className="md:hidden flex items-center gap-2 mr-2">
              <div className="w-8 h-8 rounded-sm overflow-hidden flex items-center justify-center shadow-sm border border-border">
                <img src="/logo.jpg" alt="BhoomiIntel Logo" className="w-full h-full object-cover" />
              </div>
            </div>
            
            {/* Global Search */}
            <div className="hidden md:flex relative max-w-md w-full">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 text-mutedForeground">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
              <input 
                type="text" 
                placeholder="Search districts, policies, or users... (Cmd+K)" 
                className="w-full pl-9 pr-4 py-2 text-sm border border-border bg-muted/30 rounded-sm focus:outline-none focus:border-accent transition-colors"
                onClick={() => setIsCommandPaletteOpen(true)}
                readOnly
              />
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {/* Language Toggle */}
            <select className="text-xs font-medium bg-transparent border-none focus:outline-none cursor-pointer text-foreground hidden sm:block">
              <option value="en">EN</option>
              <option value="hi">HI</option>
              <option value="mr">MR</option>
            </select>
            
            <div className="h-4 w-px bg-border hidden sm:block" />

            {/* Notification Bell */}
            <Link href="/app/notifications" className="relative text-mutedForeground hover:text-foreground transition-colors p-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
              <span className="absolute top-0.5 right-1 w-2 h-2 bg-danger rounded-full border border-white"></span>
            </Link>
          </div>
        </header>

        <main className="flex-1 flex flex-col relative overflow-hidden">
          {children}
        </main>
      </div>

      {/* Floating Voice Assistant Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isVoiceAssistantOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-16 right-0 w-80 bg-white border border-border shadow-2xl rounded-md overflow-hidden flex flex-col"
            >
              <div className="bg-primary p-3 flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                  <span className="text-sm font-bold">Bhoomi Voice Assistant</span>
                </div>
                <button onClick={() => setIsVoiceAssistantOpen(false)} className="hover:text-accent"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
              </div>
              <div className="h-64 p-4 overflow-y-auto bg-muted/20 flex flex-col gap-3">
                <div className="bg-muted p-2 rounded-md rounded-tl-none text-xs text-foreground self-start shadow-sm max-w-[85%]">
                  Namaste! How can I assist you with BhoomiIntel today? Try saying "Show me Pune disputes".
                </div>
                {transcript && (
                  <div className="bg-primary text-white p-2 rounded-md rounded-tr-none text-xs self-end shadow-sm max-w-[85%]">
                    {transcript}
                  </div>
                )}
                {/* Voice waves animation placeholder */}
                {isListening && (
                  <div className="mt-auto self-center flex items-center gap-1 opacity-50">
                    <motion.div animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 bg-accent rounded-full"></motion.div>
                    <motion.div animate={{ height: [12, 24, 12] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 bg-accent rounded-full"></motion.div>
                    <motion.div animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 bg-accent rounded-full"></motion.div>
                  </div>
                )}
              </div>
              <div className="p-3 bg-white border-t border-border flex justify-center">
                <div className={`text-xs font-medium flex items-center gap-2 ${isListening ? 'text-danger animate-pulse' : 'text-mutedForeground'}`}>
                  {isListening ? (
                    <><div className="w-2 h-2 rounded-full bg-danger"></div> Listening...</>
                  ) : (
                    <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg> Click to talk</>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setIsVoiceAssistantOpen(!isVoiceAssistantOpen)}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all ${isVoiceAssistantOpen ? 'bg-danger text-white hover:bg-danger/90 scale-90' : 'bg-primary text-white hover:bg-primary-light hover:scale-105'}`}
        >
          {isVoiceAssistantOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/></svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
          )}
        </button>
      </div>

      {/* Command Palette Modal */}
      <AnimatePresence>
        {isCommandPaletteOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setIsCommandPaletteOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-[15vh] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white rounded-md shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              <div className="flex items-center px-4 py-3 border-b border-border">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-mutedForeground mr-3"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Search commands, districts, or jump to page..." 
                  className="flex-1 bg-transparent border-none focus:outline-none text-foreground placeholder:text-mutedForeground"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="text-[10px] bg-muted text-mutedForeground px-1.5 py-0.5 rounded-sm font-mono border border-border">ESC</span>
              </div>
              <div className="max-h-80 overflow-y-auto p-2">
                {filteredLinks.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-mutedForeground px-3 py-1 uppercase">Navigation</span>
                    {filteredLinks.map((link, idx) => (
                      <button 
                        key={idx}
                        onClick={() => { router.push(link.href); setIsCommandPaletteOpen(false); }}
                        className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-sm hover:bg-muted text-sm text-foreground transition-colors group"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-mutedForeground group-hover:text-primary">{link.icon}</svg>
                        {link.name}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-sm text-mutedForeground">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
