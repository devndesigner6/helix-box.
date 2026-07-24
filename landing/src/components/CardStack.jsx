import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Lock, Coins, Code, ArrowRight } from 'lucide-react';

export const CardStack = () => {
  const [expanded, setExpanded] = useState(false);

  const cards = [
    {
      id: 1,
      icon: Terminal,
      title: "Rust-Powered PTY Engine",
      subtitle: "24fps Cell Grid Buffer Diffing",
      description: "Real PTY sessions via WezTerm fork. Incremental screen cell updates delivered over stdin/stdout at sub-second latency.",
      badge: "High Performance",
      color: "from-cyan-500/20 to-[#A8F1F7]/40"
    },
    {
      id: 2,
      icon: Lock,
      title: "Zero-Trust Encrypted Relay",
      description: "No open firewall ports or static IP setup. Ephemeral 6-character nonces pair PC and mobile phone via TLS 1.3 WebSockets.",
      badge: "TLS 1.3",
      color: "from-[#A8F1F7]/30 to-sky-400/20"
    },
    {
      id: 3,
      icon: Coins,
      title: "Algorand x402 Micropayments",
      description: "HTTP 402 Payment Required integration. Pay $0.01 per AI prompt or $0.25 per Docker sandbox settled on Algorand in <1s.",
      badge: "Algorand MainNet",
      color: "from-emerald-400/20 to-[#A8F1F7]/30"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto my-16 px-6">
      <div className="text-center mb-8">
        <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400 tracking-widest uppercase">EXPANDABLE ARCHITECTURE</span>
        <h3 className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white mt-1">Product Stack Specs</h3>
        <p className="text-xs text-slate-500 mt-1">Click stack to expand detailed technical specs</p>
      </div>

      <div 
        onClick={() => setExpanded(!expanded)}
        className="relative h-[360px] max-w-xl mx-auto cursor-pointer perspective-1000"
      >
        {cards.map((card, idx) => {
          const Icon = card.icon;
          const offset = idx * 16;
          const scale = 1 - idx * 0.05;
          const rotate = expanded ? (idx - 1) * 8 : idx * -2;
          const translateY = expanded ? idx * 120 - 100 : idx * 18;

          return (
            <motion.div
              key={card.id}
              initial={false}
              animate={{
                y: translateY,
                scale: expanded ? 1 : scale,
                rotate: rotate,
                zIndex: cards.length - idx
              }}
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
              className={`absolute top-0 left-0 right-0 p-8 rounded-3xl agenta-card border border-slate-200 dark:border-slate-800 shadow-2xl bg-gradient-to-br ${card.color}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-900 dark:text-white shadow-sm">
                  <Icon className="w-6 h-6 text-cyan-500" />
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                  {card.badge}
                </span>
              </div>

              <h4 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-2">
                {card.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                {card.description}
              </p>

              <div className="flex items-center text-xs font-semibold text-cyan-600 dark:text-cyan-400 gap-1">
                <span>{expanded ? 'Click to collapse' : 'Click to expand stack'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
