import React, { useState, useEffect } from "react";
import { useLocation, useNavigate as useReactRouterNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import ServiceApplication from "./components/ServiceApplication";
import AdminPanel from "./components/AdminPanel";
import QrVerify from "./components/QrVerify";
import AiAssistant from "./components/AiAssistant";
import { AlertCircle, CheckCircle2, Sparkles, HelpCircle } from "lucide-react";

export default function App() {
  // Navigation Routing using react-router-dom
  const location = useLocation();
  const reactRouterNavigate = useReactRouterNavigate();

  const currentPath = location.pathname;
  const queryParams = new URLSearchParams(location.search);

  // Global State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Applying service
  const [activeApplyService, setActiveApplyService] = useState<any>(null);

  // UI States
  const [darkMode, setDarkMode] = useState(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);

  // Toast System
  const [toast, setToast] = useState<{ title: string; message: string; type: "success" | "error" } | null>(null);

  const navigate = (path: string) => {
    reactRouterNavigate(path);
  };

  const showToast = (title: string, message: string, type: "success" | "error") => {
    setToast({ title, message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Initial Theme checks
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const preferDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && preferDark)) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleToggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  // Check existing session & fetch metadata
  useEffect(() => {
    let cancelled = false;

    const token = localStorage.getItem("smart_citizen_token");
    console.log("[auth] token present:", !!token);

    // Fetch public services list
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((e) => console.error("Failed to load services", e));

    const authCheck = async () => {
      if (!token) {
        if (!cancelled) setLoading(false);
        return;
      }

      try {
        // Validate token on server
        const res = await fetch("/api/auth/session", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          console.warn("[auth] session invalid:", { status: res.status, body });
          localStorage.removeItem("smart_citizen_token");
          if (!cancelled) {
            setCurrentUser(null);
            setLoading(false);
          }
          return;
        }

        const data = await res.json();
        if (cancelled) return;

        console.log("[auth] session valid, user:", data?.user?.email);
        setCurrentUser(data.user);
        // Sync account credentials and files
        await syncUserData(token);
      } catch (e) {
        console.error("[auth] session check failed:", e);
        localStorage.removeItem("smart_citizen_token");
        if (!cancelled) {
          setCurrentUser(null);
          setLoading(false);
        }
      }
    };

    authCheck();

    return () => {
      cancelled = true;
    };
  }, []);


  const syncUserData = async (token: string) => {
    try {
      const [appsRes, certsRes, alertsRes] = await Promise.all([
        fetch("/api/applications", { headers: { "Authorization": `Bearer ${token}` } }),
        fetch("/api/certificates", { headers: { "Authorization": `Bearer ${token}` } }),
        fetch("/api/notifications", { headers: { "Authorization": `Bearer ${token}` } })
      ]);

      if (appsRes.ok) setApplications(await appsRes.json());
      if (certsRes.ok) setCertificates(await certsRes.json());
      if (alertsRes.ok) setNotifications(await alertsRes.json());
    } catch (e) {
      console.error("Sync user data error", e);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (user: any, token: string) => {
    localStorage.setItem("smart_citizen_token", token);
    setCurrentUser(user);
    setLoading(true);
    syncUserData(token);
  };

  const handleLogout = () => {
    localStorage.removeItem("smart_citizen_token");
    setCurrentUser(null);
    setApplications([]);
    setCertificates([]);
    setNotifications([]);
    navigate("/");
    showToast("Session Terminated", "You have successfully signed out of the portal.", "success");
  };

  // Submit profile details update
  const handleUpdateProfile = async (name: string, phone: string) => {
    const token = localStorage.getItem("smart_citizen_token");
    const res = await fetch("/api/auth/profile", {

      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ name, phone })
    });
    const data = await res.json();
    if (res.ok) {
      setCurrentUser(data.user);
      return data;
    }
    throw new Error(data.message);
  };

  // Add a new application to backend
  const handleCreateApplication = async (fields: any, documents: any[]) => {
    const token = localStorage.getItem("smart_citizen_token");
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        serviceId: activeApplyService.id,
        serviceName: activeApplyService.name,
        fields,
        documents
      })
    });
    const data = await res.json();
    if (res.ok) {
      // Sync list
      syncUserData(token!);
      return data;
    }
    throw new Error(data.message);
  };

  // Delete notification trigger
  const handleDeleteNotification = async (id: string) => {
    const token = localStorage.getItem("smart_citizen_token");
    try {
      await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  // Admin service config operations
  const handleAddService = async (srvData: any) => {
    const token = localStorage.getItem("smart_citizen_token");
    const res = await fetch("/api/admin/services", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(srvData)
    });
    const data = await res.json();
    if (res.ok) {
      setServices(prev => [...prev, data.service]);
      return data;
    }
    throw new Error(data.message);
  };

  const handleEditService = async (id: string, srvData: any) => {
    const token = localStorage.getItem("smart_citizen_token");
    const res = await fetch(`/api/admin/services/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(srvData)
    });
    const data = await res.json();
    if (res.ok) {
      setServices(prev => prev.map(s => s.id === id ? data.service : s));
      return data;
    }
    throw new Error(data.message);
  };

  const handleDeleteService = async (id: string) => {
    const token = localStorage.getItem("smart_citizen_token");
    const res = await fetch(`/api/admin/services/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (res.ok) {
      setServices(prev => prev.filter(s => s.id !== id));
      return;
    }
    throw new Error("Failed to delete service");
  };

  // Router matching logic
  const renderRoute = () => {
    if (loading) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono text-emerald-800 uppercase tracking-widest animate-pulse">
            SECURE HANDSHAKE IN PROGRESS...
          </p>
        </div>
      );
    }

    switch (currentPath) {
      case "/":
      case "":
        return <LandingPage services={services} />;

      case "/auth":
        return <Auth onLoginSuccess={handleLoginSuccess} showToast={showToast} />;

      case "/dashboard":
        if (!currentUser && loading) {
          // Avoid redirect loops while auth validation/loading is still in progress
          return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-mono text-emerald-800 uppercase tracking-widest animate-pulse">
                VALIDATING SESSION...
              </p>
            </div>
          );
        }
        if (!currentUser) {
          navigate("/auth");
          return null;
        }
        if (activeApplyService) {
          return (
            <ServiceApplication
              service={activeApplyService}
              onBack={() => setActiveApplyService(null)}
              onSubmit={handleCreateApplication}
              showToast={showToast}
            />
          );
        }
        return (
          <Dashboard
            user={currentUser}
            applications={applications}
            certificates={certificates}
            notifications={notifications}
            services={services}
            onUpdateProfile={handleUpdateProfile}
            onApplyService={(id) => {
              const selected = services.find(s => s.id === id);
              setActiveApplyService(selected);
            }}
            onDeleteNotification={handleDeleteNotification}
            showToast={showToast}
          />
        );


      case "/admin":
        if ((!currentUser || currentUser.role !== "admin") && loading) {
          return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-mono text-emerald-800 uppercase tracking-widest animate-pulse">
                AUTHORIZING ADMIN...
              </p>
            </div>
          );
        }
        if (!currentUser || currentUser.role !== "admin") {
          navigate("/auth");
          return null;
        }
        return (
          <AdminPanel
            user={currentUser}
            services={services}
            onAddService={handleAddService}
            onEditService={handleEditService}
            onDeleteService={handleDeleteService}
            showToast={showToast}
          />
        );


      case "/verify":
        return <QrVerify />;


      default:
        return (
          <div className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-4">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white uppercase">Obsolete Path 404</h2>
            <p className="text-xs text-gray-500">The gateway requested could not be resolved.</p>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-emerald-800 text-white font-bold text-xs rounded-xl"
            >
              Back to Ingress
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-neutral-950 text-gray-800 dark:text-neutral-100 transition-colors">
      
      {/* Unified Header */}
      <Header
        user={currentUser}
        onLogout={handleLogout}
        darkMode={darkMode}
        onToggleTheme={handleToggleTheme}
        onToggleAi={() => setAiDrawerOpen(true)}
        notificationsCount={notifications.length}
        navigate={navigate}
      />

      {/* Main viewport */}
      <main className="flex-grow">
        {renderRoute()}
      </main>

      {/* Unified Footer */}
      <Footer navigate={navigate} />

      {/* Floating AI Bubble trigger */}
      <button
        onClick={() => setAiDrawerOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3 bg-emerald-800 text-white hover:bg-emerald-950 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 animate-pulse flex items-center justify-center"
        title="Consult Sema AI Helpdesk"
      >
        <Sparkles className="w-6 h-6 text-amber-300" />
      </button>

      {/* Slide-out Sema AI Assistant drawer */}
      <AiAssistant isOpen={aiDrawerOpen} onClose={() => setAiDrawerOpen(false)} />

      {/* Toast notifications popups */}
      {toast && (
        <div className="fixed bottom-24 right-6 z-50 p-4 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-2xl flex items-start space-x-3 max-w-sm animate-bounce">
          <div className="shrink-0 mt-0.5">
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-800" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
          </div>
          <div>
            <h4 className="font-bold text-xs text-gray-900 dark:text-white leading-none uppercase tracking-wide">
              {toast.title}
            </h4>
            <p className="text-[11px] text-gray-600 dark:text-neutral-400 mt-1 leading-relaxed font-sans">
              {toast.message}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
