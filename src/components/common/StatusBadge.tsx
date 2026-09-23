import React from 'react';
import { BillStatus, PaymentVerificationStatus } from '../../types';

interface StatusBadgeProps {
  status: BillStatus | PaymentVerificationStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'text-[11px] py-0.5 px-2' : 'text-xs py-1 px-2.5';
  const baseClasses = `inline-flex items-center gap-1.5 font-medium rounded-full backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_2px_6px_rgba(0,0,0,0.03)] transition-all ${sizeClasses}`;

  switch (status) {
    case 'PAID_VERIFIED':
    case 'VERIFIED':
      return (
        <span className={`${baseClasses} bg-emerald-500/10 text-emerald-800 border border-emerald-500/25`}>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
          Paid & Verified
        </span>
      );

    case 'PAYMENT_SUBMITTED':
    case 'PENDING':
      return (
        <span className={`${baseClasses} bg-amber-500/12 text-amber-900 border border-amber-500/30`}>
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.8)]"></span>
          </span>
          Verification Pending
        </span>
      );

    case 'PAYMENT_PENDING':
      return (
        <span className={`${baseClasses} bg-amber-500/10 text-amber-800 border border-amber-400/25`}>
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          Payment Pending
        </span>
      );

    case 'APPROVED':
      return (
        <span className={`${baseClasses} bg-blue-500/10 text-blue-800 border border-blue-500/25`}>
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
          Approved by Client
        </span>
      );

    case 'SUBMITTED':
      return (
        <span className={`${baseClasses} bg-sky-500/10 text-sky-800 border border-sky-500/25`}>
          <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
          Submitted
        </span>
      );

    case 'DRAFT':
      return (
        <span className={`${baseClasses} bg-slate-500/10 text-slate-700 border border-slate-400/20`}>
          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
          Draft
        </span>
      );

    case 'REJECTED':
    case 'PAYMENT_REJECTED':
      return (
        <span className={`${baseClasses} bg-rose-500/10 text-rose-800 border border-rose-500/25`}>
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.8)]" />
          Rejected
        </span>
      );

    case 'CORRECTION_REQUESTED':
      return (
        <span className={`${baseClasses} bg-orange-500/10 text-orange-800 border border-orange-500/25`}>
          <span className="h-1.5 w-1.5 rounded-full bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.8)]" />
          Correction Needed
        </span>
      );

    default:
      return (
        <span className={`${baseClasses} bg-slate-500/10 text-slate-700 border border-slate-400/20`}>
          {status}
        </span>
      );
  }
};

