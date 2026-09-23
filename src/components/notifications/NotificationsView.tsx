import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRelativeTime } from '../../utils/formatters';
import { Bell, CheckCheck, Trash2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    navigateTo,
  } = useApp();

  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');

  const filtered = notifications.filter(n => (filter === 'UNREAD' ? !n.read : true));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Notifications & Alerts</h2>
          <p className="text-xs text-slate-500">
            Real-time audit alerts for payment submissions, verification approvals, and bill dispatches
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={markAllNotificationsRead}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            <span>Mark All as Read</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            filter === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('UNREAD')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            filter === 'UNREAD' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Unread ({notifications.filter(n => !n.read).length})
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-2xs">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No notifications matching your filter.
          </div>
        ) : (
          filtered.map(n => (
            <div
              key={n.id}
              onClick={() => {
                markNotificationRead(n.id);
                if (n.targetView) navigateTo(n.targetView, n.targetId);
              }}
              className={`p-4 flex items-start gap-4 cursor-pointer hover:bg-slate-50 transition-colors ${
                !n.read ? 'bg-slate-50/70' : ''
              }`}
            >
              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                  n.type === 'PAYMENT_VERIFIED'
                    ? 'bg-emerald-100 text-emerald-700'
                    : n.type === 'PAYMENT_SUBMITTED'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {n.type === 'PAYMENT_VERIFIED' ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : n.type === 'PAYMENT_SUBMITTED' ? (
                  <Clock className="h-4 w-4" />
                ) : (
                  <Bell className="h-4 w-4" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{n.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {formatRelativeTime(n.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
              </div>

              {!n.read && (
                <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0 self-center" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
