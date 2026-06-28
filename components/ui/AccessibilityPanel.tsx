'use client';

import React from 'react';
import { Settings, Shield, Keyboard, EyeOff, CheckSquare } from 'lucide-react';

interface AccessibilityPanelProps {
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
  skipIntro: () => void;
}

export function AccessibilityPanel({
  reducedMotion,
  toggleReducedMotion,
  skipIntro
}: AccessibilityPanelProps) {
  return (
    <div className="fixed bottom-6 left-24 pointer-events-auto z-40 flex items-center gap-2 select-none">
      {/* Reduced Motion Toggle Button */}
      <button
        onClick={toggleReducedMotion}
        className={`px-3 py-1.5 border rounded text-[10px] font-mono transition-all flex items-center gap-1.5 backdrop-blur-md ${reducedMotion ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white'}`}
        title="Toggle Reduced Motion"
      >
        {reducedMotion ? <EyeOff className="w-3.5 h-3.5" /> : <Settings className="w-3.5 h-3.5" />}
        <span>{reducedMotion ? "REDUCED MOTION: ON" : "REDUCED MOTION: OFF"}</span>
      </button>

      {/* Skip Intro Button */}
      <button
        onClick={skipIntro}
        className="px-3 py-1.5 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 rounded text-[10px] font-mono text-slate-400 hover:text-white backdrop-blur-md transition-all flex items-center gap-1.5"
        title="Leap straight to Training Grounds"
      >
        <Shield className="w-3.5 h-3.5 text-orange-400" />
        <span>SKIP INTRO</span>
      </button>

      {/* Keyboard Controls Legend */}
      <div className="p-2 bg-slate-950/80 border border-slate-800 rounded text-[9px] font-mono text-slate-500 flex items-center gap-1.5 backdrop-blur-md">
        <Keyboard className="w-3.5 h-3.5 text-slate-400" />
        <span>SCROLL / MOUSEWHEEL TO TRAVEL</span>
      </div>
    </div>
  );
}
export default AccessibilityPanel;
