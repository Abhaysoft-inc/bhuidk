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
  ShieldCheck,
  Lock,
  ArrowRight,
  KeyRound,
  Building2,
  GraduationCap,
  ChevronDown,
} from "lucide-react";
import { TerritoryProvider } from "@/context/territory-context";
import { TerritoryHeaderSelector } from "@/components/layout/territory-header-selector";

const baseNavItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/repository", label: "Repository", icon: Database },
  { href: "/dashboard/simulator", label: "Policy Simulator", icon: Sparkles },
  { href: "/dashboard/gis", label: "Geospatial GIS", icon: MapPin },
  { href: "/dashboard/workspaces", label: "Workspaces", icon: Users },
  { href: "/dashboard/grants", label: "Grants & Innovation", icon: Lightbulb },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
];

const searchableItems = [
  { title: "User & Role Management", category: "Admin", href: "/dashboard/users" },
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
  const isSimulator = pathname?.startsWith("/dashboard/simulator");

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Authenticated user state & Route Protection
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("veda_user");
        if (!stored) {
          // Not logged in -> redirect to login page immediately
          setAuthChecked(true);
          router.replace(`/login?redirect=${encodeURIComponent(pathname || "/dashboard")}`);
          return;
        }

        try {
          const user = JSON.parse(stored);
          if (!user || !user.email) {
            setAuthChecked(true);
            router.replace(`/login?redirect=${encodeURIComponent(pathname || "/dashboard")}`);
            return;
          }

          setCurrentUser(user);
          setAuthChecked(true);
        } catch (e) {
          console.error("Auth verification failed", e);
          setAuthChecked(true);
          router.replace("/login");
        }
      }
    };

    checkAuth();

    const handleUpdate = () => checkAuth();
    window.addEventListener("veda_user_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("veda_user_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [pathname, router]);

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("veda_user");
      window.dispatchEvent(new Event("veda_user_updated"));
    }
    router.replace("/login");
  };

  const handleSwitchRole = (newRole: "admin" | "officer" | "researcher") => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      role: newRole,
      name:
        newRole === "admin"
          ? "Rajesh Kumar, IAS"
          : newRole === "officer"
          ? "Suresh Patil (ADM Revenue)"
          : "Dr. Ashok Sharma",
      email:
        newRole === "admin"
          ? "admin@veda.gov.in"
          : newRole === "officer"
          ? "officer.pune@veda.gov.in"
          : "ashok.sharma@niti.gov.in",
      department:
        newRole === "admin"
          ? "Dept. of Land Resources (DoLR), MoRD"
          : newRole === "officer"
          ? "District Revenue Collectorate, Pune"
          : "Centre for Land Governance Research",
      designation:
        newRole === "admin"
          ? "Central Platform Administrator"
          : newRole === "officer"
          ? "Additional District Magistrate"
          : "Senior Policy Fellow",
      avatarInitials: newRole === "admin" ? "RK" : newRole === "officer" ? "SP" : "AS",
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("veda_user", JSON.stringify(updated));
      window.dispatchEvent(new Event("veda_user_updated"));
    }
    setCurrentUser(updated);
    setRoleSwitcherOpen(false);
  };

  const navItems = [
    ...baseNavItems,
    ...(currentUser?.role === "admin"
      ? [{ href: "/dashboard/users", label: "User Management", icon: ShieldCheck, badge: "ADMIN" }]
      : []),
  ];

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
  const roleRef = useRef<HTMLDivElement>(null);

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
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setRoleSwitcherOpen(false);
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

  // Unauthenticated Guard Gate (Prevents any dashboard content from flashing or showing)
  if (!authChecked || !currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-4 selection:bg-[#eae4ff]">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-[#f4f0ff] text-[#4A2BC2] border border-[#eae4ff] flex items-center justify-center mx-auto shadow-2xs">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#4A2BC2] uppercase tracking-widest bg-[#f4f0ff] inline-block px-2.5 py-0.5 rounded-full border border-[#eae4ff] mb-2">
              VEDA SECURE WORKSPACE
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Official Authentication Required
            </h1>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Access to this dashboard requires verified departmental credentials. Redirecting you to the Officer Sign-In gateway...
            </p>
          </div>
          <div className="pt-2">
            <Link
              href={`/login?redirect=${encodeURIComponent(pathname || "/dashboard")}`}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#4A2BC2] hover:bg-[#3C1FA4] text-white py-2.5 rounded-lg text-xs font-bold tracking-wide transition-all shadow-md shadow-[#4A2BC2]/20"
            >
              <span>Proceed to Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TerritoryProvider>
      <div className="min-h-screen flex bg-slate-50 text-slate-900 selection:bg-[#eae4ff] selection:text-[#4A2BC2]">
        {/* ─── Sidebar (Desktop) ─── */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-[#0b2b50] text-white transition-all duration-200 ${
            collapsed ? "w-16" : "w-56"
          } hidden md:flex shadow-lg`}
        >
          {/* Logo */}
          <div className="h-14 flex items-center gap-3 px-4 border-b border-white/10 shrink-0">
            <img src="/logo.svg" alt="VEDA Symbol" className="w-8 h-8 rounded-lg shrink-0" />
            {!collapsed && (
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white leading-tight truncate">
                  VEDA Platform
                </div>
                <div className="text-[10px] text-slate-400 truncate">DoLR • Govt of India</div>
              </div>
            )}
          </div>

          {/* Nav Items */}
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
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-white/15 text-white"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!collapsed && (
                    <div className="flex-1 flex items-center justify-between">
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-[#4A2BC2] text-white">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom */}
          <div className="border-t border-white/10 p-2 space-y-0.5">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
              title={collapsed ? "VEDA Portal Home" : undefined}
            >
              <ExternalLink className="w-4 h-4 shrink-0 text-slate-400" />
              {!collapsed && <span>Portal Home</span>}
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-400 hover:bg-red-500/20 hover:text-red-300 transition-colors cursor-pointer text-left"
              title={collapsed ? "Sign Out" : undefined}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {!collapsed && <span>Sign Out</span>}
            </button>
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
          className={`fixed inset-y-0 left-0 z-40 w-56 bg-[#0b2b50] text-white flex flex-col transition-transform duration-200 md:hidden shadow-2xl ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="h-14 flex items-center gap-3 px-4 border-b border-white/10">
            <img src="/logo.svg" alt="VEDA Symbol" className="w-8 h-8 rounded-lg shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">VEDA Platform</div>
              <div className="text-[10px] text-slate-400">DoLR • Govt of India</div>
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
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
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
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* ─── Main Area ─── */}
        <div
          className={`flex-1 flex flex-col transition-all duration-200 ${
            collapsed ? "md:ml-16" : "md:ml-56"
          }`}
        >
          {/* Top Bar */}
          <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shadow-2xs">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <button
                type="button"
                className="md:hidden text-slate-600 hover:text-slate-900 cursor-pointer p-1"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Global Search Bar */}
              <div ref={searchRef} className="relative max-w-xs sm:max-w-sm w-full">
                <form onSubmit={handleSearchSubmit}>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search repository, datasets, policies..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-[#4A2BC2] rounded-lg text-xs focus:outline-none transition-colors"
                    />
                  </div>
                </form>

                {/* Search Dropdown */}
                {isSearchFocused && searchQuery.trim() && (
                  <div className="absolute left-0 top-full mt-1.5 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
                    {filteredSearch.length > 0 ? (
                      <div className="py-2">
                        <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Suggested Resources
                        </div>
                        {filteredSearch.map((item, idx) => (
                          <Link
                            key={idx}
                            href={item.href}
                            onClick={() => {
                              setIsSearchFocused(false);
                              setSearchQuery("");
                            }}
                            className="flex items-center justify-between px-3 py-2 text-xs hover:bg-[#f4f0ff] transition-colors group"
                          >
                            <span className="text-slate-800 font-medium group-hover:text-[#4A2BC2]">
                              {item.title}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                              {item.category}
                            </span>
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

              {/* Territory Focus Selector */}
              {isSimulator && (
                <div className="hidden md:flex items-center ml-auto mr-3 shrink-0">
                  <TerritoryHeaderSelector />
                </div>
              )}
            </div>

            {/* Right Utilities: Quick RBAC Role Switcher + Notifs + Profile */}
            <div className="flex items-center gap-2.5 shrink-0">
              {/* Interactive Role Switcher Pill in Top Bar */}
              <div ref={roleRef} className="relative">
                <button
                  type="button"
                  onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border shadow-2xs ${
                    currentUser.role === "admin"
                      ? "bg-[#f4f0ff] text-[#4A2BC2] border-[#eae4ff] hover:bg-[#eae4ff]"
                      : currentUser.role === "officer"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                      : "bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100"
                  }`}
                  title="Click to Switch Demo Role (Simulate RBAC Permissions)"
                >
                  {currentUser.role === "admin" && <ShieldCheck className="w-3.5 h-3.5" />}
                  {currentUser.role === "officer" && <Building2 className="w-3.5 h-3.5" />}
                  {currentUser.role === "researcher" && <GraduationCap className="w-3.5 h-3.5" />}
                  <span className="uppercase text-[10px] tracking-wide">{currentUser.role}</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>

                {roleSwitcherOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 text-xs">
                    <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Simulate Role (RBAC)
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSwitchRole("admin")}
                      className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-[#f4f0ff] transition-colors cursor-pointer ${
                        currentUser.role === "admin"
                          ? "font-bold text-[#4A2BC2] bg-[#f4f0ff]/50"
                          : "text-slate-700"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <KeyRound className="w-3.5 h-3.5 text-[#4A2BC2]" />
                        <span>Platform Admin</span>
                      </span>
                      {currentUser.role === "admin" && <span className="text-[10px] text-[#4A2BC2] font-bold">Active</span>}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSwitchRole("officer")}
                      className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-[#f4f0ff] transition-colors cursor-pointer ${
                        currentUser.role === "officer"
                          ? "font-bold text-[#4A2BC2] bg-[#f4f0ff]/50"
                          : "text-slate-700"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Revenue Officer</span>
                      </span>
                      {currentUser.role === "officer" && <span className="text-[10px] text-emerald-600 font-bold">Active</span>}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSwitchRole("researcher")}
                      className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-[#f4f0ff] transition-colors cursor-pointer ${
                        currentUser.role === "researcher"
                          ? "font-bold text-[#4A2BC2] bg-[#f4f0ff]/50"
                          : "text-slate-700"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                        <span>Policy Researcher</span>
                      </span>
                      {currentUser.role === "researcher" && <span className="text-[10px] text-blue-600 font-bold">Active</span>}
                    </button>
                  </div>
                )}
              </div>

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
                          className={`p-2.5 rounded-lg text-xs ${
                            n.unread
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
                  <div
                    className={`w-7 h-7 rounded-full ${
                      currentUser.role === "admin" ? "bg-[#4A2BC2]" : "bg-[#0b2b50]"
                    } text-white flex items-center justify-center text-[10px] font-bold shadow-xs`}
                  >
                    {currentUser.avatarInitials || "VD"}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-semibold text-slate-800 leading-tight">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                      <span>{currentUser.designation}</span>
                      {currentUser.role === "admin" && (
                        <span className="text-[9px] font-bold text-[#4A2BC2] bg-[#f4f0ff] px-1.5 py-0.5 rounded border border-[#eae4ff]">
                          ADMIN
                        </span>
                      )}
                    </div>
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 space-y-1">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <div className="text-xs font-bold text-slate-900">{currentUser.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{currentUser.email}</div>
                    </div>

                    {currentUser.role === "admin" && (
                      <Link
                        href="/dashboard/users"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-[#4A2BC2] bg-[#f4f0ff] hover:bg-[#eae4ff] transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#4A2BC2]" />
                        <span>User Management</span>
                      </Link>
                    )}

                    <Link
                      href="/"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" /> VEDA Home
                    </Link>

                    <div className="border-t border-slate-100 my-1" />
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        handleSignOut();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </TerritoryProvider>
  );
}
