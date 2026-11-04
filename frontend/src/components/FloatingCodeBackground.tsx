import React from 'react';

const FLOATING_SNIPPETS = [
  { text: 'const review = await analyze(code);', top: '12%', left: '8%', delay: '0s', anim: 'animate-float-slow' },
  { text: 'O(n²) → O(n)', top: '24%', right: '14%', delay: '-4s', anim: 'animate-float-reverse' },
  { text: 'security.scan();', top: '65%', left: '10%', delay: '-8s', anim: 'animate-float-slow' },
  { text: 'AI.optimize();', top: '78%', right: '18%', delay: '-2s', anim: 'animate-float-reverse' },
  { text: 'git diff --staged', top: '45%', right: '8%', delay: '-11s', anim: 'animate-float-slow' },
  { text: 'HashSet<Integer> seen = new HashSet<>();', top: '88%', left: '32%', delay: '-6s', anim: 'animate-float-reverse' },
  { text: 'assertDoesNotThrow(() -> process());', top: '38%', left: '4%', delay: '-14s', anim: 'animate-float-slow' },
];

export const FloatingCodeBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Subtle background radial glows */}
      <div className="absolute -top-40 left-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl opacity-60" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl opacity-40" />

      {/* Floating code fragments */}
      {FLOATING_SNIPPETS.map((item, idx) => (
        <div
          key={idx}
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
            animationDelay: item.delay,
          }}
          className={`absolute text-xs font-mono text-slate-700/60 transition-opacity duration-1000 ${item.anim} hidden md:block`}
        >
          <span className="px-2.5 py-1 rounded border border-slate-800/40 bg-slate-950/40 backdrop-blur-sm">
            {item.text}
          </span>
        </div>
      ))}
    </div>
  );
};
