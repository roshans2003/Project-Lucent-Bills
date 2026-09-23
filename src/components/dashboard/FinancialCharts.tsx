import React from 'react';
import { formatINR } from '../../utils/formatters';

interface FinancialChartsProps {
  contractValue: number;
  totalBilled: number;
  verifiedPaid: number;
  outstanding: number;
  verificationPendingAmount: number;
}

export const FinancialCharts: React.FC<FinancialChartsProps> = ({
  contractValue,
  totalBilled,
  verifiedPaid,
  outstanding,
  verificationPendingAmount,
}) => {
  const billedPct = contractValue > 0 ? Math.min(100, Math.round((totalBilled / contractValue) * 100)) : 0;
  const paidPct = contractValue > 0 ? Math.min(100, Math.round((verifiedPaid / contractValue) * 100)) : 0;
  const pendingVerificationPct = contractValue > 0 ? Math.min(100, Math.round((verificationPendingAmount / contractValue) * 100)) : 0;

  // Monthly trends mock data aligned with project history
  const monthlyData = [
    { month: 'Nov 25', billed: 0, paid: 0 },
    { month: 'Dec 25', billed: 0, paid: 0 },
    { month: 'Jan 26', billed: 120000, paid: 120000 },
    { month: 'Feb 26', billed: 380000, paid: 380000 },
    { month: 'Mar 26', billed: 545000, paid: 77100 },
  ];

  const maxVal = Math.max(...monthlyData.map(m => Math.max(m.billed, m.paid)), 600000);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Monthly Billing & Verified Payments Trend */}
      <div className="lg:col-span-2 glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Billing & Verification Trend</h3>
            <p className="text-xs text-slate-500">Monthly breakdown of contractor bills and verified payments</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-gradient-to-tr from-slate-900 to-indigo-900 shadow-2xs" />
              <span className="text-slate-600 font-medium">Billed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-2xs" />
              <span className="text-slate-600 font-medium">Verified Paid</span>
            </div>
          </div>
        </div>

        {/* Bar chart container */}
        <div className="h-52 w-full flex items-end justify-between gap-3 pt-6 pb-2 border-b border-slate-200/50">
          {monthlyData.map((d, i) => {
            const billedHeight = Math.max(4, Math.round((d.billed / maxVal) * 160));
            const paidHeight = Math.max(4, Math.round((d.paid / maxVal) * 160));

            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full flex items-end justify-center gap-1.5 h-44">
                  {/* Billed bar */}
                  <div
                    className="w-1/2 max-w-[28px] bg-gradient-to-t from-slate-900 via-indigo-950 to-indigo-800 rounded-t-lg transition-all group-hover:brightness-125 relative shadow-xs"
                    style={{ height: `${billedHeight}px` }}
                    title={`Billed: ${formatINR(d.billed)}`}
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[10px] py-1 px-2 rounded-lg font-mono tabular-nums whitespace-nowrap pointer-events-none transition-opacity z-10 shadow-lg border border-white/20">
                      {formatINR(d.billed)}
                    </div>
                  </div>
                  {/* Verified Paid bar */}
                  <div
                    className="w-1/2 max-w-[28px] bg-gradient-to-t from-emerald-600 via-teal-500 to-emerald-400 rounded-t-lg transition-all group-hover:brightness-125 relative shadow-xs shadow-emerald-500/20"
                    style={{ height: `${paidHeight}px` }}
                    title={`Verified Paid: ${formatINR(d.paid)}`}
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-emerald-950 text-emerald-200 text-[10px] py-1 px-2 rounded-lg font-mono tabular-nums whitespace-nowrap pointer-events-none transition-opacity z-10 shadow-lg border border-emerald-500/30">
                      {formatINR(d.paid)}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-slate-500">{d.month}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>Current active cycle: March 2026</span>
          <span className="font-mono font-medium text-slate-700">Contract progress: {billedPct}% billed</span>
        </div>
      </div>

      {/* 2. Payment Distribution & Financial Progress */}
      <div className="glass-card rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">Contract Financial Status</h3>
          <p className="text-xs text-slate-500 mb-6">Contract allocation and realization breakdown</p>

          {/* Visual Progress Multi-segment Bar */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Contract Value:</span>
              <span className="font-mono font-extrabold text-slate-900">{formatINR(contractValue)}</span>
            </div>

            <div className="h-4 w-full bg-slate-200/50 rounded-xl overflow-hidden flex p-0.5 shadow-inner border border-white/60">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 rounded-l-lg transition-all duration-500 relative group shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                style={{ width: `${paidPct}%` }}
                title={`Verified Paid: ${paidPct}% (${formatINR(verifiedPaid)})`}
              />
              <div
                className="bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-500 relative group shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                style={{ width: `${pendingVerificationPct}%` }}
                title={`Pending Verification: ${formatINR(verificationPendingAmount)}`}
              />
              <div
                className="bg-slate-300/80 transition-all duration-500 relative group"
                style={{ width: `${Math.max(0, billedPct - paidPct - pendingVerificationPct)}%` }}
                title={`Outstanding: ${formatINR(outstanding)}`}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>0%</span>
              <span className="text-slate-600 font-medium">{billedPct}% Billed ({formatINR(totalBilled)})</span>
              <span>100%</span>
            </div>
          </div>

          {/* Legend and values list */}
          <div className="space-y-3 pt-2 border-t border-slate-200/50">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                <span className="text-slate-600">Verified Paid</span>
              </div>
              <span className="font-mono font-bold text-emerald-800 tabular-nums">{formatINR(verifiedPaid)}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
                <span className="text-slate-600">Verification Pending</span>
              </div>
              <span className="font-mono font-bold text-amber-800 tabular-nums">{formatINR(verificationPendingAmount)}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-400" />
                <span className="text-slate-600">Outstanding Billed</span>
              </div>
              <span className="font-mono font-bold text-slate-800 tabular-nums">{formatINR(outstanding)}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-300" />
                <span className="text-slate-500">Unbilled Contract</span>
              </div>
              <span className="font-mono text-slate-500 tabular-nums">{formatINR(Math.max(0, contractValue - totalBilled))}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-3 border-t border-slate-200/50 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Settlement Velocity:</span>
          <span className="font-semibold text-emerald-700">92% verified on time</span>
        </div>
      </div>
    </div>
  );
};
