import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  FileCode2,
  ChevronRight,
  GitPullRequest,
  Zap,
  Check,
} from 'lucide-react';
import { useAnimatedCounter } from '../utils/motion';

interface FileNode {
  name: string;
  type: 'folder' | 'file';
  path: string;
  issues?: number;
  children?: FileNode[];
}

const SAMPLE_REPO_TREE: FileNode[] = [
  {
    name: 'src/main/java/com/codeguard',
    type: 'folder',
    path: 'src/main/java/com/codeguard',
    children: [
      {
        name: 'analyzer',
        type: 'folder',
        path: 'src/main/java/com/codeguard/analyzer',
        children: [
          { name: 'CodeAnalyzer.java', type: 'file', path: 'CodeAnalyzer.java', issues: 0 },
          { name: 'AnalysisResult.java', type: 'file', path: 'AnalysisResult.java', issues: 0 },
        ],
      },
      {
        name: 'controller',
        type: 'folder',
        path: 'src/main/java/com/codeguard/controller',
        children: [
          { name: 'AnalyzeController.java', type: 'file', path: 'AnalyzeController.java', issues: 1 },
          { name: 'AiOptimizationController.java', type: 'file', path: 'AiOptimizationController.java', issues: 0 },
        ],
      },
      {
        name: 'service',
        type: 'folder',
        path: 'src/main/java/com/codeguard/service',
        children: [
          { name: 'CodeOptimizationService.java', type: 'file', path: 'CodeOptimizationService.java', issues: 0 },
          { name: 'AiReviewService.java', type: 'file', path: 'AiReviewService.java', issues: 1 },
        ],
      },
    ],
  },
  {
    name: 'src/main/resources',
    type: 'folder',
    path: 'src/main/resources',
    children: [{ name: 'application.properties', type: 'file', path: 'application.properties', issues: 0 }],
  },
];

