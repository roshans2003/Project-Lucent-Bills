import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectChatBox } from './ProjectChatBox';
import { Building, MapPin, ArrowRight, MessageSquare, ExternalLink } from 'lucide-react';

export const MessagesHubView: React.FC = () => {
  const { messages, projects, role, navigateTo } = useApp();

  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');

  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
            Project Communications Hub
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent, chronological record between Contractor and Client with linked bills and audit receipts
          </p>
        </div>

        {activeProject && (
          <button
            onClick={() => navigateTo('project-detail', activeProject.id)}
            className="self-start sm:self-auto px-3.5 py-1.5 text-xs font-bold text-slate-700 glass-button-secondary rounded-xl flex items-center gap-1.5 transition-all"
          >
            <span>View Project File</span>
            <ExternalLink className="h-3 w-3 opacity-70" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left: Project Selector Threads List (md:col-span-4) */}
        <div className="md:col-span-4 space-y-3">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
            Projects ({projects.length})
          </div>

          <div className="space-y-2">
            {projects.map(p => {
              const projectMsgs = messages.filter(m => m.projectId === p.id);
              const unreadInP = projectMsgs.filter(m => m.senderRole !== role && !m.read).length;
              const isSelected = p.id === activeProject?.id;

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'glass-panel bg-white/95 border-indigo-200 shadow-md ring-1 ring-indigo-500/20'
                      : 'glass-panel-subtle hover:bg-white/80 border-white/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="font-extrabold text-xs text-slate-900 truncate">{p.title}</div>
                    {unreadInP > 0 ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500 text-white shrink-0">
                        {unreadInP} new
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded-lg bg-slate-100 shrink-0">
                        {projectMsgs.length}
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <Building className="h-3 w-3 opacity-60 shrink-0" />
                    <span className="truncate">
                      {role === 'CONTRACTOR' ? `Client: ${p.clientName}` : 'Contractor: Vertex'}
                    </span>
                  </div>

                  <div className="mt-2 text-[10px] font-mono text-slate-400 flex items-center justify-between border-t border-slate-100/70 pt-2">
                    <span>{p.code}</span>
                    <span className="text-indigo-600 font-semibold flex items-center gap-1 group-hover:underline">
                      Open Thread <ArrowRight className="h-2.5 w-2.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Rich Project Chat Box (md:col-span-8) */}
        <div className="md:col-span-8">
          {activeProject ? (
            <ProjectChatBox
              projectId={activeProject.id}
              title={`${activeProject.title} Thread`}
              subtitle={`Contractor & Client thread for Project #${activeProject.code}`}
              maxHeight="640px"
              allowBillTagging={true}
            />
          ) : (
            <div className="p-12 text-center text-xs text-slate-400 glass-panel rounded-3xl">
              Select a project from the left to view messages.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
