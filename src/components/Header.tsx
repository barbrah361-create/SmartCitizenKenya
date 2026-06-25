import React, { useState } from "react";
import { Bell, LogOut, User, LayoutDashboard, Menu, X, Shield, Sun, Moon, MessageSquare } from "lucide-react";
import KenyaLogo from "./KenyaLogo";

interface HeaderProps {
  user: any;
  onLogout: () => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  onToggleAi: () => void;
  notificationsCount: number;
  navigate: (path: string) => void;
}

export default function Header({
  user,
  onLogout,
  darkMode,
  onToggleTheme,
  onToggleAi,
  notificationsCount,
  navigate
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Verify Certificate", path: "/verify" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-colors">
      
      {/* Patriotic Banner Accent Lines - High-contrast minimal */}
      <div className="h-1 w-full flex">
        <div className="h-full flex-1 bg-black" />
        <div className="h-full w-3 bg-[#BB0000]" />
        <div className="h-full flex-1 bg-[#006600]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Brand - Clean Minimalism with crisp flat styling */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center space-x-3 group cursor-pointer text-left animate-fade-in"
            id="header_logo"
          >
            <KenyaLogo className="w-10 h-10" />
            <div>
              <span className="text-xs font-bold tracking-wider text-black dark:text-white block uppercase leading-none font-sans">
                Smart Citizen
              </span>
              <span className="text-[9px] text-gray-500 dark:text-neutral-400 font-mono tracking-tight block mt-0.5">
                REPUBLIC OF KENYA
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className="text-xs uppercase tracking-wider font-bold text-gray-600 dark:text-neutral-400 hover:text-[#006600] dark:hover:text-green-400 transition-colors cursor-pointer"
              >
                {link.name}
              </button>
            ))}

            {/* AI Assistant shortcut */}
            <button
              onClick={onToggleAi}
              className="flex items-center space-x-1.5 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-[#006600] dark:text-green-400 border border-transparent transition-all cursor-pointer"
            >
              <MessageSquare className="w-3 h-3 text-[#006600] dark:text-green-400" />
              <span>Ask Sema AI</span>
            </button>
          </nav>

          {/* Action buttons & User profile details */}
          <div className="flex items-center space-x-4">
            
            {/* Dark Mode toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 text-gray-400 dark:text-neutral-400 hover:text-black dark:hover:text-white rounded-md transition-colors cursor-pointer"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-600" />}
            </button>

            {user ? (
              <div className="flex items-center space-x-3">
                {/* Notification Dropdown toggle */}
                <div className="relative">
                  <button
                    onClick={handleNotificationClick}
                    className="p-2 text-gray-400 dark:text-neutral-400 hover:text-black dark:hover:text-white rounded-md relative transition-colors cursor-pointer"
                    id="btn_notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {notificationsCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-[#BB0000] rounded-full" />
                    )}
                  </button>

                  {/* Notifications Overlay */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-md shadow-lg z-50 overflow-hidden text-sm">
                      <div className="p-3 bg-black text-white font-bold text-xs uppercase tracking-wider flex justify-between items-center">
                        <span>Recent Alerts</span>
                        <span className="text-[10px] bg-neutral-800 px-2 py-0.5 rounded-sm">{notificationsCount} Alerts</span>
                      </div>
                      <div className="p-4 text-center text-gray-500 dark:text-neutral-400 font-mono text-xs">
                        {notificationsCount === 0 ? "No new notifications to display." : `You have ${notificationsCount} notifications. View them on your dashboard.`}
                      </div>
                      <div className="bg-gray-50 dark:bg-neutral-900 p-2 text-center border-t border-gray-100 dark:border-neutral-800">
                        <button
                          onClick={() => { navigate("/dashboard"); setShowNotifications(false); }}
                          className="text-xs text-[#006600] font-bold uppercase tracking-wider hover:underline"
                        >
                          Go to Notification Center
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Dashboard / User Admin portal indicators */}
                <button
                  onClick={() => navigate(user.role === "admin" ? "/admin" : "/dashboard")}
                  className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-md bg-black hover:bg-neutral-800 text-white text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  id="header_dashboard_link"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>{user.role === "admin" ? "Admin Portal" : "My Dashboard"}</span>
                </button>

                {/* Account Settings Avatar / Log out */}
                <div className="flex items-center space-x-2 border-l border-gray-200 dark:border-neutral-800 pl-3">
                  <div className="text-right hidden lg:block">
                    <p className="text-xs font-bold text-gray-950 dark:text-white leading-none uppercase">{user.name}</p>
                    <p className="text-[9px] text-gray-400 dark:text-neutral-500 font-mono mt-0.5 uppercase tracking-wide">
                      {user.role === "admin" ? "Staff Admin" : `ID: ${user.nationalId}`}
                    </p>
                  </div>
                  <button
                    onClick={onLogout}
                    className="p-2 text-gray-400 hover:text-[#BB0000] dark:text-neutral-400 dark:hover:text-red-400 rounded-md transition-colors cursor-pointer"
                    title="Sign Out"
                    id="btn_logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigate("/auth")}
                  className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-neutral-300 hover:text-black px-3 py-1.5 cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/auth?tab=register")}
                  className="text-xs font-black uppercase tracking-wider text-white bg-[#006600] hover:bg-green-800 px-4 py-2 rounded-md shadow-sm transition-colors cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => { navigate(link.path); setMobileMenuOpen(false); }}
              className="block w-full text-left py-2 text-xs uppercase tracking-wider font-bold text-gray-700 dark:text-neutral-300 hover:text-[#006600]"
            >
              {link.name}
            </button>
          ))}
          <button
            onClick={() => { onToggleAi(); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-xs uppercase tracking-wider font-bold text-[#006600]"
          >
            Ask Sema AI
          </button>
          {!user && (
            <button
              onClick={() => { navigate("/auth"); setMobileMenuOpen(false); }}
              className="block w-full text-left py-2 text-xs uppercase tracking-wider font-bold text-gray-700"
            >
              Login / Sign Up
            </button>
          )}
        </div>
      )}

    </header>
  );
}
