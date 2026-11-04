import React, { useEffect, useState } from 'react';
import { AnalysisHistoryItem } from '../types';
import { codeGuardApi } from '../services/api';
import { History, Calendar, ArrowUpRight } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadSnippet: (code: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, onLoadSnippet }) => {
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      codeGuardApi
        .getHistory()
        .then((data) => setHistory(data))
        .catch((err) => console.error('Failed to load history', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Analysis History (Stored in PostgreSQL)</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
          >
            Close
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading analysis history...</div>
          ) : history.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No saved analysis history yet. Run an analysis while logged in to save results!
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between transition"
              >
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <span className="text-sm font-bold text-white">Score: {item.score}/100</span>
                    <span className="text-xs text-slate-400">{item.lineCount} lines</span>
                    <div className="flex items-center space-x-1 text-[11px]">
                      {item.highCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          {item.highCount} HIGH
                        </span>
                      )}
                      {item.mediumCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {item.mediumCount} MED
                        </span>
                      )}
                      {item.lowCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {item.lowCount} LOW
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-[11px] text-slate-500">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(item.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onLoadSnippet(item.codeSnippet);
                    onClose();
                  }}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-medium transition"
                >
                  <span>Load</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
