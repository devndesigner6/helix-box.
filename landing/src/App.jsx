import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { CardFlip } from './components/CardFlip';
import { LiquidGlassCard } from './components/LiquidGlassCard';
import { TerminalShowcase } from './components/TerminalShowcase';
import { ParticleButton } from './components/ParticleButton';
import { CardStack } from './components/CardStack';
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
  ArrowRight,
  Plus,
  Minus,
  CheckCircle2,
  Twitter,
  Instagram,
  Home
} from 'lucide-react';

export default function App() {
  const [copied, setCopied] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);
  const [activeTab, setActiveTab] = useState('Most Popular');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const copyCommand = () => {
    navigator.clipboard.writeText('npx helixbox-cli -n');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  const marqueeRow1 = [
    "AI-Powered Mobile IDE",
    "Code on Your Phone",
    "Run on Your Machine",
    "Rust PTY Engine",
    "Zero-Trust WebSockets",
    "Algorand x402 Micropayments",
    "24fps Cell Grid Rendering",
    "Mobile Web/Native Client"
  ];

  const marqueeRow2 = [
    "Git Integration",
    "Built-in File Editor",
    "Process Management",
    "System Resource Monitor",
    "Dual-Channel Relays",
    "QR Code Pairing",
    "Ephemeral Nonce Auth",
    "Open Source Software"
  ];

  const categories = [
    "Most Popular", 
    "Mobile Terminal", 
    "CLI Bridge", 
    "Rust PTY", 
    "Cloud Sandboxes", 
    "Security", 
    "Open Source"
  ];

  const useCases = [
    {
      category: "Mobile Terminal",
      title: "Rust-Powered PTY Terminal",
      description: "Real PTY sessions via WezTerm cell grid with 24fps incremental diff rendering and sub-second input latency on mobile.",
      time: "Instant"
    },
    {
      category: "CLI Bridge",
      title: "Local Machine Gateway",
      description: "Node.js CLI bridges your local environment to the mobile app via WebSocket. Spawns processes, monitors system resources, and executes git commands.",
      time: "Zero SSH"
    },
    {
      category: "File Operations",
      title: "Mobile Code Explorer & Editor",
      description: "Browse repository directory trees, edit source code with syntax highlighting, search files via ripgrep, and commit changes on mobile.",
      time: "Full IDE"
    },
    {
      category: "Micro-Billing",
      title: "Algorand x402 Protocol",
      description: "HTTP 402 payment required integration. Pay pennies for AI prompts and ephemeral container sandboxes settled on Algorand in under 1 second.",
      time: "< 1s Finality"
    },
    {
      category: "Security",
      title: "Zero-Trust Encrypted Relays",
      description: "Bun-based WebSocket relay server connects CLI and app securely with 6-character QR nonces without open firewall ports or VPN setup.",
      time: "TLS 1.3"
    },
    {
      category: "Developer Tools",
      title: "Git & Process Management",
      description: "Full git status, diff, commit, push, pull, background process management, and port scanning directly on your mobile device.",
      time: "Full Git"
    },
    {
      category: "AI Integration",
      title: "AI Terminal Assistant",
      description: "Interactive AI assistant trained to analyze terminal stack traces, write shell scripts, and debug build errors over stdin/stdout.",
      time: "Codex / LLM"
    },
    {
      category: "Open Source",
      title: "100% Open Source Ecosystem",
      description: "Entire mobile app (Expo/React Native), CLI bridge, Rust PTY engine, and Bun proxy manager are MIT licensed.",
      time: "MIT License"
    }
  ];

  const pricingTiers = [
    {
      name: "Helix Box Connect",
      price: "$0.00",
      period: "100% Free & Open Source",
      description: "Remotely connect your mobile device to your local PC without SSH configuration.",
      features: [
        "Local Machine CLI Pairing",
        "Rust WezTerm PTY Engine",
        "Mobile File Explorer & Editor",
        "Full Git Integration",
        "System Resource Monitoring",
        "Zero Port Forwarding"
      ],
      popular: false,
      cta: "Download APK"
    },
    {
      name: "x402 AI Assist",
      price: "$0.01",
      period: "per prompt completion",
      description: "Pay-per-request AI terminal code assistant settled natively on Algorand.",
      features: [
        "LLM Terminal Code Assistant",
        "Automatic Stack Trace Analysis",
        "Terminal Command Generation",
        "Sub-Second Algorand Settlement",
        "Priority Relay Bandwidth",
        "Multi-Tab Session Control",
        "Custom Shell Shortcuts",
        "Instant MainNet Verification"
      ],
      popular: true,
      cta: "Enable AI Assist"
    },
    {
      name: "Cloud Sandbox",
      price: "$0.25",
      period: "per container instance",
      description: "On-demand cloud Docker containers for running untrusted code and integration tests.",
      features: [
        "Isolated Docker Cloud Instance",
        "Full Root Terminal Access",
        "Unlimited Bandwidth",
        "Ephemeral Storage Workspace",
        "Algorand x402 Header Auth",
        "Sub-Second Sandbox Provisioning",
        "Secure TLS Encryption",
        "Direct CLI Stream",
        "Lifetime Open Source Access"
      ],
      popular: false,
      cta: "Spawn Sandbox"
    }
  ];

  const faqs = [
    {
      q: "What is Helix Box?",
      a: "Helix Box is an AI-powered mobile IDE and cloud development platform. It lets you code on your phone and run workloads on your local machine or in secure cloud sandboxes without dealing with complex SSH configuration."
    },
    {
      q: "How does the CLI bridge connect my PC to my phone?",
      a: "Run `npx helixbox-cli -n` on your local PC. The Node.js CLI connects to our Bun WebSocket proxy and outputs a QR code and 6-character key. Scan or type the key in the mobile app to pair your devices instantly."
    },
    {
      q: "Do I need to open firewall ports or set up a VPN?",
      a: "No! Helix Box uses zero-trust outbound WebSocket relays via Manager & Proxy servers. Your local machine never exposes open incoming firewall ports to the public internet."
    },
    {
      q: "What is Algorand x402 and how does micro-billing work?",
      a: "x402 is an HTTP 402 Payment Required standard. Instead of paying a $20/month subscription, Helix Box endpoints return payment challenges for $0.01 AI prompts or $0.25 Docker sandboxes settled on Algorand in under 1 second."
    },
    {
      q: "Where can I download the Android APK?",
      a: "Click the 'Download APK' particle button in the navigation bar or hero section. It downloads `helix-boxv1.apk` directly from our official GitHub releases."
    },
    {
      q: "Is Helix Box open source?",
      a: "Yes! The Expo/React Native mobile client (`app/`), Node.js CLI (`cli/`), Bun proxy manager (`manager/` & `proxy/`), and Rust PTY binary (`pty/`) are all open-source under the MIT license."
    }
  ];

  return (
    <div className="min-h-screen bg-[#ffffff] dark:bg-[#090a0f] text-slate-900 dark:text-slate-100 font-sans selection:bg-[#A8F1F7] selection:text-slate-900 transition-colors duration-300">
      
      <Navbar />

      {/* 1. Hero Section — Agenta Template Layout & Greek Statue Branding */}
      <section className="pt-36 pb-16 px-6 max-w-6xl mx-auto text-center">
        
        {/* Agenta Dashed Border Pill Badge */}
        <div className="inline-flex items-center gap-2 mb-8">
          <span className="agenta-badge flex items-center gap-2">
            <img src="/helixbox.png" alt="Greek Statue" className="w-4 h-4 object-cover rounded-full" />
            <span>The Future of Mobile Engineering — <strong>Helix Box Mobile IDE</strong></span>
          </span>
        </div>

        {/* Agenta Dual-Line Heavy Sans Heading */}
        <h1 className="mb-6 max-w-4xl mx-auto">
          <span className="block font-heading font-black text-5xl sm:text-6xl md:text-7xl text-slate-900 dark:text-white tracking-tight leading-none mb-3">
            Code on your phone.
          </span>
          <span className="block font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl text-slate-600 dark:text-slate-300 tracking-tight leading-tight">
            Run on your machine.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          AI-powered mobile IDE and cloud development platform. Remotely use your local PC environment for coding without dealing with SSH configuration, paired via zero-trust relays and Algorand x402 micro-compute.
        </p>

        {/* KokonutUI Particle Button + Dashed Outline Copy Button */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <ParticleButton href="https://github.com/devndesigner6/helix-box/releases/latest/download/helix-boxv1.apk">
            Download APK
          </ParticleButton>

          <button
            onClick={copyCommand}
            className="agenta-dashed-btn flex items-center gap-3 text-sm font-mono"
          >
            <span className="text-cyan-500 font-bold">$</span>
            <span>npx helixbox-cli -n</span>
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* 2. Infinite 2-Row Marquee Banner */}
        <div className="relative w-full overflow-hidden no-scrollbar py-4 border-y border-slate-200/80 dark:border-slate-800/80 mb-20 space-y-3">
          {/* Marquee Row 1 */}
          <div className="flex w-[200%] animate-marquee gap-4">
            {marqueeRow1.concat(marqueeRow1).map((item, idx) => (
              <span 
                key={idx} 
                className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 shrink-0"
              >
                {item}
              </span>
            ))}
          </div>

          {/* Marquee Row 2 */}
          <div className="flex w-[200%] animate-marquee gap-4" style={{ animationDirection: 'reverse' }}>
            {marqueeRow2.concat(marqueeRow2).map((item, idx) => (
              <span 
                key={idx} 
                className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 shrink-0"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* KokonutUI Card Stack Showcase */}
        <CardStack />

        {/* Agenta Giant Rounded Hero Showcase Frame */}
        <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden p-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl mt-12">
          <div className="rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800/60">
            <TerminalShowcase />
          </div>
        </div>

      </section>

      {/* 4. Bento Grid / Discover Capabilities Section */}
      <section className="py-24 px-6 max-w-6xl mx-auto" id="features">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400 tracking-widest uppercase">DISCOVER CAPABILITIES</span>
          <h2 className="text-4xl font-extrabold font-heading text-slate-900 dark:text-white mt-2 mb-4">Mobile IDE Architecture</h2>
          <p className="text-slate-600 dark:text-slate-400 text-base">Combining zero-trust proxy relays, Rust PTY terminal rendering, and Algorand micro-billing.</p>
        </div>

        {/* Bento Grid Top Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="agenta-card p-6 flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <Twitter className="w-5 h-5 text-sky-500" />
              <span className="font-bold text-sm">Twitter</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="agenta-card p-6 flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <Instagram className="w-5 h-5 text-pink-500" />
              <span className="font-bold text-sm">Instagram</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
          <a href="https://helixbox.xyz" target="_blank" rel="noreferrer" className="md:col-span-2 agenta-card p-6 flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <Home className="w-5 h-5 text-cyan-500" />
              <span className="font-bold text-sm">Helix Box Production URL</span>
            </div>
            <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400">helixbox.xyz ↗</span>
          </a>
        </div>

        {/* Bento Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <CardFlip 
            icon={Lock}
            title="Zero-Trust E2E Relays"
            description="No open firewall ports or static IP addresses required. Session pairs securely over encrypted Bun WebSocket relays."
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
            title="Rust PTY Engine"
            description="Real PTY sessions via WezTerm cell grid with 24fps incremental diff rendering and sub-second input latency on mobile."
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

      {/* 5. Agenta "How It Works" Section */}
      <section className="py-24 px-6 max-w-6xl mx-auto border-t border-slate-200 dark:border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400 tracking-widest uppercase">AUGMENT IN MINUTES</span>
          <h2 className="text-4xl font-extrabold font-heading text-slate-900 dark:text-white mt-2 mb-4">How it works</h2>
          <p className="text-slate-600 dark:text-slate-400 text-base">Three simple steps to pair your mobile phone with your local PC terminal.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="agenta-card p-8 flex flex-col justify-between">
            <div>
              <div className="font-mono text-sm font-bold text-cyan-600 dark:text-cyan-400 mb-3">01 Terminal Calibration</div>
              <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-3">Launch CLI Bridge</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">Run `npx helixbox-cli -n` on your PC. Generates an ephemeral QR code and 6-character session key.</p>
            </div>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Automated QR Code Generation</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Ephemeral 6-Char Nonce Auth</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Zero Firewall Setup Required</li>
            </ul>
          </div>

          <div className="agenta-card p-8 flex flex-col justify-between">
            <div>
              <div className="font-mono text-sm font-bold text-cyan-600 dark:text-cyan-400 mb-3">02 Augment Capabilities</div>
              <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-3">Mobile Terminal Sync</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">Scan QR or type code in the mobile app. Instant PTY terminal emulator & live stdout stream on mobile.</p>
            </div>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Rust 24fps WezTerm Rendering</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Multi-Tab Session Control</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Integrated File Explorer & Editor</li>
            </ul>
          </div>

          <div className="agenta-card p-8 flex flex-col justify-between">
            <div>
              <div className="font-mono text-sm font-bold text-cyan-600 dark:text-cyan-400 mb-3">03 Sync & Evolve</div>
              <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-3">x402 On-Chain Billing</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">Pay pennies for AI prompt assistance and ephemeral container sandboxes settled natively on Algorand.</p>
            </div>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> HTTP 402 Payment Header</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Sub-Second MainNet Finality</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Fractional Cent Transaction Fees</li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-12">
          <a href="https://github.com/devndesigner6/helix-box/releases/latest/download/helix-boxv1.apk" className="agenta-dashed-btn inline-block">
            Ready to code? Download Helix Box APK
          </a>
        </div>
      </section>

      {/* 6. Agenta Use Cases Grid Section (8 Cards) */}
      <section className="py-24 px-6 max-w-6xl mx-auto border-t border-slate-200 dark:border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400 tracking-widest uppercase">USE CASES</span>
          <h2 className="text-4xl font-extrabold font-heading text-slate-900 dark:text-white mt-2 mb-4">Enhance every aspect of development</h2>
          <p className="text-slate-600 dark:text-slate-400 text-base">Discover how Helix Box transforms mobile developer workflows across all domains.</p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeTab === cat
                  ? 'bg-[#A8F1F7] text-slate-950 font-bold shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {useCases.map((uc, idx) => (
            <div key={idx} className="agenta-card p-6 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#A8F1F7]/30 text-slate-800 dark:text-cyan-300">
                    {uc.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{uc.time}</span>
                </div>
                <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  {uc.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {uc.description}
                </p>
              </div>
              <div className="flex items-center text-xs font-medium text-cyan-600 dark:text-cyan-400 gap-1 group-hover:translate-x-1 transition-transform">
                <span>Learn more</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a href="https://github.com/devndesigner6/helix-box" target="_blank" rel="noreferrer" className="text-xs text-slate-500 dark:text-slate-400 underline hover:text-cyan-500 transition-colors">
            Want custom features? View Helix Box on GitHub
          </a>
        </div>
      </section>

      {/* 7. Agenta Enhancement Plans / Pricing Section */}
      <section className="py-24 px-6 max-w-6xl mx-auto border-t border-slate-200 dark:border-slate-800" id="pricing">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400 tracking-widest uppercase">ENHANCEMENT PLANS</span>
          <h2 className="text-4xl font-extrabold font-heading text-slate-900 dark:text-white mt-2 mb-4">Algorand x402 Micro-Billing</h2>
          <p className="text-slate-600 dark:text-slate-400 text-base">Select your micropayment tier. No subscriptions required — pay per request on Algorand.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, idx) => (
            <div key={idx} className={`agenta-card p-8 flex flex-col justify-between relative ${tier.popular ? 'border-[#A8F1F7] shadow-xl' : ''}`}>
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#A8F1F7] text-slate-950 font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                  Most Popular
                </div>
              )}
              <div>
                <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-4xl font-extrabold font-heading text-slate-900 dark:text-white">{tier.price}</span>
                  <span className="text-xs text-slate-500">{tier.period}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">{tier.description}</p>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((f, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <a href="https://github.com/devndesigner6/helix-box/releases/latest/download/helix-boxv1.apk" className={tier.popular ? "agenta-primary-btn text-sm w-full py-3 text-center block" : "agenta-dashed-btn text-sm w-full py-3 text-center block"}>
                {tier.cta}
              </a>
            </div>
          ))}
        </div>

        <div className="text-center mt-10 space-y-2">
          <p className="text-xs text-slate-500">All micropayments settled on Algorand MainNet/TestNet in under 1 second.</p>
          <p><a href="https://github.com/devndesigner6/helix-box" target="_blank" rel="noreferrer" className="text-xs text-slate-500 underline hover:text-cyan-500 transition-colors">Read Algorand x402 Global Challenge Integration Blueprint</a></p>
        </div>
      </section>

      {/* 8. Agenta FAQ Accordion Section */}
      <section className="py-24 px-6 max-w-4xl mx-auto border-t border-slate-200 dark:border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400 tracking-widest uppercase">FAQ</span>
          <h2 className="text-4xl font-extrabold font-heading text-slate-900 dark:text-white mt-2 mb-4">Frequently asked questions</h2>
          <a href="https://github.com/devndesigner6/helix-box/issues" target="_blank" rel="noreferrer" className="text-xs text-slate-500 underline hover:text-cyan-500 transition-colors">Can't find the answer you're looking for? Get in touch on GitHub</a>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="agenta-card p-6 cursor-pointer transition-colors"
              onClick={() => setActiveFaq(activeFaq === idx ? -1 : idx)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs font-bold text-cyan-500">00{idx + 1}</span>
                  <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">{faq.q}</h3>
                </div>
                {activeFaq === idx ? <Minus className="w-4 h-4 text-cyan-500" /> : <Plus className="w-4 h-4 text-slate-400" />}
              </div>
              {activeFaq === idx && (
                <p className="mt-4 pl-10 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 9. Agenta Footer Section */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-16 px-6 bg-white dark:bg-[#07090e] transition-colors duration-300">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <img src="/helixbox.png" alt="Greek Statue" className="w-8 h-8 object-cover rounded-lg" />
              <span className="font-heading font-black text-2xl text-slate-900 dark:text-white">
                Helix<span className="text-cyan-500">Box</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed mb-6">
              AI-powered mobile IDE and cloud development platform. Code on your phone, run on your machine or in secure cloud sandboxes.
            </p>
            
            {/* Newsletter Subscription Input */}
            <form onSubmit={handleSubscribe} className="max-w-sm mb-6">
              <div className="text-xs font-bold text-slate-900 dark:text-white mb-2">Join the evolution</div>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs w-full focus:outline-none focus:border-[#A8F1F7]"
                  required
                />
                <button type="submit" className="agenta-primary-btn px-4 py-2.5 text-xs shrink-0">
                  {subscribed ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5">Open Source Software under MIT License</p>
            </form>
          </div>

          <div>
            <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white mb-4">Architecture</h4>
            <ul className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
              <li><a href="#features" className="hover:text-cyan-500 transition-colors">Rust PTY Engine</a></li>
              <li><a href="#features" className="hover:text-cyan-500 transition-colors">Zero-Trust Relays</a></li>
              <li><a href="#pricing" className="hover:text-cyan-500 transition-colors">Algorand x402 Protocol</a></li>
              <li><a href="https://github.com/devndesigner6/helix-box" target="_blank" rel="noreferrer" className="hover:text-cyan-500 transition-colors">GitHub Releases</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white mb-4">Helix-Crew Team</h4>
            <ul className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
              <li><span>Hemanth Peddada</span></li>
              <li><span>Hemanth Bandi</span></li>
              <li><span>Asif</span></li>
            </ul>
          </div>

        </div>

        <div className="max-w-6xl mx-auto pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Helix Box. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="https://github.com/devndesigner6/helix-box" target="_blank" rel="noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms</a>
            <a href="https://github.com/devndesigner6/helix-box" target="_blank" rel="noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy</a>
            <a href="https://github.com/devndesigner6/helix-box" target="_blank" rel="noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
