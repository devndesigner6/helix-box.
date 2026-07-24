import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCw, Check } from 'lucide-react';

export const CardFlip = ({ icon: Icon, title, description, backTitle, features }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="perspective-1000 h-[320px] w-full cursor-pointer"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full transform-style-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
      >
        {/* Front Face */}
        <div className="absolute inset-0 backface-hidden rounded-2xl p-8 flex flex-col justify-between glass-panel liquid-glass-shadow hover:border-purple-500/50 transition-colors">
          <div className="flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold font-heading text-white">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Hover to flip details</span>
            <RotateCw className="w-3 h-3 text-purple-400" />
          </div>
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl p-8 flex flex-col justify-between bg-gray-900/95 border border-purple-500/60 shadow-2xl">
          <div>
            <h4 className="text-lg font-bold text-cyan-400 mb-4 font-heading">{backTitle}</h4>
            <ul className="space-y-3">
              {features.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
