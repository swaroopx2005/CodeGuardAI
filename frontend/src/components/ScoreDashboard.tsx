import React, { useEffect, useState } from 'react';
import { AnalysisResult } from '../types';
import { useAnimatedCounter } from '../utils/motion';
import { AlertTriangle, AlertCircle, Info, FileCode } from 'lucide-react';

interface ScoreDashboardProps {
  result: AnalysisResult;
}

export const ScoreDashboard: React.FC<ScoreDashboardProps> = ({ result }) => {
  const animatedScore = useAnimatedCounter(result.score, 900);
  const animatedHigh = useAnimatedCounter(result.highCount, 600);
  const animatedMed = useAnimatedCounter(result.mediumCount, 700);
  const animatedLow = useAnimatedCounter(result.lowCount, 800);
  const animatedLines = useAnimatedCounter(result.lineCount, 950);

  const [revealedGrade, setRevealedGrade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRevealedGrade(true);
    }, 750);
    return () => clearTimeout(timer);
  }, [result.score]);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 stroke-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 65) return 'text-amber-400 stroke-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 stroke-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  const getGradeInfo = (score: number) => {
    if (score >= 90) return { grade: 'A+', text: 'Excellent' };
    if (score >= 80) return { grade: 'A', text: 'Production Ready' };
    if (score >= 65) return { grade: 'B', text: 'Needs Attention' };
    return { grade: 'C', text: 'Refactoring Required' };
  };

  const { grade, text: gradeText } = getGradeInfo(result.score);

  // SVG circular progress ring calculations (r=32, circumference=201)
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {/* 1. Quality Score Circular Ring Card */}
      <div className="col-span-2 md:col-span-1 p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between shadow-sm hover:border-slate-700/80 transition-smooth group">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Quality Score</span>
          <div className="flex items-baseline space-x-1.5">
            <span className={`text-3xl font-extrabold tracking-tight ${getScoreColor(result.score).split(' ')[0]}`}>
              {animatedScore}
            </span>
            <span className="text-slate-500 text-xs">/ 100</span>
          </div>
          {/* Animated Grade Reveal */}
          <div
            className={`transition-all duration-500 ${
              revealedGrade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
            }`}
          >
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border inline-flex items-center space-x-1 ${getScoreColor(result.score)}`}>
              <span>{grade}</span>
              <span>•</span>
              <span>{gradeText}</span>
            </span>
          </div>
        </div>

        {/* Circular Progress Ring */}
        <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
          <svg className="w-16 h-16 -rotate-90 transform" viewBox="0 0 76 76">
            <circle
              cx="38"
              cy="38"
              r={radius}
              className="stroke-slate-800"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="38"
              cy="38"
              r={radius}
              className={`transition-all duration-300 ease-out ${getScoreColor(result.score).split(' ')[1]}`}
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <span className="absolute text-[11px] font-mono font-bold text-slate-300">
            {animatedScore}%
          </span>
        </div>
      </div>

      {/* 2. High Severity Card */}
      <div
        style={{ animationDelay: '60ms' }}
        className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between shadow-sm hover:-translate-y-0.5 hover:border-rose-900/40 hover:shadow-lg transition-smooth animate-fade-in-up"
      >
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-rose-400 text-[11px] uppercase tracking-wider">High</span>
          <AlertCircle className="w-4 h-4 text-rose-400" />
        </div>
        <div className="my-1">
          <span className="text-3xl font-extrabold text-rose-400 font-mono tracking-tight">{animatedHigh}</span>
        </div>
        <span className="text-[11px] text-slate-500">Critical / NullPointer</span>
      </div>

      {/* 3. Medium Severity Card */}
      <div
        style={{ animationDelay: '120ms' }}
        className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between shadow-sm hover:-translate-y-0.5 hover:border-amber-900/40 hover:shadow-lg transition-smooth animate-fade-in-up"
      >
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-amber-400 text-[11px] uppercase tracking-wider">Medium</span>
          <AlertTriangle className="w-4 h-4 text-amber-400" />
        </div>
        <div className="my-1">
          <span className="text-3xl font-extrabold text-amber-400 font-mono tracking-tight">{animatedMed}</span>
        </div>
        <span className="text-[11px] text-slate-500">Nesting & Long Methods</span>
      </div>

      {/* 4. Low Severity Card */}
      <div
        style={{ animationDelay: '180ms' }}
        className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between shadow-sm hover:-translate-y-0.5 hover:border-blue-900/40 hover:shadow-lg transition-smooth animate-fade-in-up"
      >
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-blue-400 text-[11px] uppercase tracking-wider">Low</span>
          <Info className="w-4 h-4 text-blue-400" />
        </div>
        <div className="my-1">
          <span className="text-3xl font-extrabold text-blue-400 font-mono tracking-tight">{animatedLow}</span>
        </div>
        <span className="text-[11px] text-slate-500">Logging & Unused</span>
      </div>

      {/* 5. Lines of Code Card */}
      <div
        style={{ animationDelay: '240ms' }}
        className="col-span-2 md:col-span-1 p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between shadow-sm hover:-translate-y-0.5 hover:border-slate-700 hover:shadow-lg transition-smooth animate-fade-in-up"
      >
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-slate-300 text-[11px] uppercase tracking-wider">Lines Analyzed</span>
          <FileCode className="w-4 h-4 text-slate-400" />
        </div>
        <div className="my-1 flex items-baseline space-x-1">
          <span className="text-3xl font-extrabold text-slate-100 font-mono tracking-tight">{animatedLines}</span>
          <span className="text-xs text-slate-500">LOC</span>
        </div>
        <span className="text-[11px] text-slate-500">{result.issues.length} total code smells</span>
      </div>
    </div>
  );
};
