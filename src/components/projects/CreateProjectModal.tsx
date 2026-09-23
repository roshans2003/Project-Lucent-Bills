import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Building, MapPin, IndianRupee } from 'lucide-react';

interface CreateProjectModalProps {
  onClose: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onClose }) => {
  const { createProject, projects } = useApp();

  const [title, setTitle] = useState('');
  const [code, setCode] = useState(`LB-PRJ-0${projects.length + 1}`);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [location, setLocation] = useState('');
  const [contractValue, setContractValue] = useState<number>(1500000);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedEndDate, setExpectedEndDate] = useState('2026-12-31');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !clientName.trim() || contractValue <= 0) {
      setError('Please fill in all mandatory fields with valid values.');
      return;
    }

    createProject({
      title: title.trim(),
      code: code.trim(),
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim() || `${clientName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      clientPhone: clientPhone.trim() || '+91 98400 12345',
      location: location.trim() || 'Coimbatore, Tamil Nadu',
      contractValue,
      startDate,
      expectedEndDate,
      status: 'ACTIVE',
      description: description.trim() || 'Residential / Commercial development agreement.',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">Create New Project</h3>
            <p className="text-xs text-slate-500">
              Establish contract scope, total agreement value, and client contact
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-700 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Project Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Modern Villa — Coimbatore, Studio RS Puram"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Project Code
              </label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Total Contract Value (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min={1000}
                value={contractValue}
                onChange={e => setContractValue(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Client Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Arun Kumar"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Client Email
              </label>
              <input
                type="email"
                placeholder="client@gmail.com"
                value={clientEmail}
                onChange={e => setClientEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Site Location
              </label>
              <input
                type="text"
                placeholder="City / Area"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Expected Completion
              </label>
              <input
                type="date"
                value={expectedEndDate}
                onChange={e => setExpectedEndDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description / Contract Scope
            </label>
            <textarea
              rows={2}
              placeholder="Scope of work, structural details, or milestone stages"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
