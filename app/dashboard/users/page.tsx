"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  Mail,
  Building2,
  Lock,
  KeyRound,
  Download,
  Trash2,
  Edit,
  X,
  UserCheck,
  Compass,
  GraduationCap,
  ShieldAlert,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

interface UserRecord {
  id: string | number;
  name: string;
  email: string;
  role: "admin" | "officer" | "researcher" | "surveyor" | "public";
  department: string;
  designation: string;
  jurisdiction: string;
  status: "Active" | "Pending" | "Suspended";
  lastLogin: string;
}

const defaultUsers: UserRecord[] = [
  {
    id: "USR-001",
    name: "Rajesh Kumar, IAS",
    email: "rajesh.kumar@veda.gov.in",
    role: "admin",
    department: "Dept. of Land Resources (DoLR)",
    designation: "Joint Secretary & Platform Admin",
    jurisdiction: "Central (All States)",
    status: "Active",
    lastLogin: "10 mins ago",
  },
  {
    id: "USR-002",
    name: "Suresh Patil",
    email: "suresh.patil@mahabhulekh.gov.in",
    role: "officer",
    department: "District Collectorate, Pune",
    designation: "Additional District Magistrate (ADM)",
    jurisdiction: "Maharashtra / Pune Tehsil",
    status: "Active",
    lastLogin: "2 hours ago",
  },
  {
    id: "USR-003",
    name: "Dr. Ashok Sharma",
    email: "ashok.sharma@niti.gov.in",
    role: "researcher",
    department: "NITI Aayog / Centre for Land Policy",
    designation: "Senior Policy Advisor",
    jurisdiction: "National Research",
    status: "Active",
    lastLogin: "Yesterday",
  },
  {
    id: "USR-004",
    name: "Pooja Deshmukh",
    email: "pooja.d@svamitva.nic.in",
    role: "surveyor",
    department: "Survey of India / SVAMITVA PMU",
    designation: "Chief Drone Mapping Officer",
    jurisdiction: "Western Region (MH / GA)",
    status: "Active",
    lastLogin: "3 hours ago",
  },
  {
    id: "USR-005",
    name: "Anand Verma",
    email: "anand.verma@up.gov.in",
    role: "officer",
    department: "Revenue Board, Lucknow",
    designation: "Sub-Divisional Magistrate (SDM)",
    jurisdiction: "Uttar Pradesh / Ayodhya",
    status: "Active",
    lastLogin: "1 day ago",
  },
  {
    id: "USR-006",
    name: "Kavita Reddy",
    email: "kavita.reddy@karnataka.gov.in",
    role: "officer",
    department: "Bhoomi Monitoring Cell, Bengaluru",
    designation: "Tehsildar (Cadastral Records)",
    jurisdiction: "Karnataka / Bengaluru Rural",
    status: "Pending",
    lastLogin: "Never",
  },
  {
    id: "USR-007",
    name: "Vikram Sengupta",
    email: "vikram.s@iitb.ac.in",
    role: "researcher",
    department: "IIT Bombay Geospatial Lab",
    designation: "PhD Research Scholar",
    jurisdiction: "Academic Sandbox",
    status: "Pending",
    lastLogin: "Never",
  },
];

