import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { CardFlip } from './components/CardFlip';
import { LiquidGlassCard } from './components/LiquidGlassCard';
import { TerminalShowcase } from './components/TerminalShowcase';
import { 
  Sparkles, 
  Smartphone, 
  Copy, 
  Check, 
  ArrowUpRight, 
  ShieldCheck, 
  Zap, 
  Terminal, 
  Lock, 
  Coins, 
  Trophy,
  ArrowRight,
  Cpu,
  Layers,
  Globe
} from 'lucide-react';

export default function App() {
  const [copied, setCopied] = useState(false);

  const copyCommand = () => {
    navigator.clipboard.writeText('npx helixbox-cli -n');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const marqueeItems = [
    "⚡ Zero-Trust Relays",
    "🔒 E2E Encrypted",
    "💎 Algorand x402 Micropayments",
    "📱 Native PTY Terminal",
    "🤖 AI Agent Compute",
    "⚡ Sub-Second Settlement",
    "🏆 OpenAI Build Week Winner",
    "🌐 Open Source Software"
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#07090e] text-slate-900 dark:text-slate-100 font-sans selection:bg-cyan-200 selection:text-slate-900 transition-colors duration-300">
      <Navbar />

      {/* Hero Section — Exact Agenta Template Layout */}
      <section className="pt-36 pb-16 px-6 max-w-6xl mx-auto text-center">
        
        {/* Agenta Pill Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full border border-dashed border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm text-xs font-medium text-slate-600 dark:text-slate-300 mb-8 shadow-sm">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>OpenAI Build Week Hyderabad — <strong>Best Presentation Award</strong></span>
        </div>

        {/* Agenta Cursive Script Title + Sans-Serif Line */}
        <h1 className="mb-6 flex flex-col items-center">
          <span className="font-script text-6xl sm:text-7xl md:text-8xl text-slate-800 dark:text-slate-100 tracking-wide font-normal leading-none mb-2">
            Transcend terminal limits.
          </span>
          <span className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl text-slate-900 dark:text-white tracking-tight leading-tight">
            Augment your mobile workflow.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          The mobile-first Web/Native IDE & interactive PTY terminal emulator. Pair your local PC environment with mobile devices via zero-trust, E2E encrypted relays and Algorand x402 micro-compute.
        </p>

        {/* Agenta Hero Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <a
            href="https://github.com/devndesigner6/helix-box/releases/latest/download/helix-boxv1.apk"
            className="agenta-pill-btn px-8 py-3.5 text-base flex items-center gap-3 shadow-lg"
          >
            <Smartphone className="w-5 h-5" />
            <span>Download for Android</span>
          </a>

          <button
            onClick={copyCommand}
            className="agenta-outline-btn px-6 py-3.5 text-sm font-mono flex items-center gap-3"
          >
            <span className="text-cyan-500 font-bold">$</span>
            <span>npx helixbox-cli -n</span>
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Agenta Infinite Horizontal Marquee Banner */}
        <div className="relative w-full overflow-hidden no-scrollbar py-4 border-y border-slate-200/80 dark:border-slate-800/80 mb-20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm">
          <div className="flex w-[200%] animate-marquee gap-4">
            {marqueeItems.concat(marqueeItems).map((item, idx) => (
              <span 
                key={idx} 
                className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Giant Agenta Rounded Hero Showcase Frame */}
        <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
          <div className="rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800/60">
            <TerminalShowcase />
          </div>
        </div>

      </section>

      {/* Agenta Bento Grid Features Section */}
      <section className="py-24 px-6 max-w-6xl mx-auto" id="features">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400 tracking-widest uppercase">DISCOVER CAPABILITIES</span>
          <h2 className="text-4xl font-extrabold font-heading text-slate-900 dark:text-white mt-2 mb-4">Engineering Beyond Boundaries</h2>
          <p className="text-slate-600 dark:text-slate-400 text-base">Combining zero-trust proxy infrastructure, mobile PTY terminal rendering, and Algorand micro-billing.</p>
        </div>

        {/* Bento Grid Layout (Agenta Style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <CardFlip 
            icon={Lock}
            title="Zero-Trust E2E Relays"
            description="No open firewall ports or static IP addresses required. Session pairs securely over encrypted WebSocket relays."
            backTitle="Security Architecture"
            features={[
              "TLS 1.3 End-to-End Encryption",
              "Ephemeral 6-Character Nonce Tokens",
              "Zero Port-Forwarding / VPN setup",
              "Single Active Session Isolation"
            ]}
          />
          <CardFlip 
            icon={Terminal}
            title="Full Native PTY Terminal"
            description="Full ANSI color support, xterm rendering, sub-second input latency, and mobile-optimized virtual keyboard controls."
            backTitle="Terminal Features"
            features={[
              "Multi-tab PTY session execution",
              "Live stdout / stderr streaming",
              "Custom mobile hotkeys (Ctrl, Tab, Esc)",
              "Built-in File Explorer & Editor"
            ]}
          />
          <CardFlip 
            icon={Coins}
            title="Algorand x402 Billing"
            description="HTTP 402 payment protocol integration. Pay pennies for compute, AI prompts, and transient container sandboxes."
            backTitle="x402 Micro-Transactions"
            features={[
              "$0.01 per AI terminal completion",
              "$0.10 for 1-Hour PTY Session Pass",
              "Sub-second settlement on MainNet",
              "Fractional cent gas fees"
            ]}
          />
        </div>
      </section>

      {/* Algorand x402 Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto" id="x402">
        <LiquidGlassCard className="text-center py-16 px-8 agenta-glass-panel border-cyan-400/40">
          <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400 tracking-widest uppercase mb-3 block">ALGORAND x402 PROTOCOL NATIVE</span>
          <h2 className="text-4xl font-extrabold font-heading text-slate-900 dark:text-white mb-4">Pay-Per-Request Micro-Compute Settlement</h2>
          <p className="text-slate-600 dark:text-slate-400 text-base max-w-2xl mx-auto mb-12 leading-relaxed">
            Traditional cloud IDEs force $20/month subscriptions. Helix Box uses <strong className="text-slate-900 dark:text-white">Algorand x402 (HTTP 402 Payment Required)</strong> to let developers and autonomous AI agents pay per command execution on-chain.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="font-mono text-xs text-purple-600 dark:text-purple-400 font-bold mb-2">01</div>
              <h4 className="font-heading font-bold text-slate-900 dark:text-white mb-2">Request API</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Client sends request to terminal or AI assist endpoint.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="font-mono text-xs text-purple-600 dark:text-purple-400 font-bold mb-2">02</div>
              <h4 className="font-heading font-bold text-slate-900 dark:text-white mb-2">HTTP 402 Challenge</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Manager returns <code className="text-cyan-600 dark:text-cyan-300">X-PAYMENT-REQUEST</code> header with USDC price & nonce.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="font-mono text-xs text-purple-600 dark:text-purple-400 font-bold mb-2">03</div>
              <h4 className="font-heading font-bold text-slate-900 dark:text-white mb-2">Algorand Settlement</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Client signs & broadcasts transaction on MainNet in &lt; 1s.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="font-mono text-xs text-purple-600 dark:text-purple-400 font-bold mb-2">04</div>
              <h4 className="font-heading font-bold text-slate-900 dark:text-white mb-2">Fulfillment</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Manager verifies proof & executes PTY command or AI prompt.</p>
            </div>
          </div>
        </LiquidGlassCard>
      </section>

      {/* Agenta Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 px-6 bg-white dark:bg-[#07090e] transition-colors duration-300">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="font-heading font-extrabold text-xl text-slate-900 dark:text-white mb-1">
              Helix<span className="text-cyan-500 dark:text-cyan-400">Box</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Built for OpenAI Build Week & Algorand x402 Challenge.</p>
          </div>
          <div className="flex items-center gap-6 text-xs text-slate-600 dark:text-slate-400">
            <span>Helix-Crew: Hemanth Peddada, Hemanth Bandi, Asif</span>
            <a href="https://github.com/devndesigner6/helix-box" target="_blank" rel="noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
