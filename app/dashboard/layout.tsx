"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Database,
  Sparkles,
  MapPin,
  Users,
  Lightbulb,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  Menu,
  X,
  CheckCheck,
  ExternalLink,
  HelpCircle,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/repository", label: "Repository", icon: Database },
  { href: "/dashboard/simulator", label: "Policy Simulator", icon: Sparkles },
  { href: "/dashboard/gis", label: "Geospatial GIS", icon: MapPin },
  { href: "/dashboard/workspaces", label: "Workspaces", icon: Users },
  { href: "/dashboard/grants", label: "Grants & Innovation", icon: Lightbulb },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
];

const searchableItems = [
  { title: "Geospatial GIS Viewer", category: "Tool", href: "/dashboard/gis" },
  { title: "Policy Simulator Engine", category: "Tool", href: "/dashboard/simulator" },
  { title: "ULPIN Bhu-Aadhaar Study", category: "Paper", href: "/dashboard/repository" },
  { title: "Cadastral Resurvey Datasets", category: "Dataset", href: "/dashboard/repository" },
  { title: "Model Tenancy Act Framework", category: "Policy", href: "/dashboard/simulator" },
  { title: "Pune Cadastral Resurvey Workspace", category: "Workspace", href: "/dashboard/workspaces" },
  { title: "SVAMITVA Drone Resurvey SOP", category: "Document", href: "/dashboard/repository" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Notifications state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Maharashtra Cadastral Dataset Updated", time: "2 hours ago", unread: true },
    { id: 2, title: "Policy Simulation Result Ready", time: "5 hours ago", unread: true },
    { id: 3, title: "Workspace Invitation: Pune Corridor", time: "1 day ago", unread: false },
  ]);

  // User menu state
  const [showUserMenu, setShowUserMenu] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSearch = searchQuery.trim()
    ? searchableItems.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard/repository?query=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchFocused(false);
    }
  };

  const markAllNotifsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* ─── Sidebar (Desktop) ─── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-[#0b2b50] text-white transition-all duration-200 ${collapsed ? "w-16" : "w-56"
          } hidden md:flex shadow-lg`}
      >
        {/* Logo */}
        <div className="h-14 flex items-center gap-3 px-4 border-b border-white/10 shrink-0">
          <img src="/logo.jpg" alt="BhoomiIntel Logo" className="w-8 h-8 rounded shrink-0 object-cover" />
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-white leading-tight truncate">
                Land Governance
              </div>
              <div className="text-[10px] text-slate-400 truncate">DoLR • PME Division</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${isActive
                  ? "bg-white/15 text-white"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/10 p-2 space-y-0.5">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
            title={collapsed ? "Settings" : undefined}
          >
            <Settings className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Settings</span>}
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
            title={collapsed ? "Sign Out" : undefined}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </Link>
        </div>

        {/* Collapse Toggle */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-16 w-6 h-6 bg-white border border-slate-200 rounded-full shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer z-50 transition-transform"
        >
          {collapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>
      </aside>

      {/* ─── Mobile Overlay ─── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ─── Mobile Sidebar ─── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-56 bg-[#0b2b50] text-white flex flex-col transition-transform duration-200 md:hidden shadow-2xl ${mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="h-14 flex items-center gap-3 px-4 border-b border-white/10">
          <img src="/logo.jpg" alt="BhoomiIntel Logo" className="w-8 h-8 rounded shrink-0 object-cover" />
          <div>
            <div className="text-xs font-bold text-white">Land Governance</div>
            <div className="text-[10px] text-slate-400">DoLR • PME Division</div>
          </div>
        </div>
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${isActive
                  ? "bg-white/15 text-white"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-2 space-y-0.5">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* ─── Main Area ─── */}
      <div
        className={`flex-1 flex flex-col transition-all duration-200 ${collapsed ? "md:ml-16" : "md:ml-56"
          }`}
      >
        {/* Top Bar */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Interactive Search Input */}
            <div ref={searchRef} className="relative w-full max-w-md hidden sm:block">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search tools, land records, policy frameworks..."
                  className="w-64 md:w-80 pl-9 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0b2b50]/20 focus:border-[#0b2b50] focus:bg-white transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>

              {/* Live Search Results Dropdown */}
              {isSearchFocused && searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
                  {filteredSearch.length > 0 ? (
                    <div className="p-1.5 space-y-0.5">
                      {filteredSearch.map((res, i) => (
                        <Link
                          key={i}
                          href={res.href}
                          onClick={() => setIsSearchFocused(false)}
                          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0b2b50] bg-[#0b2b50]/10 px-1.5 py-0.5 rounded">
                              {res.category}
                            </span>
                            <span className="text-xs font-semibold text-slate-800">{res.title}</span>
                          </div>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-500">
                      Press <kbd className="px-1.5 py-0.5 bg-slate-100 border rounded text-[10px]">Enter</kbd> to search repository for &quot;{searchQuery}&quot;
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Utilities */}
          <div className="flex items-center gap-3">
            {/* Notifications Dropdown Container */}
            <div ref={notifRef} className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-500 hover:text-slate-900 cursor-pointer rounded-lg hover:bg-slate-100 transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-50">
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
                    <h4 className="text-xs font-bold text-slate-800">Notifications</h4>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllNotifsRead}
                        className="text-[10px] font-bold text-[#0b2b50] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCheck className="w-3 h-3" /> Mark read
                      </button>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-lg text-xs ${n.unread
                          ? "bg-amber-50 border border-amber-200 font-semibold text-slate-800"
                          : "bg-slate-50 text-slate-500"
                          }`}
                      >
                        <div>{n.title}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{n.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div ref={userRef} className="relative">
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 pl-1"
              >
                <div className="w-7 h-7 rounded-full bg-[#0b2b50] text-white flex items-center justify-center text-[10px] font-bold">
                  AS
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-slate-800 leading-tight">
                    Dr. Ashok Sharma
                  </div>
                  <div className="text-[10px] text-slate-500">Researcher</div>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 z-50 space-y-0.5">
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" /> Settings
                  </Link>
                  <Link
                    href="/dashboard/grants"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" /> Help & Grants
                  </Link>
                  <div className="border-t border-slate-100 my-1" />
                  <Link
                    href="/"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
