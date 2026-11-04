import React from 'react';
import { ArrowRight, Sparkles, Play, Cpu, CheckCircle } from 'lucide-react';

interface HeroSectionProps {
  onStartAnalyze: () => void;
  onStartOptimize: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartAnalyze, onStartOptimize }) => {
  return (
    <div className="relative py-10 md:py-14 text-center max-w-4xl mx-auto px-4 z-10">
      {/* 1. Staggered Pill Badge */}
      <div
        style={{ animationDelay: '50ms' }}
        className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-5 shadow-sm animate-fade-in-up"
      >
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        <span>CodeGuard AI 2.0 • Autonomous Code Review & Optimization</span>
      </div>

      {/* 2. Headline Animation (Fade + upward movement) */}
      <h1
        style={{ animationDelay: '120ms' }}
        className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-4 animate-fade-in-up"
      >
        Ship Better Code with{' '}
        <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-indigo-200 bg-clip-text text-transparent">
          AI Intelligence
        </span>
      </h1>

      {/* 3. Subtitle (Slightly afterward) */}
      <p
        style={{ animationDelay: '200ms' }}
        className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8 animate-fade-in-up"
      >
        Detect null pointers, memory leaks, and complex nested code smells in milliseconds.
        Instantly transform quadratic <span className="font-mono text-rose-300">O(n²)</span> bottlenecks into linear{' '}
        <span className="font-mono text-emerald-300">O(n)</span> implementations with mathematically verified trade-offs.
      </p>

      {/* 4. Animated CTA Buttons */}
      <div
        style={{ animationDelay: '280ms' }}
        className="flex flex-wrap items-center justify-center gap-3.5 animate-fade-in-up"
      >
        {/* Analyze Code CTA */}
        <button
          onClick={onStartAnalyze}
          className="group relative flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-smooth hover:scale-[1.03] active:scale-[0.98] shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/40"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Analyze Java Code</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </button>

        {/* AI Optimize CTA */}
        <button
          onClick={onStartOptimize}
          className="group flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-xs border border-slate-700/80 transition-smooth hover:scale-[1.03] active:scale-[0.98] hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10"
        >
          <Cpu className="w-3.5 h-3.5 text-amber-400" />
          <span>AI Complexity Optimizer</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
            O(n²) → O(n)
          </span>
        </button>
      </div>

      {/* Feature trust markers */}
      <div
        style={{ animationDelay: '360ms' }}
        className="mt-8 pt-6 border-t border-slate-800/60 flex flex-wrap items-center justify-center gap-6 text-[11px] text-slate-500 animate-fade-in-up"
      >
        <span className="flex items-center space-x-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>6 Real-Time Static Analysis Rules</span>
        </span>
        <span className="flex items-center space-x-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>Asymptotic Complexity Ranking</span>
        </span>
        <span className="flex items-center space-x-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>Spring Boot & PostgreSQL Backend</span>
        </span>
      </div>
    </div>
  );
};
