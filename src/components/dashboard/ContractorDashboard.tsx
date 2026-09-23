import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR, formatDate, formatRelativeTime } from '../../utils/formatters';
import { FinancialCard } from '../common/FinancialCard';
import { FinancialCharts } from './FinancialCharts';
import { VerificationAlert } from './VerificationAlert';
import { StatusBadge } from '../common/StatusBadge';
import { ProofViewerModal } from '../payments/ProofViewerModal';
import { BillCreateModal } from '../bills/BillCreateModal';
import {
  Wallet,
  Receipt,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Plus,
  AlertTriangle,
  History,
  Eye,
  ShieldCheck,
  Building,
  ArrowRight,
} from 'lucide-react';

export const ContractorDashboard: React.FC = () => {
  const {
    getFinancialSummary,
    bills,
    payments,
    activities,
    navigateTo,
    organization,
  } = useApp();

  const finance = getFinancialSummary();
  const pendingPayments = payments.filter(p => p.status === 'PENDING');
  const recentBills = bills.slice(0, 5);
  const recentActivities = activities.slice(0, 6);

  const [selectedProofUrl, setSelectedProofUrl] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900">
              Contractor Financial Workspace
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium glass-pill bg-emerald-500/10 text-emerald-800 border border-emerald-500/20">
              <ShieldCheck className="h-3 w-3 text-emerald-600" /> Non-Custodial
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Transparent billing & payment reconciliation for <span className="font-semibold text-slate-700">{organization.name}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white glass-button-primary rounded-xl transition-all shadow-md"
          >
            <Plus className="h-4 w-4 text-indigo-200" />
            <span>Create New Bill</span>
          </button>
        </div>
      </div>

      {/* Top 5 Key Metric Cards (Dynamic Financial Math) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <FinancialCard
          title="Total Contract Value"
          amount={finance.contractValue}
          subtitle="Signed client commitments"
          highlight="default"
          icon={<Wallet className="h-4 w-4" />}
        />

        <FinancialCard
          title="Total Billed"
          amount={finance.totalBilled}
          subtitle={`${finance.billedPercentage.toFixed(0)}% of total contract`}
          highlight="primary"
          progressPercentage={finance.billedPercentage}
          icon={<Receipt className="h-4 w-4" />}
        />

        <FinancialCard
          title="Verified Paid"
          amount={finance.verifiedPaid}
          subtitle="Realized external payments"
          highlight="success"
          progressPercentage={finance.paidPercentage}
          icon={<CheckCircle2 className="h-4 w-4" />}
        />

        <FinancialCard
          title="Outstanding Billed"
          amount={finance.outstanding}
          subtitle="Awaiting client settlement"
          highlight="amber"
          icon={<Clock className="h-4 w-4" />}
        />

        <FinancialCard
          title="Remaining Contract"
          amount={finance.remainingContractValue}
          subtitle="Unrealized project balance"
          highlight="default"
          icon={<ArrowUpRight className="h-4 w-4" />}
        />
      </div>

      {/* Payment Verification Request Section */}
      {pendingPayments.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                Payment Verification Requests ({pendingPayments.length})
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              Clients submitted external proof · Verify bank deposit
            </span>
          </div>

          <div className="space-y-3">
            {pendingPayments.map(p => (
              <VerificationAlert
                key={p.id}
                payment={p}
                onOpenProofModal={url => setSelectedProofUrl(url)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Dashboard Charts: Monthly Trends & Financial Distribution */}
      <FinancialCharts
        contractValue={finance.contractValue}
        totalBilled={finance.totalBilled}
        verifiedPaid={finance.verifiedPaid}
        outstanding={finance.outstanding}
        verificationPendingAmount={finance.verificationPendingAmount}
      />

      {/* Bottom Grid: Recent Bills Table + Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bills Table (2 Cols) */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Bills</h3>
                <p className="text-xs text-slate-500">Latest active project bill submissions</p>
              </div>
              <button
                onClick={() => navigateTo('bills')}
                className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 transition-colors glass-pill px-3 py-1 rounded-xl"
              >
                <span>View all bills</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/60 text-slate-500 font-semibold text-[11px]">
                    <th className="py-2.5 px-3">Bill</th>
                    <th className="py-2.5 px-3">Project</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Due Date</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/70">
                  {recentBills.map(b => (
                    <tr
                      key={b.id}
                      onClick={() => navigateTo('bill-detail', b.id)}
                      className="hover:bg-white/70 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-3 font-mono font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {b.billNumber}
                      </td>
                      <td className="py-3.5 px-3 text-slate-700 truncate max-w-[140px] font-medium">
                        {b.projectTitle}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                        {formatINR(b.totalAmount)}
                      </td>
                      <td className="py-3.5 px-3">
                        <StatusBadge status={b.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-3 text-slate-500 font-mono text-[11px]">
                        {formatDate(b.dueDate)}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            navigateTo('bill-detail', b.id);
                          }}
                          className="text-slate-400 hover:text-slate-900 p-1.5 rounded-lg hover:bg-white/80 transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200/50 flex items-center justify-between text-xs text-slate-500">
            <span>Showing {recentBills.length} recent bills</span>
            <button
              onClick={() => setShowCreateModal(true)}
              className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
            >
              + Quick draft new bill
            </button>
          </div>
        </div>

        {/* Recent Activity Audit Timeline (1 Col) */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-slate-500" />
              <h3 className="text-sm font-bold text-slate-900">Recent Activity</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Live audit</span>
          </div>

          <div className="space-y-4">
            {recentActivities.map((act, idx) => (
              <div key={act.id} className="relative flex items-start gap-3">
                {/* Timeline connector line */}
                {idx !== recentActivities.length - 1 && (
                  <div className="absolute top-6 left-3 w-px h-[calc(100%-12px)] bg-slate-200/70" />
                )}

                <div className="h-6 w-6 rounded-full glass-pill border border-white/80 flex items-center justify-center shrink-0 z-10 text-[10px] font-bold text-slate-700 shadow-2xs">
                  {act.type === 'PAYMENT_VERIFIED' ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  ) : act.type === 'PAYMENT_SUBMITTED' ? (
                    <Clock className="h-3.5 w-3.5 text-amber-600" />
                  ) : (
                    <Receipt className="h-3.5 w-3.5 text-slate-600" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900">{act.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {formatRelativeTime(act.timestamp)}
                    </span>
                  </div>

                  {act.amount && (
                    <div className="font-mono font-bold text-xs text-slate-900 tabular-nums">
                      {formatINR(act.amount)}
                    </div>
                  )}

                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                    {act.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Proof Viewer Modal */}
      {selectedProofUrl && (
        <ProofViewerModal
          imageUrl={selectedProofUrl}
          onClose={() => setSelectedProofUrl(null)}
        />
      )}

      {/* Create Bill Modal */}
      {showCreateModal && (
        <BillCreateModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};
