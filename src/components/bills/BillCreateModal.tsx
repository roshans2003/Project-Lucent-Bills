import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BillItem } from '../../types';
import { formatINR } from '../../utils/formatters';
import { ParticularPickerModal } from './ParticularPickerModal';
import {
  X,
  Plus,
  Trash2,
  FileText,
  Calculator,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

interface BillCreateModalProps {
  onClose: () => void;
  preselectedProjectId?: string;
}

export const BillCreateModal: React.FC<BillCreateModalProps> = ({ onClose, preselectedProjectId }) => {
  const { projects, createBill, bills, navigateTo } = useApp();

  const activeProjects = projects.filter(p => p.status === 'ACTIVE');
  const initialProject = activeProjects.find(p => p.id === preselectedProjectId) || activeProjects[0];

  const [projectId, setProjectId] = useState<string>(initialProject ? initialProject.id : '');
  const selectedProj = projects.find(p => p.id === projectId);

  // Generate next bill number based on existing count
  const nextNum = bills.length + 44;
  const [billNumber, setBillNumber] = useState<string>(`LB-2026-00${nextNum}`);

  const [billingPeriod, setBillingPeriod] = useState<string>('23 Mar 2026 - 30 Mar 2026');
  const [issueDate, setIssueDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState<string>('2026-04-05');
  const [notes, setNotes] = useState<string>('Direct settlement via UPI or bank transfer. Site inspection slips attached.');
  const [taxRate, setTaxRate] = useState<number>(0); // e.g. 0 or 18% GST
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // Bill line items
  const [items, setItems] = useState<BillItem[]>([
    {
      id: 'item_1',
      particular: 'Cement (Ultratech 53 Grade)',
      category: 'Civil Materials',
      quantity: 50,
      unit: 'bags',
      rate: 420,
      amount: 21000,
      notes: '',
    },
    {
      id: 'item_2',
      particular: 'M-Sand (Manufactured Sand)',
      category: 'Civil Materials',
      quantity: 3,
      unit: 'loads',
      rate: 5500,
      amount: 16500,
      notes: '',
    },
    {
      id: 'item_3',
      particular: 'Mason & Skilled Civil Labour',
      category: 'Labour',
      quantity: 6,
      unit: 'days',
      rate: 900,
      amount: 5400,
      notes: '',
    },
  ]);

  const [showPickerModal, setShowPickerModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate Subtotal dynamically
  const subtotal = items.reduce((acc, it) => acc + (it.amount || 0), 0);
  const taxAmount = Math.round((subtotal * taxRate) / 100);
  const totalAmount = Math.max(0, subtotal + taxAmount - discountAmount);

  const handleUpdateItem = (id: string, field: keyof BillItem, value: any) => {
    setItems(prev =>
      prev.map(it => {
        if (it.id !== id) return it;
        const updated = { ...it, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          const qty = field === 'quantity' ? Number(value) : it.quantity;
          const rt = field === 'rate' ? Number(value) : it.rate;
          updated.amount = Math.round(qty * rt);
        }
        return updated;
      })
    );
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      setError('A bill must contain at least one line item.');
      return;
    }
    setItems(prev => prev.filter(it => it.id !== id));
    setError(null);
  };

  const handleAddFromLibrary = (libItem: { particular: string; category?: string; unit: string; rate: number }) => {
    const newItem: BillItem = {
      id: `item_${Date.now()}`,
      particular: libItem.particular,
      category: libItem.category,
      quantity: 1,
      unit: libItem.unit,
      rate: libItem.rate,
      amount: libItem.rate,
    };
    setItems(prev => [...prev, newItem]);
  };

  const handleAddEmptyRow = () => {
    const newItem: BillItem = {
      id: `item_${Date.now()}`,
      particular: '',
      quantity: 1,
      unit: 'nos',
      rate: 0,
      amount: 0,
    };
    setItems(prev => [...prev, newItem]);
  };

  const handleSubmit = (status: 'DRAFT' | 'SUBMITTED') => {
    if (!selectedProj) {
      setError('Please select a project.');
      return;
    }
    if (items.some(it => !it.particular.trim() || it.amount <= 0)) {
      setError('All bill items must have a title, valid quantity, and rate.');
      return;
    }

    const newBill = createBill({
      billNumber: billNumber.trim(),
      projectId: selectedProj.id,
      projectTitle: selectedProj.title,
      clientName: selectedProj.clientName,
      clientEmail: selectedProj.clientEmail,
      billingPeriod,
      issueDate,
      dueDate,
      items,
      subtotal,
      taxRate,
      taxAmount,
      discountAmount,
      totalAmount,
      status,
      notes,
    });

    onClose();
    if (newBill?.id) {
      navigateTo('bill-detail', newBill.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl glass-modal rounded-3xl shadow-[0_25px_60px_rgba(15,23,42,0.25),inset_0_1px_2px_rgba(255,255,255,0.9)] overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/60 flex items-center justify-between glass-panel-subtle">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Create New Project Bill</h3>
            <p className="text-xs text-slate-500">
              Draft comprehensive bill particulars, quantities, rates, and review auto calculations
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
        <div className="p-6 overflow-y-auto space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-300/30 text-xs text-rose-800">
              {error}
            </div>
          )}

          {/* Project & Bill Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 glass-panel p-4 rounded-2xl border border-white/70 shadow-2xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Project
              </label>
              <select
                value={projectId}
                onChange={e => setProjectId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl glass-input focus:outline-none bg-white/80 font-medium"
              >
                {activeProjects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
              {selectedProj && (
                <span className="text-[10px] text-slate-500 mt-1 block font-medium">
                  Client: {selectedProj.clientName}
                </span>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Bill Number
              </label>
              <input
                type="text"
                value={billNumber}
                onChange={e => setBillNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl glass-input focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Billing Period
              </label>
              <input
                type="text"
                value={billingPeriod}
                onChange={e => setBillingPeriod(e.target.value)}
                placeholder="e.g. 10 Mar - 20 Mar 2026"
                className="w-full px-3 py-2 text-xs rounded-xl glass-input focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl glass-input focus:outline-none"
              />
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Bill Particulars & Line Items
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">
                  ({items.length} items)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPickerModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 glass-button-secondary rounded-xl transition-all shadow-2xs"
                >
                  <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                  <span>+ Add from Library</span>
                </button>
                <button
                  type="button"
                  onClick={handleAddEmptyRow}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 glass-pill rounded-xl transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Custom Row</span>
                </button>
              </div>
            </div>

            <div className="border border-white/70 rounded-2xl overflow-hidden glass-panel-subtle shadow-2xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200/60 text-slate-500 font-semibold text-[11px]">
                    <th className="py-2.5 px-3 w-[42%]">Particular Description</th>
                    <th className="py-2.5 px-2 w-[14%]">Quantity</th>
                    <th className="py-2.5 px-2 w-[14%]">Unit</th>
                    <th className="py-2.5 px-2 w-[14%] text-right">Rate (₹)</th>
                    <th className="py-2.5 px-3 w-[16%] text-right">Amount (₹)</th>
                    <th className="py-2.5 px-2 w-[4%]"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/70 font-sans">
                  {items.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-white/70 transition-colors">
                      <td className="p-2">
                        <input
                          type="text"
                          required
                          placeholder="e.g. Cement, Steel, UI/UX"
                          value={item.particular}
                          onChange={e => handleUpdateItem(item.id, 'particular', e.target.value)}
                          className="w-full px-2 py-1.5 text-xs rounded-lg glass-input focus:outline-none font-medium"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min={0.1}
                          step="any"
                          required
                          value={item.quantity}
                          onChange={e => handleUpdateItem(item.id, 'quantity', e.target.value)}
                          className="w-full px-2 py-1.5 text-xs font-mono rounded-lg glass-input focus:outline-none"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={item.unit}
                          onChange={e => handleUpdateItem(item.id, 'unit', e.target.value)}
                          className="w-full px-2 py-1.5 text-xs rounded-lg glass-input focus:outline-none"
                        />
                      </td>
                      <td className="p-2 text-right">
                        <input
                          type="number"
                          min={0}
                          step="any"
                          required
                          value={item.rate}
                          onChange={e => handleUpdateItem(item.id, 'rate', e.target.value)}
                          className="w-full px-2 py-1.5 text-xs font-mono text-right rounded-lg glass-input focus:outline-none"
                        />
                      </td>
                      <td className="p-2 text-right font-mono font-bold text-slate-900 tabular-nums">
                        {formatINR(item.amount)}
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes and Calculations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Bill Notes & Payment Instructions
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl glass-input focus:outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Visible to client on their invoice. Mention site delivery slips, weighbridge vouchers, or UPI details.
              </p>
            </div>

            {/* Financial Summary Breakdown */}
            <div className="glass-panel rounded-2xl p-4 border border-white/70 space-y-2.5 text-xs shadow-2xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Subtotal ({items.length} items):</span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">{formatINR(subtotal)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span>GST / Tax Rate:</span>
                  <select
                    value={taxRate}
                    onChange={e => setTaxRate(Number(e.target.value))}
                    className="px-2 py-1 rounded-lg glass-input text-[11px] bg-white/70 font-mono"
                  >
                    <option value={0}>0% (Exempt / Direct Civil)</option>
                    <option value={5}>5%</option>
                    <option value={12}>12%</option>
                    <option value={18}>18% (Standard GST)</option>
                  </select>
                </div>
                <span className="font-mono tabular-nums">{formatINR(taxAmount)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>Discount / Adjustment:</span>
                <input
                  type="number"
                  min={0}
                  value={discountAmount}
                  onChange={e => setDiscountAmount(Number(e.target.value))}
                  className="w-28 px-2 py-1 text-right font-mono rounded-lg glass-input text-[11px]"
                />
              </div>

              <div className="pt-2.5 border-t border-slate-200/50 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Total Billed:</span>
                <span className="text-lg font-extrabold font-mono text-slate-900 tabular-nums">
                  {formatINR(totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-white/60 glass-panel-subtle flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 glass-button-secondary rounded-xl"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSubmit('DRAFT')}
              className="px-4 py-2 text-xs font-semibold text-slate-700 glass-button-secondary rounded-xl transition-all"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => handleSubmit('SUBMITTED')}
              className="px-5 py-2 text-xs font-bold text-white glass-button-primary rounded-xl transition-all shadow-md"
            >
              Submit to Client
            </button>
          </div>
        </div>

        {/* Particular Picker Library Submodal */}
        {showPickerModal && (
          <ParticularPickerModal
            onSelect={handleAddFromLibrary}
            onClose={() => setShowPickerModal(false)}
          />
        )}
      </div>
    </div>
  );
};
