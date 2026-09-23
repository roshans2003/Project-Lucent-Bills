import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../common/StatusBadge';
import { PaymentSubmitModal } from '../payments/PaymentSubmitModal';
import { ProofViewerModal } from '../payments/ProofViewerModal';
import { ActivityTimeline } from '../common/ActivityTimeline';
import { ProjectChatBox } from '../messages/ProjectChatBox';
import {
  Printer,
  Share2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  MessageSquare,
  Building,
  FileCheck,
  Send,
  Eye,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Clock,
  Circle,
  RefreshCw,
} from 'lucide-react';

interface BillDetailViewProps {
  billId: string;
}

export const BillDetailView: React.FC<BillDetailViewProps> = ({ billId }) => {
  const {
    bills,
    role,
    organization,
    submitBill,
    approveBill,
    requestClarification,
    verifyPayment,
    rejectPayment,
    payments,
    activities,
    navigateTo,
  } = useApp();

  const bill = bills.find(b => b.id === billId);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);
  const [selectedProofUrl, setSelectedProofUrl] = useState<string>('');
  const [clarificationOpen, setClarificationOpen] = useState(false);
  const [clarificationText, setClarificationText] = useState('');
  const [correctionModalOpen, setCorrectionModalOpen] = useState(false);
  const [correctionReason, setCorrectionReason] = useState('');
  const [correctionError, setCorrectionError] = useState<string | null>(null);

  if (!bill) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-slate-500">Bill not found.</p>
        <button
          onClick={() => navigateTo('bills')}
          className="mt-3 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg"
        >
          Back to Bills
        </button>
      </div>
    );
  }

  // Related payment submissions for this bill
  const billPayment = payments.find(p => p.billId === bill.id);

  const handlePrint = () => {
    window.print();
  };

  const handleApprove = () => {
    approveBill(bill.id);
  };

  const handleClarificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clarificationText.trim()) return;
    requestClarification(bill.id, clarificationText.trim());
    setClarificationOpen(false);
    setClarificationText('');
  };

  const billActivities = activities.filter(
    a => a.billId === bill.id || (bill.billNumber && a.billNumber === bill.billNumber)
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Action Bar (no-print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <button
          onClick={() => navigateTo('bills')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Bills</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 glass-button-secondary rounded-xl transition-all shadow-2xs"
          >
            <Printer className="h-3.5 w-3.5 text-slate-500" />
            <span>Print Invoice</span>
          </button>

          {/* Client Specific Actions */}
          {role === 'CLIENT' && (
            <>
              {bill.status === 'SUBMITTED' && (
                <>
                  <button
                    onClick={() => setClarificationOpen(!clarificationOpen)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 glass-button-secondary rounded-xl transition-all"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-slate-500" />
                    <span>Request Clarification</span>
                  </button>
                  <button
                    onClick={handleApprove}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600/90 hover:bg-blue-600 border border-blue-400/30 rounded-xl transition-all shadow-sm"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Approve Bill</span>
                  </button>
                </>
              )}

              {(bill.status === 'APPROVED' || bill.status === 'PAYMENT_PENDING' || bill.status === 'SUBMITTED') && (
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white glass-button-primary rounded-xl transition-all shadow-md hover:scale-[1.01]"
                >
                  <CreditCard className="h-4 w-4 text-emerald-300" />
                  <span>I've Paid</span>
                </button>
              )}

              {bill.status === 'PAYMENT_REJECTED' && (
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 border border-amber-400/40 rounded-xl transition-all shadow-md"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Re-Submit Payment Record</span>
                </button>
              )}
            </>
          )}

          {/* Contractor Specific Actions */}
          {role === 'CONTRACTOR' && (
            <>
              {bill.status === 'DRAFT' && (
                <button
                  onClick={() => submitBill(bill.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white glass-button-primary rounded-xl transition-all shadow-sm"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Submit Bill to Client</span>
                </button>
              )}

              {bill.status === 'PAYMENT_SUBMITTED' && billPayment && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCorrectionModalOpen(true);
                      setCorrectionReason('');
                      setCorrectionError(null);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-amber-800 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-300/40 rounded-xl transition-all"
                  >
                    <span>Request Correction</span>
                  </button>
                  <button
                    onClick={() => {
                      verifyPayment(billPayment.id, 'Bank credit confirmed');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600/90 hover:bg-emerald-600 border border-emerald-400/40 rounded-xl transition-all shadow-sm"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Verify Payment Received</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Workflow Progression Stepper (no-print) */}
      <div className="glass-panel p-5 rounded-3xl border border-white/80 shadow-[0_10px_30px_rgba(15,23,42,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)] no-print">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Workflow Progress</span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-bold text-slate-800">
              {bill.status === 'DRAFT' && '1. Draft in progress by Contractor'}
              {bill.status === 'SUBMITTED' && '2. Awaiting Client Review & Approval'}
              {(bill.status === 'APPROVED' || bill.status === 'PAYMENT_PENDING') && '3. Approved · Ready for External Payment'}
              {bill.status === 'PAYMENT_SUBMITTED' && '4. Payment Submitted · Awaiting Contractor Verification'}
              {bill.status === 'PAID_VERIFIED' && 'Completed · Verified & Reconciled'}
              {bill.status === 'PAYMENT_REJECTED' && 'Correction Required · Client Revision Needed'}
            </span>
          </div>

          <StatusBadge status={bill.status} size="sm" />
        </div>

        {/* 4 Step visual track */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Step 1: Bill Created */}
          <div
            className={`p-3 rounded-2xl border transition-all ${
              bill.status === 'DRAFT'
                ? 'bg-indigo-50/70 border-indigo-300/60 shadow-xs'
                : 'bg-emerald-500/10 border-emerald-300/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Step 1</span>
              {bill.status === 'DRAFT' ? (
                <Clock className="h-3.5 w-3.5 text-indigo-600" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              )}
            </div>
            <div className="font-bold text-xs text-slate-900">Bill Created</div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {bill.status === 'DRAFT' ? 'Contractor draft' : `Issued on ${formatDate(bill.issueDate)}`}
            </div>
          </div>

          {/* Step 2: Client Review & Approval */}
          <div
            className={`p-3 rounded-2xl border transition-all ${
              bill.status === 'SUBMITTED'
                ? 'bg-blue-50/70 border-blue-400/60 shadow-xs ring-1 ring-blue-300/50'
                : ['APPROVED', 'PAYMENT_PENDING', 'PAYMENT_SUBMITTED', 'PAID_VERIFIED'].includes(bill.status)
                ? 'bg-emerald-500/10 border-emerald-300/40'
                : 'bg-white/40 border-slate-200/60 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Step 2</span>
              {['APPROVED', 'PAYMENT_PENDING', 'PAYMENT_SUBMITTED', 'PAID_VERIFIED'].includes(bill.status) ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              ) : bill.status === 'SUBMITTED' ? (
                <Clock className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
              ) : (
                <Circle className="h-3.5 w-3.5 text-slate-400" />
              )}
            </div>
            <div className="font-bold text-xs text-slate-900">Client Approval</div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {['APPROVED', 'PAYMENT_PENDING', 'PAYMENT_SUBMITTED', 'PAID_VERIFIED'].includes(bill.status)
                ? 'Approved by Client'
                : bill.status === 'SUBMITTED'
                ? 'Awaiting review'
                : 'Pending submission'}
            </div>
          </div>

          {/* Step 3: External Payment Submission */}
          <div
            className={`p-3 rounded-2xl border transition-all ${
              bill.status === 'PAYMENT_REJECTED'
                ? 'bg-amber-500/15 border-amber-400/60 ring-1 ring-amber-300/50 shadow-xs'
                : ['APPROVED', 'PAYMENT_PENDING'].includes(bill.status)
                ? 'bg-indigo-50/70 border-indigo-400/60 shadow-xs ring-1 ring-indigo-300/50'
                : ['PAYMENT_SUBMITTED', 'PAID_VERIFIED'].includes(bill.status)
                ? 'bg-emerald-500/10 border-emerald-300/40'
                : 'bg-white/40 border-slate-200/60 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Step 3</span>
              {['PAYMENT_SUBMITTED', 'PAID_VERIFIED'].includes(bill.status) ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              ) : bill.status === 'PAYMENT_REJECTED' ? (
                <AlertCircle className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
              ) : ['APPROVED', 'PAYMENT_PENDING'].includes(bill.status) ? (
                <Clock className="h-3.5 w-3.5 text-indigo-600 animate-pulse" />
              ) : (
                <Circle className="h-3.5 w-3.5 text-slate-400" />
              )}
            </div>
            <div className="font-bold text-xs text-slate-900">External Payment</div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {['PAYMENT_SUBMITTED', 'PAID_VERIFIED'].includes(bill.status)
                ? billPayment ? `${billPayment.paymentMethod} (Ref: ${billPayment.referenceNumber})` : 'Submitted'
                : bill.status === 'PAYMENT_REJECTED'
                ? 'Correction needed'
                : ['APPROVED', 'PAYMENT_PENDING'].includes(bill.status)
                ? 'Pending transfer'
                : 'Pending approval'}
            </div>
          </div>

          {/* Step 4: Contractor Verification */}
          <div
            className={`p-3 rounded-2xl border transition-all ${
              bill.status === 'PAID_VERIFIED'
                ? 'bg-emerald-500/15 border-emerald-400/60 shadow-xs'
                : bill.status === 'PAYMENT_SUBMITTED'
                ? 'bg-amber-50/70 border-amber-400/60 shadow-xs ring-1 ring-amber-300/50'
                : 'bg-white/40 border-slate-200/60 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Step 4</span>
              {bill.status === 'PAID_VERIFIED' ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              ) : bill.status === 'PAYMENT_SUBMITTED' ? (
                <Clock className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
              ) : (
                <Circle className="h-3.5 w-3.5 text-slate-400" />
              )}
            </div>
            <div className="font-bold text-xs text-slate-900">Contractor Verification</div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {bill.status === 'PAID_VERIFIED'
                ? 'Verified & Reconciled'
                : bill.status === 'PAYMENT_SUBMITTED'
                ? 'Verification required'
                : 'Pending payment'}
            </div>
          </div>
        </div>
      </div>

      {/* Clarification prompt box */}
      {clarificationOpen && (
        <form onSubmit={handleClarificationSubmit} className="p-4 glass-panel border border-blue-300/40 bg-blue-500/5 rounded-2xl space-y-3 no-print">
          <div className="flex items-center justify-between text-xs font-bold text-blue-900">
            <span>Ask Contractor for Clarification</span>
            <button
              type="button"
              onClick={() => setClarificationOpen(false)}
              className="text-blue-500 hover:text-blue-800 font-semibold"
            >
              Cancel
            </button>
          </div>
          <textarea
            required
            rows={2}
            value={clarificationText}
            onChange={e => setClarificationText(e.target.value)}
            placeholder="e.g. Can you provide the weighbridge slip for the sand, or confirm delivery count?"
            className="w-full text-xs p-3 rounded-xl glass-input focus:outline-none"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white glass-button-primary rounded-xl"
            >
              Send to Contractor
            </button>
          </div>
        </form>
      )}

      {/* Main Invoice Sheet (Printable) */}
      <div className="glass-panel rounded-3xl border border-white/80 shadow-[0_20px_50px_rgba(15,23,42,0.08),inset_0_1px_2px_rgba(255,255,255,0.9)] print-shadow-none overflow-hidden">
        {/* Invoice Header */}
        <div className="p-8 border-b border-white/60 glass-panel-subtle">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 font-mono">
                  {bill.billNumber}
                </span>
                <StatusBadge status={bill.status} size="md" />
              </div>
              <p className="text-xs text-slate-500">Project: <strong className="text-slate-800">{bill.projectTitle}</strong></p>
            </div>

            {/* Contractor Org Details */}
            <div className="text-right sm:text-right space-y-0.5 text-xs text-slate-600">
              <div className="font-bold text-slate-900 text-sm">{organization.name}</div>
              <div className="text-slate-500 text-[11px]">{organization.address}</div>
              {organization.gstin && (
                <div className="font-mono text-[10px] text-slate-500">
                  GSTIN: {organization.gstin}
                </div>
              )}
            </div>
          </div>

          {/* Key Dates & Client Info Bar */}
          <div className="mt-8 pt-6 border-t border-slate-200/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Billed To
              </span>
              <span className="font-bold text-slate-900 mt-0.5 block">{bill.clientName}</span>
              <span className="text-[11px] text-slate-500 truncate block">{bill.clientEmail}</span>
            </div>

            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Billing Period
              </span>
              <span className="font-semibold text-slate-800 mt-0.5 block">{bill.billingPeriod}</span>
            </div>

            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Issue Date
              </span>
              <span className="font-semibold text-slate-800 mt-0.5 block">{formatDate(bill.issueDate)}</span>
            </div>

            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Due Date
              </span>
              <span className="font-bold text-slate-900 mt-0.5 block">{formatDate(bill.dueDate)}</span>
            </div>
          </div>
        </div>

        {/* Invoice Line Items */}
        <div className="p-8">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 text-slate-500 font-semibold text-[11px]">
                <th className="py-3 px-2 w-[4%]">#</th>
                <th className="py-3 px-2 w-[44%]">Particular / Item Description</th>
                <th className="py-3 px-2 w-[14%] text-right">Quantity</th>
                <th className="py-3 px-2 w-[10%]">Unit</th>
                <th className="py-3 px-2 w-[14%] text-right">Rate</th>
                <th className="py-3 px-2 w-[14%] text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80 font-sans">
              {bill.items.map((item, idx) => (
                <tr key={item.id} className="hover:bg-white/60 transition-colors">
                  <td className="py-3.5 px-2 text-slate-400 font-mono">{idx + 1}</td>
                  <td className="py-3.5 px-2">
                    <div className="font-bold text-slate-900">{item.particular}</div>
                    {item.notes && (
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.notes}</div>
                    )}
                  </td>
                  <td className="py-3.5 px-2 text-right font-mono tabular-nums text-slate-700">
                    {item.quantity}
                  </td>
                  <td className="py-3.5 px-2 text-slate-500">{item.unit}</td>
                  <td className="py-3.5 px-2 text-right font-mono tabular-nums text-slate-700">
                    {formatINR(item.rate)}
                  </td>
                  <td className="py-3.5 px-2 text-right font-mono font-bold tabular-nums text-slate-900">
                    {formatINR(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals & Notes Section */}
          <div className="mt-8 pt-6 border-t border-slate-200/60 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {bill.notes && (
                <div>
                  <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Notes & Site Observations
                  </h5>
                  <p className="text-xs text-slate-600 glass-panel-subtle p-3.5 rounded-2xl border border-white/70 leading-relaxed">
                    {bill.notes}
                  </p>
                </div>
              )}

              {/* Bank & External Payment Direct Info */}
              <div className="text-xs text-slate-500 space-y-1 glass-panel p-4 rounded-2xl border border-emerald-400/30 bg-emerald-500/5">
                <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Direct Payment Instructions (Non-Custodial)</span>
                </div>
                <p className="text-[11px] text-slate-700">
                  Pay to: <strong className="text-slate-900">{organization.bankDetails?.accountName}</strong>
                </p>
                <div className="font-mono text-[10px] text-slate-600">
                  Bank: {organization.bankDetails?.bankName} · A/C: {organization.bankDetails?.accountNumber} · IFSC: {organization.bankDetails?.ifsc}
                </div>
                <div className="font-mono text-[10px] text-slate-800">
                  UPI ID: <strong className="text-slate-950">{organization.bankDetails?.upiId}</strong>
                </div>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {formatINR(bill.subtotal)}
                </span>
              </div>

              {bill.taxRate > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>GST ({bill.taxRate}%):</span>
                  <span className="font-mono tabular-nums">{formatINR(bill.taxAmount)}</span>
                </div>
              )}

              {bill.discountAmount > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Discount / Adjustment:</span>
                  <span className="font-mono tabular-nums text-rose-600">
                    -{formatINR(bill.discountAmount)}
                  </span>
                </div>
              )}

              <div className="pt-3 border-t-2 border-slate-900 flex justify-between items-baseline">
                <span className="text-sm font-extrabold text-slate-900">Total Billed:</span>
                <span className="text-2xl font-black font-mono text-slate-900 tabular-nums">
                  {formatINR(bill.totalAmount)}
                </span>
              </div>

              {bill.status === 'PAID_VERIFIED' && (
                <div className="mt-3 p-3.5 glass-panel rounded-2xl border border-emerald-400/40 bg-emerald-500/10 flex items-center justify-between text-xs font-bold text-emerald-900">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Paid & Verified by Contractor
                  </span>
                  <span className="font-mono font-black tabular-nums">
                    {formatINR(bill.totalAmount)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Verification Record History Section */}
        {billPayment && (
          <div className="p-8 border-t border-white/60 glass-panel-subtle">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-slate-600" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  External Payment Submission Record
                </h4>
              </div>
              <StatusBadge status={billPayment.status} size="sm" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs glass-panel p-4 rounded-2xl border border-white/70 shadow-2xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Amount Paid</span>
                <span className="font-mono font-bold text-sm text-slate-900 tabular-nums">
                  {formatINR(billPayment.amount)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Method & Date</span>
                <span className="font-semibold text-slate-800">
                  {billPayment.paymentMethod}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {formatDate(billPayment.paymentDate)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-mono">UTR / Reference</span>
                <span className="font-mono font-semibold text-slate-900 truncate block">
                  {billPayment.referenceNumber}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Proof Document</span>
                {billPayment.proofUrl ? (
                  <button
                    onClick={() => {
                      setSelectedProofUrl(billPayment.proofUrl!);
                      setShowProofModal(true);
                    }}
                    className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold text-xs mt-0.5"
                  >
                    <Eye className="h-3 w-3" />
                    <span>View Attached Proof</span>
                  </button>
                ) : (
                  <span className="text-slate-400">None attached</span>
                )}
              </div>
            </div>

            {/* Correction requested alert banner */}
            {(billPayment.status === 'CORRECTION_REQUESTED' || bill.status === 'PAYMENT_REJECTED') && (
              <div className="mt-4 p-4 rounded-2xl bg-amber-500/15 border border-amber-300/40 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <span>Correction Requested by Contractor</span>
                </div>
                {billPayment.contractorFeedback && (
                  <p className="text-xs text-amber-800 bg-white/60 p-2.5 rounded-xl border border-amber-200/50">
                    "{billPayment.contractorFeedback}"
                  </p>
                )}
                {role === 'CLIENT' && (
                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Re-Submit Corrected Payment Record</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Verified status stamp banner */}
            {billPayment.status === 'VERIFIED' && (
              <div className="mt-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-300/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-600 text-white">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-950">
                      Payment Verified & Reconciled
                    </div>
                    <div className="text-[11px] text-emerald-800">
                      Verified by {billPayment.verifiedBy || organization.name} on {billPayment.verifiedAt ? formatDate(billPayment.verifiedAt) : 'Recently'}.
                      {billPayment.contractorFeedback && ` Note: "${billPayment.contractorFeedback}"`}
                    </div>
                  </div>
                </div>
                <div className="font-mono text-xs font-bold text-emerald-800 bg-white/80 px-3 py-1.5 rounded-xl border border-emerald-300/40 shrink-0 text-center">
                  AUDIT CONFIRMED
                </div>
              </div>
            )}

            {billPayment.status === 'PENDING' && role === 'CONTRACTOR' && (
              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    setCorrectionModalOpen(true);
                    setCorrectionReason('');
                    setCorrectionError(null);
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-amber-800 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-300/40 rounded-xl transition-all"
                >
                  Request Correction
                </button>
                <button
                  onClick={() => verifyPayment(billPayment.id, 'Bank credit confirmed')}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600/90 hover:bg-emerald-600 border border-emerald-400/40 rounded-xl shadow-xs transition-all"
                >
                  Confirm & Mark Paid
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bill Communication & Lifecycle Audit Lineage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2 no-print">
        {/* Left: Bill-Specific Discussion Thread */}
        <div>
          <ProjectChatBox
            projectId={bill.projectId}
            preselectedBillId={bill.id}
            title={`Bill #${bill.billNumber} Discussion & Clarifications`}
            subtitle={`Direct query and approval message thread for this invoice`}
            maxHeight="520px"
          />
        </div>

        {/* Right: Bill Activity & Audit Trail */}
        <div className="glass-panel rounded-3xl border border-white/80 p-6 space-y-4 shadow-[0_15px_40px_rgba(15,23,42,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)] flex flex-col h-[520px] overflow-hidden">
          <div className="flex items-center gap-2 pb-2 border-b border-white/60 shrink-0">
            <div className="p-1.5 rounded-xl bg-indigo-500/10 text-indigo-700">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                Bill Audit & Lifecycle Trail
              </h3>
              <p className="text-[11px] text-slate-500">
                End-to-end verification and activity history for Bill #{bill.billNumber}
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            <ActivityTimeline
              activities={billActivities}
              compact={false}
              emptyMessage={`No audit events recorded for Bill #${bill.billNumber} yet.`}
            />
          </div>
        </div>
      </div>

      {/* Contractor Correction Modal */}
      {correctionModalOpen && billPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg glass-modal rounded-3xl shadow-[0_25px_60px_rgba(15,23,42,0.25),inset_0_1px_2px_rgba(255,255,255,0.9)] overflow-hidden flex flex-col p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/60">
              <h3 className="text-base font-extrabold text-slate-900">Request Payment Correction</h3>
              <button
                onClick={() => setCorrectionModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors"
              >
                <AlertCircle className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Specify what details need correction (e.g. incorrect transaction UTR, partial credit amount received, or unreadable receipt slip). The client will be prompted to re-submit with these details.
            </p>

            {correctionError && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-300/30 text-xs text-rose-800">
                {correctionError}
              </div>
            )}

            <textarea
              rows={3}
              value={correctionReason}
              onChange={e => setCorrectionReason(e.target.value)}
              placeholder="e.g. The attached receipt shows ₹35,000 but the bill balance is ₹42,900. Please confirm if this is a split payment or re-upload the full remittance receipt."
              className="w-full text-xs p-3 rounded-xl glass-input focus:outline-none"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCorrectionModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 glass-button-secondary rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!correctionReason.trim()) {
                    setCorrectionError('Please enter a note explaining what needs correction.');
                    return;
                  }
                  rejectPayment(billPayment.id, correctionReason.trim(), true);
                  setCorrectionModalOpen(false);
                  setCorrectionReason('');
                  setCorrectionError(null);
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-all shadow-sm"
              >
                Send Correction Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showPaymentModal && (
        <PaymentSubmitModal
          bill={bill}
          onClose={() => setShowPaymentModal(false)}
        />
      )}

      {showProofModal && selectedProofUrl && (
        <ProofViewerModal
          imageUrl={selectedProofUrl}
          title={`Proof for Bill #${bill.billNumber}`}
          onClose={() => setShowProofModal(false)}
        />
      )}
    </div>
  );
};
