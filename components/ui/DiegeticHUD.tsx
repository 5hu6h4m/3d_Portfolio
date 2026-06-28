'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROJECTS, CHAPTERS, SKILLS, THREATS, MISSIONS } from '../../lib/data';
import { Compass, FileText, Map, ShieldAlert, Trophy, Volume2, VolumeX, Eye } from 'lucide-react';

interface DiegeticHUDProps {
  scrollProgress: number;
  activeChapter: number;
  isMuted: boolean;
  toggleMute: () => void;
  playInteraction: (type: 'chakra' | 'pulse' | 'sword' | 'lightning') => void;
  scrollToProgress: (progress: number) => void;
}

export function DiegeticHUD({
  scrollProgress,
  activeChapter,
  isMuted,
  toggleMute,
  playInteraction,
  scrollToProgress
}: DiegeticHUDProps) {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showWorldMap, setShowWorldMap] = useState(false);

  // Rotation value for the 3D compass pointing towards Sunset Monument
  const compassRotation = scrollProgress * 360;

  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex flex-col justify-between p-6 select-none">
      
      {/* ================= TOP PANEL: STATUS & COMPASS ================= */}
      <div className="w-full flex justify-between items-start pointer-events-auto">
        {/* Shinobi Stats Panel (Life bar / Chakra gauges) */}
        <div className="flex flex-col gap-2 p-4 bg-slate-950/80 border border-slate-800 rounded-md backdrop-blur-md text-white max-w-xs">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-orange-400">SHINOBI ID:</span>
            <span className="text-slate-300 font-bold">ROSHAN BHAGAT</span>
          </div>
          {/* Health Bar (Representing HP/Scroll completion) */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-emerald-400 w-6">HP:</span>
            <div className="h-2 flex-grow bg-slate-800 rounded-sm overflow-hidden border border-slate-700">
              <motion.div 
                className="h-full bg-emerald-500" 
                style={{ width: `${Math.max(10, (1 - scrollProgress) * 100)}%` }}
              />
            </div>
          </div>
          {/* Chakra Bar (Representing skill release levels) */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-cyan-400 w-6">CHA:</span>
            <div className="h-2 flex-grow bg-slate-800 rounded-sm overflow-hidden border border-slate-700">
              <motion.div 
                className="h-full bg-cyan-400" 
                style={{ width: `${scrollProgress * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Dynamic Compass & Map Trigger */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              playInteraction('pulse');
              setShowWorldMap(prev => !prev);
            }}
            className="p-3 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 rounded-full text-orange-400 hover:text-orange-300 backdrop-blur-md transition-all shadow-lg"
          >
            <Map className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col items-center p-3 bg-slate-950/80 border border-slate-800 rounded-md backdrop-blur-md text-slate-300">
            <motion.div style={{ rotate: compassRotation }}>
              <Compass className="w-8 h-8 text-orange-500" />
            </motion.div>
            <span className="text-[9px] font-mono mt-1 text-slate-400">SUNSET DEPTH</span>
          </div>
        </div>
      </div>

      {/* ================= MIDDLE PANEL: STORYLINE HUD OVERLAYS ================= */}
      <div className="flex-grow flex items-center justify-center pointer-events-none px-4 py-8">
        <AnimatePresence>
          {/* Display Thematic text inside the cinematic bounds */}
          {activeChapter && (
            <motion.div 
              key={activeChapter}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="text-center bg-slate-950/65 border border-slate-800/40 rounded-lg p-6 max-w-lg backdrop-blur-sm pointer-events-auto"
            >
              <h2 className="text-2xl font-black text-orange-500 uppercase tracking-widest font-serif">
                {CHAPTERS[activeChapter - 1]?.title}
              </h2>
              <p className="text-xs font-mono text-slate-300 mt-2 italic">
                {CHAPTERS[activeChapter - 1]?.subtitle}
              </p>
              
              {/* Context-aware chapter overlays */}
              {activeChapter === 1 && (
                <p className="text-sm text-slate-400 mt-4 leading-relaxed font-sans">
                  {"\"Every shinobi starts their path in complete obscurity. Roshan Bhagat, a national ranking builder, launches their engineering journey inside the Hidden Robotics Village.\""}
                </p>
              )}
              {activeChapter === 2 && (
                <p className="text-sm text-slate-400 mt-4 leading-relaxed font-sans">
                  {"\"Step inside the academy. Serving as Vice President of the MET E-Cell, Roshan designs entrepreneur modules and coordinates massive hacking tournaments.\""}
                </p>
              )}
              {activeChapter === 3 && (
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {SKILLS.map((s, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                      {s.name} ({s.chakraNature})
                    </span>
                  ))}
                </div>
              )}
              {activeChapter === 4 && (
                <div className="mt-4 flex flex-col gap-2">
                  <p className="text-xs text-slate-400 font-mono mb-2">CLICK PILLARS IN 3D TO REVIEW PROJECTS</p>
                  <div className="flex gap-2 justify-center">
                    {PROJECTS.map((p, i) => (
                      <button 
                        key={i}
                        onClick={() => {
                          playInteraction('sword');
                          setSelectedProject(p);
                        }}
                        className="px-3 py-1.5 rounded bg-orange-950/60 border border-orange-500/40 text-orange-300 text-xs font-mono hover:bg-orange-900/60 transition-all"
                      >
                        {p.symbolicTeammate}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {activeChapter === 5 && (
                <div className="mt-4 flex flex-col gap-3 text-left">
                  <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider text-center">ROGUE THREAT REGISTRY (FAILURES)</p>
                  {THREATS.map((t, i) => (
                    <div key={i} className="p-2 bg-red-950/20 border border-red-500/20 rounded">
                      <p className="text-xs text-red-300 font-mono font-bold">{t.name} (Rival: {t.symbolicEnemy})</p>
                      <p className="text-[11px] text-slate-400 mt-1">{t.description}</p>
                    </div>
                  ))}
                </div>
              )}
              {activeChapter === 6 && (
                <div className="mt-4 text-center">
                  <div className="inline-block p-1 bg-orange-500/20 border border-orange-500 rounded-full animate-ping absolute w-4 h-4" />
                  <p className="text-xs text-orange-400 font-mono font-bold tracking-widest">SAGE MODE ACTIVE</p>
                  <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                    {"\"Behold the Autonomous Drone Navigation mapping suite. High precision spatial intelligence running on real-time hardware.\""}
                  </p>
                </div>
              )}
              {activeChapter === 7 && (
                <div className="mt-4 grid grid-cols-2 gap-2 text-left">
                  {MISSIONS.map((m, i) => (
                    <div key={i} className="p-2 bg-slate-900 border border-slate-800 rounded">
                      <p className="text-xs text-orange-400 font-mono">{m.rank}</p>
                      <p className="text-xs text-white font-bold font-mono">{m.title}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{m.description}</p>
                    </div>
                  ))}
                </div>
              )}
              {activeChapter === 8 && (
                <div className="mt-4 text-center">
                  <p className="text-xs text-slate-400 font-mono">SCROLL TO REACH THE SUNSET OR LEAP TO CONTACT SCROLL BELOW</p>
                  <button
                    onClick={() => {
                      playInteraction('lightning');
                      scrollToProgress(1.0);
                    }}
                    className="mt-3 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white rounded text-xs font-mono transition-all"
                  >
                    SUMMON MESSAGE SCROLL
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ================= BOTTOM PANEL: HUD KUNAI TRACKER & AUDIO ================= */}
      <div className="w-full flex justify-between items-end pointer-events-auto">
        {/* Audio Mute & Volume Control */}
        <button 
          onClick={() => {
            toggleMute();
            playInteraction('pulse');
          }}
          className="p-3 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 rounded-full text-white backdrop-blur-md transition-all shadow-lg"
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
        </button>

        {/* Diegetic Mission Scroll Project Viewer */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-slate-950/70 backdrop-blur-sm"
              onClick={() => setSelectedProject(null)}
            >
              <div 
                className="w-full max-w-lg p-6 bg-[#f7f3e9] border-[10px] border-[#8b5a2b] rounded-md shadow-2xl relative overflow-hidden"
                style={{
                  boxShadow: 'inset 0 0 40px rgba(139,90,43,0.3)',
                  backgroundImage: `radial-gradient(circle, transparent 20%, rgba(139,90,43,0.03) 90%)`
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Scroll Top Rolled Bar */}
                <div className="h-4 bg-[#8b5a2b] w-full rounded-t-sm absolute top-0 left-0" />
                
                {/* Scroll Content (Parchment Texture look) */}
                <div className="text-amber-950 font-serif my-4">
                  <div className="flex justify-between items-start border-b-2 border-amber-900/25 pb-2">
                    <div>
                      <span className="text-[10px] font-mono text-amber-900 uppercase font-bold tracking-widest">{selectedProject.rank} MISSION DETAIL</span>
                      <h3 className="text-xl font-bold font-serif">{selectedProject.title}</h3>
                    </div>
                    <span className="text-xs px-2 py-0.5 bg-amber-900/10 rounded font-mono text-amber-900">{selectedProject.symbolicTeammate}</span>
                  </div>
                  <p className="text-xs font-mono text-amber-900 italic mt-2">Symbolism: {selectedProject.symbolism}</p>
                  <p className="text-sm mt-4 leading-relaxed">{selectedProject.description}</p>
                  
                  <div className="mt-6 flex flex-wrap gap-2">
                    {selectedProject.tags.map((t: string, idx: number) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-amber-900/10 rounded border border-amber-900/15 font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedProject(null)}
                  className="mt-6 w-full py-2 bg-amber-900 hover:bg-amber-950 text-white rounded text-xs font-mono transition-all uppercase tracking-wider"
                >
                  Close Scroll
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interactive Mini World Map Dialog */}
        <AnimatePresence>
          {showWorldMap && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-slate-950/70 backdrop-blur-sm pointer-events-auto"
              onClick={() => setShowWorldMap(false)}
            >
              <div 
                className="w-full max-w-md p-6 bg-slate-900 border border-slate-800 rounded-lg text-white"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-mono text-orange-400 uppercase tracking-widest font-bold flex items-center gap-2">
                    <Map className="w-4 h-4" /> MAP OF THE HIDDEN ROBOTICS VILLAGE
                  </h3>
                  <button 
                    onClick={() => setShowWorldMap(false)}
                    className="text-slate-400 hover:text-white font-mono text-xs"
                  >
                    [X]
                  </button>
                </div>
                
                {/* Mini map locations navigation nodes */}
                <div className="mt-4 flex flex-col gap-2 font-mono text-xs">
                  {CHAPTERS.map((ch, idx) => {
                    const progress = idx / (CHAPTERS.length - 1);
                    return (
                      <button 
                        key={idx}
                        onClick={() => {
                          playInteraction('lightning');
                          scrollToProgress(progress);
                          setShowWorldMap(false);
                        }}
                        className={`flex justify-between items-center p-2 rounded transition-all ${activeChapter === idx + 1 ? 'bg-orange-500/20 border border-orange-500/60 text-white' : 'bg-slate-950/50 hover:bg-slate-800 border border-slate-900 text-slate-400'}`}
                      >
                        <span>Chapter 0{idx + 1}: {ch.title}</span>
                        <span className="text-[10px] text-slate-500">Z-Pos: {(-idx * 15).toFixed(0)}m</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Diegetic Kunai Progress Tracker */}
        <div className="flex flex-col items-center gap-1.5 p-3 bg-slate-950/80 border border-slate-800 rounded-md backdrop-blur-md">
          <div className="h-28 w-1.5 bg-slate-800 rounded-full relative overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 right-0 bg-orange-500 rounded-full"
              style={{ height: `${scrollProgress * 100}%` }}
            />
            {/* The virtual Kunai element sliding along progress */}
            <motion.div 
              className="absolute -left-1 text-[10px] font-mono text-orange-400 select-none cursor-pointer"
              style={{ top: `calc(${scrollProgress * 100}% - 8px)` }}
              title="Kunai Tracker"
            >
              📍
            </motion.div>
          </div>
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mt-1">KUNAI POS</span>
        </div>

      </div>

    </div>
  );
}
export default DiegeticHUD;
