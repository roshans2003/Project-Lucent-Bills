import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentRecord } from '../../types';
import { formatINR, formatDate } from '../../utils/formatters';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Eye,
} from 'lucide-react';

interface VerificationAlertProps {
  payment: PaymentRecord;
  onOpenProofModal?: (proofUrl: string) => void;
  onOpenVerifyModal?: (payment: PaymentRecord) => void;
}

export const VerificationAlert: React.FC<VerificationAlertProps> = ({
  payment,
  onOpenProofModal,
  onOpenVerifyModal,
}) => {
  const { verifyPayment, rejectPayment, navigateTo } = useApp();
  const [rejecting, setRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isCorrection, setIsCorrection] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const handleVerify = () => {
    verifyPayment(payment.id, 'Verified external transfer received in bank account');
  };

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      setErrorText('Please provide a note or reason for the client.');
      return;
    }
    rejectPayment(payment.id, rejectReason.trim(), isCorrection);
    setRejecting(false);
    setRejectReason('');
    setErrorText(null);
  };

  return (
    <div className="glass-panel liquid-specular-edge rounded-2xl border border-amber-400/30 bg-amber-500/10 p-5 shadow-[0_10px_32px_rgba(245,158,11,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-950 border border-amber-400/40 font-mono backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600 shadow-[0_0_6px_rgba(245,158,11,0.9)]"></span>
              </span>
              Action Required: Payment Verification Request
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {formatDate(payment.paymentDate)}
            </span>
          </div>

          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h4 className="text-base font-bold text-slate-900">
              Bill #{payment.billNumber}
            </h4>
            <span className="text-slate-300">·</span>
            <span className="text-lg font-extrabold font-mono text-emerald-800 tabular-nums">
              {formatINR(payment.amount)}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-600 font-medium">
              Method: <span className="text-slate-900 font-semibold">{payment.paymentMethod}</span>
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-600 font-mono">
              Ref: <span className="text-slate-900 font-bold">{payment.referenceNumber}</span>
            </span>
          </div>

          <div className="text-xs text-slate-600 flex items-center gap-2">
            <span>Project: <strong className="text-slate-900">{payment.projectTitle}</strong></span>
            <span className="text-slate-300">·</span>
            <span>Client: <strong className="text-slate-900">{payment.submittedBy}</strong></span>
          </div>

          {payment.notes && (
            <div className="text-xs italic text-slate-700 bg-white/75 backdrop-blur-sm p-2.5 rounded-xl border border-amber-300/40 mt-1 shadow-2xs">
              "{payment.notes}"
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {payment.proofUrl && (
            <button
              onClick={() => onOpenProofModal ? onOpenProofModal(payment.proofUrl!) : window.open(payment.proofUrl, '_blank')}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 glass-button-secondary rounded-xl transition-all shadow-2xs"
            >
              <Eye className="h-3.5 w-3.5 text-slate-500" />
              <span>View Proof</span>
            </button>
          )}

          <button
            onClick={() => {
              setIsCorrection(true);
              setRejecting(true);
            }}
            className="px-3 py-2 text-xs font-semibold text-amber-900 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 rounded-xl transition-all shadow-2xs backdrop-blur-md"
          >
            Request Correction
          </button>

          <button
            onClick={() => {
              setIsCorrection(false);
              setRejecting(true);
            }}
            className="px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-300/30 rounded-xl transition-all shadow-2xs backdrop-blur-md"
          >
            Reject
          </button>

          <button
            onClick={handleVerify}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 rounded-xl transition-all shadow-md shadow-emerald-700/20 border border-white/30"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Verify Payment</span>
          </button>
        </div>
      </div>

      {/* Inline Reject / Request Correction Drawer */}
      {rejecting && (
        <div className="mt-4 pt-4 border-t border-amber-300/40 space-y-3 glass-panel rounded-xl p-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900">
            <span>
              {isCorrection ? 'Request Payment Correction from Client' : 'Reject Payment Submission'}
            </span>
            <button
              onClick={() => setRejecting(false)}
              className="text-slate-400 hover:text-slate-600 text-xs font-medium"
            >
              Cancel
            </button>
          </div>
          <p className="text-xs text-slate-500">
            {isCorrection
              ? 'Explain what needs correction (e.g. incorrect UTR number, partial amount, or unreadable receipt slip).'
              : 'Specify why this payment submission cannot be accepted.'}
          </p>
          {errorText && (
            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-300/30 text-xs text-rose-700">
              {errorText}
            </div>
          )}
          <textarea
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
            placeholder={
              isCorrection
                ? 'e.g. The attached receipt shows ₹35,000 but the bill balance is ₹42,900. Please confirm if split payment.'
                : 'e.g. No transaction with this reference number was credited to our HDFC bank account.'
            }
            className="w-full text-xs p-2.5 rounded-xl glass-input focus:outline-none"
            rows={2}
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setRejecting(false)}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 glass-button-secondary rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmReject}
              className={`px-3 py-1.5 text-xs font-semibold text-white rounded-lg shadow-sm ${
                isCorrection ? 'bg-amber-600 hover:bg-amber-700' : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              {isCorrection ? 'Send Correction Request' : 'Confirm Rejection'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
