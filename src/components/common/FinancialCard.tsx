import React, { ReactNode } from 'react';
import { formatINR } from '../../utils/formatters';

interface FinancialCardProps {
  title: string;
  amount: number;
  subtitle?: string;
  badge?: ReactNode;
  icon?: ReactNode;
  trend?: string;
  highlight?: 'default' | 'primary' | 'success' | 'amber' | 'rose';
  progressPercentage?: number;
  onClick?: () => void;
}

export const FinancialCard: React.FC<FinancialCardProps> = ({
  title,
  amount,
  subtitle,
  badge,
  icon,
  trend,
  highlight = 'default',
  progressPercentage,
  onClick,
}) => {
  const getHighlightGlow = () => {
    switch (highlight) {
      case 'primary':
        return 'before:absolute before:inset-y-0 before:left-0 before:w-1.5 before:bg-gradient-to-b before:from-indigo-600 before:to-slate-900 before:rounded-l-2xl';
      case 'success':
        return 'before:absolute before:inset-y-0 before:left-0 before:w-1.5 before:bg-gradient-to-b before:from-emerald-400 before:to-teal-600 before:rounded-l-2xl';
      case 'amber':
        return 'before:absolute before:inset-y-0 before:left-0 before:w-1.5 before:bg-gradient-to-b before:from-amber-400 before:to-orange-500 before:rounded-l-2xl';
      case 'rose':
        return 'before:absolute before:inset-y-0 before:left-0 before:w-1.5 before:bg-gradient-to-b before:from-rose-400 before:to-pink-600 before:rounded-l-2xl';
      default:
        return 'before:absolute before:inset-y-0 before:left-0 before:w-1.5 before:bg-slate-300/60 before:rounded-l-2xl';
    }
  };

  const getLiquidAura = () => {
    switch (highlight) {
      case 'success':
        return 'bg-emerald-500/5';
      case 'amber':
        return 'bg-amber-500/5';
      case 'primary':
        return 'bg-indigo-500/5';
      case 'rose':
        return 'bg-rose-500/5';
      default:
        return 'bg-white/40';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`glass-card liquid-specular-edge rounded-2xl p-5 relative overflow-hidden transition-all duration-200 ${getHighlightGlow()} ${getLiquidAura()} ${
        onClick ? 'cursor-pointer hover:-translate-y-1' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <span className="text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
          {title}
        </span>
        {icon && (
          <div className="h-7 w-7 rounded-lg glass-panel-subtle flex items-center justify-center text-slate-600 shadow-2xs">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-2xl lg:text-3xl font-extrabold font-mono tracking-tight text-slate-900 tabular-nums">
          {formatINR(amount)}
        </div>
        {badge && <div>{badge}</div>}
      </div>

      {progressPercentage !== undefined && (
        <div className="mt-3.5">
          <div className="w-full bg-slate-200/60 rounded-full h-1.5 overflow-hidden p-0.5 shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                highlight === 'success'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                  : highlight === 'amber'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                  : 'bg-gradient-to-r from-slate-900 to-indigo-600 shadow-[0_0_8px_rgba(15,23,42,0.4)]'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }}
            />
          </div>
        </div>
      )}

      {(subtitle || trend) && (
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-200/40">
          <span className="truncate">{subtitle}</span>
          {trend && <span className="font-semibold text-slate-700 font-mono text-[11px]">{trend}</span>}
        </div>
      )}
    </div>
  );
};

