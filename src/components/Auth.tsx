import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Shield, Mail, Lock, Phone, User, FileText, Sparkles, Key, AlertCircle, ArrowLeft } from "lucide-react";
import KenyaLogo from "./KenyaLogo";

interface AuthProps {
  onLoginSuccess: (user: any, token: string) => void;
  showToast: (title: string, message: string, type: "success" | "error") => void;
}

export default function Auth({ onLoginSuccess, showToast }: AuthProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Forgot Password / Reset Password States
  const [forgotPasswordActive, setForgotPasswordActive] = useState(false);
  const [resetActive, setResetActive] = useState(false);
  const [smsResult, setSmsResult] = useState<string | null>(null);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "register") {
      setIsRegister(true);
    } else {
      setIsRegister(false);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (isRegister) {
      if (!name || !nationalId || !phone || !email || !password || !confirmPassword) {
        showToast("Validation", "Please complete all registration fields.", "error");
        return;
      }
      if (password !== confirmPassword) {
        showToast("Validation", "Passwords do not match.", "error");
        return;
      }
      if (nationalId.length < 6 || isNaN(Number(nationalId))) {
        showToast("Validation", "Please input a valid Kenyan National ID number.", "error");
        return;
      }

      setLoading(true);
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, nationalId, phone, email, password })
        });
        const data = await res.json();

        if (res.ok) {
          showToast("Karibu!", "Citizen account successfully initialized.", "success");
          onLoginSuccess(data.user, data.token);
          navigate("/dashboard");
        } else {
          showToast("Registration Refused", data.message || "Unable to register citizen.", "error");
        }
      } catch (err) {
        showToast("Error", "Network connection issues.", "error");
      } finally {
        setLoading(false);
      }
    } else {
      // Login
      if (!email || !password) {
        showToast("Validation", "Email and Password are required.", "error");
        return;
      }

      setLoading(true);
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (res.ok) {
          showToast("Session Active", `Welcome back, ${data.user.name}!`, "success");
          onLoginSuccess(data.user, data.token);
          if (data.user.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/dashboard");
          }
        } else {
          showToast("Access Denied", data.message || "Invalid credentials.", "error");
        }
      } catch (err) {
        showToast("Error", "Network connection issues.", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast("Required", "Please provide your registered citizen email.", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        showToast("SMS Sent", "Password recovery credentials dispatched.", "success");
        setSmsResult(data.message);
        setResetActive(true);
      } else {
        showToast("Recovery Failed", data.message, "error");
      }
    } catch (e) {
      showToast("Error", "Connection error.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password !== confirmPassword) {
      showToast("Validation", "Passwords must match.", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Reset Success", "Your citizen credentials have been updated.", "success");
        setForgotPasswordActive(false);
        setResetActive(false);
        setSmsResult(null);
      } else {
        showToast("Failed", data.message, "error");
      }
    } catch (e) {
      showToast("Error", "Connection failure.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F5] dark:bg-neutral-950 p-4 py-16 relative overflow-hidden transition-colors">
      
      {/* Visual Background Elements */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-neutral-200/50 dark:bg-neutral-900/10 blur-3xl" />

      <div className="max-w-md w-full relative z-10">
        
        {/* Brand Banner Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <KenyaLogo className="w-14 h-14 mb-3" />
          <h2 className="text-xl font-bold font-sans text-gray-900 dark:text-white uppercase tracking-wider">
            Kenya Smart Citizen
          </h2>
          <span className="text-[10px] text-[#006600] dark:text-green-500 font-mono tracking-widest uppercase block mt-1 font-bold">
            Secure Government Ingress
          </span>
        </div>

        {/* Auth Glassmorphic Card */}
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg shadow-sm overflow-hidden p-6 sm:p-8">
          
          {/* Main login forgot/reset logic switch */}
          {forgotPasswordActive ? (
            <div>
              <button
                onClick={() => { setForgotPasswordActive(false); setResetActive(false); }}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-500 hover:underline mb-6"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to login</span>
              </button>

              {!resetActive ? (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recover Credentials</h3>
                  <p className="text-xs text-gray-500 dark:text-neutral-400">
                    Provide your citizen email address. We will verify your civil records and simulate an SMS OTP protocol to your registered mobile phone.
                  </p>
                  <div>
                    <label className="text-xs font-bold text-gray-500 dark:text-neutral-400 block mb-1">Citizen Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="citizen@citizen.go.ke"
                        className="w-full bg-gray-50 dark:bg-neutral-800 border-none outline-none focus:ring-1 focus:ring-emerald-700 text-gray-800 dark:text-neutral-100 text-xs sm:text-sm pl-10 pr-4 py-3 rounded-xl placeholder-gray-400"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-800 hover:bg-emerald-950 text-white font-semibold text-xs sm:text-sm py-3 rounded-xl shadow transition-all mt-2"
                  >
                    {loading ? "Processing..." : "Submit Recovery Request"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Complete Credentials Reset</h3>
                  {smsResult && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/40 text-amber-800 dark:text-amber-300 rounded-xl text-xs flex items-start space-x-2 font-mono">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{smsResult}</span>
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-bold text-gray-500 dark:text-neutral-400 block mb-1">New Secure Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-neutral-800 border-none outline-none focus:ring-1 focus:ring-emerald-700 text-gray-800 dark:text-neutral-100 text-xs sm:text-sm pl-10 pr-4 py-3 rounded-xl"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 dark:text-neutral-400 block mb-1">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-neutral-800 border-none outline-none focus:ring-1 focus:ring-emerald-700 text-gray-800 dark:text-neutral-100 text-xs sm:text-sm pl-10 pr-4 py-3 rounded-xl"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-800 hover:bg-emerald-950 text-white font-semibold text-xs sm:text-sm py-3 rounded-xl shadow transition-all mt-2"
                  >
                    {loading ? "Updating..." : "Save Credentials"}
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div>
              {/* Login / Register tab selectors */}
              <div className="flex bg-gray-100 dark:bg-neutral-800 p-1 rounded-md mb-6 border border-gray-200 dark:border-neutral-700">
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className={`flex-1 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    !isRegister
                      ? "bg-white dark:bg-neutral-700 text-[#006600] dark:text-white shadow-xs"
                      : "text-gray-500 hover:text-gray-950 dark:hover:text-white"
                  }`}
                >
                  Citizen Login
                </button>
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className={`flex-1 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    isRegister
                      ? "bg-white dark:bg-neutral-700 text-[#006600] dark:text-white shadow-xs"
                      : "text-gray-500 hover:text-gray-950 dark:hover:text-white"
                  }`}
                >
                  Citizen Signup
                </button>
              </div>

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {isRegister && (
                  <>
                    <div>
                      <label className="text-xs font-bold text-gray-500 dark:text-neutral-400 block mb-1">Full Legal Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. David Kiprop"
                          className="w-full bg-gray-50 dark:bg-neutral-800 border-none outline-none focus:ring-1 focus:ring-[#006600] text-gray-800 dark:text-neutral-100 text-xs sm:text-sm pl-10 pr-4 py-3 rounded-md placeholder-gray-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-gray-500 dark:text-neutral-400 block mb-1">National ID Number</label>
                        <div className="relative">
                          <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            required
                            value={nationalId}
                            onChange={(e) => setNationalId(e.target.value)}
                            placeholder="e.g. 87654321"
                            className="w-full bg-gray-50 dark:bg-neutral-800 border-none outline-none focus:ring-1 focus:ring-[#006600] text-gray-800 dark:text-neutral-100 text-xs sm:text-sm pl-10 pr-4 py-3 rounded-md placeholder-gray-400 font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-500 dark:text-neutral-400 block mb-1">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+254 712 345678"
                            className="w-full bg-gray-50 dark:bg-neutral-800 border-none outline-none focus:ring-1 focus:ring-[#006600] text-gray-800 dark:text-neutral-100 text-xs sm:text-sm pl-10 pr-4 py-3 rounded-md placeholder-gray-400 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-neutral-400 block mb-1">Citizen Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="citizen@citizen.go.ke"
                      className="w-full bg-gray-50 dark:bg-neutral-800 border-none outline-none focus:ring-1 focus:ring-[#006600] text-gray-800 dark:text-neutral-100 text-xs sm:text-sm pl-10 pr-4 py-3 rounded-md placeholder-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-gray-500 dark:text-neutral-400">Password</label>
                    {!isRegister && (
                      <button
                        type="button"
                        onClick={() => setForgotPasswordActive(true)}
                        className="text-[10px] font-bold uppercase tracking-wider text-[#006600] hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-gray-50 dark:bg-neutral-800 border-none outline-none focus:ring-1 focus:ring-[#006600] text-gray-800 dark:text-neutral-100 text-xs sm:text-sm pl-10 pr-4 py-3 rounded-md placeholder-gray-400"
                    />
                  </div>
                </div>

                {isRegister && (
                  <div>
                    <label className="text-xs font-bold text-gray-500 dark:text-neutral-400 block mb-1">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-gray-50 dark:bg-neutral-800 border-none outline-none focus:ring-1 focus:ring-[#006600] text-gray-800 dark:text-neutral-100 text-xs sm:text-sm pl-10 pr-4 py-3 rounded-md placeholder-gray-400"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#006600] hover:bg-green-800 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-md shadow-sm transition-all mt-4 cursor-pointer"
                  id="btn_auth_submit"
                >
                  {loading ? "Processing..." : isRegister ? "Create Portal Account" : "Access Portal Ingress"}
                </button>

              </form>

              {/* Demo accounts credentials tip */}
              <div className="mt-6 border-t border-gray-200 dark:border-neutral-800 pt-4 text-[10px] text-gray-500 space-y-1.5 bg-gray-50 dark:bg-neutral-800 p-4 rounded-md leading-relaxed">
                <span className="font-bold text-gray-800 dark:text-neutral-200 uppercase block mb-1 tracking-wider">
                  Academic Evaluation Access
                </span>
                <p>
                  <strong>Citizen Account:</strong> <code className="font-mono bg-neutral-200 dark:bg-neutral-700 px-1 py-0.5 rounded-sm">citizen@citizen.go.ke</code> / <code className="font-mono bg-neutral-200 dark:bg-neutral-700 px-1 py-0.5 rounded-sm">Citizen123!</code>
                </p>
                <p>
                  <strong>Admin Account:</strong> <code className="font-mono bg-neutral-200 dark:bg-neutral-700 px-1 py-0.5 rounded-sm">admin@citizen.go.ke</code> / <code className="font-mono bg-neutral-200 dark:bg-neutral-700 px-1 py-0.5 rounded-sm">Admin123!</code>
                </p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