export default function UserManagementPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [users, setUsers] = useState<UserRecord[]>(defaultUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Sync active user for RBAC enforcement
  useEffect(() => {
    const loadCurrentUser = () => {
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("veda_user");
          if (stored) {
            setCurrentUser(JSON.parse(stored));
          } else {
            setCurrentUser(null);
          }
        } catch (e) {
          console.error("Error reading veda_user", e);
          setCurrentUser(null);
        }
        setAuthChecked(true);
      }
    };

    loadCurrentUser();

    const handleUpdate = () => loadCurrentUser();
    window.addEventListener("veda_user_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("veda_user_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<"admin" | "officer" | "researcher" | "surveyor">("officer");
  const [newUserDept, setNewUserDept] = useState("");
  const [newUserDesignation, setNewUserDesignation] = useState("");
  const [newUserJurisdiction, setNewUserJurisdiction] = useState("Maharashtra");

  // Load registered users from localStorage if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("veda_registered_users");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const formatted = parsed.map((u: any, idx: number) => ({
              id: u.id || `REG-${idx + 100}`,
              name: u.name || "Officer",
              email: u.email || "officer@veda.gov.in",
              role: u.role || "officer",
              department: u.department || "Revenue Administration",
              designation: u.designation || "Officer",
              jurisdiction: u.stateName || "State Jurisdiction",
              status: "Active" as const,
              lastLogin: "Recently",
            }));
            setUsers((prev) => {
              const ids = new Set(prev.map((p) => p.email));
              const uniqueNew = formatted.filter((f: UserRecord) => !ids.has(f.email));
              return [...uniqueNew, ...prev];
            });
          }
        }
      } catch (err) {
        console.error("Error reading stored users", err);
      }
    }
  }, []);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    const newUser: UserRecord = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      department: newUserDept || "Dept. of Land Resources",
      designation: newUserDesignation || "Officer",
      jurisdiction: newUserJurisdiction,
      status: "Active",
      lastLogin: "Just now",
    };

    setUsers([newUser, ...users]);
    setIsAddModalOpen(false);

    // Save to localStorage
    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("veda_registered_users") || "[]");
        stored.push(newUser);
        localStorage.setItem("veda_registered_users", JSON.stringify(stored));
      } catch (err) {
        console.error(err);
      }
    }

    // Reset inputs
    setNewUserName("");
    setNewUserEmail("");
    setNewUserDept("");
    setNewUserDesignation("");
  };

  const handleToggleStatus = (id: string | number) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nextStatus =
            u.status === "Active"
              ? "Suspended"
              : u.status === "Suspended"
              ? "Active"
              : "Active";
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const handleDeleteUser = (id: string | number) => {
    if (confirm("Are you sure you want to revoke access for this user?")) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  // Filtered list
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.jurisdiction.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const activeCount = users.filter((u) => u.status === "Active").length;
  const pendingCount = users.filter((u) => u.status === "Pending").length;
  const adminCount = users.filter((u) => u.role === "admin").length;

  const handleSwitchToAdmin = () => {
    const adminUser = {
      name: "Rajesh Kumar, IAS",
      email: "admin@veda.gov.in",
      role: "admin",
      department: "Dept. of Land Resources (DoLR), MoRD",
      designation: "Central Platform Administrator",
      avatarInitials: "RK",
      lastLogin: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("veda_user", JSON.stringify(adminUser));
      window.dispatchEvent(new Event("veda_user_updated"));
    }
    setCurrentUser(adminUser);
  };

  // RBAC Access Gate: Only Platform Admins can view/manage users
  if (authChecked && currentUser && currentUser.role !== "admin") {
    return (
      <div className="max-w-2xl mx-auto my-8 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-2xs">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold uppercase tracking-wider">
            RBAC Access Restriction • Admin Only
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Administrative Privilege Required
          </h1>
          <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            The User &amp; Officer Management directory is strictly restricted to Central Platform Administrators (Joint Secretary / Central PMU).
          </p>
        </div>

        {/* Current user session breakdown */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left max-w-md mx-auto text-xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Active Officer:</span>
            <span className="font-bold text-slate-900">{currentUser.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Current Role:</span>
            <span className="font-bold uppercase text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-200">
              {currentUser.role}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Department:</span>
            <span className="text-slate-700">{currentUser.department}</span>
          </div>
        </div>

        {/* Action buttons to resolve RBAC */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleSwitchToAdmin}
            className="inline-flex items-center gap-2 bg-[#4A2BC2] hover:bg-[#3C1FA4] text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-md shadow-[#4A2BC2]/20 cursor-pointer"
          >
            <KeyRound className="w-4 h-4 text-[#b9a4ff]" />
            <span>Switch to Admin (1-Click Demo)</span>
          </button>

          <Link
            href="/login?redirect=/dashboard/users"
            className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-5 py-2.5 rounded-lg text-xs font-bold transition-colors"
          >
            <Lock className="w-4 h-4 text-slate-500" />
            <span>Sign In as Admin</span>
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#f4f0ff] text-[#4A2BC2] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
              User &amp; Access Governance
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#f4f0ff] text-[#4A2BC2] border border-[#eae4ff]">
              ADMIN CONSOLE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Authorize and manage role permissions for Central administrators, District Revenue Officers,
            SVAMITVA survey specialists, and verified policy researchers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#4A2BC2] hover:bg-[#3C1FA4] text-white px-4 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-all shadow-sm hover:shadow cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite / Add Officer</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Active Users</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-semibold text-slate-900 mt-1">{activeCount}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">● Real-time authenticated</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Platform Admins</span>
            <KeyRound className="w-4 h-4 text-[#4A2BC2]" />
          </div>
          <div className="text-2xl font-semibold text-[#4A2BC2] mt-1">{adminCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Central DoLR / NIC</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Approvals</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-semibold text-amber-600 mt-1">{pendingCount}</div>
          <div className="text-[11px] text-amber-700 font-semibold mt-0.5">Awaiting verification</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Security Protocol</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm font-semibold text-slate-900 mt-2">STQC / GIGW 3.0</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Audit logging enabled</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, district..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#4A2BC2]/20 focus:border-[#4A2BC2]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Role filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="admin">Administrators</option>
            <option value="officer">Revenue Officers</option>
            <option value="researcher">Policy Researchers</option>
            <option value="surveyor">GIS Surveyors</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">User &amp; Designation</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Department / Jurisdiction</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No users matching criteria found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name & Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                              user.role === "admin"
                                ? "bg-[#4A2BC2] text-white"
                                : user.role === "officer"
                                ? "bg-emerald-600 text-white"
                                : user.role === "surveyor"
                                ? "bg-teal-600 text-white"
                                : "bg-blue-600 text-white"
                            }`}
                          >
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{user.name}</div>
                            <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        {user.role === "admin" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f4f0ff] text-[#4A2BC2] border border-[#eae4ff]">
                            <KeyRound className="w-3 h-3" />
                            Admin
                          </span>
                        )}
                        {user.role === "officer" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <Building2 className="w-3 h-3" />
                            Officer
                          </span>
                        )}
                        {user.role === "researcher" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                            <GraduationCap className="w-3 h-3" />
                            Researcher
                          </span>
                        )}
                        {user.role === "surveyor" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                            <Compass className="w-3 h-3" />
                            GIS Surveyor
                          </span>
                        )}
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-semibold">{user.designation}</div>
                        <div className="text-[11px] text-slate-500">{user.department} • {user.jurisdiction}</div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {user.status === "Active" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        )}
                        {user.status === "Pending" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            Pending Approval
                          </span>
                        )}
                        {user.status === "Suspended" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700">
                            <span className="w-2 h-2 rounded-full bg-rose-500" />
                            Suspended
                          </span>
                        )}
                      </td>

                      {/* Last Login */}
                      <td className="py-3.5 px-4 text-slate-500">{user.lastLogin}</td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(user.id)}
                            title={user.status === "Active" ? "Suspend user access" : "Activate user access"}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(user.id)}
                            title="Revoke access"
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Invite Officer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#f4f0ff] text-[#4A2BC2] flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-slate-900 text-base">
                  Invite New Government Officer
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Meenakshi Sundaram, IAS"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#4A2BC2]/20 focus:border-[#4A2BC2]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Official Email Address (@nic.in / @gov.in)
                </label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="officer@nic.in"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#4A2BC2]/20 focus:border-[#4A2BC2]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Role Category
                  </label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#4A2BC2]/20"
                  >
                    <option value="officer">Revenue Officer</option>
                    <option value="admin">Platform Admin</option>
                    <option value="researcher">Policy Researcher</option>
                    <option value="surveyor">GIS Surveyor</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Jurisdiction / State
                  </label>
                  <select
                    value={newUserJurisdiction}
                    onChange={(e) => setNewUserJurisdiction(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#4A2BC2]/20"
                  >
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Central (DoLR)">Central (DoLR)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={newUserDept}
                    onChange={(e) => setNewUserDept(e.target.value)}
                    placeholder="e.g. Revenue Collectorate"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#4A2BC2]/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={newUserDesignation}
                    onChange={(e) => setNewUserDesignation(e.target.value)}
                    placeholder="e.g. Tehsildar / ADM"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#4A2BC2]/20"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#4A2BC2] hover:bg-[#3C1FA4] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Create &amp; Grant Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
