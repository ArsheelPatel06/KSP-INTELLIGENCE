import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Bot,
  Search,
  FileText,
  BarChart3,
  Map,
  Network,
  FileCheck2,
  Bell,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export const Sidebar = () => {
  const { sidebarCollapsed, setSidebarCollapsed, currentUser, notifications } = useApp();

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'AI Crime Assistant', path: '/ai-assistant', icon: Bot, badge: 'AI' },
    { name: 'Search Cases', path: '/cases', icon: Search },
    { name: 'Case Details', path: '/cases/FIR-2026-KA-0042', icon: FileText },
    { name: 'Crime Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Crime Map', path: '/map', icon: Map },
    { name: 'Criminal Network', path: '/network', icon: Network },
    { name: 'Reports', path: '/reports', icon: FileCheck2 },
    { name: 'Notifications', path: '/notifications', icon: Bell, count: unreadNotificationsCount },
    { name: 'Admin Panel', path: '/admin', icon: ShieldCheck },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-[#050505] border-r border-[#27272A] transition-all duration-300 flex flex-col justify-between ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Branding */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#27272A]">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="h-10 w-10 min-w-10 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <ShieldAlert size={22} className="text-blue-400" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-sm text-white tracking-tight leading-none">SENTINEL-AI</span>
                <span className="text-[10px] text-blue-400 font-semibold tracking-wider mt-1 uppercase">Crime Intel Platform</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-900 transition-colors"
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* User Role Banner */}
        {!sidebarCollapsed && (
          <div className="mx-3 my-3 p-3 bg-[#0A0A0A] border border-[#27272A] rounded-lg flex items-center justify-between shadow-md">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white truncate max-w-[130px]">{currentUser.name}</span>
              <span className="text-[10px] text-zinc-400">{currentUser.district}</span>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-950 text-blue-400 border border-blue-800 uppercase">
              {currentUser.role}
            </span>
          </div>
        )}

        {/* Navigation List */}
        <nav className="mt-2 px-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600/20 text-white border border-blue-500/50 font-bold shadow-md'
                    : 'text-zinc-400 hover:bg-zinc-900/80 hover:text-white'
                } ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`
              }
              title={sidebarCollapsed ? item.name : undefined}
            >
              <div className="flex items-center space-x-3">
                <item.icon size={18} className="shrink-0 text-blue-400" />
                {!sidebarCollapsed && <span>{item.name}</span>}
              </div>

              {!sidebarCollapsed && (
                <div className="flex items-center space-x-1.5">
                  {item.badge && (
                    <span className="px-1.5 py-0.2 text-[9px] font-extrabold rounded bg-blue-500/20 text-blue-400 border border-blue-500/40">
                      {item.badge}
                    </span>
                  )}
                  {item.count > 0 && (
                    <span className="px-2 py-0.2 text-[10px] font-bold rounded-full bg-rose-600 text-white">
                      {item.count}
                    </span>
                  )}
                </div>
              )}

              {sidebarCollapsed && item.count > 0 && (
                <span className="absolute top-1 right-2 h-2 w-2 rounded-full bg-rose-500"></span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Footer Status */}
      <div className="p-3 border-t border-[#27272A]">
        {!sidebarCollapsed ? (
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <div className="flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-white font-semibold">GRID LIVE</span>
            </div>
            <span className="font-mono text-[10px] text-zinc-500">v2.4-BLACK</span>
          </div>
        ) : (
          <div className="flex justify-center" title="Grid Live">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
        )}
      </div>
    </aside>
  );
};
