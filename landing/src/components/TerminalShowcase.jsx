import React, { useState } from 'react';
import { Terminal, Copy, Check } from 'lucide-react';

export const TerminalShowcase = () => {
  const [copied, setCopied] = useState(false);

  const copyCommand = () => {
    navigator.clipboard.writeText('npx helixbox-cli -n');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative max-w-4xl mx-auto my-6">
      <div className="absolute -inset-2 bg-cyan-200/40 dark:bg-cyan-900/20 rounded-3xl blur-2xl" />
      
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-[#0f172a]">
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>helixbox-cli — bash (80x24)</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Connected</span>
          </div>
        </div>

        <div className="p-6 font-mono text-sm leading-relaxed text-slate-200 min-h-[220px]">
          <div className="text-slate-500"># Launching Helix Box CLI session...</div>
          <div className="mt-1">
            <span className="text-cyan-300 font-bold">dev@localhost</span>:<span className="text-slate-400">~/project</span>$ <span className="text-white font-bold">npx helixbox-cli -n</span>
          </div>
          <div className="mt-2 text-cyan-200">
            Helixbox CLI v0.1.124
            <br />
            ====================
          </div>
          <div className="mt-2 text-cyan-300 font-bold">
            &nbsp;&nbsp;Session code: <span className="bg-cyan-950/80 border border-cyan-500/40 px-2 py-0.5 rounded text-[#A8F1F7]">ettE6SRCHU</span>
          </div>
          <div className="text-slate-400">&nbsp;&nbsp;Root directory: C:\Users\dev\helix-box</div>
          <div className="text-slate-400">&nbsp;&nbsp;Gateway: wss://helixbox-proxy.onrender.com</div>
          <div className="mt-2 text-emerald-400 font-semibold">✔ App connected! (single secure E2E session)</div>
          <div className="text-cyan-400">⚡ Listening for remote mobile PTY commands...</div>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-cyan-300">dev@localhost</span>:<span className="text-slate-400">~/project</span>$ <span className="w-2 h-5 bg-cyan-300 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};
