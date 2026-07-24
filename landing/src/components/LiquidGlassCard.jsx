import React from 'react';

export const LiquidGlassCard = ({ children, className = '' }) => {
  return (
    <div className={`relative group overflow-hidden rounded-2xl p-8 glass-panel liquid-glass-shadow transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/40 ${className}`}>
      {/* Specular Glare Highlight Overlay */}
      <div className="pointer-events-none absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shine" />
      {children}
    </div>
  );
};
