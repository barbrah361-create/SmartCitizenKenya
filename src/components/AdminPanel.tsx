import React, { useState, useEffect } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, FileText, CheckCircle2, XCircle, Clock, Trash2, Edit2, Plus, RefreshCw, BarChart3, Mail, Phone, ShieldAlert, Eye, DollarSign } from "lucide-react";

interface AdminPanelProps {
  user: any;
  services: any[];
  onAddService: (newSrv: any) => Promise<any>;
  onEditService: (id: string, srvData: any) => Promise<any>;
  onDeleteService: (id: string) => Promise<any>;
  showToast: (title: string, message: string, type: "success" | "error") => void;
}

export default function AdminPanel({
  user,
  services,
  onAddService,
  onEditService,
  onDeleteService,
  showToast
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"analytics" | "applications" | "users" | "services">("analytics");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);

  // Application Pipeline list
  const [apps, setApps] = useState<any[]>([]);
  const [appSearch, setAppSearch] = useState("");
  const [appStatusFilter, setAppStatusFilter] = useState("");

  // Review states
  const [reviewNotes, setReviewNotes] = useState("");
  const [activeReviewApp, setActiveReviewApp] = useState<any>(null);

  // User list states
  const [citizens, setCitizens] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState("");

  // Service Config form states
  const [srvFormActive, setSrvFormActive] = useState(false);
  const [editingSrvId, setEditingSrvId] = useState<string | null>(null);
  const [srvName, setSrvName] = useState("");
  const [srvDesc, setSrvDesc] = useState("");
  const [srvDept, setSrvDept] = useState("");
  const [srvDays, setSrvDays] = useState(3);
  const [srvReqs, setSrvReqs] = useState("");

  useEffect(() => {
    fetchStatsAndData();
  }, []);

  const fetchStatsAndData = async () => {
    setLoading(true);
    const token = localStorage.getItem("smart_citizen_token");
    try {
      // Fetch stats
      const statsRes = await fetch("/api/analytics/stats", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch applications
      const appsRes = await fetch("/api/applications", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const appsData = await appsRes.json();
      setApps(appsData);

      // Fetch citizens
      const citizensRes = await fetch("/api/admin/users", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const citizensData = await citizensRes.json();
      setCitizens(citizensData);
    } catch (e) {
      showToast("Sync Error", "Failed to retrieve central database stats.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Submit Application Status Review decision
  const handleReviewDecision = async (status: "Approved" | "Rejected") => {
    if (!activeReviewApp) return;
    const token = localStorage.getItem("smart_citizen_token");

    try {
      const res = await fetch(`/api/applications/${activeReviewApp.id}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status, reviewNotes })
      });

      if (res.ok) {
        showToast("Review Locked", `Application marked as ${status} successfully.`, "success");
        setReviewNotes("");
        setActiveReviewApp(null);
        fetchStatsAndData(); // refresh
      } else {
        showToast("Review Failed", "Unable to log reviewer decision.", "error");
      }
    } catch (e) {
      showToast("Error", "Network connection glitch.", "error");
    }
  };

  // Toggle user account status
  const handleToggleUserStatus = async (citizen: any) => {
    const token = localStorage.getItem("smart_citizen_token");
    const nextStatus = citizen.status === "active" ? "disabled" : "active";

    try {
      const res = await fetch(`/api/admin/users/${citizen.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });

      if (res.ok) {
        showToast("Account Modified", `Citizen status set to ${nextStatus}.`, "success");
        fetchStatsAndData();
      } else {
        showToast("Action Failed", "Unable to update account permissions.", "error");
      }
    } catch (e) {
      showToast("Error", "Failed to connect to directory.", "error");
    }
  };

  // Delete citizen account
  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this citizen account?")) return;
    const token = localStorage.getItem("smart_citizen_token");

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        showToast("Citizen Removed", "Account successfully deleted.", "success");
        fetchStatsAndData();
      } else {
        showToast("Failed", "Unable to complete account termination.", "error");
      }
    } catch (e) {
      showToast("Error", "Could not reach user directory.", "error");
    }
  };

  // Save/Edit Service Config
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!srvName || !srvDesc || !srvDept) {
      showToast("Validation", "Please fill in all service parameters.", "error");
      return;
    }

    const requirements = srvReqs.split("\n").filter(r => r.trim().length > 0);
    const serviceData = {
      name: srvName,
      description: srvDesc,
      department: srvDept,
      estimatedDays: srvDays,
      requirements
    };

    try {
      if (editingSrvId) {
        await onEditService(editingSrvId, serviceData);
        showToast("Config Updated", "Service configuration updated on central system.", "success");
      } else {
        await onAddService(serviceData);
        showToast("Service Created", "New citizen service registered.", "success");
      }
      setSrvFormActive(false);
      setEditingSrvId(null);
      setSrvName("");
      setSrvDesc("");
      setSrvDept("");
      setSrvDays(3);
      setSrvReqs("");
    } catch (e) {
      showToast("Failed", "Could not write service config.", "error");
    }
  };

  // Trigger service edit populate
  const triggerEditSrv = (srv: any) => {
    setEditingSrvId(srv.id);
    setSrvName(srv.name);
    setSrvDesc(srv.description);
    setSrvDept(srv.department);
    setSrvDays(srv.estimatedDays);
    setSrvReqs(srv.requirements.join("\n"));
    setSrvFormActive(true);
  };

  // Handle service delete
  const handleDeleteSrv = async (id: string) => {
    if (!window.confirm("Obsolete this service? Citizens will no longer be able to submit requests.")) return;
    try {
      await onDeleteService(id);
      showToast("Service Removed", "Service obsoleted successfully.", "success");
    } catch (e) {
      showToast("Failed", "Unable to remove service.", "error");
    }
  };

  // Status distribution colors
  const PIE_COLORS = ["#006600", "#d97706", "#2563eb", "#dc2626", "#4b5563"];

  // Filter applications list
  const filteredApps = apps.filter(a => {
    const matchesSearch = a.userName.toLowerCase().includes(appSearch.toLowerCase()) ||
                          a.serviceName.toLowerCase().includes(appSearch.toLowerCase()) ||
                          a.id.toLowerCase().includes(appSearch.toLowerCase());
    const matchesFilter = appStatusFilter === "" || a.status === appStatusFilter;
    return matchesSearch && matchesFilter;
  });

  // Filter users directory list
  const filteredCitizens = citizens.filter(c => {
    return c.name.toLowerCase().includes(userSearch.toLowerCase()) ||
           c.email.toLowerCase().includes(userSearch.toLowerCase()) ||
           c.nationalId.includes(userSearch);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Welcome Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-6 rounded-lg shadow-xs gap-4 relative overflow-hidden">
        {/* Patriotic stripe */}
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="bg-black flex-1" />
          <div className="bg-[#006600] w-2" />
          <div className="bg-red-600 w-2" />
          <div className="bg-white flex-1" />
        </div>
        
        <div className="mt-1">
          <span className="text-[9px] bg-red-50 text-red-700 border border-red-150 px-2.5 py-1 rounded-sm font-bold uppercase tracking-wider">
            GOVERNMENT STAFF ACCESS
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-950 dark:text-white mt-3 leading-tight uppercase tracking-tight">
            Central Command Center
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Ministry Portal Administrator • Logged as {user.name}
          </p>
        </div>
        <button
          onClick={fetchStatsAndData}
          className="flex items-center space-x-1 px-4 py-2 bg-green-50/50 dark:bg-green-950/20 text-[#006600] dark:text-green-400 text-xs font-bold rounded-md border border-gray-200 dark:border-neutral-800 hover:bg-green-50 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Synchronize Ledger</span>
        </button>
      </div>

      {/* Admin Tab Selectors */}
      <div className="flex border-b border-gray-200 dark:border-neutral-800 overflow-x-auto whitespace-nowrap">
        {[
          { key: "analytics", label: "Operations Reports", icon: BarChart3 },
          { key: "applications", label: "Review Pipeline", icon: FileText },
          { key: "users", label: "Citizens Directory", icon: Users },
          { key: "services", label: "Service Settings", icon: Plus }
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`flex items-center space-x-2 py-3 px-6 text-xs font-bold border-b-2 transition-colors uppercase tracking-wider cursor-pointer ${
              activeTab === t.key
                ? "border-[#006600] text-[#006600] dark:text-green-400 font-bold"
                : "border-transparent text-gray-500 hover:text-gray-950 dark:hover:text-white"
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT: ANALYTICS */}
      {activeTab === "analytics" && (
        <div className="space-y-10">
          
          {stats && (
            <>
              {/* Summary Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="p-5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg shadow-xs flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-sm bg-gray-50 dark:bg-neutral-800 flex items-center justify-center text-gray-650 border border-gray-200 dark:border-neutral-750 shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Total Citizens</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white font-mono">{stats.totalCitizens}</span>
                  </div>
                </div>

                <div className="p-5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg shadow-xs flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-sm bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center text-amber-600 border border-amber-100 dark:border-neutral-750 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Pending Reviews</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white font-mono">{stats.pendingReviews}</span>
                  </div>
                </div>

                <div className="p-5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg shadow-xs flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-sm bg-green-50/50 dark:bg-green-950/20 flex items-center justify-center text-[#006600] dark:text-green-400 border border-gray-200 dark:border-neutral-750 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Approved Registries</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white font-mono">{stats.totalApproved}</span>
                  </div>
                </div>

                <div className="p-5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg shadow-xs flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-sm bg-blue-50/50 dark:bg-blue-950/10 flex items-center justify-center text-blue-650 border border-blue-100 dark:border-neutral-750 shrink-0">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Simulated Revenue</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white font-mono">Ksh. {stats.simulatedRevenue.toLocaleString()}</span>
                  </div>
                </div>

              </div>

              {/* Analytical Charts Grid (using Recharts) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Chart 1: Monthly applications timeline (Area Chart) */}
                <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6 shadow-xs space-y-4">
                  <h3 className="font-bold text-xs text-gray-900 dark:text-white uppercase tracking-widest">Submissions Volume Timeline</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats.monthlyApplications}>
                        <defs>
                          <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#006600" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#006600" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" stroke="#888" style={{ fontSize: "10px", fontFamily: "monospace" }} />
                        <YAxis stroke="#888" style={{ fontSize: "10px", fontFamily: "monospace" }} />
                        <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "4px" }} />
                        <Area type="monotone" dataKey="submissions" stroke="#006600" fillOpacity={1} fill="url(#colorSubmissions)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 2: Service Popularity (Bar Chart) */}
                <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6 shadow-xs space-y-4">
                  <h3 className="font-bold text-xs text-gray-900 dark:text-white uppercase tracking-widest">Submissions Popularity by Department</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.serviceStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" truncate stroke="#888" style={{ fontSize: "10px", fontFamily: "monospace" }} />
                        <YAxis stroke="#888" style={{ fontSize: "10px", fontFamily: "monospace" }} />
                        <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "4px" }} />
                        <Bar dataKey="applications" fill="#006600" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 3: Application Status (Pie Chart) */}
                <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6 shadow-xs space-y-4 lg:col-span-1">
                  <h3 className="font-bold text-xs text-gray-900 dark:text-white uppercase tracking-widest">Audit Pipeline Status Distribution</h3>
                  <div className="h-64 flex justify-center items-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                           data={stats.statusStats}
                           cx="50%"
                           cy="50%"
                           labelLine={false}
                           label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                           outerRadius={80}
                           fill="#8884d8"
                           dataKey="value"
                           style={{ fontSize: "9px", fontFamily: "monospace" }}
                        >
                          {stats.statusStats.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "4px" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 4: Citizen Growth Timeline (Bar Chart) */}
                <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6 shadow-xs space-y-4">
                  <h3 className="font-bold text-xs text-gray-900 dark:text-white uppercase tracking-widest">Registered Citizen Growth</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.userGrowth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" stroke="#888" style={{ fontSize: "10px", fontFamily: "monospace" }} />
                        <YAxis stroke="#888" style={{ fontSize: "10px", fontFamily: "monospace" }} />
                        <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "4px" }} />
                        <Bar dataKey="citizens" fill="#006600" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            </>
          )}

        </div>
      )}

      {/* TAB CONTENT: SERVICE REVIEWS PIPELINE */}
      {activeTab === "applications" && (
        <div className="space-y-6">
          
          {/* Filters Area */}
          <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-5 shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-center">
            <input
              type="text"
              placeholder="Search by citizen name, service, or ref..."
              value={appSearch}
              onChange={(e) => setAppSearch(e.target.value)}
              className="w-full sm:max-w-md bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-750 outline-none focus:ring-1 focus:ring-[#006600] text-gray-800 dark:text-neutral-100 text-xs sm:text-sm px-4 py-2.5 rounded-md placeholder-gray-400"
            />
            <select
              value={appStatusFilter}
              onChange={(e) => setAppStatusFilter(e.target.value)}
              className="w-full sm:max-w-xs bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-750 outline-none focus:ring-1 focus:ring-[#006600] text-gray-800 dark:text-neutral-100 text-xs sm:text-sm px-4 py-2.5 rounded-md"
            >
              <option value="">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Applications list table */}
          <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-neutral-800 text-gray-400 font-bold uppercase border-b border-gray-200 dark:border-neutral-700">
                    <th className="p-4 font-sans text-[9px] tracking-widest uppercase">Ref ID</th>
                    <th className="p-4 font-sans text-[9px] tracking-widest uppercase">Citizen</th>
                    <th className="p-4 font-sans text-[9px] tracking-widest uppercase">Requested Service</th>
                    <th className="p-4 font-sans text-[9px] tracking-widest uppercase">Status</th>
                    <th className="p-4 font-sans text-[9px] tracking-widest uppercase">Submitted Date</th>
                    <th className="p-4 font-sans text-[9px] tracking-widest uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 dark:divide-neutral-800">
                  {filteredApps.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400 font-mono">
                        No citizen applications found matching this query.
                      </td>
                    </tr>
                  ) : (
                    filteredApps.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50/50 dark:hover:bg-neutral-800/40">
                        <td className="p-4 font-mono font-bold text-[11px] text-[#006600] dark:text-green-400">{app.id}</td>
                        <td className="p-4">
                          <p className="font-bold text-gray-900 dark:text-white leading-none uppercase text-xs tracking-tight">{app.userName}</p>
                          <span className="text-[10px] text-gray-400 font-mono mt-0.5 block">{app.userEmail}</span>
                        </td>
                        <td className="p-4 font-bold text-gray-750 dark:text-neutral-300 text-xs uppercase tracking-tight">{app.serviceName}</td>
                        <td className="p-4">
                          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-sm border ${
                            app.status === "Approved" || app.status === "Completed"
                              ? "bg-green-50/50 text-[#006600] border-green-200"
                              : app.status === "Rejected"
                              ? "bg-red-50 text-red-800"
                              : "bg-amber-50 text-amber-800"
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="p-4 text-gray-500 font-mono text-xs">{new Date(app.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setActiveReviewApp(app)}
                            className="text-[10px] uppercase font-bold text-white bg-[#006600] hover:bg-green-800 px-3 py-1.5 rounded-sm shadow-xs transition-colors cursor-pointer"
                          >
                            Review Files
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Active Review Modal */}
          {activeReviewApp && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
              <div className="bg-white dark:bg-neutral-900 border border-gray-250 dark:border-neutral-800 rounded-lg p-6 max-w-2xl w-full space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                
                {/* Patriotic stripe */}
                <div className="absolute top-0 left-0 right-0 h-1 flex">
                  <div className="bg-black flex-1" />
                  <div className="bg-red-600 w-2" />
                  <div className="bg-white flex-1" />
                </div>

                <div className="flex justify-between items-start pt-1.5">
                  <div>
                    <h3 className="font-bold text-xs uppercase tracking-widest text-[#006600]">Review Application Package</h3>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">Tracking Ref: {activeReviewApp.id}</p>
                  </div>
                  <button
                    onClick={() => setActiveReviewApp(null)}
                    className="text-gray-400 hover:text-black dark:hover:text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Close Review
                  </button>
                </div>

                {/* Submitter Credentials */}
                <div className="p-4 bg-gray-50 dark:bg-neutral-800/40 border border-gray-200 dark:border-neutral-800 rounded-md grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Citizen Submitter</span>
                    <span className="font-bold text-gray-900 dark:text-white mt-1 block uppercase tracking-tight text-xs">{activeReviewApp.userName}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Service Requested</span>
                    <span className="font-bold text-gray-900 dark:text-white mt-1 block uppercase tracking-tight text-xs">{activeReviewApp.serviceName}</span>
                  </div>
                </div>

                {/* Form parameters */}
                <div className="space-y-2">
                  <h4 className="font-bold text-[10px] uppercase tracking-widest text-gray-400">Parameters Log</h4>
                  <div className="p-4 bg-gray-100 dark:bg-neutral-800/80 border border-gray-200 dark:border-neutral-750 rounded-md space-y-1.5 text-xs font-mono">
                    {Object.keys(activeReviewApp.fields).map((key) => (
                      <div key={key} className="flex justify-between border-b border-gray-200/50 dark:border-neutral-700/60 pb-1 last:border-none">
                        <span className="text-gray-450 uppercase text-[10px] tracking-wider">{key}:</span>
                        <span className="font-bold text-gray-900 dark:text-white">{activeReviewApp.fields[key]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scanned files lists */}
                <div className="space-y-2">
                  <h4 className="font-bold text-[10px] uppercase tracking-widest text-gray-400">Uploaded Scans ({activeReviewApp.documents.length})</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {activeReviewApp.documents.map((doc: any) => (
                      <div
                        key={doc.id}
                        className="p-3 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-800 rounded-md flex items-center justify-between"
                      >
                        <span className="font-bold truncate pr-2 text-gray-800 dark:text-neutral-200 text-xs">{doc.name}</span>
                        <button
                          onClick={() => window.open(doc.url, "_blank")}
                          className="flex items-center space-x-1 font-bold text-[#006600] hover:underline shrink-0 text-xs uppercase tracking-wider cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View file</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action input boxes */}
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block">Reviewer Notes (Dispatched directly to citizen dashboard)</label>
                  <textarea
                    rows={3}
                    placeholder="Provide detailed feedback, required amendments, or reasons for rejection..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-750 outline-none focus:ring-1 focus:ring-[#006600] text-gray-800 dark:text-neutral-100 text-xs p-4 rounded-md placeholder-gray-400 font-sans"
                  />
                </div>

                {/* Final approvals buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleReviewDecision("Rejected")}
                    className="flex-1 py-3 bg-red-650 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-md transition-colors cursor-pointer"
                  >
                    Reject Application
                  </button>
                  <button
                    onClick={() => handleReviewDecision("Approved")}
                    className="flex-1 py-3 bg-[#006600] hover:bg-green-800 text-white font-bold text-xs uppercase tracking-wider rounded-md transition-colors cursor-pointer"
                  >
                    Issue Approved Certificate
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      )}      {/* TAB CONTENT: CITIZENS DIRECTORY MANAGER */}
      {activeTab === "users" && (
        <div className="space-y-6">
          
          <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-5 rounded-lg shadow-xs">
            <input
              type="text"
              placeholder="Search by legal name, email, or National ID..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-750 outline-none focus:ring-1 focus:ring-[#006600] text-gray-800 dark:text-neutral-100 text-xs sm:text-sm px-4 py-2.5 rounded-md placeholder-gray-400"
            />
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-neutral-800 text-gray-400 font-bold uppercase border-b border-gray-200 dark:border-neutral-700">
                    <th className="p-4 font-sans text-[9px] tracking-widest uppercase">Citizen Full Name</th>
                    <th className="p-4 font-sans text-[9px] tracking-widest uppercase">Contact Email</th>
                    <th className="p-4 font-sans text-[9px] tracking-widest uppercase">National ID</th>
                    <th className="p-4 font-sans text-[9px] tracking-widest uppercase">Phone No.</th>
                    <th className="p-4 font-sans text-[9px] tracking-widest uppercase">Privilege Role</th>
                    <th className="p-4 font-sans text-[9px] tracking-widest uppercase">Account Access</th>
                    <th className="p-4 font-sans text-[9px] tracking-widest uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 dark:divide-neutral-800">
                  {filteredCitizens.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50/50 dark:hover:bg-neutral-800/40">
                      <td className="p-4 font-bold text-gray-900 dark:text-white uppercase text-xs tracking-tight">{c.name}</td>
                      <td className="p-4 font-mono text-[11px] text-gray-650 dark:text-neutral-400">{c.email}</td>
                      <td className="p-4 font-mono font-bold text-gray-700 dark:text-neutral-300">ID: {c.nationalId}</td>
                      <td className="p-4 font-mono text-gray-500">{c.phone}</td>
                      <td className="p-4 capitalize">
                        <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold border ${
                          c.role === "admin" ? "bg-red-50 text-red-800 border-red-150" : "bg-gray-100 text-gray-700 border-gray-200"
                        }`}>
                          {c.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-sm border ${
                          c.status === "active" ? "bg-green-50/50 text-[#006600] border-green-200" : "bg-red-50 text-red-800 border-red-200"
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleToggleUserStatus(c)}
                          className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-sm cursor-pointer ${
                            c.status === "active"
                              ? "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/50"
                              : "bg-green-50/50 text-[#006600] hover:bg-green-50 border border-green-200/50"
                          }`}
                        >
                          {c.status === "active" ? "Disable" : "Enable"}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(c.id)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-sm border border-red-200/50 transition-colors cursor-pointer"
                          title="Terminate Account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB CONTENT: SERVICES CONFIGURATION MANAGER */}
      {activeTab === "services" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Registered Services lists */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="font-bold text-xs text-gray-900 dark:text-white uppercase tracking-widest">
              Existing Services ({services.length})
            </h3>

            <div className="space-y-4">
              {services.map((srv) => (
                <div
                  key={srv.id}
                  className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-5 rounded-lg shadow-xs flex justify-between items-center"
                >
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white uppercase tracking-tight leading-none">{srv.name}</h4>
                    <span className="text-[10px] text-gray-400 font-mono block mt-1 uppercase">{srv.department}</span>
                    <span className="text-[10px] font-bold text-[#006600] block mt-1.5 uppercase tracking-wider">SLA: {srv.estimatedDays} Days</span>
                  </div>

                  <div className="flex space-x-2 shrink-0 pl-3">
                    <button
                      onClick={() => triggerEditSrv(srv)}
                      className="p-2 text-gray-500 hover:text-[#006600] bg-gray-50 dark:bg-neutral-800 hover:bg-green-50 rounded-sm border border-gray-200 dark:border-neutral-750 transition-colors cursor-pointer"
                      title="Edit Configuration"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSrv(srv.id)}
                      className="p-2 text-gray-500 hover:text-red-500 bg-gray-50 dark:bg-neutral-800 hover:bg-red-50 rounded-sm border border-gray-200 dark:border-neutral-750 transition-colors cursor-pointer"
                      title="Delete Service"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Register/Edit Service Form */}
          <form onSubmit={handleSaveService} className="lg:col-span-5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-6 rounded-lg shadow-xs space-y-5">
            <h3 className="font-bold text-xs text-gray-900 dark:text-white uppercase tracking-widest border-b border-gray-200 dark:border-neutral-800 pb-3">
              {editingSrvId ? "Modify Service Profile" : "Register New Service"}
            </h3>

            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-neutral-400 block mb-1">Service Name</label>
              <input
                type="text"
                required
                value={srvName}
                onChange={(e) => setSrvName(e.target.value)}
                className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-750 outline-none focus:ring-1 focus:ring-[#006600] text-gray-800 dark:text-neutral-100 text-xs sm:text-sm px-4 py-2.5 rounded-md placeholder-gray-400 font-bold uppercase tracking-tight"
                placeholder="e.g. Passport Renewal"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-neutral-400 block mb-1">Service Description</label>
              <textarea
                rows={3}
                required
                value={srvDesc}
                onChange={(e) => setSrvDesc(e.target.value)}
                className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-750 outline-none focus:ring-1 focus:ring-[#006600] text-gray-800 dark:text-neutral-100 text-xs p-4 rounded-md placeholder-gray-400"
                placeholder="Provide a detailed description of the pathway..."
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-neutral-400 block mb-1">Department</label>
              <input
                type="text"
                required
                value={srvDept}
                onChange={(e) => setSrvDept(e.target.value)}
                className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-750 outline-none focus:ring-1 focus:ring-[#006600] text-gray-800 dark:text-neutral-100 text-xs sm:text-sm px-4 py-2.5 rounded-md placeholder-gray-400"
                placeholder="e.g. Department of Immigration"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-neutral-400 block mb-1">Estimated SLA Period (Days)</label>
              <input
                type="number"
                required
                value={srvDays}
                onChange={(e) => setSrvDays(Number(e.target.value))}
                className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-750 outline-none focus:ring-1 focus:ring-[#006600] text-gray-800 dark:text-neutral-100 text-xs sm:text-sm px-4 py-2.5 rounded-md font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-neutral-400 block mb-1">Requirements (one per line)</label>
              <textarea
                rows={3}
                value={srvReqs}
                onChange={(e) => setSrvReqs(e.target.value)}
                className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-750 outline-none focus:ring-1 focus:ring-[#006600] text-gray-800 dark:text-neutral-100 text-xs p-4 rounded-md font-mono"
                placeholder="e.g. Copy of Birth Certificate&#10;Copy of Parents ID"
              />
            </div>

            <div className="flex space-x-2 pt-2">
              {editingSrvId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingSrvId(null);
                    setSrvName("");
                    setSrvDesc("");
                    setSrvDept("");
                    setSrvDays(3);
                    setSrvReqs("");
                  }}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold uppercase tracking-wider rounded-md cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#006600] hover:bg-green-800 text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-xs transition-colors cursor-pointer"
              >
                {editingSrvId ? "Apply Modifications" : "Register Service"}
              </button>
            </div>
          </form>

        </div>
      )}

    </div>
  );
}
