import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ScoreDashboard } from './components/ScoreDashboard';
import { IssueExplorer } from './components/IssueExplorer';
import { AiReviewPanel } from './components/AiReviewPanel';
import { OptimizationModal } from './components/OptimizationModal';
import { OptimizationHistoryModal } from './components/OptimizationHistoryModal';
import { HistoryModal } from './components/HistoryModal';
import { AuthModal } from './components/AuthModal';
import { ScanningPipeline } from './components/ScanningPipeline';
import { RepositoryScanner } from './components/RepositoryScanner';
import { FloatingCodeBackground } from './components/FloatingCodeBackground';
import { codeGuardApi } from './services/api';
import { AnalysisResult, AiReviewResponse, OptimizationResponse } from './types';
import {
  Play,
  Zap,
  RefreshCw,
  FileCode2,
  RotateCcw,
  Sparkles,
  Layers,
  FolderGit2,
} from 'lucide-react';

const SAMPLES = {
  nestedLoop: {
    title: 'Nested Loop O(n²) Duplicate Search',
    code: `public class DuplicateFinder {

    // Time: O(n²) | Space: O(1)
    public static boolean findDuplicateSlow(int[] numbers) {
        // Nested loop compares every pair of elements
        for (int i = 0; i < numbers.length; i++) {
            for (int j = i + 1; j < numbers.length; j++) {
                if (numbers[i] == numbers[j]) {
                    return true;
                }
            }
        }
        return false;
    }
}`,
  },
  stringConcat: {
    title: 'String Concatenation in Loop O(n²)',
    code: `public class StringConcatenator {

    // Time: O(n²) character copies | Space: O(n²) allocations
    public String buildMessage(String[] messages) {
        String output = "";
        for (int i = 0; i < messages.length; i++) {
            // Immutable String recreation on each iteration
            output += messages[i];
        }
        return output;
    }
}`,
  },
  multiSmell: {
    title: 'Full Multi-Smell Payment Processor',
    code: `public class PaymentProcessor {

    public void processTransaction(String accountId, double amount) {
        // Smell 1: Possible NullPointerException
        String idPrefix = accountId.toString();

        // Smell 2: System.out.println in production code
        System.out.println("Processing transaction for: " + idPrefix);

        // Smell 3: Unused local variable
        int transactionRetryLimit = 5;

        // Smell 4: Deeply nested if statements (Arrow Anti-Pattern)
        if (amount > 0) {
            if (accountId != null) {
                if (amount < 100000) {
                    executeTransfer(idPrefix, amount);
                }
            }
        }

        // Smell 5: Empty catch block
        try {
            auditLog(idPrefix);
        } catch (Exception e) {
        }
    }

    private void executeTransfer(String id, double amt) {}
    private void auditLog(String id) {}
}`,
  },
};

