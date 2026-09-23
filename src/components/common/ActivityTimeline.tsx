import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ActivityLog } from '../../types';
import { formatINR, formatRelativeTime, formatDate } from '../../utils/formatters';
import {
  FilePlus,
  Send,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  Building,
  Filter,
  ArrowRight,
  User,
  Clock,
  ExternalLink,
} from 'lucide-react';

interface ActivityTimelineProps {
  activities: ActivityLog[];
  title?: string;
  subtitle?: string;
  compact?: boolean;
  showFilters?: boolean;
  limit?: number;
  emptyMessage?: string;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  activities,
  title,
  subtitle,
  compact = false,
  showFilters = false,
  limit,
  emptyMessage = 'No activity recorded yet.',
}) => {
  const { navigateTo } = useApp();
  const [filterType, setFilterType] = useState<'ALL' | 'FINANCIAL' | 'BILLS' | 'MESSAGES'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const getFilteredActivities = () => {
    let result = activities;

    if (filterType === 'FINANCIAL') {
      result = result.filter(
        a => a.type === 'PAYMENT_SUBMITTED' || a.type === 'PAYMENT_VERIFIED' || a.type === 'PAYMENT_REJECTED' || a.amount
      );
    } else if (filterType === 'BILLS') {
      result = result.filter(
        a =>
          a.type === 'BILL_CREATED' ||
          a.type === 'BILL_SUBMITTED' ||
          a.type === 'BILL_APPROVED' ||
          a.type === 'CLARIFICATION_REQUESTED'
      );
    } else if (filterType === 'MESSAGES') {
      result = result.filter(a => a.type === 'MESSAGE_SENT' || a.type === 'CLARIFICATION_REQUESTED');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        a =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.actorName.toLowerCase().includes(q) ||
          (a.billNumber && a.billNumber.toLowerCase().includes(q))
      );
    }

    return limit ? result.slice(0, limit) : result;
  };

  const filtered = getFilteredActivities();

  const getNodeIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'BILL_CREATED':
        return <FilePlus className="h-3.5 w-3.5 text-indigo-600" />;
      case 'BILL_SUBMITTED':
        return <Send className="h-3.5 w-3.5 text-blue-600" />;
      case 'BILL_APPROVED':
        return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />;
      case 'PAYMENT_SUBMITTED':
        return <CreditCard className="h-3.5 w-3.5 text-amber-600" />;
      case 'PAYMENT_VERIFIED':
        return <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />;
      case 'PAYMENT_REJECTED':
        return <AlertCircle className="h-3.5 w-3.5 text-rose-600" />;
      case 'CLARIFICATION_REQUESTED':
        return <HelpCircle className="h-3.5 w-3.5 text-purple-600" />;
      case 'MESSAGE_SENT':
        return <MessageSquare className="h-3.5 w-3.5 text-sky-600" />;
      case 'PROJECT_CREATED':
        return <Building className="h-3.5 w-3.5 text-indigo-600" />;
      default:
        return <Clock className="h-3.5 w-3.5 text-slate-500" />;
    }
  };

  const getNodeBg = (type: ActivityLog['type']) => {
    switch (type) {
      case 'BILL_CREATED':
        return 'bg-indigo-50 border-indigo-200 text-indigo-700';
      case 'BILL_SUBMITTED':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'BILL_APPROVED':
        return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case 'PAYMENT_SUBMITTED':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'PAYMENT_VERIFIED':
        return 'bg-emerald-100 border-emerald-300 text-emerald-900';
      case 'PAYMENT_REJECTED':
        return 'bg-rose-50 border-rose-200 text-rose-700';
      case 'CLARIFICATION_REQUESTED':
        return 'bg-purple-50 border-purple-200 text-purple-700';
      case 'MESSAGE_SENT':
        return 'bg-sky-50 border-sky-200 text-sky-700';
      case 'PROJECT_CREATED':
        return 'bg-indigo-50 border-indigo-200 text-indigo-700';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header if title/subtitle provided */}
      {(title || subtitle || showFilters) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/60">
          <div>
            {title && <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>

          {showFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search audit trail..."
                className="px-2.5 py-1 text-xs rounded-xl glass-input w-36 sm:w-44 focus:outline-none"
              />

              <div className="flex items-center gap-1 glass-pill p-0.5 rounded-xl text-xs">
                {(['ALL', 'FINANCIAL', 'BILLS', 'MESSAGES'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilterType(f)}
                    className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition-all ${
                      filterType === f
                        ? 'bg-white text-slate-900 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {f === 'ALL'
                      ? 'All'
                      : f === 'FINANCIAL'
                      ? 'Financial'
                      : f === 'BILLS'
                      ? 'Bills'
                      : 'Chat'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="p-8 text-center glass-panel-subtle rounded-2xl border border-white/60 text-xs text-slate-400">
          {emptyMessage}
        </div>
      ) : (
        /* Timeline Lineage */
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:top-2 before:bottom-2 before:left-[14px] sm:before:left-[17px] before:w-0.5 before:bg-gradient-to-b before:from-indigo-400/40 before:via-slate-300 before:to-slate-200">
          {filtered.map((item, idx) => (
            <div key={item.id} className="relative group">
              {/* Timeline Marker Node */}
              <div
                className={`absolute -left-[24px] sm:-left-[31px] top-1 h-7 w-7 rounded-full border shadow-xs flex items-center justify-center transition-transform group-hover:scale-110 ${getNodeBg(
                  item.type
                )}`}
                title={item.type.replace('_', ' ')}
              >
                {getNodeIcon(item.type)}
              </div>

              {/* Event Content Box */}
              <div
                className={`glass-panel p-3.5 sm:p-4 rounded-2xl border border-white/80 transition-all ${
                  compact
                    ? 'hover:bg-white/90 shadow-2xs'
                    : 'hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-1.5">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="font-bold text-xs text-slate-900">{item.title}</span>

                    {/* Actor Role Tag */}
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-medium inline-flex items-center gap-1 border ${
                        item.actorRole === 'CONTRACTOR'
                          ? 'bg-indigo-500/10 text-indigo-800 border-indigo-200/50'
                          : 'bg-emerald-500/10 text-emerald-800 border-emerald-200/50'
                      }`}
                    >
                      <User className="h-2.5 w-2.5" />
                      <span>{item.actorName}</span>
                    </span>

                    {/* Bill Link if exists */}
                    {item.billNumber && (
                      <button
                        onClick={() => {
                          if (item.billId) {
                            navigateTo('bill-detail', item.billId);
                          } else {
                            navigateTo('bills');
                          }
                        }}
                        className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-white text-slate-700 hover:text-indigo-600 hover:border-indigo-300 border border-slate-200 flex items-center gap-1 transition-colors"
                        title="View Bill Details"
                      >
                        <span>#{item.billNumber}</span>
                        <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                      </button>
                    )}
                  </div>

                  {/* Timestamp */}
                  <span
                    className="text-[11px] text-slate-400 font-mono shrink-0"
                    title={formatDate(item.timestamp)}
                  >
                    {formatRelativeTime(item.timestamp)}
                  </span>
                </div>

                {/* Description Body */}
                <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

                {/* Amount Pill if present */}
                {item.amount !== undefined && item.amount > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-100/60 flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Transaction Scope
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-900 tabular-nums">
                      {formatINR(item.amount)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
