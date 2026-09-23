import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR, formatDate } from '../../utils/formatters';
import { FinancialCard } from '../common/FinancialCard';
import { StatusBadge } from '../common/StatusBadge';
import { PaymentSubmitModal } from '../payments/PaymentSubmitModal';
import { Bill } from '../../types';
import {
  Wallet,
  Receipt,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  CreditCard,
  MessageSquare,
  ChevronRight,
  ShieldCheck,
  Building,
  Check,
  ArrowRight,
  FileText,
} from 'lucide-react';

export const ClientDashboard: React.FC = () => {
  const {
    projects,
    bills,
    getFinancialSummary,
    navigateTo,
    currentUser,
    approveBill,
  } = useApp();

  const finance = getFinancialSummary();
  const [selectedBillForPayment, setSelectedBillForPayment] = useState<Bill | null>(null);

  // Bills awaiting client action:
  // 1. SUBMITTED -> Needs client approval or clarification
  // 2. PAYMENT_PENDING / APPROVED -> Needs client external payment ("I've Paid")
  const actionableBills = bills.filter(
    b => b.status === 'SUBMITTED' || b.status === 'APPROVED' || b.status === 'PAYMENT_PENDING'
  );

  return (
    <div className="space-y-8">
      {/* Client Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900">
              Welcome, {currentUser.name}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium glass-pill bg-emerald-500/10 text-emerald-800 border border-emerald-500/20">
              <ShieldCheck className="h-3 w-3 text-emerald-600" /> Property Owner Portal
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track your contract balance, review itemized bills, and submit external payment confirmations
          </p>
        </div>

        <button
          onClick={() => navigateTo('messages')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 glass-button-secondary rounded-xl transition-all shadow-2xs self-start sm:self-auto"
        >
          <MessageSquare className="h-3.5 w-3.5 text-slate-500" />
          <span>Message Contractor</span>
        </button>
      </div>

      {/* 5 Financial Cards for Client Understanding */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <FinancialCard
          title="Total Contract Value"
          amount={finance.contractValue}
          subtitle="Signed agreement scope"
          highlight="default"
          icon={<Wallet className="h-4 w-4" />}
        />

        <FinancialCard
          title="Total Billed"
          amount={finance.totalBilled}
          subtitle="Active work completed"
          highlight="primary"
          progressPercentage={finance.billedPercentage}
          icon={<Receipt className="h-4 w-4" />}
        />

        <FinancialCard
          title="Total Paid"
          amount={finance.verifiedPaid}
          subtitle="Verified by contractor"
          highlight="success"
          progressPercentage={finance.paidPercentage}
          icon={<CheckCircle2 className="h-4 w-4" />}
        />

        <FinancialCard
          title="Outstanding Due"
          amount={finance.outstanding}
          subtitle="Billed awaiting payment"
          highlight="amber"
          icon={<Clock className="h-4 w-4" />}
        />

        <FinancialCard
          title="Remaining Contract"
          amount={finance.remainingContractValue}
          subtitle="Future balance on contract"
          highlight="default"
          icon={<ArrowUpRight className="h-4 w-4" />}
        />
      </div>

      {/* Action Required: Bills Awaiting Review or Payment */}
      {actionableBills.length > 0 && (
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.9)]"></span>
                </span>
                <span>Action Required: Bills Awaiting Your Action ({actionableBills.length})</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Review line-item particulars, approve, or submit external payment receipts
              </p>
            </div>
            <button
              onClick={() => navigateTo('bills')}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 glass-pill px-3 py-1 rounded-xl transition-colors"
            >
              View all bills
            </button>
          </div>

          <div className="space-y-3">
            {actionableBills.map(b => (
              <div
                key={b.id}
                className="p-4 rounded-xl glass-panel-subtle flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/80 transition-all border border-white/80"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {b.billNumber}
                    </span>
                    <StatusBadge status={b.status} size="sm" />
                    <span className="text-xs text-slate-300">·</span>
                    <span className="text-xs font-medium text-slate-600">{b.projectTitle}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-extrabold font-mono text-slate-900 tabular-nums">
                      {formatINR(b.totalAmount)}
                    </span>
                    <span className="text-xs text-slate-500">
                      Due: {formatDate(b.dueDate)} ({b.items.length} items)
                    </span>
                  </div>
                  {b.notes && (
                    <p className="text-xs text-slate-600 line-clamp-1 italic">
                      "{b.notes}"
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => navigateTo('bill-detail', b.id)}
                    className="px-3.5 py-2 text-xs font-medium text-slate-700 glass-button-secondary rounded-xl transition-colors"
                  >
                    Review Details
                  </button>

                  {b.status === 'SUBMITTED' && (
                    <button
                      onClick={() => approveBill(b.id)}
                      className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 rounded-xl transition-all shadow-md shadow-blue-600/20 border border-white/20"
                    >
                      Approve Bill
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedBillForPayment(b)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white glass-button-primary rounded-xl transition-all shadow-md"
                  >
                    <CreditCard className="h-3.5 w-3.5 text-emerald-400" />
                    <span>I've Paid</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Projects Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">My Projects</h3>
            <p className="text-xs text-slate-500">
              Contract financial commitment, billed progress, and real-time project accounts
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map(p => {
            const projectFinance = getFinancialSummary(p.id);

            return (
              <div
                key={p.id}
                onClick={() => navigateTo('project-detail', p.id)}
                className="glass-card rounded-2xl p-6 relative overflow-hidden cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                        {p.title}
                      </h4>
                      <span className="text-xs text-slate-500">{p.location}</span>
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded-lg glass-pill font-bold text-slate-700">
                      {p.code}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 mt-2 mb-6 leading-relaxed">
                    {p.description}
                  </p>

                  {/* Financial 4-Grid */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200/50 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono tracking-wider">Contract Value</span>
                      <span className="font-mono font-bold text-slate-900 tabular-nums text-sm">
                        {formatINR(p.contractValue)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono tracking-wider">Billed to Date</span>
                      <span className="font-mono font-bold text-slate-800 tabular-nums text-sm">
                        {formatINR(projectFinance.totalBilled)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono tracking-wider">Verified Paid</span>
                      <span className="font-mono font-bold text-emerald-700 tabular-nums text-sm">
                        {formatINR(projectFinance.verifiedPaid)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono tracking-wider">Outstanding Due</span>
                      <span className="font-mono font-bold text-amber-700 tabular-nums text-sm">
                        {formatINR(projectFinance.outstanding)}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-5 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Paid Progress:</span>
                      <span className="font-mono font-bold text-slate-700">{projectFinance.paidPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200/60 rounded-full overflow-hidden p-0.5 shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                        style={{ width: `${projectFinance.paidPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/50 flex items-center justify-between text-xs text-slate-500">
                  <span>Remaining Contract: <strong className="font-mono text-slate-800">{formatINR(projectFinance.remainingContractValue)}</strong></span>
                  <span className="text-slate-900 font-bold flex items-center gap-1">
                    Open Project <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Submit Modal */}
      {selectedBillForPayment && (
        <PaymentSubmitModal
          bill={selectedBillForPayment}
          onClose={() => setSelectedBillForPayment(null)}
        />
      )}
    </div>
  );
};
