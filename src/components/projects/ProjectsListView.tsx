import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/formatters';
import { CreateProjectModal } from './CreateProjectModal';
import { EmptyState } from '../common/EmptyState';
import {
  FolderKanban,
  Plus,
  Search,
  ChevronRight,
  MapPin,
  User,
  ArrowRight,
} from 'lucide-react';

export const ProjectsListView: React.FC = () => {
  const { projects, getFinancialSummary, role, navigateTo } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredProjects = projects.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.clientName.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Projects Portfolio</h2>
          <p className="text-xs text-slate-500">
            Monitor contract execution, financial realizations, and active site billing
          </p>
        </div>

        {role === 'CONTRACTOR' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>New Project</span>
          </button>
        )}
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-2xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search project title, client, location, or code..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 font-medium focus:ring-1 focus:ring-slate-900"
          >
            <option value="ALL">All Project Statuses</option>
            <option value="ACTIVE">Active Projects</option>
            <option value="COMPLETED">Completed</option>
            <option value="ON_HOLD">On Hold</option>
          </select>
        </div>
      </div>

      {/* Project Cards Grid */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={<FolderKanban className="h-6 w-6" />}
          title="No Projects Found"
          description="There are no projects matching your query."
          actionText={role === 'CONTRACTOR' ? 'Create Project' : undefined}
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map(p => {
            const finance = getFinancialSummary(p.id);

            return (
              <div
                key={p.id}
                onClick={() => navigateTo('project-detail', p.id)}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 hover:shadow-sm cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {p.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          {p.location}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3 text-slate-400" />
                          {p.clientName}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold shrink-0">
                      {p.code}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 mt-2 mb-6 leading-relaxed">
                    {p.description}
                  </p>

                  {/* 4-Metric Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">Contract Value</span>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        {formatINR(p.contractValue)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">Total Billed</span>
                      <span className="font-mono font-semibold text-slate-800 tabular-nums">
                        {formatINR(finance.totalBilled)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">Verified Paid</span>
                      <span className="font-mono font-semibold text-emerald-700 tabular-nums">
                        {formatINR(finance.verifiedPaid)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">Outstanding</span>
                      <span className="font-mono font-semibold text-amber-700 tabular-nums">
                        {formatINR(finance.outstanding)}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-5 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Billed: {finance.billedPercentage.toFixed(0)}%</span>
                      <span className="text-emerald-700 font-medium">
                        Paid: {finance.paidPercentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                      <div
                        className="bg-emerald-500 h-2 transition-all duration-500"
                        style={{ width: `${finance.paidPercentage}%` }}
                      />
                      <div
                        className="bg-slate-300 h-2 transition-all duration-500"
                        style={{ width: `${Math.max(0, finance.billedPercentage - finance.paidPercentage)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>
                    Remaining: <strong>{formatINR(finance.remainingContractValue)}</strong>
                  </span>
                  <span className="text-slate-900 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Manage Project</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCreateModal && (
        <CreateProjectModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};
