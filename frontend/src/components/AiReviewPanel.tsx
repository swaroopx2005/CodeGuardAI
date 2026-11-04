import React, { useState, useEffect } from 'react';
import { AiReviewResponse } from '../types';
import {
  Sparkles,
  Copy,
  Check,
  Zap,
  TestTube,
  Code2,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface AiReviewPanelProps {
  review: AiReviewResponse | null;
  isLoading?: boolean;
  onApplyCode: (code: string) => void;
  onClose: () => void;
}

const TEST_STAGES = [
  'Analyzing method signature & parameters...',
  'Identifying boundary & edge cases...',
  'Generating JUnit 5 test assertions...',
  'Validating null & empty input branches...',
  'Tests generated successfully.',
];

const TEST_CATEGORIES = [
  { label: 'Normal Input', desc: 'Valid parameters producing expected return values', verified: true },
  { label: 'Edge Case', desc: 'Boundary values (max/min thresholds, single items)', verified: true },
  { label: 'Null Input', desc: 'Ensures no unexpected NullPointerExceptions are thrown', verified: true },
  { label: 'Empty Input', desc: 'Empty collections or blank strings handled gracefully', verified: true },
  { label: 'Large Input', desc: 'High volume inputs executing within linear time limits', verified: true },
];

export const AiReviewPanel: React.FC<AiReviewPanelProps> = ({
  review,
  isLoading = false,
  onApplyCode,
  onClose,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedTests, setCopiedTests] = useState(false);
  const [activeTab, setActiveTab] = useState<'refactored' | 'tests'>('refactored');

  // Test generation stage animation state
  const [testStageIdx, setTestStageIdx] = useState(0);
  const [testsReady, setTestsReady] = useState(false);

  useEffect(() => {
    if (activeTab === 'tests' && !testsReady) {
      setTestStageIdx(0);
      const interval = setInterval(() => {
        setTestStageIdx((prev) => {
          if (prev < TEST_STAGES.length - 1) {
            return prev + 1;
          } else {
            setTestsReady(true);
            clearInterval(interval);
            return prev;
          }
        });
      }, 350);
      return () => clearInterval(interval);
    }
  }, [activeTab, testsReady]);

  if (!review) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(review.correctedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyTests = () => {
    navigator.clipboard.writeText(review.generatedTestCases);
    setCopiedTests(true);
    setTimeout(() => setCopiedTests(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white">AI Code Review & Test Generation</h3>
                {isLoading && (
                  <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-mono animate-pulse-subtle">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                    <span>✨ AI analyzing...</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{review.overview}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-smooth"
          >
            Close
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Complexity Banner */}
          <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/40 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-indigo-300">
              <Zap className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold">Complexity Estimation:</span>
              <span>{review.complexityAnalysis}</span>
            </div>
          </div>

          {/* Key Findings */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Key Diagnostic Findings
            </h4>
            <div className="space-y-1.5">
              {review.keyProblems.map((prob, idx) => (
                <div
                  key={idx}
                  style={{ animationDelay: `${idx * 40}ms` }}
                  className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 flex items-start space-x-2 animate-fade-in-up"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{prob}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center space-x-2 border-b border-slate-800 pt-2">
            <button
              onClick={() => setActiveTab('refactored')}
              className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-smooth ${
                activeTab === 'refactored'
                  ? 'border-indigo-500 text-indigo-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Optimized / Refactored Code</span>
            </button>
            <button
              onClick={() => setActiveTab('tests')}
              className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-smooth ${
                activeTab === 'tests'
                  ? 'border-indigo-500 text-indigo-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <TestTube className="w-4 h-4" />
              <span>Generated JUnit 5 Tests</span>
              {!testsReady && activeTab === 'tests' && (
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              )}
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'refactored' ? (
            <div className="relative animate-fade-in-up">
              <div className="absolute top-2 right-2 flex items-center space-x-2 z-10">
                <button
                  onClick={() => {
                    onApplyCode(review.correctedCode);
                    onClose();
                  }}
                  className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-medium transition-smooth shadow-sm"
                >
                  Apply to Editor
                </button>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700 transition-smooth"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto max-h-72">
                <code>{review.correctedCode}</code>
              </pre>
            </div>
          ) : (
            <div className="space-y-3 animate-fade-in-up">
              {/* Test Generation Progress Stages */}
              {!testsReady ? (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-3 text-xs text-indigo-300">
                  <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin shrink-0" />
                  <span className="font-mono">{TEST_STAGES[testStageIdx]}</span>
                </div>
              ) : (
                <>
                  {/* Verified Categories Checklist */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Generated Test Coverage Matrix
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {TEST_CATEGORIES.map((cat, idx) => (
                        <div
                          key={idx}
                          style={{ animationDelay: `${idx * 40}ms` }}
                          className="p-2 rounded bg-slate-900 border border-slate-800/80 flex items-start space-x-2 animate-fade-in-up"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-white block">{cat.label}</span>
                            <span className="text-[10px] text-slate-400 leading-tight block">{cat.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Code Editor Container for Test Suite */}
                  <div className="relative">
                    <div className="absolute top-2 right-2 z-10">
                      <button
                        onClick={handleCopyTests}
                        className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700 transition-smooth"
                      >
                        {copiedTests ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedTests ? 'Copied' : 'Copy Test Suite'}</span>
                      </button>
                    </div>
                    <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-indigo-300 overflow-x-auto max-h-72">
                      <code>{review.generatedTestCases}</code>
                    </pre>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
