import React, { useEffect, useState } from 'react';
import { OptimizationHistoryItem } from '../types';
import { codeGuardApi } from '../services/api';
import { Calendar, Zap, RotateCcw, ArrowUpRight } from 'lucide-react';

interface OptimizationHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestoreOriginal: (code: string) => void;
  onLoadOptimized: (code: string) => void;
}

export const OptimizationHistoryModal: React.FC<OptimizationHistoryModalProps> = ({
  isOpen,
  onClose,
  onRestoreOriginal,
  onLoadOptimized,
}) => {
  const [history, setHistory] = useState<OptimizationHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      codeGuardApi
        .getOptimizationHistory()
        .then((data) => setHistory(data))
        .catch((err) => console.error('Failed to load optimization history', err))
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
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Optimization History</h3>
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
            <div className="py-12 text-center text-xs text-slate-400">Loading optimization history...</div>
          ) : history.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No optimization records found. Apply an optimization to save records here!
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition"
              >
                <div>
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span className="text-xs font-bold text-white">{item.summary}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] mb-1.5">
                    {/* Complexity badge */}
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {item.originalTimeComplexity} → {item.optimizedTimeComplexity}
                    </span>
                    {/* Score badge */}
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                      Score: {item.beforeScore} → {item.afterScore}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 text-[11px] text-slate-500">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(item.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => {
                      onRestoreOriginal(item.originalCode);
                      onClose();
                    }}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore Original</span>
                  </button>

                  <button
                    onClick={() => {
                      onLoadOptimized(item.optimizedCode);
                      onClose();
                    }}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition"
                  >
                    <span>Load Optimized</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
