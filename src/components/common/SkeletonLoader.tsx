import React from 'react';

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="h-12 bg-slate-100 border-b border-slate-200" />
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-14 px-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-200" />
              <div className="space-y-1.5">
                <div className="w-32 h-3.5 bg-slate-200 rounded" />
                <div className="w-20 h-2.5 bg-slate-100 rounded" />
              </div>
            </div>
            <div className="w-24 h-4 bg-slate-200 rounded" />
            <div className="w-20 h-4 bg-slate-200 rounded" />
            <div className="w-16 h-6 bg-slate-100 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <div className="w-24 h-3 bg-slate-200 rounded" />
          <div className="w-36 h-7 bg-slate-300 rounded" />
          <div className="w-full h-1.5 bg-slate-100 rounded" />
        </div>
      ))}
    </div>
  );
};
