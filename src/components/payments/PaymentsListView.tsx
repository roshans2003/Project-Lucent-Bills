import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentRecord, PaymentVerificationStatus } from '../../types';
import { formatINR, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../common/StatusBadge';
import { EmptyState } from '../common/EmptyState';
import { ProofViewerModal } from './ProofViewerModal';
import {
  CreditCard,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  AlertCircle,
  Download,
  Filter,
} from 'lucide-react';
import { exportToCSV } from '../../utils/formatters';

export const PaymentsListView: React.FC = () => {
  const { payments, role, verifyPayment, rejectPayment, navigateTo } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [methodFilter, setMethodFilter] = useState<string>('ALL');
  const [selectedProofUrl, setSelectedProofUrl] = useState<string | null>(null);
  const [actionModal, setActionModal] = useState<{
    payment: PaymentRecord;
    type: 'VERIFY' | 'CORRECTION' | 'REJECT';
  } | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const filteredPayments = payments.filter(p => {
    const matchesSearch =
      p.billNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.referenceNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.projectTitle.toLowerCase().includes(search.toLowerCase()) ||
      p.submittedBy.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesMethod = methodFilter === 'ALL' || p.paymentMethod === methodFilter;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  const handleExportCSV = () => {
    const headers = ['Bill Number', 'Project', 'Amount', 'Payment Method', 'Payment Date', 'Reference Number', 'Status', 'Submitted By'];
    const rows = filteredPayments.map(p => [
      p.billNumber,
      p.projectTitle,
      p.amount,
      p.paymentMethod,
      p.paymentDate,
      p.referenceNumber,
      p.status,
      p.submittedBy,
    ]);
    exportToCSV(`LucentBills_Payments_${Date.now()}`, headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Payment Verification Records</h2>
          <p className="text-xs text-slate-500">
            Audit trail of external UPI, bank transfers, cheques, and verification states
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs self-start sm:self-auto"
        >
          <Download className="h-3.5 w-3.5 text-slate-500" />
          <span>Export Ledger CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-2xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search reference UTR, bill number, client..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 font-medium focus:ring-1 focus:ring-slate-900"
          >
            <option value="ALL">All Verification States</option>
            <option value="PENDING">🟠 Verification Pending</option>
            <option value="VERIFIED">🟢 Verified</option>
            <option value="REJECTED">🔴 Rejected</option>
            <option value="CORRECTION_REQUESTED">Correction Needed</option>
          </select>

          <select
            value={methodFilter}
            onChange={e => setMethodFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 font-medium focus:ring-1 focus:ring-slate-900"
          >
            <option value="ALL">All Payment Methods</option>
            <option value="UPI">UPI</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cheque">Cheque</option>
            <option value="Cash">Cash</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filteredPayments.length === 0 ? (
        <EmptyState
          icon={<CreditCard className="h-6 w-6" />}
          title="No Payment Records Found"
          description="There are no payment records matching your current filter."
          secondaryActionText={search || statusFilter !== 'ALL' ? 'Clear Filters' : undefined}
          onSecondaryAction={() => {
            setSearch('');
            setStatusFilter('ALL');
            setMethodFilter('ALL');
          }}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                  <th className="py-3 px-4 w-[16%]">Bill Reference</th>
                  <th className="py-3 px-3 w-[15%] text-right">Amount</th>
                  <th className="py-3 px-3 w-[15%]">Method</th>
                  <th className="py-3 px-3 w-[18%]">UTR / Ref Number</th>
                  <th className="py-3 px-3 w-[12%]">Payment Date</th>
                  <th className="py-3 px-3 w-[12%]">Status</th>
                  <th className="py-3 px-4 w-[12%] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredPayments.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <button
                        onClick={() => navigateTo('bill-detail', p.billId)}
                        className="font-mono font-bold text-slate-900 hover:text-blue-600 transition-colors text-left"
                      >
                        #{p.billNumber}
                      </button>
                      <span className="text-[10px] text-slate-400 block truncate max-w-xs">
                        {p.projectTitle}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <span className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                        {formatINR(p.amount)}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-medium text-slate-800">{p.paymentMethod}</span>
                      {p.proofUrl && (
                        <button
                          onClick={() => setSelectedProofUrl(p.proofUrl!)}
                          className="flex items-center gap-1 text-[10px] text-blue-600 hover:underline mt-0.5"
                        >
                          <Eye className="h-3 w-3" />
                          <span>View Proof Slip</span>
                        </button>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-mono font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                        {p.referenceNumber}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                      {formatDate(p.paymentDate)}
                    </td>

                    <td className="py-3 px-3">
                      <StatusBadge status={p.status} size="sm" />
                    </td>

                    <td className="py-3 px-4 text-right">
                      {role === 'CONTRACTOR' && p.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setActionModal({ payment: p, type: 'VERIFY' });
                              setFeedbackText('Bank credit confirmed in account.');
                              setFeedbackError(null);
                            }}
                            className="px-2.5 py-1 text-[11px] font-bold text-white bg-emerald-600/90 hover:bg-emerald-600 rounded-lg transition-colors shadow-2xs"
                          >
                            Verify
                          </button>
                          <button
                            onClick={() => {
                              setActionModal({ payment: p, type: 'CORRECTION' });
                              setFeedbackText('');
                              setFeedbackError(null);
                            }}
                            className="px-2 py-1 text-[11px] font-semibold text-amber-800 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-300/40 rounded-lg transition-colors"
                          >
                            Correction
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => navigateTo('bill-detail', p.billId)}
                          className="text-slate-500 hover:text-slate-900 text-xs font-semibold px-2 py-1 rounded-lg hover:bg-white/80 transition-colors"
                        >
                          View Bill
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Contractor Action Modal (Verify / Correction / Reject) */}
      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg glass-modal rounded-3xl shadow-[0_25px_60px_rgba(15,23,42,0.25),inset_0_1px_2px_rgba(255,255,255,0.9)] overflow-hidden flex flex-col p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/60">
              <h3 className="text-base font-extrabold text-slate-900">
                {actionModal.type === 'VERIFY'
                  ? 'Confirm Payment Verification'
                  : actionModal.type === 'CORRECTION'
                  ? 'Request Payment Correction'
                  : 'Reject Payment Submission'}
              </h3>
              <button
                onClick={() => setActionModal(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="glass-panel p-3.5 rounded-2xl border border-white/70 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Bill:</span>
                <span className="font-mono font-bold text-slate-900">#{actionModal.payment.billNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount:</span>
                <span className="font-mono font-black text-emerald-800 text-sm">{formatINR(actionModal.payment.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Method & Reference:</span>
                <span className="font-mono text-slate-800 font-semibold">{actionModal.payment.paymentMethod} · {actionModal.payment.referenceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Submitted By:</span>
                <span className="text-slate-800 font-semibold">{actionModal.payment.submittedBy}</span>
              </div>
            </div>

            {feedbackError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-300/30 text-xs text-rose-800 flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{feedbackError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {actionModal.type === 'VERIFY'
                  ? 'Verification Notes (Recorded in audit trail)'
                  : 'Correction Notes / Message for Client'}
              </label>
              <textarea
                rows={3}
                value={feedbackText}
                onChange={e => setFeedbackText(e.target.value)}
                placeholder={
                  actionModal.type === 'VERIFY'
                    ? 'e.g. Bank credit confirmed in HDFC account.'
                    : 'e.g. The reference number does not match our bank statement, or please re-upload a clear slip.'
                }
                className="w-full text-xs p-3 rounded-xl glass-input focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActionModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 glass-button-secondary rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (actionModal.type === 'VERIFY') {
                    verifyPayment(actionModal.payment.id, feedbackText.trim() || 'Bank credit confirmed');
                    setActionModal(null);
                    setFeedbackText('');
                    setFeedbackError(null);
                  } else if (actionModal.type === 'CORRECTION') {
                    if (!feedbackText.trim()) {
                      setFeedbackError('Please specify what details need correction.');
                      return;
                    }
                    rejectPayment(actionModal.payment.id, feedbackText.trim(), true);
                    setActionModal(null);
                    setFeedbackText('');
                    setFeedbackError(null);
                  } else if (actionModal.type === 'REJECT') {
                    if (!feedbackText.trim()) {
                      setFeedbackError('Please state the rejection reason.');
                      return;
                    }
                    rejectPayment(actionModal.payment.id, feedbackText.trim(), false);
                    setActionModal(null);
                    setFeedbackText('');
                    setFeedbackError(null);
                  }
                }}
                className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-md transition-all ${
                  actionModal.type === 'VERIFY'
                    ? 'bg-emerald-600 hover:bg-emerald-700 border border-emerald-400/40'
                    : actionModal.type === 'CORRECTION'
                    ? 'bg-amber-600 hover:bg-amber-700 border border-amber-400/40'
                    : 'bg-rose-600 hover:bg-rose-700 border border-rose-400/40'
                }`}
              >
                {actionModal.type === 'VERIFY'
                  ? 'Confirm Verification'
                  : actionModal.type === 'CORRECTION'
                  ? 'Send Correction Request'
                  : 'Reject Payment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Proof Modal */}
      {selectedProofUrl && (
        <ProofViewerModal
          imageUrl={selectedProofUrl}
          onClose={() => setSelectedProofUrl(null)}
        />
      )}
    </div>
  );
};