export const App: React.FC = () => {
  // Navigation View: 'analyze' | 'repositories'
  const [currentView, setCurrentView] = useState<'analyze' | 'repositories'>('analyze');

  const [code, setCode] = useState<string>(SAMPLES.nestedLoop.code);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [aiReview, setAiReview] = useState<AiReviewResponse | null>(null);
  const [optimization, setOptimization] = useState<OptimizationResponse | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  const [user, setUser] = useState<string | null>(localStorage.getItem('codeguard_user'));
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [showOptHistoryModal, setShowOptHistoryModal] = useState<boolean>(false);

  const [undoBackupCode, setUndoBackupCode] = useState<string | null>(null);
  const [activeLine, setActiveLine] = useState<number | null>(null);

  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const decorationsRef = useRef<string[]>([]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  // Subtle line highlight when clicking an issue
  const jumpToLine = (lineNumber: number) => {
    setActiveLine(lineNumber);
    if (editorRef.current && monacoRef.current) {
      editorRef.current.revealLineInCenter(lineNumber);
      editorRef.current.setPosition({ lineNumber, column: 1 });
      editorRef.current.focus();

      // Apply subtle line decoration highlight
      decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, [
        {
          range: new monacoRef.current.Range(lineNumber, 1, lineNumber, 1),
          options: {
            isWholeLine: true,
            className: 'editor-line-highlight',
          },
        },
      ]);

      // Gently clear the highlight after 2.8s
      setTimeout(() => {
        if (editorRef.current) {
          decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, []);
        }
      }, 2800);
    }
  };

  const handleRunAnalysis = async (customCode?: string) => {
    const codeToAnalyze = customCode !== undefined ? customCode : code;
    if (!codeToAnalyze.trim()) return;

    setIsAnalyzing(true);
    try {
      const result = await codeGuardApi.analyzeCode(codeToAnalyze);
      setAnalysisResult(result);
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRunAiOptimize = async () => {
    if (!code.trim()) return;
    setIsOptimizing(true);
    try {
      const res = await codeGuardApi.optimizeCode(code, analysisResult);
      setOptimization(res);
    } catch (err) {
      console.error('Optimization error:', err);
      alert('Optimization request failed. Ensure the Spring Boot backend is running.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleRunAiReview = async () => {
    if (!code.trim()) return;
    setIsAiLoading(true);
    try {
      const review = await codeGuardApi.getAiReview(code);
      setAiReview(review);
    } catch (err) {
      console.error('AI Review error:', err);
      alert('AI Review failed. Ensure the Spring Boot backend is running.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleApplyOptimization = async (optimizedCode: string, opt: OptimizationResponse) => {
    setUndoBackupCode(code);
    setCode(optimizedCode);

    try {
      await codeGuardApi.saveOptimization({
        originalCode: opt.originalCode,
        optimizedCode: opt.optimizedCode,
        originalTimeComplexity: opt.originalComplexity.time,
        optimizedTimeComplexity: opt.optimizedComplexity.time,
        originalSpaceComplexity: opt.originalComplexity.space,
        optimizedSpaceComplexity: opt.optimizedComplexity.space,
        beforeScore: opt.beforeScore,
        afterScore: opt.afterScore,
        summary: opt.summary,
      });
    } catch (e) {
      console.warn('Could not auto-save optimization history', e);
    }

    handleRunAnalysis(optimizedCode);
  };

  const handleRestoreOriginal = () => {
    if (undoBackupCode) {
      setCode(undoBackupCode);
      handleRunAnalysis(undoBackupCode);
      setUndoBackupCode(null);
    }
  };

  useEffect(() => {
    handleRunAnalysis();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100 relative overflow-x-hidden selection:bg-indigo-500/30">
      {/* Floating Animated Code Background */}
      <FloatingCodeBackground />

      {/* Main Navbar */}
      <Navbar
        user={user}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenHistory={() => setShowHistoryModal(true)}
        onOpenOptHistory={() => setShowOptHistoryModal(true)}
        onLogout={() => {
          codeGuardApi.logout();
          setUser(null);
        }}
        onRunAiReview={handleRunAiReview}
        isAiLoading={isAiLoading}
        hasAnalysis={!!analysisResult}
      />

      {/* Undo / Revert Optimization Notification Banner */}
      {undoBackupCode && (
        <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border-b border-emerald-800/40 px-4 py-2 flex items-center justify-between text-xs z-30 animate-fade-in-up">
          <div className="flex items-center space-x-2 text-emerald-300">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Optimization applied to editor! Score and complexity updated.</span>
          </div>
          <button
            onClick={handleRestoreOriginal}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition-smooth"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Restore Original Code</span>
          </button>
        </div>
      )}

      {/* Hero Section */}
      <HeroSection
        onStartAnalyze={() => {
          setCurrentView('analyze');
          handleRunAnalysis();
        }}
        onStartOptimize={() => {
          setCurrentView('analyze');
          handleRunAiOptimize();
        }}
      />

      {/* Navigation View Switcher (Dashboard / Analyze vs Repositories & PRs) */}
      <div className="max-w-7xl w-full mx-auto px-4 mb-3 flex items-center justify-between z-10">
        <div className="flex items-center space-x-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs backdrop-blur">
          <button
            onClick={() => setCurrentView('analyze')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-smooth ${
              currentView === 'analyze'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Code Analysis & Optimizer</span>
          </button>
          <button
            onClick={() => setCurrentView('repositories')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-smooth ${
              currentView === 'repositories'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Repositories & GitHub PRs</span>
          </button>
        </div>
      </div>

      {/* Main Content with Page Transition Animation */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 pb-8 flex flex-col space-y-4 z-10">
        {currentView === 'analyze' ? (
          <div className="space-y-4 animate-fade-in-up">
            {/* Animated Quality Score & Metric Cards */}
            {analysisResult && <ScoreDashboard result={analysisResult} />}

            {/* Main Work Area: 2 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[580px]">
              {/* Left Column: Monaco Code Editor */}
              <div className="lg:col-span-7 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm relative group">
                {/* Multi-Stage Scanning Overlay & Laser indicator */}
                <ScanningPipeline isScanning={isAnalyzing} />

                {/* Editor Toolbar */}
                <div className="p-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 bg-slate-900/90">
                  <div className="flex items-center space-x-2">
                    <FileCode2 className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs text-slate-300 font-medium">Java Source Code</span>

                    {/* Presets Dropdown */}
                    <select
                      onChange={(e) => {
                        const selected = SAMPLES[e.target.value as keyof typeof SAMPLES];
                        if (selected) {
                          setCode(selected.code);
                          handleRunAnalysis(selected.code);
                          setUndoBackupCode(null);
                        }
                      }}
                      className="ml-2 bg-slate-950 border border-slate-800 text-slate-300 text-[11px] rounded px-2 py-1 focus:outline-none focus:border-indigo-500 transition-colors"
                    >
                      <option value="nestedLoop">{SAMPLES.nestedLoop.title}</option>
                      <option value="stringConcat">{SAMPLES.stringConcat.title}</option>
                      <option value="multiSmell">{SAMPLES.multiSmell.title}</option>
                    </select>
                  </div>

                  {/* Action Buttons: AI Optimize & Analyze Code */}
                  <div className="flex items-center space-x-2">
                    {/* Optimization Available Indicator */}
                    {analysisResult?.optimization && (
                      <button
                        onClick={handleRunAiOptimize}
                        className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold transition"
                        title="Click to view full O(n²) → O(n) average optimization"
                      >
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        <span>Optimization: O(n²) → O(n)</span>
                      </button>
                    )}

                    {/* AI Optimize Button */}
                    <button
                      onClick={handleRunAiOptimize}
                      disabled={isOptimizing}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs shadow-md transition-smooth hover:scale-[1.03] active:scale-[0.98] disabled:opacity-50"
                      title="Detect inefficient loops/searches and suggest optimized complexity"
                    >
                      {isOptimizing ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Zap className="w-3.5 h-3.5 fill-current" />
                      )}
                      <span>{isOptimizing ? 'Optimizing...' : 'AI Optimize'}</span>
                    </button>

                    {/* Analyze Code Button */}
                    <button
                      onClick={() => handleRunAnalysis()}
                      disabled={isAnalyzing}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow transition-smooth hover:scale-[1.03] active:scale-[0.98] disabled:opacity-50"
                    >
                      {isAnalyzing ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current" />
                      )}
                      <span>{isAnalyzing ? 'Scanning...' : 'Analyze Code'}</span>
                    </button>
                  </div>
                </div>

                {/* Monaco Editor Container */}
                <div className="flex-1 min-h-[500px]">
                  <Editor
                    height="100%"
                    defaultLanguage="java"
                    theme="vs-dark"
                    value={code}
                    onChange={(val) => setCode(val || '')}
                    onMount={handleEditorDidMount}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 13,
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 4,
                    }}
                  />
                </div>
              </div>

              {/* Right Column: Detected Issues Explorer */}
              <div className="lg:col-span-5 h-[620px] lg:h-auto">
                {analysisResult ? (
                  <IssueExplorer
                    issues={analysisResult.issues}
                    activeLine={activeLine}
                    onSelectLine={jumpToLine}
                  />
                ) : (
                  <div className="h-full bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center p-6 text-center text-slate-500 text-xs">
                    Run analysis to see detected code smells, bugs, and maintainability issues.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Repositories & GitHub PRs View (with smooth Page Transition) */
          <div className="animate-fade-in-up">
            <RepositoryScanner />
          </div>
        )}
      </main>

      {/* AI Optimization Modal (Split-Screen, Complexity Comparison & Confirm) */}
      {optimization && (
        <OptimizationModal
          optimization={optimization}
          onApply={handleApplyOptimization}
          onClose={() => setOptimization(null)}
        />
      )}

      {/* AI Deep Review Modal */}
      {aiReview && (
        <AiReviewPanel
          review={aiReview}
          isLoading={isAiLoading}
          onApplyCode={(newCode) => {
            setCode(newCode);
            handleRunAnalysis(newCode);
          }}
          onClose={() => setAiReview(null)}
        />
      )}

      {/* Analysis History Modal */}
      <HistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        onLoadSnippet={(snippet) => {
          setCode(snippet);
          handleRunAnalysis(snippet);
        }}
      />

      {/* Optimization History Modal */}
      <OptimizationHistoryModal
        isOpen={showOptHistoryModal}
        onClose={() => setShowOptHistoryModal(false)}
        onRestoreOriginal={(origCode) => {
          setCode(origCode);
          handleRunAnalysis(origCode);
        }}
        onLoadOptimized={(optCode) => {
          setCode(optCode);
          handleRunAnalysis(optCode);
        }}
      />

      {/* Login & Register Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={(loggedUser) => setUser(loggedUser)}
      />
    </div>
  );
};
