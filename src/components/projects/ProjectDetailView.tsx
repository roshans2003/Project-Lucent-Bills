import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR, formatDate, formatRelativeTime } from '../../utils/formatters';
import { FinancialCard } from '../common/FinancialCard';
import { StatusBadge } from '../common/StatusBadge';
import { BillCreateModal } from '../bills/BillCreateModal';
import { PaymentSubmitModal } from '../payments/PaymentSubmitModal';
import { ProofViewerModal } from '../payments/ProofViewerModal';
import { Bill } from '../../types';
import { ActivityTimeline } from '../common/ActivityTimeline';
import { ProjectChatBox } from '../messages/ProjectChatBox';
import {
  ArrowLeft,
  Wallet,
  Receipt,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Plus,
  CreditCard,
  MessageSquare,
  FileText,
  History,
  Send,
  Download,
  Eye,
  Building,
  User,
  MapPin,
  Calendar,
  Paperclip,
} from 'lucide-react';

interface ProjectDetailViewProps {
  projectId: string;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ projectId }) => {
  const {
    projects,
    bills,
    payments,
    messages,
    sendMessage,
    activities,
    getFinancialSummary,
    role,
    navigateTo,
    currentUser,
  } = useApp();

  const project = projects.find(p => p.id === projectId);
  const [activeTab, setActiveTab] = useState<'overview' | 'bills' | 'payments' | 'messages' | 'files' | 'activity'>('overview');
  const [showCreateBillModal, setShowCreateBillModal] = useState(false);
  const [selectedPayBill, setSelectedPayBill] = useState<Bill | null>(null);
  const [selectedProofUrl, setSelectedProofUrl] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatBillReference, setChatBillReference] = useState('');

  if (!project) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-slate-500">Project not found.</p>
        <button
          onClick={() => navigateTo('projects')}
          className="mt-3 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  const finance = getFinancialSummary(project.id);
  const projectBills = bills.filter(b => b.projectId === project.id);
  const projectPayments = payments.filter(p => p.projectId === project.id);
  const projectMessages = messages.filter(m => m.projectId === project.id);
  const projectActivities = activities.filter(a => a.projectId === project.id);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    sendMessage({
      projectId: project.id,
      billId: chatBillReference ? chatBillReference : undefined,
      billNumber: chatBillReference
        ? projectBills.find(b => b.id === chatBillReference)?.billNumber
        : undefined,
      content: chatMessage.trim(),
    });

    setChatMessage('');
    setChatBillReference('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigateTo('projects')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to All Projects</span>
          </button>
          <div className="flex items-center gap-3">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              {project.title}
            </h2>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
              {project.code}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              {project.location}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5 text-slate-400" />
              Client: <strong>{project.clientName}</strong>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              Target: {formatDate(project.expectedEndDate)}
            </span>
          </div>
        </div>

        {role === 'CONTRACTOR' && (
          <button
            onClick={() => setShowCreateBillModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Create Bill for Project</span>
          </button>
        )}
      </div>

      {/* Tabs navigation */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6 text-xs font-medium">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'bills', label: `Bills (${projectBills.length})` },
            { id: 'payments', label: `Payments (${projectPayments.length})` },
            {
              id: 'messages',
              label: `Messages (${projectMessages.length})`,
              badge: projectMessages.filter(m => m.senderRole !== role && !m.read).length > 0
                ? `${projectMessages.filter(m => m.senderRole !== role && !m.read).length} new`
                : undefined,
            },
            { id: 'files', label: 'Project Files (4)' },
            { id: 'activity', label: `Activity (${projectActivities.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3.5 border-b-2 font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'border-slate-900 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* TAB CONTENT */}

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-100">
          {/* Financial Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <FinancialCard
              title="Contract Value"
              amount={finance.contractValue}
              subtitle="Signed agreement scope"
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
              title="Outstanding Due"
              amount={finance.outstanding}
              subtitle="Pending settlement"
              highlight="amber"
              icon={<Clock className="h-4 w-4" />}
            />
            <FinancialCard
              title="Remaining Contract"
              amount={finance.remainingContractValue}
              subtitle="Unrealized scope balance"
              highlight="default"
              icon={<ArrowUpRight className="h-4 w-4" />}
            />
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Project Scope & Description</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {project.description}
              </p>

              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Start Date</span>
                  <span className="font-semibold text-slate-800">{formatDate(project.startDate)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Completion Date</span>
                  <span className="font-semibold text-slate-800">{formatDate(project.expectedEndDate)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Status</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {project.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Client Details</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Name</span>
                  <span className="font-bold text-slate-900 text-sm">{project.clientName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Email</span>
                  <span className="text-slate-600 font-mono text-[11px]">{project.clientEmail}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Phone</span>
                  <span className="text-slate-600 font-mono text-[11px]">{project.clientPhone}</span>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('messages')}
                    className="w-full py-2 px-3 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-slate-600" />
                    <span>Open Project Chat</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Project Pulse: Live Activity & Recent Communication Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            {/* Recent Timeline Preview */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
                    <History className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Recent Project Activity</h3>
                </div>
                <button
                  onClick={() => setActiveTab('activity')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                >
                  <span>View Full Trail ({projectActivities.length})</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <ActivityTimeline
                activities={projectActivities}
                compact={true}
                limit={4}
                emptyMessage="No activity logs for this project yet."
              />
            </div>

            {/* Recent Messages Preview */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Latest Communications</h3>
                </div>
                <button
                  onClick={() => setActiveTab('messages')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                >
                  <span>Open Hub ({projectMessages.length})</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {projectMessages.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                  No messages yet. Use the Messages tab to converse with client or tag bills.
                </div>
              ) : (
                <div className="space-y-3">
                  {projectMessages.slice(-3).reverse().map(msg => (
                    <div
                      key={msg.id}
                      onClick={() => setActiveTab('messages')}
                      className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50/70 cursor-pointer transition-all space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-900">{msg.senderName}</span>
                        <span className="text-slate-400 font-mono text-[10px]">
                          {formatRelativeTime(msg.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {msg.content || msg.text}
                      </p>
                      {msg.billNumber && (
                        <div className="inline-flex items-center gap-1 text-[10px] font-mono text-indigo-700 font-semibold mt-1">
                          <Receipt className="h-3 w-3" />
                          <span>Tagged #{msg.billNumber}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. BILLS TAB */}
      {activeTab === 'bills' && (
        <div className="space-y-4 animate-in fade-in duration-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Project Bills ({projectBills.length})</h3>
            {role === 'CONTRACTOR' && (
              <button
                onClick={() => setShowCreateBillModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Create Bill</span>
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                  <th className="py-3 px-4">Bill Number</th>
                  <th className="py-3 px-3">Period</th>
                  <th className="py-3 px-3 text-right">Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Due Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projectBills.map(b => (
                  <tr
                    key={b.id}
                    onClick={() => navigateTo('bill-detail', b.id)}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 group-hover:text-blue-600">
                      {b.billNumber}
                    </td>
                    <td className="py-3 px-3 text-slate-600">{b.billingPeriod}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {formatINR(b.totalAmount)}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={b.status} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                      {formatDate(b.dueDate)}
                    </td>
                    <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigateTo('bill-detail', b.id)}
                          className="p-1 text-slate-400 hover:text-slate-700"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        {role === 'CLIENT' && (b.status === 'APPROVED' || b.status === 'PAYMENT_PENDING' || b.status === 'SUBMITTED') && (
                          <button
                            onClick={() => setSelectedPayBill(b)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md"
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

      {/* 3. PAYMENTS TAB */}
      {activeTab === 'payments' && (
        <div className="space-y-4 animate-in fade-in duration-100">
          <h3 className="text-sm font-bold text-slate-900">Project Payments ({projectPayments.length})</h3>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                  <th className="py-3 px-4">Bill</th>
                  <th className="py-3 px-3 text-right">Amount</th>
                  <th className="py-3 px-3">Method</th>
                  <th className="py-3 px-3">UTR Reference</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Proof Slip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projectPayments.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      #{p.billNumber}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {formatINR(p.amount)}
                    </td>
                    <td className="py-3 px-3 text-slate-800 font-medium">{p.paymentMethod}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-600">{p.referenceNumber}</td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                      {formatDate(p.paymentDate)}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={p.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      {p.proofUrl ? (
                        <button
                          onClick={() => setSelectedProofUrl(p.proofUrl!)}
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-xs"
                        >
                          <Eye className="h-3 w-3" />
                          <span>View</span>
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[10px]">None</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. MESSAGES TAB */}
      {activeTab === 'messages' && (
        <div className="animate-in fade-in duration-100">
          <ProjectChatBox projectId={project.id} maxHeight="620px" />
        </div>
      )}

      {/* 5. FILES TAB */}
      {activeTab === 'files' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 animate-in fade-in duration-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Project Documents & Blueprints</h3>
              <p className="text-xs text-slate-500">Shared architectural drawings, structural sheets, and contract PDFs</p>
            </div>
            <button
              onClick={() => alert('Document upload simulated: file added to secure project cloud.')}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1"
            >
              <Paperclip className="h-3.5 w-3.5" />
              <span>Upload Document</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {[
              { name: 'Villa_Architectural_Plan_v3.pdf', size: '4.8 MB', date: '15 Jan 2026', type: 'PDF Blueprint' },
              { name: 'Structural_Steel_BOQ_Signed.pdf', size: '1.2 MB', date: '20 Jan 2026', type: 'Contract BOQ' },
              { name: 'Site_Soil_Test_Report.pdf', size: '890 KB', date: '10 Jan 2026', type: 'Geotechnical' },
              { name: 'Coimbatore_Municipal_Sanction.pdf', size: '2.1 MB', date: '02 Feb 2026', type: 'Permit' },
            ].map((f, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-2xs transition-all space-y-2">
                <div className="flex items-start justify-between">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <span className="text-[10px] font-mono text-slate-400">{f.size}</span>
                </div>
                <div className="text-xs font-bold text-slate-900 truncate" title={f.name}>
                  {f.name}
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-200/60">
                  <span>{f.type}</span>
                  <span>{f.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. ACTIVITY TAB */}
      {activeTab === 'activity' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 animate-in fade-in duration-100 shadow-xs">
          <ActivityTimeline
            activities={projectActivities}
            title="Project Audit & Activity Lineage"
            subtitle="Complete chronological trail of bill creation, client reviews, offline payment records, and site communications"
            showFilters={true}
          />
        </div>
      )}

      {/* Modals */}
      {showCreateBillModal && (
        <BillCreateModal
          preselectedProjectId={project.id}
          onClose={() => setShowCreateBillModal(false)}
        />
      )}

      {selectedPayBill && (
        <PaymentSubmitModal
          bill={selectedPayBill}
          onClose={() => setSelectedPayBill(null)}
        />
      )}

      {selectedProofUrl && (
        <ProofViewerModal
          imageUrl={selectedProofUrl}
          onClose={() => setSelectedProofUrl(null)}
        />
      )}
    </div>
  );
};
