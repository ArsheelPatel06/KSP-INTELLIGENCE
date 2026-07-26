import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bell,
  Globe,
  UserCheck,
  Shield,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  LogOut,
  SlidersHorizontal
} from 'lucide-react';

export const Navbar = () => {
  const {
    sidebarCollapsed,
    currentUser,
    setCurrentUser,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    aiLanguage,
    setAiLanguage
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navigate = useNavigate();
  const unreadNotifications = notifications.filter(n => !n.read);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/cases?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const roles = [
    { name: 'Investigator', badge: 'IPS-KA-2016-89', icon: '🕵️‍♂️' },
    { name: 'Analyst', badge: 'KA-INT-2022-14', icon: '📊' },
    { name: 'Supervisor', badge: 'IPS-KA-2010-02', icon: '👮‍♂️' },
    { name: 'Admin', badge: 'SYS-ADMIN-001', icon: '⚡' }
  ];

  const handleRoleChange = (roleName, badge) => {
    setCurrentUser({
      ...currentUser,
      role: roleName,
      badge: badge
    });
    setShowRoleSelector(false);
  };

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-16 bg-[#000000]/95 backdrop-blur-md border-b border-[#27272A] transition-all duration-300 flex items-center justify-between px-6 ${
        sidebarCollapsed ? 'left-20' : 'left-64'
      }`}
    >
      {/* Global Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Global Intelligence Search (FIR #, Suspect, Vehicle, Phone)..."
            className="w-full bg-[#0A0A0A] border border-[#27272A] rounded-lg pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
      </form>

      {/* Right Controls */}
      <div className="flex items-center space-x-4">
        {/* Language Toggle */}
        <button
          onClick={() => setAiLanguage(aiLanguage === 'en' ? 'kn' : 'en')}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-[#0A0A0A] border border-[#27272A] text-xs font-semibold text-white hover:border-blue-500 transition-all"
          title="Toggle AI Language (English / Kannada)"
        >
          <Globe size={14} className="text-blue-400" />
          <span className="uppercase font-bold">{aiLanguage}</span>
        </button>

        {/* System Security Badge */}
        <div className="hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-[11px] font-bold text-emerald-400">
          <Shield size={12} />
          <span>BLACK-OPS SEC-LEVEL 4</span>
        </div>

        {/* Role Switcher Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRoleSelector(!showRoleSelector);
              setShowNotifications(false);
              setShowProfileMenu(false);
            }}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#0A0A0A] border border-[#27272A] text-xs font-bold text-white hover:bg-zinc-900 transition-all"
          >
            <UserCheck size={14} className="text-blue-400" />
            <span className="hidden sm:inline">Role: {currentUser.role}</span>
            <ChevronDown size={14} className="text-zinc-400" />
          </button>

          {showRoleSelector && (
            <div className="absolute right-0 mt-2 w-56 bg-[#0A0A0A] border border-[#27272A] rounded-xl shadow-2xl p-2 z-50">
              <div className="px-3 py-2 border-b border-[#27272A] text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Switch Role Context
              </div>
              <div className="mt-1 space-y-1">
                {roles.map((r) => (
                  <button
                    key={r.name}
                    onClick={() => handleRoleChange(r.name, r.badge)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      currentUser.role === r.name
                        ? 'bg-blue-600/20 text-white border border-blue-500/50 font-bold'
                        : 'text-zinc-300 hover:bg-zinc-900'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{r.icon}</span>
                      <span>{r.name}</span>
                    </div>
                    {currentUser.role === r.name && <CheckCircle2 size={14} className="text-blue-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowRoleSelector(false);
              setShowProfileMenu(false);
            }}
            className="relative p-2 rounded-lg bg-[#0A0A0A] border border-[#27272A] text-white hover:bg-zinc-900 transition-all"
            title="Notifications"
          >
            <Bell size={18} />
            {unreadNotifications.length > 0 && (
              <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 bg-[#0A0A0A] border border-[#27272A] rounded-xl shadow-2xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-[#27272A]">
                <div className="flex items-center space-x-2">
                  <Bell size={16} className="text-blue-400" />
                  <span className="text-xs font-bold text-white">Alerts & Intel Feed</span>
                  <span className="px-2 py-0.5 text-[10px] bg-rose-950 text-rose-400 border border-rose-800 rounded-full font-bold">
                    {unreadNotifications.length} New
                  </span>
                </div>
                <button
                  onClick={markAllNotificationsRead}
                  className="text-[11px] font-bold text-blue-400 hover:underline"
                >
                  Mark All Read
                </button>
              </div>

              <div className="mt-2 max-h-80 overflow-y-auto space-y-2 pr-1">
                {notifications.slice(0, 5).map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      markNotificationRead(notif.id);
                      if (notif.link) navigate(notif.link);
                      setShowNotifications(false);
                    }}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                      notif.read
                        ? 'bg-[#000000] border-[#27272A] text-zinc-400'
                        : 'bg-[#141414] border-blue-800/60 text-white hover:border-blue-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{notif.title}</span>
                      <span className="text-[10px] text-zinc-500">{notif.timestamp}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-zinc-300 line-clamp-2">{notif.message}</p>
                  </div>
                ))}
              </div>

              <div className="mt-2 pt-2 border-t border-[#27272A] text-center">
                <button
                  onClick={() => {
                    navigate('/notifications');
                    setShowNotifications(false);
                  }}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center justify-center space-x-1 w-full py-1"
                >
                  <span>View All Alerts</span>
                  <ExternalLink size={12} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
              setShowRoleSelector(false);
            }}
            className="flex items-center space-x-2 pl-2"
          >
            <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xs shadow-md border border-blue-400">
              VR
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-[#0A0A0A] border border-[#27272A] rounded-xl shadow-2xl p-2 z-50">
              <div className="px-3 py-2 border-b border-[#27272A]">
                <p className="text-xs font-bold text-white">{currentUser.name}</p>
                <p className="text-[10px] text-zinc-400">{currentUser.badge}</p>
              </div>
              <div className="mt-1 space-y-1">
                <button
                  onClick={() => {
                    navigate('/settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs text-white hover:bg-zinc-900 transition-colors"
                >
                  <SlidersHorizontal size={14} className="text-zinc-400" />
                  <span>Profile Settings</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/login');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-950/50 transition-colors font-bold"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
