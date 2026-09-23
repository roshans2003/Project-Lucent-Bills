import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ParticularTemplate } from '../../types';
import { formatINR } from '../../utils/formatters';
import { Search, Plus, X, Tag, Sparkles } from 'lucide-react';

interface ParticularPickerModalProps {
  onSelect: (item: { particular: string; category?: string; unit: string; rate: number }) => void;
  onClose: () => void;
}

export const ParticularPickerModal: React.FC<ParticularPickerModalProps> = ({ onSelect, onClose }) => {
  const { particulars, addParticular } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showCreateCustom, setShowCreateCustom] = useState(false);

  // Custom particular form state
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState('Civil Materials');
  const [customUnit, setCustomUnit] = useState('bags');
  const [customRate, setCustomRate] = useState<number>(0);
  const [customDescription, setCustomDescription] = useState('');

  const categories = ['ALL', ...Array.from(new Set(particulars.map(p => p.category)))];

  const filteredParticulars = particulars.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleCreateAndSelect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const created = addParticular({
      name: customName.trim(),
      category: customCategory,
      defaultUnit: customUnit,
      defaultRate: customRate,
      description: customDescription.trim() || 'Custom bill particular',
    });

    onSelect({
      particular: created.name,
      category: created.category,
      unit: created.defaultUnit,
      rate: created.defaultRate,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl glass-modal rounded-3xl shadow-[0_25px_60px_rgba(15,23,42,0.25),inset_0_1px_2px_rgba(255,255,255,0.9)] overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/60 flex items-center justify-between glass-panel-subtle">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Particular Library</h3>
            <p className="text-xs text-slate-500">
              Select from predefined standard items or quickly create a custom rate
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!showCreateCustom ? (
          <div className="p-6 flex flex-col gap-4 overflow-hidden">
            {/* Search bar & Create trigger */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search materials, labour, consulting, design..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl glass-input focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowCreateCustom(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-white glass-button-primary rounded-xl transition-all whitespace-nowrap shadow-md"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>+ New Custom</span>
              </button>
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'glass-button-primary text-white shadow-xs'
                      : 'glass-pill text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Particulars Grid / Table */}
            <div className="overflow-y-auto max-h-[46vh] divide-y divide-slate-100/80 border border-white/70 glass-panel-subtle rounded-2xl">
              {filteredParticulars.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No particulars found matching your search.
                  <div className="mt-2">
                    <button
                      onClick={() => {
                        setCustomName(search);
                        setShowCreateCustom(true);
                      }}
                      className="text-slate-900 font-bold underline decoration-slate-400 underline-offset-2"
                    >
                      Create "{search}" as a new particular
                    </button>
                  </div>
                </div>
              ) : (
                filteredParticulars.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelect({
                        particular: p.name,
                        category: p.category,
                        unit: p.defaultUnit,
                        rate: p.defaultRate,
                      });
                      onClose();
                    }}
                    className="p-3.5 flex items-center justify-between hover:bg-white/80 cursor-pointer transition-colors group"
                  >
                    <div className="space-y-0.5 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {p.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {p.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {p.description}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-extrabold font-mono text-slate-900 tabular-nums">
                        {formatINR(p.defaultRate)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        per {p.defaultUnit}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreateAndSelect} className="p-6 space-y-4 overflow-y-auto">
            <div className="text-xs text-slate-500 pb-2 border-b border-white/60">
              Add a custom item to your organization's library for future quick reuse.
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Particular Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Italian Marble Polishing, UI/UX Wireframing"
                value={customName}
                onChange={e => setCustomName(e.target.value)}
                className="w-full px-3 py-2.5 text-xs rounded-xl glass-input focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={customCategory}
                  onChange={e => setCustomCategory(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl glass-input focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Default Unit
                </label>
                <input
                  type="text"
                  placeholder="bags, sq.ft, hours, days"
                  value={customUnit}
                  onChange={e => setCustomUnit(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl glass-input focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Default Rate (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  value={customRate}
                  onChange={e => setCustomRate(Number(e.target.value))}
                  className="w-full px-3 py-2.5 text-xs font-mono font-bold rounded-xl glass-input focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Description / Specifications
              </label>
              <textarea
                rows={2}
                placeholder="Standard material spec, grade, or scope description"
                value={customDescription}
                onChange={e => setCustomDescription(e.target.value)}
                className="w-full px-3 py-2.5 text-xs rounded-xl glass-input focus:outline-none"
              />
            </div>

            <div className="pt-3 border-t border-white/60 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowCreateCustom(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 glass-button-secondary rounded-xl"
              >
                Back to Library
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold text-white glass-button-primary rounded-xl transition-all shadow-md"
              >
                Save & Insert into Bill
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
