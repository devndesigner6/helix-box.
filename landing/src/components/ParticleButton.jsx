import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone } from 'lucide-react';

export const ParticleButton = ({ children, href, className = '' }) => {
  const [particles, setParticles] = useState([]);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newParticles = Array.from({ length: 14 }).map((_, i) => ({
      id: Date.now() + i,
      x,
      y,
      angle: (i * 360) / 14 + (Math.random() * 20 - 10),
      speed: Math.random() * 60 + 40,
      size: Math.random() * 6 + 4,
    }));

    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 800);
  };

  return (
    <div className="relative inline-block">
      <motion.a
        href={href}
        onClick={handleClick}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
        className={`relative z-10 agenta-primary-btn flex items-center gap-3 text-base font-bold shadow-lg cursor-pointer ${className}`}
      >
        <Smartphone className="w-5 h-5" />
        <span>{children}</span>
      </motion.a>

      {/* Particle Burst Canvas Overlay */}
      <div className="pointer-events-none absolute inset-0 z-20 overflow-visible">
        <AnimatePresence>
          {particles.map((p) => {
            const rad = (p.angle * Math.PI) / 180;
            const targetX = p.x + Math.cos(rad) * p.speed;
            const targetY = p.y + Math.sin(rad) * p.speed;

            return (
              <motion.span
                key={p.id}
                initial={{ x: p.x, y: p.y, opacity: 1, scale: 1 }}
                animate={{ x: targetX, y: targetY, opacity: 0, scale: 0.2 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="absolute rounded-full bg-[#A8F1F7] shadow-[0_0_8px_#A8F1F7]"
                style={{
                  width: p.size,
                  height: p.size,
                  left: 0,
                  top: 0,
                }}
              />
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
