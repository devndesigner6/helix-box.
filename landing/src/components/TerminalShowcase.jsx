import React, { useState } from 'react';
import { Terminal, Copy, Check, ShieldCheck, Sparkles, CreditCard } from 'lucide-react';

export const TerminalShowcase = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('pair');

  const copyCommand = () => {
    navigator.clipboard.writeText('npx helixbox-cli -n');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative max-w-4xl mx-auto mt-16">
      <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-3xl blur-3xl opacity-30 animate-pulse-glow" />
      
      <div className="relative glass-panel rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-3.5 bg-gray-900/90 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-gray-400">
            <Terminal className="w-3.5 h-3.5" />
            <span>helixbox-cli — bash (80x24)</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Connected</span>
          </div>
        </div>

        <div className="p-6 font-mono text-sm leading-relaxed bg-gray-950/95 text-gray-300 min-h-[220px]">
          <div className="text-gray-500"># Launching Helix Box CLI session...</div>
          <div className="mt-1">
            <span className="text-cyan-400 font-bold">dev@localhost</span>:<span className="text-purple-400">~/project</span>$ <span className="text-white font-bold">npx helixbox-cli -n</span>
          </div>
          <div className="mt-2 text-purple-300">
            Helixbox CLI v0.1.124
            <br />
            ====================
          </div>
          <div className="mt-2 text-pink-400 font-bold">
            &nbsp;&nbsp;Session code: <span className="bg-pink-500/20 px-2 py-0.5 rounded text-pink-300">ettE6SRCHU</span>
          </div>
          <div className="text-gray-400">&nbsp;&nbsp;Root directory: C:\Users\dev\helix-box</div>
          <div className="text-gray-400">&nbsp;&nbsp;Gateway: wss://helixbox-proxy.onrender.com</div>
          <div className="mt-2 text-emerald-400 font-semibold">✔ App connected! (single secure E2E session)</div>
          <div className="text-sky-400">⚡ Listening for remote mobile PTY commands...</div>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-cyan-400">dev@localhost</span>:<span className="text-purple-400">~/project</span>$ <span className="w-2 h-5 bg-cyan-400 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};
