import React from 'react';
import { Box, Github, Smartphone, Trophy } from 'lucide-react';

export const Navbar = () => {
  return (
    <header className="fixed top-5 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] max-w-6xl z-50">
      <nav className="glass-panel px-6 py-3.5 rounded-2xl flex items-center justify-between shadow-2xl">
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(139,92,246,0.5)] group-hover:scale-105 transition-transform">
            <Box className="w-5 h-5" />
          </div>
          <span className="font-heading font-extrabold text-xl tracking-tight text-white">
            Helix<span className="text-cyan-400">Box</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
          <a href="#x402" className="hover:text-white transition-colors">x402 Protocol</a>
          <a href="#playground" className="hover:text-white transition-colors">Playground</a>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/devndesigner6/helix-box"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white px-4 py-2 rounded-xl hover:bg-white/5 transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>
          <a
            href="https://github.com/devndesigner6/helix-box/releases/latest/download/helix-boxv1.apk"
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl border border-white/20 shadow-lg hover:shadow-purple-500/40 hover:scale-105 transition-all"
          >
            <Smartphone className="w-4 h-4" />
            <span>Download APK</span>
          </a>
        </div>
      </nav>
    </header>
  );
};
