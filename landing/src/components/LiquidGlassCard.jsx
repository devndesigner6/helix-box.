import React from 'react';

const GLASS_SHADOW_LIGHT =
  "shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)]";

const GLASS_SHADOW_DARK =
  "dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]";

const GLASS_SHADOW = `${GLASS_SHADOW_LIGHT} ${GLASS_SHADOW_DARK}`;

const GlassFilter = React.memo(({ id, scale = 30 }) => (
  <svg aria-hidden="true" className="hidden" focusable={false}>
    <title>Glass Effect Filter</title>
    <defs>
      <filter
        colorInterpolationFilters="sRGB"
        height="200%"
        id={id}
        width="200%"
        x="-50%"
        y="-50%"
      >
        <feTurbulence
          baseFrequency="0.05 0.05"
          numOctaves="1"
          result="turbulence"
          seed="1"
          type="fractalNoise"
        />
        <feGaussianBlur
          in="turbulence"
          result="blurredNoise"
          stdDeviation="2"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="blurredNoise"
          result="displaced"
          scale={scale}
          xChannelSelector="R"
          yChannelSelector="B"
        />
        <feGaussianBlur in="displaced" result="finalBlur" stdDeviation="4" />
        <feComposite in="finalBlur" in2="finalBlur" operator="over" />
      </filter>
    </defs>
  </svg>
));
GlassFilter.displayName = "GlassFilter";

export function LiquidGlassCard({ className = '', children, ...props }) {
  const filterId = React.useId();

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-8 backdrop-blur-[2px] ${className}`}
      {...props}
    >
      <div className={`pointer-events-none absolute inset-0 rounded-[inherit] ${GLASS_SHADOW}`} />

      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[inherit]"
        style={{ backdropFilter: `url("#${filterId}")` }}
      />
      <GlassFilter id={filterId} scale={30} />

      <div className="relative z-10">{children}</div>

      <div className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] bg-gradient-to-r from-transparent via-black/5 to-transparent opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100 dark:via-white/5" />
    </div>
  );
}

export function LiquidButton({ className = '', children, ...props }) {
  const filterId = React.useId();

  return (
    <>
      <button
        className={`relative transition-transform duration-200 active:scale-[0.97] hover:scale-105 px-6 py-3 rounded-full text-slate-900 font-semibold bg-[#A8F1F7] ${className}`}
        {...props}
      >
        <div className={`pointer-events-none absolute inset-0 rounded-[inherit] ${GLASS_SHADOW}`} />
        <div
          className="pointer-events-none absolute inset-0 isolate -z-10 overflow-hidden rounded-[inherit]"
          style={{ backdropFilter: `url("#${filterId}")` }}
        />
        <span className="relative z-10">{children}</span>
      </button>
      <GlassFilter id={filterId} scale={70} />
    </>
  );
}