export const RepositoryScanner: React.FC<{ onSelectFileCode?: (code: string) => void }> = () => {
  const [activeTab, setActiveTab] = useState<'repo' | 'pr'>('repo');
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    'src/main/java/com/codeguard': true,
    'src/main/java/com/codeguard/analyzer': true,
    'src/main/java/com/codeguard/service': true,
  });

  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(100);

  // PR Pipeline State
  const [prStage, setPrStage] = useState<number>(0);
  const [isPrRunning, setIsPrRunning] = useState(false);
  const prScore = useAnimatedCounter(prStage >= 6 ? 74 : 0, 800);

  const toggleFolder = (path: string) => {
    setOpenFolders((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const handleStartScan = () => {
    setIsScanning(true);
    setScanProgress(15);
    setTimeout(() => setScanProgress(45), 400);
    setTimeout(() => setScanProgress(78), 900);
    setTimeout(() => {
      setScanProgress(100);
      setIsScanning(false);
    }, 1400);
  };

  const handleRunPrReview = () => {
    setIsPrRunning(true);
    setPrStage(1); // Fetching changes
    setTimeout(() => setPrStage(2), 600); // 17 files detected
    setTimeout(() => setPrStage(3), 1200); // Static analysis
    setTimeout(() => setPrStage(4), 1800); // Security scan
    setTimeout(() => setPrStage(5), 2400); // Complexity scan
    setTimeout(() => setPrStage(6), 3000); // Complete
    setTimeout(() => setIsPrRunning(false), 3100);
  };

  const renderTree = (nodes: FileNode[], depth = 0) => {
    return (
      <div className="space-y-0.5">
        {nodes.map((node) => {
          if (node.type === 'folder') {
            const isOpen = !!openFolders[node.path];
            return (
              <div key={node.path} style={{ paddingLeft: `${depth * 14}px` }}>
                <button
                  onClick={() => toggleFolder(node.path)}
                  className="w-full flex items-center space-x-1.5 py-1 px-2 rounded hover:bg-slate-800/60 text-slate-300 text-xs transition-smooth group"
                >
                  <ChevronRight
                    className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                      isOpen ? 'rotate-90' : ''
                    }`}
                  />
                  {isOpen ? (
                    <FolderOpen className="w-3.5 h-3.5 text-indigo-400" />
                  ) : (
                    <Folder className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span className="font-mono text-[11px] group-hover:text-white transition-colors">
                    {node.name}
                  </span>
                </button>
                {isOpen && node.children && (
                  <div className="border-l border-slate-800 ml-3.5 pl-1 transition-all duration-200">
                    {renderTree(node.children, depth + 1)}
                  </div>
                )}
              </div>
            );
          } else {
            return (
              <div
                key={node.path}
                style={{ paddingLeft: `${depth * 14 + 18}px` }}
                className="flex items-center justify-between py-1 px-2 rounded hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 text-xs transition-smooth cursor-pointer"
              >
                <div className="flex items-center space-x-1.5 font-mono text-[11px]">
                  <FileCode2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>{node.name}</span>
                </div>
                {node.issues && node.issues > 0 ? (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {node.issues} smell
                  </span>
                ) : (
                  <span className="text-[10px] text-emerald-400/80">clean</span>
                )}
              </div>
            );
          }
        })}
      </div>
    );
  };

  const PR_STAGES = [
    'GitHub Pull Request #42: Feat/Optimization Engine',
    'Fetching repository changes & diffs...',
    '17 files detected for review',
    'Static analysis & code smells completed',
    'Security & injection scan completed',
    'Algorithmic complexity evaluation completed',
    'AI code review & summary ready',
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      {/* Top Header Tabs */}
      <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
        <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('repo')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-medium transition-smooth ${
              activeTab === 'repo'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            <span>Repository Scanner</span>
          </button>
          <button
            onClick={() => setActiveTab('pr')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-medium transition-smooth ${
              activeTab === 'pr'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitPullRequest className="w-3.5 h-3.5 text-violet-400" />
            <span>GitHub PR Review</span>
          </button>
        </div>

        <button
          onClick={activeTab === 'repo' ? handleStartScan : handleRunPrReview}
          disabled={isScanning || isPrRunning}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow transition-smooth disabled:opacity-50"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>{isScanning || isPrRunning ? 'Processing...' : activeTab === 'repo' ? 'Scan Repo' : 'Run PR Review'}</span>
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'repo' ? (
          <>
            {/* Visual Repository Scanner Progress */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">
                  {isScanning ? 'Scanning repository...' : 'Repository Scan Complete'}
                </span>
                <span className="font-mono text-indigo-400 font-bold">{scanProgress}%</span>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300 rounded-full"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>

              {/* Metric Counters */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
                <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">Files</span>
                  <span className="font-mono font-bold text-slate-200">29 files</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">Functions</span>
                  <span className="font-mono font-bold text-slate-200">142 methods</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">Security Checks</span>
                  <span className="font-mono font-bold text-emerald-400">100% Passed</span>
                </div>
              </div>
            </div>

            {/* Expandable File Tree with Smooth Rotations */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
                <span>Repository File Tree</span>
                <span className="text-[11px] text-slate-500 lowercase">click folder to expand</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 max-h-[300px] overflow-y-auto">
                {renderTree(SAMPLE_REPO_TREE)}
              </div>
            </div>
          </>
        ) : (
          /* GitHub PR Review Tab */
          <div className="space-y-4">
            {/* PR Overview Card */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
                  <GitPullRequest className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">PR #42: Add Optimization Engine</h4>
                  <p className="text-[11px] text-slate-400">Target: main • Author: swaroop • 17 files changed</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                +420 / -112 lines
              </span>
            </div>

            {/* PR Pipeline Stages with Checkmark Transitions */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                PR Review Pipeline
              </span>
              <div className="space-y-2">
                {PR_STAGES.slice(1).map((stage, idx) => {
                  const stepNumber = idx + 1;
                  const isDone = prStage > stepNumber;
                  const isCurrent = prStage === stepNumber;

                  return (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-smooth ${
                        isDone
                          ? 'bg-slate-900 border-emerald-900/40 text-slate-200'
                          : isCurrent
                          ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-300 shadow-sm'
                          : 'bg-slate-900/50 border-slate-800/80 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {isDone ? (
                          <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        ) : isCurrent ? (
                          <div className="w-4 h-4 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-600 font-mono">
                            {stepNumber}
                          </div>
                        )}
                        <span className="font-medium">{stage}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">
                        {isDone ? 'COMPLETED' : isCurrent ? 'RUNNING' : 'QUEUED'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PR Result Card (Appears after review completes) */}
            {prStage >= 6 && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 to-indigo-950/40 border border-indigo-800/50 space-y-3 animate-fade-in-up">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs text-slate-400 font-medium">PR Quality Assessment</span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-extrabold text-indigo-400 font-mono">{prScore}</span>
                      <span className="text-slate-500 text-xs">/ 100</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 ml-2">
                        MERGE APPROVED
                      </span>
                    </div>
                  </div>
                </div>

                {/* Severity Breakdown */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs pt-1">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Critical</span>
                    <span className="font-bold text-slate-400">0</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">High</span>
                    <span className="font-bold text-rose-400">2</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Medium</span>
                    <span className="font-bold text-amber-400">5</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Low</span>
                    <span className="font-bold text-blue-400">3</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
