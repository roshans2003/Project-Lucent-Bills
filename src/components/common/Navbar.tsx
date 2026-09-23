import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  CheckCheck,
  ChevronDown,
  RefreshCw,
  UserCheck,
  Layers,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Building,
  User as UserIcon,
  Trash2,
  X,
} from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters';

export const Navbar: React.FC = () => {
  const {
    role,
    setRole,
    currentUser,
    organization,
    currentView,
    navigateTo,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    clearAllNotifications,
    resetData,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setShowRoleMenu(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/60 bg-white/65 px-4 md:px-8 backdrop-blur-2xl shadow-[0_4px_24px_rgba(31,38,135,0.03),inset_0_-1px_0_rgba(255,255,255,0.8)]">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => navigateTo('landing')}
          className="group flex items-center gap-2.5 text-left focus:outline-none"
        >
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white flex items-center justify-center font-bold text-base shadow-sm border border-white/25 group-hover:scale-105 transition-transform">
            L
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-slate-900 group-hover:text-indigo-950 transition-colors">
              Lucent Bills
            </span>
          </div>
        </button>

        {/* Quiet breadcrumb / view title */}
        {currentView !== 'landing' && (
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400">
            <span>/</span>
            <span className="font-medium text-slate-700 capitalize">
              {currentView.replace('-', ' ')}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-500 font-normal">
              {role === 'CONTRACTOR' ? organization.name : 'Client Portal'}
            </span>
          </div>
        )}
      </div>

      {/* Zone 2: Navigation items / Quick toggle links */}
      <nav className="hidden md:flex items-center gap-1 glass-pill p-1 rounded-xl">
        <button
          onClick={() => navigateTo('dashboard')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            currentView === 'dashboard'
              ? 'bg-white/95 text-slate-900 shadow-xs border border-white/80 font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => navigateTo('bills')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            currentView === 'bills' || currentView === 'bill-detail'
              ? 'bg-white/95 text-slate-900 shadow-xs border border-white/80 font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
          }`}
        >
          Bills
        </button>
        <button
          onClick={() => navigateTo('payments')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            currentView === 'payments'
              ? 'bg-white/95 text-slate-900 shadow-xs border border-white/80 font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
          }`}
        >
          Payments
        </button>
        <button
          onClick={() => navigateTo('projects')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            currentView === 'projects' || currentView === 'project-detail'
              ? 'bg-white/95 text-slate-900 shadow-xs border border-white/80 font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
          }`}
        >
          Projects
        </button>
        {role === 'CONTRACTOR' && (
          <button
            onClick={() => navigateTo('particulars')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              currentView === 'particulars'
                ? 'bg-white/95 text-slate-900 shadow-xs border border-white/80 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            Library
          </button>
        )}
        <button
          onClick={() => navigateTo('messages')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            currentView === 'messages'
              ? 'bg-white/95 text-slate-900 shadow-xs border border-white/80 font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
          }`}
        >
          Messages
        </button>
      </nav>

      {/* Zone 3: 1-2 primary actions + Persona Switcher + Notifications */}
      <div className="flex items-center gap-3">
        {/* Role Switcher Pill */}
        <div className="relative" ref={roleRef}>
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 rounded-xl glass-pill px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-white/85 transition-all shadow-2xs"
            title="Switch Persona: Contractor or Client"
          >
            {role === 'CONTRACTOR' ? (
              <Building className="h-3.5 w-3.5 text-indigo-600" />
            ) : (
              <UserIcon className="h-3.5 w-3.5 text-emerald-600" />
            )}
            <span className="hidden sm:inline text-slate-900 font-medium">
              {role === 'CONTRACTOR' ? 'Contractor View' : 'Client View'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              ({role === 'CONTRACTOR' ? 'Rajesh' : 'Arun'})
            </span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-68 rounded-2xl glass-panel p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Switch Perspective
              </div>
              <button
                onClick={() => {
                  setRole('CONTRACTOR');
                  setShowRoleMenu(false);
                }}
                className={`w-full flex items-start gap-2.5 rounded-xl p-2.5 text-left text-xs transition-colors ${
                  role === 'CONTRACTOR' ? 'bg-white/80 font-semibold text-slate-900 shadow-xs border border-white/60' : 'hover:bg-white/50 text-slate-700'
                }`}
              >
                <div className="p-1.5 rounded-lg bg-indigo-500/15 text-indigo-700 mt-0.5 border border-indigo-400/20">
                  <Building className="h-3.5 w-3.5" />
                </div>
                <div>
                  <div className="text-slate-900 font-semibold">Contractor / Service Provider</div>
                  <div className="text-[11px] text-slate-500 font-normal">
                    Vertex BuildWorks (Rajesh Kumar)
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Can create bills, verify payments, manage library
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setRole('CLIENT');
                  setShowRoleMenu(false);
                }}
                className={`w-full flex items-start gap-2.5 rounded-xl p-2.5 text-left text-xs mt-1 transition-colors ${
                  role === 'CLIENT' ? 'bg-white/80 font-semibold text-slate-900 shadow-xs border border-white/60' : 'hover:bg-white/50 text-slate-700'
                }`}
              >
                <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-700 mt-0.5 border border-emerald-400/20">
                  <UserIcon className="h-3.5 w-3.5" />
                </div>
                <div>
                  <div className="text-slate-900 font-semibold">Client / Property Owner</div>
                  <div className="text-[11px] text-slate-500 font-normal">
                    Arun Kumar (Modern Villa)
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Can review bills, submit payments, view statements
                  </div>
                </div>
              </button>

              <div className="my-1.5 border-t border-slate-200/50" />
              <button
                onClick={() => {
                  if (window.confirm('Reset all demo data back to default initial state?')) {
                    resetData();
                    setShowRoleMenu(false);
                  }
                }}
                className="w-full flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs text-slate-600 hover:bg-white/60 transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
                <span>Reset Demo Database</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-xl glass-pill p-2 text-slate-600 hover:bg-white/85 transition-colors focus:outline-none shadow-2xs"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.9)]"></span>
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-panel p-3.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/50">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-amber-500/15 text-amber-900 border border-amber-400/30 font-mono px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
                      title="Mark all notifications as read"
                    >
                      <CheckCheck className="h-3 w-3" /> Mark read
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-[11px] text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors ml-1"
                      title="Clear all notifications"
                    >
                      <Trash2 className="h-3 w-3" /> Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100/60 py-1">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.targetView) navigateTo(n.targetView, n.targetId);
                        setShowNotifications(false);
                      }}
                      className={`p-2.5 rounded-xl text-xs cursor-pointer transition-colors relative group ${
                        !n.read
                          ? 'bg-white/90 hover:bg-white shadow-2xs border border-white/80'
                          : 'hover:bg-white/50 opacity-80'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1 gap-2">
                        <div className="flex items-center gap-1.5 truncate">
                          {!n.read && (
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                          )}
                          <span className="font-bold text-slate-900 truncate">{n.title}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-[10px] text-slate-400 font-mono">
                            {formatRelativeTime(n.timestamp)}
                          </span>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              deleteNotification(n.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                            title="Delete notification"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-slate-600 line-clamp-2 text-[11px] leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Landing View Toggle */}
        <button
          onClick={() => navigateTo(currentView === 'landing' ? 'dashboard' : 'landing')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 glass-button-secondary rounded-xl"
        >
          {currentView === 'landing' ? (
            <>
              <span>Open App</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              <ExternalLink className="h-3 w-3 text-slate-400" />
              <span>Public Landing</span>
            </>
          )}
        </button>

        {/* User Profile Avatar */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 focus:outline-none"
          >
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="h-8 w-8 rounded-full object-cover border-2 border-white shadow-xs ring-1 ring-slate-200 hover:ring-indigo-400 transition-all"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-slate-900 to-indigo-950 text-white flex items-center justify-center font-bold text-xs border border-white/30 shadow-xs">
                {currentUser.name.charAt(0)}
              </div>
            )}
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-58 rounded-2xl glass-panel p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-slate-200/50">
                <div className="text-xs font-bold text-slate-900">{currentUser.name}</div>
                <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Role: {role === 'CONTRACTOR' ? 'Contractor' : 'Client'}
                </div>
              </div>
              <div className="pt-1 space-y-0.5">
                <button
                  onClick={() => {
                    navigateTo('settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full rounded-xl px-3 py-1.5 text-left text-xs text-slate-700 hover:bg-white/70 transition-colors"
                >
                  Organization & Bank Details
                </button>
                <button
                  onClick={() => {
                    navigateTo('reports');
                    setShowProfileMenu(false);
                  }}
                  className="w-full rounded-xl px-3 py-1.5 text-left text-xs text-slate-700 hover:bg-white/70 transition-colors"
                >
                  Financial Reports & CSV Export
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
