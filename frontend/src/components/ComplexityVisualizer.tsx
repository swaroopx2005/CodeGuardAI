import React from 'react';
import { ComplexityInfo } from '../types';
import { TrendingDown, AlertCircle, Cpu, HardDrive } from 'lucide-react';

interface ComplexityVisualizerProps {
  original: ComplexityInfo;
  optimized: ComplexityInfo;
  tradeoffs?: string;
  recommendation?: string;
}

export const ComplexityVisualizer: React.FC<ComplexityVisualizerProps> = ({
  original,
  optimized,
  tradeoffs,
  recommendation,
}) => {
  // Rank: 1: O(1), 2: O(log n), 3: O(n), 4: O(n log n), 5: O(n²), 6: O(2ⁿ)
  const getWidthPercent = (rank: number) => {
    switch (rank) {
      case 1:
        return '18%';
      case 2:
        return '32%';
      case 3:
        return '48%';
      case 4:
        return '68%';
      case 5:
        return '88%';
      default:
        return '100%';
    }
  };

  const getBarColor = (rank: number) => {
    if (rank <= 3) return 'from-emerald-500 to-teal-400 text-emerald-400';
    if (rank === 4) return 'from-amber-500 to-yellow-400 text-amber-400';
    return 'from-rose-500 to-red-400 text-rose-400';
  };

  return (
    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
          <Cpu className="w-4 h-4 text-indigo-400" />
          <span>Algorithmic Complexity Comparison</span>
        </h4>
        {recommendation && (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            {recommendation}
          </span>
        )}
      </div>

      {/* Side-by-side Time & Space Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Time Complexity Comparison */}
        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Time Complexity</span>
            <span className="flex items-center space-x-1 text-emerald-400 text-[11px] font-semibold">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Speedup</span>
            </span>
          </div>

          {/* Original Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Original:</span>
              <span className={`font-mono font-bold ${getBarColor(original.timeRank).split(' ')[2]}`}>
                {original.time}
              </span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r rounded-full transition-all duration-500 ${getBarColor(original.timeRank).split(' ')[0]} ${getBarColor(original.timeRank).split(' ')[1]}`}
                style={{ width: getWidthPercent(original.timeRank) }}
              />
            </div>
          </div>

          {/* Optimized Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Optimized:</span>
              <span className={`font-mono font-bold ${getBarColor(optimized.timeRank).split(' ')[2]}`}>
                {optimized.time}
              </span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r rounded-full transition-all duration-500 ${getBarColor(optimized.timeRank).split(' ')[0]} ${getBarColor(optimized.timeRank).split(' ')[1]}`}
                style={{ width: getWidthPercent(optimized.timeRank) }}
              />
            </div>
          </div>
        </div>

        {/* Space Complexity Comparison */}
        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Space Complexity</span>
            <span className="text-slate-500 text-[11px] flex items-center space-x-1">
              <HardDrive className="w-3.5 h-3.5" />
              <span>Memory</span>
            </span>
          </div>

          {/* Original Space */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Original Auxiliary Space:</span>
              <span className="font-mono font-bold text-slate-300">{original.space}</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full"
                style={{ width: getWidthPercent(original.spaceRank) }}
              />
            </div>
          </div>

          {/* Optimized Space */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Optimized Auxiliary Space:</span>
              <span className="font-mono font-bold text-indigo-300">{optimized.space}</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-400 rounded-full"
                style={{ width: getWidthPercent(optimized.spaceRank) }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Trade-off Explanation Banner */}
      {tradeoffs && (
        <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-start space-x-2 text-xs text-amber-200">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-amber-300">Algorithmic Trade-off: </span>
            <span>{tradeoffs}</span>
          </div>
        </div>
      )}
    </div>
  );
};
