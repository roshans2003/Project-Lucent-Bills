import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  FolderKanban,
  Receipt,
  Users,
  CreditCard,
  BookOpen,
  MessageSquare,
  BarChart3,
  Bell,
  Settings,
  ShieldCheck,
  Building2,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggleCollapse }) => {
  const { role, currentView, navigateTo, organization, currentUser, notifications, payments } = useApp();

  const unreadMessagesCount = 1; // demo active thread
  const pendingVerificationsCount = payments.filter(p => p.status === 'PENDING').length;
  const unreadNotifCount = notifications.filter(n => !n.read).length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-4 w-4" />,
      contractorOnly: false,
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: <FolderKanban className="h-4 w-4" />,
      contractorOnly: false,
    },
    {
      id: 'bills',
      label: 'Bills',
      icon: <Receipt className="h-4 w-4" />,
      contractorOnly: false,
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: <CreditCard className="h-4 w-4" />,
      badge: role === 'CONTRACTOR' && pendingVerificationsCount > 0 ? `${pendingVerificationsCount}` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800',
      contractorOnly: false,
    },
    {
      id: 'clients',
      label: 'Clients',
      icon: <Users className="h-4 w-4" />,
      contractorOnly: true,
    },
    {
      id: 'particulars',
      label: 'Particulars',
      icon: <BookOpen className="h-4 w-4" />,
      contractorOnly: true,
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: <MessageSquare className="h-4 w-4" />,
      badge: unreadMessagesCount > 0 ? `${unreadMessagesCount}` : undefined,
      badgeColor: 'bg-blue-100 text-blue-800',
      contractorOnly: false,
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <BarChart3 className="h-4 w-4" />,
      contractorOnly: false,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="h-4 w-4" />,
      badge: unreadNotifCount > 0 ? `${unreadNotifCount}` : undefined,
      badgeColor: 'bg-rose-100 text-rose-800',
      contractorOnly: false,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="h-4 w-4" />,
      contractorOnly: false,
    },
  ];

  const visibleItems = navItems.filter(item => !item.contractorOnly || role === 'CONTRACTOR');

  return (
    <aside className="w-64 shrink-0 border-r border-white/60 bg-white/55 backdrop-blur-2xl min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 hidden md:flex shadow-[4px_0_24px_rgba(31,38,135,0.02)]">
      <div className="space-y-6">
        {/* Organization / Client Profile Header */}
        <div className="glass-card rounded-2xl p-3.5 border border-white/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs border border-white/25">
              {role === 'CONTRACTOR' ? <Building2 className="h-4 w-4 text-indigo-200" /> : <ShieldCheck className="h-4 w-4 text-emerald-300" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-900 truncate">
                {role === 'CONTRACTOR' ? organization.name : 'Client Portal'}
              </div>
              <div className="text-[11px] text-slate-500 truncate font-medium">
                {role === 'CONTRACTOR' ? 'Verified Contractor' : currentUser.name}
              </div>
            </div>
          </div>
          {role === 'CONTRACTOR' && organization.gstin && (
            <div className="mt-2.5 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span className="text-slate-400">GSTIN:</span>
              <span className="font-semibold text-slate-700 tracking-wider">{organization.gstin}</span>
            </div>
          )}
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {visibleItems.map(item => {
            const isActive =
              currentView === item.id ||
              (item.id === 'bills' && currentView === 'bill-detail') ||
              (item.id === 'projects' && currentView === 'project-detail');

            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'glass-button-primary text-white shadow-md font-semibold'
                    : 'text-slate-600 hover:bg-white/65 hover:text-slate-900 hover:shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-indigo-200' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full backdrop-blur-sm ${
                      isActive ? 'bg-white/20 text-white font-bold border border-white/20' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Non-Custodial Trust Disclaimer Card */}
      <div className="pt-4 border-t border-white/60 space-y-3">
        <div className="glass-panel-subtle rounded-2xl p-3 text-[11px] leading-relaxed text-slate-600 border border-white/70 shadow-2xs">
          <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span className="tracking-tight">Non-Custodial Billing</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-normal">
            Lucent Bills does not process or hold funds. All payments occur directly via external bank/UPI.
          </p>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span className="font-medium text-slate-500">Liquid Glass v2.4</span>
          <span className="font-mono text-[10px]">Direct Settlement</span>
        </div>
      </div>
    </aside>
  );
};
