import React, { useEffect, useState } from 'react';
import { Search, ShieldAlert, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';

interface ScanningPipelineProps {
  isScanning: boolean;
}

const STAGES = [
  { text: 'Scanning source syntax...', icon: Search },
  { text: 'Checking NullPointers & catch blocks...', icon: ShieldAlert },
  { text: 'Evaluating cyclomatic complexity & nesting...', icon: Cpu },
  { text: 'Checking method lengths & code smells...', icon: Sparkles },
  { text: 'Detecting unused variables...', icon: Search },
  { text: 'Generating quality report...', icon: CheckCircle2 },
];

export const ScanningPipeline: React.FC<ScanningPipelineProps> = ({ isScanning }) => {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);

  useEffect(() => {
    if (!isScanning) {
      setCurrentStageIdx(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStageIdx((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 280);

    return () => clearInterval(interval);
  }, [isScanning]);

  if (!isScanning) return null;

  const currentStage = STAGES[currentStageIdx];
  const Icon = currentStage.icon;

  return (
    <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between bg-slate-950/20 backdrop-blur-[1px] rounded-xl overflow-hidden animate-fade-in-up">
      {/* Laser Scanning Line */}
      <div className="relative w-full h-full">
        <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_12px_#6366f1] animate-laser-scan" />
      </div>

      {/* Floating Status Pill */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/40 shadow-xl shadow-indigo-950/50 backdrop-blur-md flex items-center space-x-2 text-xs font-mono text-indigo-300">
        <Icon className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
        <span className="font-medium tracking-tight transition-all duration-200">
          {currentStage.text}
        </span>
      </div>
    </div>
  );
};
