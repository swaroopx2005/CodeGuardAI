import React, { useState } from 'react';
import { CodeIssue } from '../types';
import { AlertCircle, AlertTriangle, Info, Lightbulb, CheckCircle2, ChevronRight } from 'lucide-react';

interface IssueExplorerProps {
  issues: CodeIssue[];
  activeLine?: number | null;
  onSelectLine: (line: number) => void;
}

export const IssueExplorer: React.FC<IssueExplorerProps> = ({
  issues,
  activeLine,
  onSelectLine,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [selectedIssueIdx, setSelectedIssueIdx] = useState<number | null>(null);

  const filteredIssues = issues.filter((issue) => {
    if (filter === 'ALL') return true;
    return issue.severity === filter;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'HIGH':
        return (
          <span className="flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3 h-3" />
            <span>HIGH</span>
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3 h-3" />
            <span>MEDIUM</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Info className="w-3 h-3" />
            <span>LOW</span>
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      {/* Header and Filter Tabs */}
      <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-white uppercase tracking-wider">Detected Issues</span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono font-medium">
            {issues.length}
          </span>
        </div>

        {/* Filter Pills with Hover & Active Transitions */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilter(lvl)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-smooth ${
                filter === lvl
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Issues List with Staggered Entrance Animation */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80 p-2 space-y-2">
        {filteredIssues.length === 0 ? (
          <div className="py-14 flex flex-col items-center justify-center text-center px-4 animate-scale-in">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3 shadow-inner">
              <CheckCircle2 className="w-6 h-6 animate-pulse-subtle" />
            </div>
            <p className="text-sm font-semibold text-white">No Issues in this Category</p>
            <p className="text-xs text-slate-500 mt-1">Your code cleanly satisfies all verification rules.</p>
          </div>
        ) : (
          filteredIssues.map((issue, idx) => {
            const isSelected = selectedIssueIdx === idx || activeLine === issue.line;
            return (
              <div
                key={idx}
                style={{ animationDelay: `${idx * 45}ms` }}
                onClick={() => {
                  setSelectedIssueIdx(idx);
                  onSelectLine(issue.line);
                }}
                className={`p-3 rounded-lg border transition-smooth cursor-pointer group animate-fade-in-up ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-500/60 shadow-md shadow-indigo-950/50'
                    : 'bg-slate-950/40 hover:bg-slate-800/50 border-slate-800/60 hover:border-slate-700/80 hover:-translate-y-0.5'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    {getSeverityBadge(issue.severity)}
                    <span className="text-[11px] font-mono text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700/60">
                      Line {issue.line}
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-indigo-300">
                      {issue.type}
                    </span>
                  </div>
                  <ChevronRight
                    className={`w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-smooth ${
                      isSelected ? 'text-indigo-400 translate-x-0.5' : ''
                    }`}
                  />
                </div>

                <p className="text-xs text-slate-200 font-medium leading-relaxed mb-2">
                  {issue.message}
                </p>

                <div className="flex items-start space-x-2 bg-slate-900/90 p-2 rounded border border-slate-800/80 text-[11px] text-slate-300 group-hover:border-slate-700/80 transition-smooth">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{issue.suggestion}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
