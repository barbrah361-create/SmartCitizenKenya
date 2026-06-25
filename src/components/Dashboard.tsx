import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, FileText, Download, CheckCircle2, AlertCircle, Clock, Trash2, ArrowRight, User, Phone, Key, ShieldCheck, RefreshCw, Sparkles, Bell, QrCode } from "lucide-react";
import { motion } from "motion/react";

interface DashboardProps {
  user: any;
  applications: any[];
  certificates: any[];
  notifications: any[];
  services: any[];
  onUpdateProfile: (name: string, phone: string) => Promise<any>;
  onApplyService: (serviceId: string) => void;
  onDeleteNotification: (id: string) => void;
  showToast: (title: string, message: string, type: "success" | "error") => void;
}

export default function Dashboard({
  user,
  applications,
  certificates,
  notifications,
  services,
  onUpdateProfile,
  onApplyService,
  onDeleteNotification,
  showToast
}: DashboardProps) {
  // Profile update fields
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profilePhone, setProfilePhone] = useState(user?.phone || "");
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Verification qr preview modal
  const [activeCertQr, setActiveCertQr] = useState<string | null>(null);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim() || !profilePhone.trim()) {
      showToast("Validation", "Name and Phone cannot be blank.", "error");
      return;
    }
    setUpdatingProfile(true);
    try {
      await onUpdateProfile(profileName, profilePhone);
      showToast("Success", "Your profile details have been securely synchronized.", "success");
    } catch (e) {
      showToast("Sync Error", "Unable to update profile on central server.", "error");
    } finally {
      setUpdatingProfile(false);
    }
  };

  // Simulated PDF Certificate downloader
  const handleDownloadCertificate = (cert: any) => {
    showToast("PDF Compile", "Assembling digital signature and security seals...", "success");
    setTimeout(() => {
      // Create element to simulate download of beautiful structured certificate
      const dataStr = `data:text/plain;charset=utf-8,${encodeURIComponent(
        `REPUBLIC OF KENYA - OFFICIAL DIGITAL CERTIFICATE\n` +
        `-------------------------------------------------\n` +
        `Document Name: ${cert.serviceName}\n` +
        `Reference No: ${cert.refNumber}\n` +
        `Holder: ${cert.citizenName}\n` +
        `National ID: ${cert.citizenNationalId}\n` +
        `Contact Phone: ${cert.citizenPhone}\n` +
        `Date of Issue: ${cert.issueDate}\n\n` +
        `Verification Hash: ${cert.qrCodeValue}\n` +
        `-------------------------------------------------\n` +
        `This is a digitally compiled academic certificate.\n` +
        `Validate online at /verify?ref=${cert.refNumber}`
      )}`;
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `${cert.serviceName.replace(/\s+/g, "_")}_Certificate.txt`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast("Certificate Fetched", "Document downloaded successfully.", "success");
    }, 1500);
  };

  // Aggregated Stat parameters
  const totalApps = applications.length;
  const pendingApps = applications.filter(a => a.status === "Pending Review" || a.status === "Submitted").length;
  const approvedApps = applications.filter(a => a.status === "Approved" || a.status === "Completed").length;
  const totalCertificates = certificates.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Welcome Board */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-6 rounded-lg shadow-xs gap-4">
        <div>
          <span className="text-[9px] bg-[#006600]/10 text-[#006600] dark:bg-green-950/40 dark:text-green-400 px-2 py-0.5 rounded-sm font-bold uppercase tracking-widest font-mono">
            CITIZEN HUB
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1.5 leading-none font-sans uppercase tracking-tight">
            Welcome, {user.name}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Registered Citizen • National ID No. <span className="font-mono">{user.nationalId}</span>
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono bg-gray-50 dark:bg-neutral-800 border border-gray-100 dark:border-neutral-800 px-3 py-2 rounded-md">
          <Clock className="w-4 h-4 text-[#006600]" />
          <span>System Time: 11:52:39 UTC</span>
        </div>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg shadow-xs flex items-center space-x-4">
          <div className="w-10 h-10 rounded-sm bg-gray-50 dark:bg-neutral-800 flex items-center justify-center text-gray-600 shrink-0 border border-gray-150">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider font-sans">Total Requests</span>
            <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white font-mono">{totalApps}</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg shadow-xs flex items-center space-x-4">
          <div className="w-10 h-10 rounded-sm bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center text-amber-600 shrink-0 border border-amber-200/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider font-sans">Pending Audit</span>
            <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white font-mono">{pendingApps}</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg shadow-xs flex items-center space-x-4">
          <div className="w-10 h-10 rounded-sm bg-green-50 dark:bg-green-950/20 flex items-center justify-center text-[#006600] shrink-0 border border-[#006600]/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider font-sans">Approvals</span>
            <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white font-mono">{approvedApps}</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg shadow-xs flex items-center space-x-4">
          <div className="w-10 h-10 rounded-sm bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-blue-600 shrink-0 border border-blue-200/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider font-sans">Certificates</span>
            <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white font-mono">{totalCertificates}</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Tracker & Download Center / Profile Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Applications Tracker & Download center */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Certificate Download Center */}
          <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-neutral-850 pb-3">
              <h3 className="font-bold text-xs uppercase tracking-widest text-gray-900 dark:text-white flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-[#006600]" />
                <span>Certificate Download Center</span>
              </h3>
              <span className="text-[9px] text-gray-400 font-mono tracking-wider font-bold">SECURE ISSUANCES</span>
            </div>

            {certificates.length === 0 ? (
              <div className="p-8 text-center text-gray-400 font-mono text-xs border border-dashed border-gray-200 dark:border-neutral-800 rounded-md">
                No legal certificates issued yet. Submit an application below.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-4 bg-gray-50/50 dark:bg-neutral-800/20 border border-gray-200 dark:border-neutral-800 rounded-md relative space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[8px] text-[#006600] bg-green-50 dark:bg-green-950/40 px-2 py-0.5 rounded-sm font-mono font-bold uppercase tracking-wider">
                          ACTIVE LICENCE
                        </span>
                        <button
                          onClick={() => setActiveCertQr(cert.refNumber)}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-neutral-700 text-gray-500 rounded-sm cursor-pointer"
                          title="View QR Gate Link"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="font-bold text-xs text-gray-900 dark:text-white mt-2 leading-tight uppercase tracking-tight">
                        {cert.serviceName}
                      </h4>
                      <p className="text-[9px] text-gray-400 mt-1 font-mono">Ref: {cert.refNumber}</p>
                    </div>

                    <div className="pt-3 border-t border-gray-200 dark:border-neutral-800 flex items-center justify-between">
                      <span className="text-[9px] text-gray-500 font-mono">Issued: {cert.issueDate}</span>
                      <button
                        onClick={() => handleDownloadCertificate(cert)}
                        className="flex items-center space-x-1 px-2.5 py-1.5 bg-[#006600] hover:bg-green-800 text-white text-[9px] font-bold uppercase tracking-wider rounded-sm shadow-xs transition-colors cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>Get PDF</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Applications Tracker list */}
          <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-900 dark:text-white border-b border-gray-200 dark:border-neutral-850 pb-3 flex items-center space-x-1.5">
              <FileText className="w-4 h-4 text-[#006600]" />
              <span>Application Status Tracker</span>
            </h3>

            {applications.length === 0 ? (
              <div className="p-8 text-center text-gray-400 font-mono text-xs">
                No submissions found. Choose a shortcut service below to apply.
              </div>
            ) : (
              <div className="space-y-4 divide-y divide-gray-100 dark:divide-neutral-800">
                {applications.map((app) => (
                  <div key={app.id} className="pt-4 first:pt-0 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-xs text-gray-900 dark:text-white uppercase tracking-tight">{app.serviceName}</h4>
                        <span className="text-[9px] text-gray-400 font-mono block">Tracking Ref: {app.id}</span>
                      </div>
                      <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                        app.status === "Approved" || app.status === "Completed"
                          ? "bg-green-50 text-[#006600] dark:bg-green-950/30 dark:text-green-400"
                          : app.status === "Rejected"
                          ? "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                      }`}>
                        {app.status}
                      </span>
                    </div>                     {/* Progress tracker graphic */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <div className="h-1 w-full bg-[#006600] rounded-sm" />
                        <span className="text-[9px] text-gray-400 font-mono">Submitted</span>
                      </div>
                      <div className="space-y-1">
                        <div className={`h-1 w-full rounded-sm ${
                          app.status !== "Draft" && app.status !== "Submitted"
                            ? "bg-[#006600]"
                            : "bg-gray-200 dark:bg-neutral-800"
                        }`} />
                        <span className="text-[9px] text-gray-400 font-mono">Reviewed</span>
                      </div>
                      <div className="space-y-1">
                        <div className={`h-1 w-full rounded-sm ${
                          app.status === "Approved" || app.status === "Completed"
                            ? "bg-[#006600]"
                            : app.status === "Rejected"
                            ? "bg-red-600"
                            : "bg-gray-200 dark:bg-neutral-800"
                        }`} />
                        <span className="text-[9px] text-gray-400 font-mono">Resolution</span>
                      </div>
                    </div>

                    {/* Review Notes */}
                    {app.reviewNotes && (
                      <div className="p-3 bg-gray-50 dark:bg-neutral-800/40 rounded-md border border-gray-200 dark:border-neutral-800 text-xs text-gray-600 dark:text-neutral-400 leading-relaxed font-sans">
                        <strong>Review Notes:</strong> {app.reviewNotes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Shortcuts Grid */}
          <div className="space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-950 dark:text-neutral-200">
              Launch Service Request
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {services.map((srv) => (
                <button
                  key={srv.id}
                  onClick={() => onApplyService(srv.id)}
                  className="p-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg shadow-xs text-left hover:border-[#006600] transition-all group cursor-pointer"
                >
                  <h4 className="font-bold text-xs text-gray-900 dark:text-white group-hover:text-[#006600] dark:group-hover:text-green-400 transition-colors leading-snug uppercase tracking-tight">
                    {srv.name}
                  </h4>
                  <span className="text-[9px] text-gray-400 font-mono block mt-1 uppercase">Est: {srv.estimatedDays} Days</span>
                  <div className="flex items-center space-x-1 px-2 py-1 border border-gray-150 dark:border-neutral-800 group-hover:border-[#006600] rounded-sm text-[9px] text-gray-600 dark:text-neutral-400 group-hover:text-[#006600] font-bold uppercase tracking-wider mt-3 w-fit transition-colors">
                    <span>Apply Now</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Profile summary & Notifications */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Profile settings card */}
          <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-900 dark:text-white border-b border-gray-200 dark:border-neutral-850 pb-3 flex items-center space-x-1.5">
              <User className="w-4 h-4 text-[#006600]" />
              <span>Identity Profile</span>
            </h3>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-neutral-400 block mb-1">Your Legal Name</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 outline-none focus:ring-1 focus:ring-[#006600] text-gray-800 dark:text-neutral-100 text-xs sm:text-sm px-4 py-2.5 rounded-md placeholder-gray-400 font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-neutral-400 block mb-1">National ID (Locked)</label>
                <input
                  type="text"
                  disabled
                  value={user.nationalId}
                  className="w-full bg-gray-100 dark:bg-neutral-800/60 border border-gray-200 dark:border-neutral-700/50 outline-none text-gray-400 text-xs sm:text-sm px-4 py-2.5 rounded-md font-mono cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-neutral-400 block mb-1">Email (Locked)</label>
                <input
                  type="text"
                  disabled
                  value={user.email}
                  className="w-full bg-gray-100 dark:bg-neutral-800/60 border border-gray-200 dark:border-neutral-700/50 outline-none text-gray-400 text-xs sm:text-sm px-4 py-2.5 rounded-md font-mono cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-neutral-400 block mb-1">Registered Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 outline-none focus:ring-1 focus:ring-[#006600] text-gray-800 dark:text-neutral-100 text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-md font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={updatingProfile}
                className="w-full bg-[#006600] hover:bg-green-800 text-white font-bold text-xs uppercase tracking-wider py-2.5 rounded-md shadow-xs transition-colors cursor-pointer"
              >
                {updatingProfile ? "Updating..." : "Synchronize Profile"}
              </button>
            </form>
          </div>

          {/* Notifications feed */}
          <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-900 dark:text-white border-b border-gray-200 dark:border-neutral-850 pb-3 flex items-center space-x-1.5">
              <Bell className="w-4 h-4 text-[#006600]" />
              <span>Recent Alerts</span>
            </h3>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-400 font-mono text-xs">
                  No notifications recorded.
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-3 bg-gray-50 dark:bg-neutral-800/40 border border-gray-200 dark:border-neutral-800 rounded-md relative space-y-1"
                  >
                    <button
                      onClick={() => onDeleteNotification(notif.id)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                      title="Dismiss alert"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <h4 className="font-bold text-xs text-gray-900 dark:text-white leading-snug uppercase tracking-tight">{notif.title}</h4>
                    <p className="text-[11px] text-gray-600 dark:text-neutral-400 pr-4 leading-relaxed font-sans">{notif.message}</p>
                    <span className="text-[9px] text-gray-400 font-mono block pt-1">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* QR Link Modal */}
      {activeCertQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6 max-w-sm w-full text-center space-y-4 shadow-md">
            <h3 className="font-bold text-xs uppercase tracking-widest text-[#006600]">Verification Gateway</h3>
            <p className="text-xs text-gray-500">
              Below is the verified portal validation link for this license. Share this reference code with inspecting officials.
            </p>
            <div className="p-3 bg-gray-50 rounded-md text-xs font-mono select-all text-[#006600] font-bold border border-gray-200 dark:bg-neutral-800 dark:border-neutral-700">
              {activeCertQr}
            </div>
            <div className="flex justify-center py-2">
              <Link
                to={`/verify?ref=${activeCertQr}`}
                className="text-xs font-bold uppercase tracking-wider text-white bg-[#006600] hover:bg-green-800 px-4 py-2.5 rounded-sm shadow-xs transition-colors cursor-pointer"
              >
                Go to Verification Page
              </Link>
            </div>
            <button
              onClick={() => setActiveCertQr(null)}
              className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer block mx-auto font-bold uppercase tracking-wider text-[10px]"
            >
              Close Gateway
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
