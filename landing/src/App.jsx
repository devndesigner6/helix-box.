import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Spotlight } from './components/Spotlight';
import { CardFlip } from './components/CardFlip';
import { LiquidGlassCard } from './components/LiquidGlassCard';
import { TerminalShowcase } from './components/TerminalShowcase';
import { 
  Lock, 
  Terminal, 
  Coins, 
  Trophy, 
  Smartphone, 
  Copy, 
  Check, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  Sparkles,
  Layers,
  Code,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  const [copied, setCopied] = useState(false);

  const copyCommand = () => {
    navigator.clipboard.writeText('npx helixbox-cli -n');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen bg-gray-950 text-gray-100 overflow-hidden font-sans selection:bg-purple-500 selection:text-white">
      {/* Background Mesh Grid & Spotlight */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#8b5cf6" />
      
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[140px] animate-pulse-glow" />
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative z-10 pt-40 pb-20 px-6 max-w-6xl mx-auto text-center">
        {/* OpenAI Winner Badge */}
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-panel border-purple-500/40 text-xs font-semibold text-gray-300 mb-8 shadow-xl hover:border-purple-500/80 transition-all cursor-pointer">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>OpenAI Build Week Hyderabad — <strong className="text-white">Best Presentation Award</strong></span>
          <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold font-heading tracking-tight leading-[1.1] mb-6">
          Build, run & debug directly from your <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">smartphone.</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-10">
          The mobile-first Web/Native IDE & interactive PTY terminal emulator. Pair your local PC environment with mobile devices via zero-trust, E2E encrypted relays and Algorand x402 micro-compute.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-5 mb-12">
          <a
            href="https://github.com/devndesigner6/helix-box/releases/latest/download/helix-boxv1.apk"
            className="flex items-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-8 py-4 rounded-2xl border border-white/20 shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:scale-105 transition-all text-left"
          >
            <Smartphone className="w-6 h-6 shrink-0" />
            <div>
              <div className="text-base leading-none mb-1">Download for Android</div>
              <div className="text-xs font-normal opacity-80">Latest Standalone APK (helix-boxv1.apk)</div>
            </div>
          </a>

          <div className="flex items-center gap-3 px-6 py-4 rounded-2xl glass-panel font-mono text-sm border-white/20 shadow-xl">
            <span className="text-cyan-400 font-bold">$</span>
            <code className="text-gray-200">npx helixbox-cli -n</code>
            <button 
              onClick={copyCommand}
              className="ml-2 text-gray-400 hover:text-purple-400 transition-colors p-1"
              title="Copy Command"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Sub-Badges */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-xs font-medium text-gray-500 mb-12">
          <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-cyan-400" /> E2E Encrypted</div>
          <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-cyan-400" /> &lt; 1s Algorand x402 Settlement</div>
          <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-cyan-400" /> iOS Version Coming Soon</div>
        </div>

        {/* Terminal Window Mockup */}
        <TerminalShowcase />
      </section>

      {/* Features Grid — KokonutUI 3D Card Flips */}
      <section className="relative z-10 py-24 px-6 max-w-6xl mx-auto" id="features">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-xs font-bold text-cyan-400 tracking-widest uppercase">ENGINEERED FOR SPEED</span>
          <h2 className="text-4xl font-extrabold font-heading text-white mt-2 mb-4">Next-Gen Mobile Developer Experience</h2>
          <p className="text-gray-400 text-base">Combining zero-trust proxy infrastructure, mobile PTY terminal rendering, and Algorand micro-billing.</p>
        </div>

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
      <section className="relative z-10 py-20 px-6 max-w-6xl mx-auto" id="x402">
        <LiquidGlassCard className="text-center py-16 px-8 border-cyan-500/30">
          <span className="font-mono text-xs font-bold text-cyan-400 tracking-widest uppercase mb-3 block">ALGORAND x402 PROTOCOL NATIVE</span>
          <h2 className="text-4xl font-extrabold font-heading text-white mb-4">Pay-Per-Request Micro-Compute Settlement</h2>
          <p className="text-gray-400 text-base max-w-2xl mx-auto mb-12 leading-relaxed">
            Traditional cloud IDEs force $20/month subscriptions. Helix Box uses <strong className="text-white">Algorand x402 (HTTP 402 Payment Required)</strong> to let developers and autonomous AI agents pay per command execution on-chain.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="p-6 rounded-xl glass-panel border-white/10">
              <div className="font-mono text-xs text-purple-400 font-bold mb-2">01</div>
              <h4 className="font-heading font-bold text-white mb-2">Request API</h4>
              <p className="text-xs text-gray-400">Client sends request to terminal or AI assist endpoint.</p>
            </div>
            <div className="p-6 rounded-xl glass-panel border-white/10">
              <div className="font-mono text-xs text-purple-400 font-bold mb-2">02</div>
              <h4 className="font-heading font-bold text-white mb-2">HTTP 402 Challenge</h4>
              <p className="text-xs text-gray-400">Manager returns <code className="text-cyan-300">X-PAYMENT-REQUEST</code> header with USDC price & nonce.</p>
            </div>
            <div className="p-6 rounded-xl glass-panel border-white/10">
              <div className="font-mono text-xs text-purple-400 font-bold mb-2">03</div>
              <h4 className="font-heading font-bold text-white mb-2">Algorand Settlement</h4>
              <p className="text-xs text-gray-400">Client signs & broadcasts transaction on MainNet in &lt; 1s.</p>
            </div>
            <div className="p-6 rounded-xl glass-panel border-white/10">
              <div className="font-mono text-xs text-purple-400 font-bold mb-2">04</div>
              <h4 className="font-heading font-bold text-white mb-2">Fulfillment</h4>
              <p className="text-xs text-gray-400">Manager verifies proof & executes PTY command or AI prompt.</p>
            </div>
          </div>
        </LiquidGlassCard>
      </section>

      {/* Download CTA Banner */}
      <section className="relative z-10 py-20 px-6 max-w-4xl mx-auto text-center">
        <div className="glass-panel p-12 rounded-3xl border-purple-500/40 bg-gradient-to-br from-purple-900/30 to-cyan-900/30 shadow-[0_0_50px_rgba(139,92,246,0.3)]">
          <h2 className="text-3xl font-extrabold font-heading text-white mb-4">Ready to control your terminal from anywhere?</h2>
          <p className="text-gray-300 text-sm max-w-lg mx-auto mb-8">Download the official Helix Box standalone Android APK or run our CLI tool in 5 seconds.</p>
          
          <div className="flex flex-wrap items-center justify-center gap-5">
            <a
              href="https://github.com/devndesigner6/helix-box/releases/latest/download/helix-boxv1.apk"
              className="flex items-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-8 py-4 rounded-2xl border border-white/20 shadow-xl hover:scale-105 transition-all"
            >
              <Smartphone className="w-5 h-5" />
              <span>Download APK (helix-boxv1.apk)</span>
            </a>
            <a
              href="https://github.com/devndesigner6/helix-box"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-2xl border border-white/20 shadow-xl hover:scale-105 transition-all"
            >
              <Code className="w-5 h-5" />
              <span>Star on GitHub</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12 px-6 bg-gray-950/90 text-sm text-gray-500">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="font-heading font-extrabold text-lg text-white mb-1">Helix<span className="text-cyan-400">Box</span></div>
            <p className="text-xs text-gray-500">Built for OpenAI Build Week & Algorand x402 Challenge.</p>
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-400">
            <span>Helix-Crew: Hemanth Peddada, Hemanth Bandi, Asif</span>
            <a href="https://github.com/devndesigner6/helix-box" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
