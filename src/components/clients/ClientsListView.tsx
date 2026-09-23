import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/formatters';
import { Search, Mail, Phone, Building, ArrowRight, User } from 'lucide-react';

export const ClientsListView: React.FC = () => {
  const { projects, bills, payments, navigateTo } = useApp();
  const [search, setSearch] = useState('');

  // Group unique clients from projects
  const clientMap = new Map<string, {
    name: string;
    email: string;
    phone: string;
    projectsCount: number;
    projectIds: string[];
    contractValue: number;
    totalBilled: number;
    verifiedPaid: number;
    outstanding: number;
  }>();

  projects.forEach(p => {
    const key = p.clientEmail || p.clientName;
    const existing = clientMap.get(key) || {
      name: p.clientName,
      email: p.clientEmail,
      phone: p.clientPhone,
      projectsCount: 0,
      projectIds: [],
      contractValue: 0,
      totalBilled: 0,
      verifiedPaid: 0,
      outstanding: 0,
    };

    existing.projectsCount += 1;
    existing.projectIds.push(p.id);
    existing.contractValue += p.contractValue;

    // Sum bills for this project
    const projBills = bills.filter(b => b.projectId === p.id);
    const billedSum = projBills.reduce((acc, b) => acc + b.totalAmount, 0);
    existing.totalBilled += billedSum;

    // Sum verified payments
    const projPayments = payments.filter(pay => pay.projectId === p.id && pay.status === 'VERIFIED');
    const paidSum = projPayments.reduce((acc, pay) => acc + pay.amount, 0);
    existing.verifiedPaid += paidSum;

    existing.outstanding = Math.max(0, existing.totalBilled - existing.verifiedPaid);

    clientMap.set(key, existing);
  });

  const clients = Array.from(clientMap.values()).filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Clients Directory</h2>
          <p className="text-xs text-slate-500">
            Client accounts, cumulative contract portfolios, and outstanding settlement balances
          </p>
        </div>
      </div>

      <div className="bg-white p-3.5 rounded-xl border border-slate-200">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search client name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clients.map((c, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 hover:border-slate-300 transition-colors shadow-2xs"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">{c.name}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <Mail className="h-3 w-3 text-slate-400" />
                    {c.email}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <Phone className="h-3 w-3 text-slate-400" />
                    {c.phone}
                  </span>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-slate-100 font-medium text-slate-700">
                {c.projectsCount} {c.projectsCount === 1 ? 'Project' : 'Projects'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Total Billed</span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {formatINR(c.totalBilled)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Verified Paid</span>
                <span className="font-mono font-semibold text-emerald-700 tabular-nums">
                  {formatINR(c.verifiedPaid)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Outstanding</span>
                <span className="font-mono font-semibold text-amber-700 tabular-nums">
                  {formatINR(c.outstanding)}
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs">
              <button
                onClick={() => navigateTo('projects')}
                className="font-medium text-slate-700 hover:text-slate-900 flex items-center gap-1"
              >
                <span>View Client Projects</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => navigateTo('messages')}
                className="px-3 py-1 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md font-medium text-xs"
              >
                Direct Message
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
