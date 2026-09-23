import React from 'react';
import { X, Download, ExternalLink, ShieldCheck } from 'lucide-react';

interface ProofViewerModalProps {
  imageUrl: string;
  title?: string;
  onClose: () => void;
}

export const ProofViewerModal: React.FC<ProofViewerModalProps> = ({ imageUrl, title = 'Payment Proof Document', onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl glass-modal rounded-3xl overflow-hidden flex flex-col max-h-[90vh] shadow-[0_25px_60px_rgba(15,23,42,0.3),inset_0_1px_2px_rgba(255,255,255,0.9)]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/60 glass-panel-subtle">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <h4 className="text-sm font-bold text-slate-900">{title}</h4>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={imageUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-white/80 transition-colors"
              title="Open full size"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-white/80 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex items-center justify-center bg-slate-950/90 backdrop-blur-sm min-h-[300px]">
          <img
            src={imageUrl}
            alt="Payment Proof"
            referrerPolicy="no-referrer"
            className="max-h-[60vh] max-w-full rounded-xl object-contain shadow-2xl border border-white/10"
          />
        </div>

        <div className="px-6 py-3 border-t border-white/60 glass-panel-subtle flex items-center justify-between text-xs text-slate-500">
          <span>Non-tampered attachment verified by client</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 glass-button-secondary text-slate-700 font-semibold rounded-xl text-xs"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
