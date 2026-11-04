import React, { useState } from 'react';
import { OptimizationResponse } from '../types';
import { ComplexityVisualizer } from './ComplexityVisualizer';
import {
  Zap,
  Copy,
  Check,
  CheckCircle2,
  X,
  ShieldAlert,
  HelpCircle,
  FileCode2,
  GitCompare,
  Sparkles,
  Lightbulb,
} from 'lucide-react';

interface OptimizationModalProps {
  optimization: OptimizationResponse | null;
  onApply: (optimizedCode: string, optimization: OptimizationResponse) => void;
  onClose: () => void;
}

export const OptimizationModal: React.FC<OptimizationModalProps> = ({
  optimization,
  onApply,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<'comparison' | 'diff' | 'explanation'>('comparison');

  if (!optimization) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(optimization.optimizedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmApply = () => {
    onApply(optimization.optimizedCode, optimization);
    setShowConfirm(false);
    onClose();
  };

  // Determine algorithm labels based on response or detection
  const isDuplicateOpt =
    optimization.title?.toLowerCase().includes('duplicate') ||
    optimization.summary?.toLowerCase().includes('duplicate') ||
    optimization.optimizedCode?.includes('HashSet');

  const beforeAlgo = isDuplicateOpt ? 'Nested Loop' : 'Quadratic Loop';
  const afterAlgo = isDuplicateOpt ? 'HashSet' : 'Optimized Structure';
  const beforeTime = optimization.originalComplexity?.time || 'O(n²)';
  const afterTime = optimization.optimizedComplexity?.time || 'O(n) average';
  const beforeSpace = optimization.originalComplexity?.space || 'O(1)';
  const afterSpace = optimization.optimizedComplexity?.space || 'O(n)';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 shadow-md shadow-amber-500/20">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white">AI Optimize Code & Complexity Engine</h3>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                    optimization.canOptimize
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {optimization.canOptimize ? 'Optimization Found' : 'Already Optimal'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{optimization.summary}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* If Cannot Optimize */}
          {!optimization.canOptimize ? (
            <div className="py-12 flex flex-col items-center justify-center text-center px-4 max-w-md mx-auto">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3" />
              <h4 className="text-base font-bold text-white">Algorithm Is Already Optimal</h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                {optimization.explanation}
              </p>
              <div className="mt-4 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                Time Complexity: {beforeTime} | Space Complexity: {beforeSpace}
              </div>
              <button
                onClick={onClose}
                className="mt-6 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white transition"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {/* 1. OPTIMIZATION FOUND HERO BANNER */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-indigo-950/40 border border-indigo-500/30 shadow-sm space-y-3">
                <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Optimization Found</span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">
                    {isDuplicateOpt ? 'Duplicate detection can be optimized.' : optimization.title || 'Algorithmic Optimization Available'}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    {optimization.algorithmRecommendation || 'Replace inefficient operations with modern asymptotic equivalents.'}
                  </p>
                </div>

                {/* Badges / Metrics Row */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-bold">
                    {beforeTime} → {afterTime}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                    {beforeAlgo} → {afterAlgo}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    Trade-off: {optimization.tradeoff || optimization.tradeoffs || 'Uses O(n) additional memory.'}
                  </span>
                </div>
              </div>

              {/* 2. BEFORE & AFTER ARCHITECTURE CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* BEFORE Card */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-rose-900/30 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[11px] font-extrabold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      BEFORE
                    </span>
                    <span className="text-xs font-mono font-bold text-rose-400">{beforeTime}</span>
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">{beforeAlgo}</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Compares every pair of elements using nested loops.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-900 flex justify-between text-[11px] font-mono text-slate-400">
                    <span>Time: <strong className="text-rose-400">{beforeTime}</strong></span>
                    <span>Space: <strong className="text-slate-300">{beforeSpace}</strong></span>
                  </div>
                </div>

                {/* AFTER Card */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-900/30 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[11px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      AFTER
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">{afterTime}</span>
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">{afterAlgo}</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Stores seen items in a Set for O(1) average lookup per item.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-900 flex justify-between text-[11px] font-mono text-slate-400">
                    <span>Time: <strong className="text-emerald-400">{afterTime}</strong></span>
                    <span>Space: <strong className="text-emerald-300">{afterSpace}</strong></span>
                  </div>
                </div>
              </div>

              {/* 3. PROPORTIONAL COMPLEXITY BARS */}
              <ComplexityVisualizer
                original={optimization.originalComplexity}
                optimized={optimization.optimizedComplexity}
                tradeoffs={optimization.tradeoff || optimization.tradeoffs}
                recommendation={optimization.algorithmRecommendation}
              />

              {/* 4. WHY THIS IS BETTER SECTION */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>Why this is better</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {optimization.explanation}
                </p>
                <div className="pt-2 border-t border-slate-900 text-[11px] text-slate-400 flex items-center space-x-1.5">
                  <span className="font-semibold text-slate-300">Memory Trade-off:</span>
                  <span>{optimization.tradeoff || optimization.tradeoffs}</span>
                </div>
              </div>

              {/* 5. CODE COMPARISON TABS */}
              <div className="flex items-center space-x-2 border-b border-slate-800 pt-1">
                <button
                  onClick={() => setActiveTab('comparison')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium border-b-2 transition ${
                    activeTab === 'comparison'
                      ? 'border-indigo-500 text-indigo-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileCode2 className="w-3.5 h-3.5" />
                  <span>Split-Screen (Before / After)</span>
                </button>
                <button
                  onClick={() => setActiveTab('diff')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium border-b-2 transition ${
                    activeTab === 'diff'
                      ? 'border-indigo-500 text-indigo-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <GitCompare className="w-3.5 h-3.5" />
                  <span>View Diff</span>
                </button>
                <button
                  onClick={() => setActiveTab('explanation')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium border-b-2 transition ${
                    activeTab === 'explanation'
                      ? 'border-indigo-500 text-indigo-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Explain Complexity & Contributing Lines</span>
                </button>
              </div>

              {/* Tab 1: Split-Screen Comparison */}
              {activeTab === 'comparison' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 min-h-[320px]">
                  {/* Left: Original (Before) */}
                  <div className="flex flex-col bg-slate-950 rounded-xl border border-rose-900/40 overflow-hidden">
                    <div className="px-3 py-2 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          BEFORE
                        </span>
                        <span className="font-semibold text-rose-300">Original Implementation</span>
                      </div>
                      <div className="flex items-center space-x-2 font-mono text-[11px]">
                        <span className="text-rose-400 font-semibold">{beforeTime}</span>
                        <span className="text-slate-600">|</span>
                        <span className="text-slate-400">{beforeSpace}</span>
                      </div>
                    </div>
                    <pre className="p-3 text-[11px] font-mono text-slate-300 overflow-x-auto flex-1 max-h-[340px] leading-relaxed">
                      <code>{optimization.originalCode}</code>
                    </pre>
                  </div>

                  {/* Right: Optimized (After) */}
                  <div className="flex flex-col bg-slate-950 rounded-xl border border-emerald-900/40 overflow-hidden">
                    <div className="px-3 py-2 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          AFTER
                        </span>
                        <span className="font-semibold text-emerald-300">Optimized Implementation</span>
                      </div>
                      <div className="flex items-center space-x-2 font-mono text-[11px]">
                        <span className="text-emerald-400 font-semibold">{afterTime}</span>
                        <span className="text-slate-600">|</span>
                        <span className="text-slate-400">{afterSpace}</span>
                      </div>
                    </div>
                    <pre className="p-3 text-[11px] font-mono text-emerald-300 overflow-x-auto flex-1 max-h-[340px] leading-relaxed">
                      <code>{optimization.optimizedCode}</code>
                    </pre>
                  </div>
                </div>
              )}

              {/* Tab 2: View Diff */}
              {activeTab === 'diff' && (
                <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden text-xs font-mono">
                  <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
                    <span className="text-slate-300 font-semibold">Algorithmic Diff Analysis</span>
                    <span className="text-[11px] text-slate-500">
                      Red: Inefficient operations removed | Green: Optimized asymptotic logic added
                    </span>
                  </div>
                  <div className="p-3 space-y-1 overflow-x-auto max-h-[340px]">
                    <div className="p-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300">
                      <span className="font-bold mr-2">-</span>
                      <span>// Nested loops: O(n²) pairwise element comparison</span>
                    </div>
                    <div className="p-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300">
                      <span className="font-bold mr-2">-</span>
                      <span>for (int i = 0; i &lt; numbers.length; i++) for (int j = i + 1; j &lt; numbers.length; j++) if (numbers[i] == numbers[j])</span>
                    </div>
                    <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                      <span className="font-bold mr-2">+</span>
                      <span>import java.util.HashSet; import java.util.Set;</span>
                    </div>
                    <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                      <span className="font-bold mr-2">+</span>
                      <span>Set&lt;Integer&gt; seen = new HashSet&lt;&gt;(); // O(1) average lookup</span>
                    </div>
                    <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                      <span className="font-bold mr-2">+</span>
                      <span>for (int element : elements) if (!seen.add(element)) return true; // Linear O(n) average</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Detailed Complexity Explanation */}
              {activeTab === 'explanation' && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs leading-relaxed">
                  <div>
                    <h5 className="font-semibold text-white mb-1">Why this complexity occurs:</h5>
                    <p className="text-slate-300">{optimization.originalComplexity?.explanation}</p>
                  </div>

                  {optimization.originalComplexity?.contributingLines &&
                    optimization.originalComplexity.contributingLines.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-white mb-1">Contributing Line Numbers:</h5>
                        <div className="flex items-center space-x-1.5">
                          {optimization.originalComplexity.contributingLines.map((ln) => (
                            <span
                              key={ln}
                              className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-mono text-[11px]"
                            >
                              Line {ln}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  <div>
                    <h5 className="font-semibold text-white mb-1">How it is improved:</h5>
                    <p className="text-slate-300">{optimization.explanation}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        {optimization.canOptimize && (
          <div className="p-3.5 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 text-xs font-medium transition"
            >
              Reject / Close
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('diff')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                  activeTab === 'diff'
                    ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>View Diff</span>
              </button>

              <button
                onClick={handleCopy}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Optimized Code'}</span>
              </button>

              <button
                onClick={() => setShowConfirm(true)}
                className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs shadow-md transition"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Apply Optimization</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal: Never modify user code without confirmation */}
      {showConfirm && (
        <div className="fixed inset-0 z-60 bg-slate-950/90 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 max-w-sm w-full shadow-2xl text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Apply Optimization to Editor?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              This will replace your current editor code with the optimized implementation. You can restore your original code at any time using the undo button.
            </p>
            <div className="flex items-center justify-center space-x-2 pt-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApply}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-500 transition shadow"
              >
                Confirm & Replace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
