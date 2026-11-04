import React from 'react';
import { Shield, Sparkles, History, LogIn, LogOut, User as UserIcon, Zap } from 'lucide-react';

interface NavbarProps {
  user: string | null;
  onOpenAuth: () => void;
  onOpenHistory: () => void;
  onOpenOptHistory: () => void;
  onLogout: () => void;
  onRunAiReview: () => void;
  isAiLoading: boolean;
  hasAnalysis: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAuth,
  onOpenHistory,
  onOpenOptHistory,
  onLogout,
  onRunAiReview,
  isAiLoading,
  hasAnalysis,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-white tracking-tight">CodeGuard</span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                AI v2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">AI Code Review, Debugging & Complexity Platform</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2.5">
          {hasAnalysis && (
            <button
              onClick={onRunAiReview}
              disabled={isAiLoading}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium text-xs shadow-md transition disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAiLoading ? 'Analyzing...' : 'AI Deep Review'}</span>
            </button>
          )}

          {user && (
            <>
              <button
                onClick={onOpenOptHistory}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition border border-slate-700"
                title="View past optimization history"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Optimizations</span>
              </button>

              <button
                onClick={onOpenHistory}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition border border-slate-700"
                title="View past analysis history"
              >
                <History className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">History</span>
              </button>
            </>
          )}

          {user ? (
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
              <div className="flex items-center space-x-1.5 text-xs font-medium text-slate-300">
                <UserIcon className="w-4 h-4 text-indigo-400" />
                <span>{user}</span>
              </div>
              <button
                onClick={onLogout}
                title="Logout"
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
