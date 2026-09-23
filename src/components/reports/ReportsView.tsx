import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR, formatDate, exportToCSV } from '../../utils/formatters';
import { FinancialCard } from '../common/FinancialCard';
import { Download, FileText, Calendar, Filter, CheckCircle2, Receipt, Clock } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { bills, payments, projects, getFinancialSummary } = useApp();

  const [selectedProjectId, setSelectedProjectId] = useState<string>('ALL');
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-12-31');

  const finance = getFinancialSummary(selectedProjectId === 'ALL' ? undefined : selectedProjectId);
  const collectionRate = finance.totalBilled > 0 ? (finance.verifiedPaid / finance.totalBilled) * 100 : 0;

  // Ledger entries combining Bills (debits) and Payments (credits)
  type LedgerEntry = {
    date: string;
    type: 'BILL' | 'PAYMENT';
    ref: string;
    project: string;
    client: string;
    description: string;
    amount: number;
    status: string;
  };

  const relevantBills = bills.filter(b => selectedProjectId === 'ALL' || b.projectId === selectedProjectId);
  const relevantPayments = payments.filter(p => selectedProjectId === 'ALL' || p.projectId === selectedProjectId);

  const ledger: LedgerEntry[] = [
    ...relevantBills.map(b => ({
      date: b.issueDate,
      type: 'BILL' as const,
      ref: b.billNumber,
      project: b.projectTitle,
      client: b.clientName,
      description: `Bill issued (${b.items.length} particulars)`,
      amount: b.totalAmount,
      status: b.status,
    })),
    ...relevantPayments.map(p => ({
      date: p.paymentDate,
      type: 'PAYMENT' as const,
      ref: p.referenceNumber,
      project: p.projectTitle,
      client: p.submittedBy,
      description: `Payment via ${p.paymentMethod} (Bill #${p.billNumber})`,
      amount: p.amount,
      status: p.status,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleExportCSV = () => {
    const headers = ['Date', 'Type', 'Reference', 'Project', 'Client', 'Description', 'Amount', 'Status'];
    const rows = ledger.map(l => [
      l.date,
      l.type,
      l.ref,
      l.project,
      l.client,
      l.description,
      l.amount,
      l.status,
    ]);
    exportToCSV(`LucentBills_Statement_${selectedProjectId}_${Date.now()}`, headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Financial Reports & Statements</h2>
          <p className="text-xs text-slate-500">
            Reconciled audit trail of invoices issued, payments verified, and collection ratios
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm self-start sm:self-auto"
        >
          <Download className="h-4 w-4" />
          <span>Download Audit Ledger CSV</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-700">Filter Scope:</span>
          <select
            value={selectedProjectId}
            onChange={e => setSelectedProjectId(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-medium"
          >
            <option value="ALL">All Consolidated Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span>Date Range:</span>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="px-2 py-1 text-xs border rounded border-slate-300"
          />
          <span>to</span>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="px-2 py-1 text-xs border rounded border-slate-300"
          />
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FinancialCard
          title="Total Billed"
          amount={finance.totalBilled}
          subtitle="Cumulative invoiced"
          highlight="primary"
          icon={<Receipt className="h-4 w-4" />}
        />
        <FinancialCard
          title="Verified Received"
          amount={finance.verifiedPaid}
          subtitle="Realized external settlements"
          highlight="success"
          icon={<CheckCircle2 className="h-4 w-4" />}
        />
        <FinancialCard
          title="Outstanding Receivable"
          amount={finance.outstanding}
          subtitle="Pending collection"
          highlight="amber"
          icon={<Clock className="h-4 w-4" />}
        />
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-500 tracking-wider uppercase">
            Collection Velocity
          </span>
          <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 mt-2">
            {collectionRate.toFixed(1)}%
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
            <div
              className="bg-emerald-500 h-1.5 rounded-full"
              style={{ width: `${Math.min(100, collectionRate)}%` }}
            />
          </div>
          <span className="text-xs text-slate-400 mt-2 block">
            Verified payments / Invoiced amount
          </span>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Consolidated Transaction Ledger</h3>
          <span className="text-xs font-mono text-slate-500">{ledger.length} total entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Ref ID</th>
                <th className="py-3 px-3">Project</th>
                <th className="py-3 px-3">Description</th>
                <th className="py-3 px-4 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {ledger.map((entry, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-mono text-slate-600 text-[11px]">
                    {formatDate(entry.date)}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                        entry.type === 'BILL'
                          ? 'bg-slate-100 text-slate-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {entry.type === 'BILL' ? 'DEBIT (BILL)' : 'CREDIT (PAYMENT)'}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold text-slate-900">
                    {entry.ref}
                  </td>
                  <td className="py-3 px-3 text-slate-700 truncate max-w-xs">{entry.project}</td>
                  <td className="py-3 px-3 text-slate-500">{entry.description}</td>
                  <td
                    className={`py-3 px-4 text-right font-mono font-bold tabular-nums ${
                      entry.type === 'PAYMENT' ? 'text-emerald-700' : 'text-slate-900'
                    }`}
                  >
                    {entry.type === 'PAYMENT' ? `+${formatINR(entry.amount)}` : formatINR(entry.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
