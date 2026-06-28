'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LoaderProps {
  progress: number;
}

export function Loader({ progress }: LoaderProps) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center text-white pointer-events-none select-none">
      
      {/* Leaves scattering animation background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-orange-600 rounded-full w-2 h-4"
            initial={{ 
              x: Math.random() * 1200 - 600, 
              y: -50, 
              rotate: 0,
              opacity: 0 
            }}
            animate={{ 
              y: 800, 
              x: `calc(100vw * ${Math.random()} - 100px)`,
              rotate: 360,
              opacity: [0, 1, 1, 0]
            }}
            transition={{ 
              duration: 3 + Math.random() * 4, 
              repeat: Infinity,
              delay: Math.random() * 2 
            }}
          />
        ))}
      </div>

      {/* Eight Trigrams Seal Loading Wheel */}
      <div className="relative flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
          className="w-24 h-24 border-4 border-dashed border-orange-500 rounded-full opacity-60"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="w-16 h-16 border-2 border-dashed border-red-500 rounded-full absolute opacity-80"
        />
        <div className="absolute text-orange-400 font-bold text-xs font-mono">
          {progress.toFixed(0)}%
        </div>
      </div>

      {/* Cinematic Text Description */}
      <h1 className="mt-8 text-sm font-mono tracking-widest text-slate-400 uppercase">
        Charging Code Chakra
      </h1>
      <p className="text-[10px] font-mono text-slate-600 mt-2">
        VILLAGE GATES ARE MATERIALIZING...
      </p>

    </div>
  );
}
export default Loader;
