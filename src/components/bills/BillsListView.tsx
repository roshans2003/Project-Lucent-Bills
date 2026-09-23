import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bill, BillStatus } from '../../types';
import { formatINR, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../common/StatusBadge';
import { EmptyState } from '../common/EmptyState';
import { BillCreateModal } from './BillCreateModal';
import { PaymentSubmitModal } from '../payments/PaymentSubmitModal';
import {
  Search,
  Plus,
  Filter,
  Receipt,
  Eye,
  CreditCard,
  ArrowUpDown,
  CheckCircle2,
  Download,
} from 'lucide-react';
import { exportToCSV } from '../../utils/formatters';

export const BillsListView: React.FC = () => {
  const { bills, role, navigateTo, projects } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [projectFilter, setProjectFilter] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPayBill, setSelectedPayBill] = useState<Bill | null>(null);

  // Filter bills
  const filteredBills = bills.filter(b => {
    const matchesSearch =
      b.billNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.projectTitle.toLowerCase().includes(search.toLowerCase()) ||
      b.clientName.toLowerCase().includes(search.toLowerCase()) ||
      b.items.some(it => it.particular.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const matchesProj = projectFilter === 'ALL' || b.projectId === projectFilter;

    return matchesSearch && matchesStatus && matchesProj;
  });

  const handleExportCSV = () => {
    const headers = ['Bill Number', 'Project', 'Client', 'Issue Date', 'Due Date', 'Status', 'Subtotal', 'Tax', 'Total Amount'];
    const rows = filteredBills.map(b => [
      b.billNumber,
      b.projectTitle,
      b.clientName,
      b.issueDate,
      b.dueDate,
      b.status,
      b.subtotal,
      b.taxAmount,
      b.totalAmount,
    ]);
    exportToCSV(`LucentBills_Export_${Date.now()}`, headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Project Bills</h2>
          <p className="text-xs text-slate-500">
            Create, track, review, and verify line-item construction and service bills
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 glass-button-secondary rounded-xl transition-all shadow-2xs"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          {role === 'CONTRACTOR' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white glass-button-primary rounded-xl transition-all shadow-md"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Bill</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-3.5 rounded-2xl border border-white/70 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-2xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search bill number, project, client, or particular..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl glass-input focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl glass-input text-slate-700 font-semibold focus:outline-none bg-white/70"
          >
            <option value="ALL">All Statuses</option>
            <option value="DRAFT">⚪ Draft</option>
            <option value="SUBMITTED">🔵 Submitted</option>
            <option value="APPROVED">Approved by Client</option>
            <option value="PAYMENT_PENDING">🟡 Payment Pending</option>
            <option value="PAYMENT_SUBMITTED">🟠 Verification Pending</option>
            <option value="PAID_VERIFIED">🟢 Paid & Verified</option>
            <option value="REJECTED">🔴 Rejected</option>
          </select>

          {/* Project filter */}
          <select
            value={projectFilter}
            onChange={e => setProjectFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl glass-input text-slate-700 font-semibold focus:outline-none bg-white/70"
          >
            <option value="ALL">All Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bills Table */}
      {filteredBills.length === 0 ? (
        <EmptyState
          icon={<Receipt className="h-6 w-6" />}
          title="No Bills Found"
          description={
            search || statusFilter !== 'ALL'
              ? 'No bills match your current search and filter criteria.'
              : "You haven't created any bills yet. Click below to draft your first bill."
          }
          actionText={role === 'CONTRACTOR' ? 'Create First Bill' : undefined}
          onAction={() => setShowCreateModal(true)}
          secondaryActionText={search || statusFilter !== 'ALL' ? 'Reset Filters' : undefined}
          onSecondaryAction={() => {
            setSearch('');
            setStatusFilter('ALL');
            setProjectFilter('ALL');
          }}
        />
      ) : (
        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/60 text-slate-500 font-semibold text-[11px] glass-panel-subtle">
                  <th className="py-3.5 px-4 w-[16%]">Bill Number</th>
                  <th className="py-3.5 px-3 w-[26%]">Project & Client</th>
                  <th className="py-3.5 px-3 w-[15%] text-right">Amount</th>
                  <th className="py-3.5 px-3 w-[18%]">Status</th>
                  <th className="py-3.5 px-3 w-[13%]">Due Date</th>
                  <th className="py-3.5 px-4 w-[12%] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/70 font-sans">
                {filteredBills.map(b => (
                  <tr
                    key={b.id}
                    onClick={() => navigateTo('bill-detail', b.id)}
                    className="hover:bg-white/60 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {b.billNumber}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-sans">
                        {b.items.length} {b.items.length === 1 ? 'particular' : 'particulars'}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-900 truncate max-w-xs">
                        {b.projectTitle}
                      </div>
                      <div className="text-[11px] text-slate-500">{b.clientName}</div>
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <span className="font-mono font-black text-slate-900 text-sm tabular-nums">
                        {formatINR(b.totalAmount)}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <StatusBadge status={b.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-3 text-slate-600 font-mono text-[11px]">
                      {formatDate(b.dueDate)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => navigateTo('bill-detail', b.id)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white/80 rounded-xl transition-colors"
                          title="View Bill Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {role === 'CLIENT' && (b.status === 'APPROVED' || b.status === 'PAYMENT_PENDING' || b.status === 'SUBMITTED') && (
                          <button
                            onClick={() => setSelectedPayBill(b)}
                            className="px-3 py-1.5 text-[11px] font-bold text-white glass-button-primary rounded-xl transition-all shadow-xs"
                          >
                            Pay
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bill Create Modal */}
      {showCreateModal && (
        <BillCreateModal onClose={() => setShowCreateModal(false)} />
      )}

      {/* Payment Submit Modal for quick action */}
      {selectedPayBill && (
        <PaymentSubmitModal
          bill={selectedPayBill}
          onClose={() => setSelectedPayBill(null)}
        />
      )}
    </div>
  );
};
