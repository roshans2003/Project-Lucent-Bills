import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bill, PaymentMethod } from '../../types';
import { formatINR } from '../../utils/formatters';
import {
  X,
  CreditCard,
  Upload,
  AlertCircle,
  ShieldCheck,
  Check,
  QrCode,
  Building,
} from 'lucide-react';

interface PaymentSubmitModalProps {
  bill: Bill;
  onClose: () => void;
}

export const PaymentSubmitModal: React.FC<PaymentSubmitModalProps> = ({ bill, onClose }) => {
  const { submitPayment, organization } = useApp();

  const [amount, setAmount] = useState<number>(bill.totalAmount);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [proofFileName, setProofFileName] = useState<string>('bank_receipt_proof.jpg');
  const [proofPreview, setProofPreview] = useState<string>('/src/assets/images/payment_proof_receipt_1790153469451.jpg');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit.');
        return;
      }
      setProofFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setProofPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceNumber.trim()) {
      setError('Please provide the transaction reference number / UTR / Cheque number.');
      return;
    }
    if (amount <= 0) {
      setError('Please enter a valid payment amount.');
      return;
    }

    setSubmitting(true);
    submitPayment({
      billId: bill.id,
      amount,
      paymentMethod,
      paymentDate,
      referenceNumber: referenceNumber.trim(),
      proofUrl: proofPreview,
      proofFileName,
      notes: notes.trim(),
    });

    setTimeout(() => {
      setSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl glass-modal rounded-3xl shadow-[0_25px_60px_rgba(15,23,42,0.25),inset_0_1px_2px_rgba(255,255,255,0.9)] overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/60 flex items-center justify-between glass-panel-subtle">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Submit Payment Record</h3>
            <p className="text-xs text-slate-500">
              Bill #{bill.billNumber} · {bill.projectTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5">
          {/* Mandatory Non-Custodial Disclaimer */}
          <div className="rounded-2xl bg-amber-500/10 border border-amber-300/40 p-4 flex items-start gap-3 glass-panel">
            <ShieldCheck className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950 leading-relaxed">
              <strong className="font-bold block mb-0.5">Direct Payment Only:</strong>
              Lucent Bills does not process, hold, or transfer funds. Your payment must be completed directly to{' '}
              <span className="font-bold">{organization.name}</span> via UPI, NEFT/RTGS, or Cheque before submitting this record.
            </div>
          </div>

          {/* Contractor Bank / UPI details snippet */}
          <div className="glass-panel-subtle border border-white/70 rounded-2xl p-4 space-y-2 text-xs shadow-2xs">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Building className="h-3.5 w-3.5 text-indigo-600" />
              <span>Contractor Payment Destination ({organization.name})</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5 text-[11px] text-slate-600 font-mono">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">UPI VPA:</span>
                <span className="font-bold text-slate-900">{organization.bankDetails?.upiId || 'vertexbuildworks@icici'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Account No:</span>
                <span className="font-bold text-slate-900">{organization.bankDetails?.accountNumber || '50200049281729'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">IFSC Code:</span>
                <span className="font-bold text-slate-900">{organization.bankDetails?.ifsc || 'HDFC0001234'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Bank Branch:</span>
                <span className="font-semibold text-slate-700">HDFC Bank, Avinashi Rd</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-300/30 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Amount and Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Paid Amount (₹) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  required
                  min={1}
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2.5 text-xs font-mono font-bold rounded-xl glass-input focus:outline-none"
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Total bill balance: {formatINR(bill.totalAmount)}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Payment Method <span className="text-rose-500">*</span>
              </label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2.5 text-xs rounded-xl glass-input focus:outline-none bg-white/70"
              >
                <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                <option value="Bank Transfer">Bank Transfer (IMPS / NEFT / RTGS)</option>
                <option value="Cheque">Cheque</option>
                <option value="Cash">Cash Receipt</option>
                <option value="Other">Other Mutually Agreed</option>
              </select>
            </div>
          </div>

          {/* Date and Reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Payment Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={paymentDate}
                onChange={e => setPaymentDate(e.target.value)}
                className="w-full px-3 py-2.5 text-xs rounded-xl glass-input focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                UTR / Transaction Reference <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 608291048291 or CHQ-401928"
                value={referenceNumber}
                onChange={e => setReferenceNumber(e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-mono font-semibold rounded-xl glass-input focus:outline-none"
              />
            </div>
          </div>

          {/* Payment Proof File Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Upload Payment Proof (Screenshot / Slip)
            </label>
            <div className="border border-dashed border-slate-300/80 rounded-2xl p-4 text-center hover:border-slate-400 transition-colors glass-panel-subtle">
              <input
                type="file"
                id="proof-upload"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="proof-upload"
                className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
              >
                <Upload className="h-6 w-6 text-slate-400" />
                <span className="text-xs font-semibold text-slate-800">
                  {proofFileName ? `Selected: ${proofFileName}` : 'Choose payment screenshot or PDF'}
                </span>
                <span className="text-[10px] text-slate-400">PNG, JPG, PDF up to 10MB</span>
              </label>

              {proofPreview && (
                <div className="mt-3 flex items-center justify-center">
                  <img
                    src={proofPreview}
                    alt="Proof preview"
                    referrerPolicy="no-referrer"
                    className="max-h-24 rounded-xl border border-white/60 object-contain shadow-md"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Notes for Contractor (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Paid via Google Pay from HDFC account ending in 4102."
              className="w-full px-3 py-2 text-xs rounded-xl glass-input focus:outline-none"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-white/60 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 glass-button-secondary rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 text-xs font-bold text-white glass-button-primary rounded-xl transition-all shadow-md disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
