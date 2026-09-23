import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR, formatRelativeTime, formatDate } from '../../utils/formatters';
import {
  Send,
  Receipt,
  Paperclip,
  CheckCheck,
  Search,
  MessageSquare,
  Building,
  User,
  ExternalLink,
  Sparkles,
  Tag,
  X,
  FileCheck,
} from 'lucide-react';

interface ProjectChatBoxProps {
  projectId: string;
  preselectedBillId?: string;
  compact?: boolean;
  maxHeight?: string;
  title?: string;
  subtitle?: string;
  allowBillTagging?: boolean;
}

export const ProjectChatBox: React.FC<ProjectChatBoxProps> = ({
  projectId,
  preselectedBillId,
  compact = false,
  maxHeight = '520px',
  title,
  subtitle,
  allowBillTagging = true,
}) => {
  const {
    messages,
    projects,
    bills,
    role,
    sendMessage,
    markMessagesAsRead,
    navigateTo,
    organization,
  } = useApp();

  const project = projects.find(p => p.id === projectId);
  const projectBills = bills.filter(b => b.projectId === projectId);

  const [inputText, setInputText] = useState('');
  const [selectedBillId, setSelectedBillId] = useState<string>(preselectedBillId || '');
  const [searchFilter, setSearchFilter] = useState('');
  const [filterByBillOnly, setFilterByBillOnly] = useState<boolean>(Boolean(preselectedBillId));
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mark unread messages in this project as read
  useEffect(() => {
    if (projectId) {
      markMessagesAsRead(projectId);
    }
  }, [projectId, messages.length]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, selectedBillId, filterByBillOnly]);

  if (!project) {
    return (
      <div className="p-6 text-center text-xs text-slate-400 glass-panel rounded-2xl">
        Project not found.
      </div>
    );
  }

  // Filter messages for this project
  let projectMessages = messages.filter(m => m.projectId === projectId);

  // If in bill-specific mode
  if (filterByBillOnly && preselectedBillId) {
    projectMessages = projectMessages.filter(
      m =>
        m.billId === preselectedBillId ||
        m.billReference === preselectedBillId ||
        (m.billNumber &&
          projectBills.some(b => b.id === preselectedBillId && b.billNumber === m.billNumber))
    );
  }

  // Search filter
  if (searchFilter.trim()) {
    const q = searchFilter.toLowerCase();
    projectMessages = projectMessages.filter(
      m =>
        m.text.toLowerCase().includes(q) ||
        (m.content && m.content.toLowerCase().includes(q)) ||
        m.senderName.toLowerCase().includes(q) ||
        (m.billNumber && m.billNumber.toLowerCase().includes(q))
    );
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const taggedBill = projectBills.find(b => b.id === (selectedBillId || preselectedBillId));

    sendMessage({
      projectId: project.id,
      billId: taggedBill?.id,
      billNumber: taggedBill?.billNumber,
      content: inputText.trim(),
      attachmentName: attachmentPreview ? 'Quarry_weighbridge_slip.jpg' : undefined,
      attachmentUrl: attachmentPreview || undefined,
    });

    setInputText('');
    setAttachmentPreview(null);
    if (!preselectedBillId) {
      setSelectedBillId('');
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputText(prompt);
  };

  const quickPrompts = [
    'Can you provide the weighbridge measurement slip?',
    'Payment transfer initiated. Bank UTR reference provided.',
    'Site civil inspection passed. Work proceeding on schedule.',
    'Please review the revised quantities in the latest bill.',
  ];

  return (
    <div
      className="glass-panel rounded-3xl border border-white/80 shadow-[0_15px_40px_rgba(15,23,42,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)] overflow-hidden flex flex-col"
      style={{ height: maxHeight }}
    >
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-white/60 glass-panel-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-indigo-500/15 text-indigo-700 border border-indigo-400/20">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                {title || 'Project Communication Hub'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {subtitle ||
                  `Direct, transparent record between Contractor (${organization.name}) and Client (${project.clientName})`}
              </p>
            </div>
          </div>
        </div>

        {/* Right Header: Search & Participants */}
        <div className="flex items-center gap-2">
          {/* Quick Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              placeholder="Search chat..."
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl glass-input w-36 sm:w-48 focus:outline-none"
            />
          </div>

          {preselectedBillId && (
            <button
              onClick={() => setFilterByBillOnly(!filterByBillOnly)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all ${
                filterByBillOnly
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                  : 'glass-button-secondary text-slate-600'
              }`}
              title="Toggle between only this bill's messages or full project thread"
            >
              {filterByBillOnly ? 'This Bill Only' : 'All Project Messages'}
            </button>
          )}
        </div>
      </div>

      {/* Messages Flow Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-sans">
        {projectMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200/60">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">No messages in this thread yet</p>
              <p className="text-[11px] text-slate-400 max-w-sm mt-0.5">
                Send notes, clarifications regarding line items, or payment coordination messages.
                Both contractor and client have instant access.
              </p>
            </div>

            {/* Quick Starter Prompts */}
            <div className="pt-2 flex flex-wrap justify-center gap-1.5 max-w-md">
              {quickPrompts.slice(0, 2).map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickPrompt(prompt)}
                  className="text-[11px] px-3 py-1 rounded-xl glass-pill hover:bg-white text-slate-600 text-left transition-colors"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          projectMessages.map(msg => {
            const isMe = msg.senderRole === role;
            const referencedBill = projectBills.find(
              b => b.id === msg.billId || b.id === msg.billReference || b.billNumber === msg.billNumber
            );

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group`}
              >
                {/* Meta info header */}
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 px-1">
                  <span
                    className={`font-bold ${
                      isMe ? 'text-indigo-950' : 'text-slate-800'
                    }`}
                  >
                    {msg.senderName}
                  </span>
                  <span>·</span>
                  <span className="font-mono">{formatRelativeTime(msg.timestamp)}</span>
                  {isMe && (
                    <CheckCheck className="h-3 w-3 text-indigo-500 inline-block ml-0.5" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-lg rounded-2xl p-4 text-xs leading-relaxed transition-all ${
                    isMe
                      ? 'bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-md rounded-br-xs'
                      : 'glass-panel text-slate-900 border border-white/80 shadow-xs rounded-bl-xs'
                  }`}
                >
                  {/* Referenced Bill Tag Pill */}
                  {(msg.billNumber || referencedBill) && (
                    <div
                      onClick={() => {
                        if (referencedBill) {
                          navigateTo('bill-detail', referencedBill.id);
                        } else {
                          navigateTo('bills');
                        }
                      }}
                      className={`mb-2.5 p-2 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                        isMe
                          ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                          : 'bg-indigo-500/10 hover:bg-indigo-500/15 border-indigo-200/50 text-indigo-950'
                      }`}
                      title="Click to view full bill sheet"
                    >
                      <div className="flex items-center gap-1.5">
                        <Receipt className="h-3.5 w-3.5 opacity-80 shrink-0" />
                        <span className="font-mono font-bold text-[11px]">
                          Bill #{msg.billNumber || referencedBill?.billNumber}
                        </span>
                        {referencedBill && (
                          <span className="text-[10px] opacity-75 font-mono">
                            ({formatINR(referencedBill.totalAmount)})
                          </span>
                        )}
                      </div>
                      <ExternalLink className="h-3 w-3 opacity-70" />
                    </div>
                  )}

                  {/* Message Body */}
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content || msg.text}</p>

                  {/* Attached Document / Photo */}
                  {msg.attachmentUrl && (
                    <div
                      className={`mt-2.5 p-2 rounded-xl border flex items-center gap-2 ${
                        isMe ? 'bg-white/10 border-white/20' : 'bg-slate-100 border-slate-200'
                      }`}
                    >
                      <FileCheck className="h-4 w-4 shrink-0 text-emerald-400" />
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-semibold truncate">
                          {msg.attachmentName || 'Attached_document_slip.jpg'}
                        </div>
                        <div className="text-[9px] opacity-75">Verified site record</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 border-t border-white/40 bg-white/40 flex items-center gap-2 overflow-x-auto shrink-0">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-amber-500" /> Quick tags:
        </span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleQuickPrompt(p)}
            className="text-[10px] px-2.5 py-1 rounded-lg glass-pill hover:bg-white text-slate-600 shrink-0 transition-colors truncate max-w-xs"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Input & Bill Reference Selector */}
      <form
        onSubmit={handleSend}
        className="p-4 border-t border-white/60 glass-panel-subtle space-y-3 shrink-0"
      >
        {/* Attachment preview banner */}
        {attachmentPreview && (
          <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-500/10 border border-emerald-300/40 text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-emerald-600" />
              <span>Quarry Delivery & Weighbridge Slip attached</span>
            </div>
            <button
              type="button"
              onClick={() => setAttachmentPreview(null)}
              className="p-1 hover:bg-emerald-200/50 rounded-lg text-emerald-800"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <div className="flex items-center flex-wrap gap-2 text-xs">
          {allowBillTagging && (
            <div className="flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <select
                value={selectedBillId}
                onChange={e => setSelectedBillId(e.target.value)}
                className="px-2.5 py-1 text-xs rounded-xl glass-input font-mono text-slate-700 focus:outline-none"
              >
                <option value="">No Bill Tagged</option>
                {projectBills.map(b => (
                  <option key={b.id} value={b.id}>
                    Tag #{b.billNumber} ({formatINR(b.totalAmount)})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="button"
            onClick={() =>
              setAttachmentPreview(
                attachmentPreview
                  ? null
                  : '/src/assets/images/payment_proof_receipt_1790153469451.jpg'
              )
            }
            className={`px-3 py-1 text-xs rounded-xl border flex items-center gap-1.5 transition-all ${
              attachmentPreview
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                : 'glass-button-secondary text-slate-600'
            }`}
          >
            <Paperclip className="h-3.5 w-3.5" />
            <span>{attachmentPreview ? 'Attached Slip' : 'Attach Slip/Photo'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            required
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Type your message, query, site observation, or payment note..."
            className="flex-1 px-4 py-2.5 text-xs rounded-2xl glass-input focus:outline-none placeholder:text-slate-400"
          />

          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-2xl transition-all flex items-center gap-2 shadow-sm shrink-0"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Send</span>
          </button>
        </div>
      </form>
    </div>
  );
};
