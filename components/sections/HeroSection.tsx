'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  scrollProgress: number;
}

// Falling leaf CSS animation injected once
const LEAF_STYLE = `
@keyframes leafFall {
  0%   { transform: translate(0, -20px) rotate(0deg);   opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 0.6; }
  100% { transform: translate(var(--dx), 110vh) rotate(var(--rot)); opacity: 0; }
}
.leaf {
  position: absolute;
  top: -30px;
  font-size: 18px;
  animation: leafFall var(--dur) linear infinite;
  animation-delay: var(--delay);
  left: var(--left);
  will-change: transform, opacity;
  pointer-events: none;
}
@keyframes scanline {
  0%   { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}
`;

function FallingLeaves() {
  const leaves = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    dur: `${6 + Math.random() * 8}s`,
    delay: `${Math.random() * 10}s`,
    dx: `${(Math.random() - 0.5) * 120}px`,
    rot: `${(Math.random() - 0.5) * 720}deg`,
  }));

  return (
    <>
      <style>{LEAF_STYLE}</style>
      {leaves.map(l => (
        <span
          key={l.id}
          className="leaf select-none"
          style={{
            '--left': l.left,
            '--dur': l.dur,
            '--delay': l.delay,
            '--dx': l.dx,
            '--rot': l.rot,
          } as React.CSSProperties}
        >
          🍂
        </span>
      ))}
    </>
  );
}

export function HeroSection({ scrollProgress }: HeroSectionProps) {
  // Fade out hero as user scrolls past 15%
  const heroOpacity = Math.max(0, 1 - scrollProgress * 8);
  const heroY = scrollProgress * -120;

  if (heroOpacity <= 0) return null;

  return (
    <div
      className="fixed inset-0 z-10 pointer-events-none overflow-hidden"
      style={{ opacity: heroOpacity, transform: `translateY(${heroY}px)` }}
    >
      {/* Falling leaves */}
      <FallingLeaves />

      {/* Horizontal scanline */}
      <div
        className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/30 to-transparent"
        style={{ top: '38%', animation: 'scanline 8s linear infinite' }}
      />

      {/* ======== REGISTRATION SCROLL (left panel) ======== */}
      <motion.div
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
        className="absolute top-1/2 left-8 -translate-y-1/2 pointer-events-auto"
        style={{ width: 'clamp(240px, 22vw, 320px)' }}
      >
        <div
          className="rounded-md border border-slate-700/60 bg-slate-950/80 backdrop-blur-md p-5 font-mono text-xs"
          style={{ boxShadow: '0 0 40px rgba(249,115,22,0.08), inset 0 0 30px rgba(0,0,0,0.6)' }}
        >
          {/* Header */}
          <p className="text-orange-500 uppercase tracking-[0.3em] font-bold text-[10px] mb-4 border-b border-slate-700/50 pb-2">
            ▌ Shinobi Registration File
          </p>

          {[
            { label: 'NAME',         value: 'ROSHAN BHAGAT',           color: '#f1f5f9' },
            { label: 'RANK',         value: 'SPECIAL JONIN (ENGINEER)', color: '#f97316' },
            { label: 'VILLAGE',      value: 'KAKURE GIJUTSU NO SATO',  color: '#f1f5f9' },
            { label: 'NATURE TYPES', value: 'FIRE · LIGHTNING · WIND', color: '#f97316' },
            { label: 'STATUS',       value: 'ACTIVE · MISSION READY',  color: '#22c55e' },
          ].map(row => (
            <div key={row.label} className="flex justify-between items-start gap-2 py-1.5 border-b border-slate-800/40 last:border-0">
              <span className="text-slate-500 shrink-0 text-[10px]">{row.label}</span>
              <span className="text-right text-[10px] font-bold" style={{ color: row.color }}>{row.value}</span>
            </div>
          ))}

          <p className="mt-4 text-slate-600 text-[9px] text-center tracking-widest uppercase">
            REGISTERED 2023 · MET INSTITUTE OF TECHNOLOGY<br />NASHIK, MAHARASHTRA, INDIA
          </p>
        </div>
      </motion.div>

      {/* ======== BIG NAME + TITLE (right / center panel) ======== */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, ease: 'easeOut', delay: 0.2 }}
        className="absolute top-1/2 right-0 -translate-y-1/2 pr-10 text-right"
        style={{ width: 'clamp(360px, 55vw, 780px)' }}
      >
        {/* Main name */}
        <h1
          className="font-black uppercase leading-[0.88] tracking-tight select-none"
          style={{
            fontSize: 'clamp(64px, 9vw, 128px)',
            fontFamily: "'Cinzel', 'Georgia', serif",
            background: 'linear-gradient(135deg, #ffffff 0%, #f97316 60%, #ef4444 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: 'none',
            filter: 'drop-shadow(0 0 40px rgba(249,115,22,0.35))',
          }}
        >
          ROSHAN<br />BHAGAT
        </h1>

        {/* Subtitle line */}
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.1em' }}
          animate={{ opacity: 1, letterSpacing: '0.3em' }}
          transition={{ duration: 1.6, delay: 0.8 }}
          className="text-orange-400/90 uppercase font-mono mt-3"
          style={{ fontSize: 'clamp(10px, 1.2vw, 15px)' }}
        >
          Automation &amp; Robotics Engineer
        </motion.p>

        {/* Sub-roles */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="flex flex-col gap-0.5 mt-1 items-end"
        >
          <p className="text-slate-400 font-mono uppercase tracking-[0.25em]" style={{ fontSize: 'clamp(8px, 0.9vw, 11px)' }}>
            Vice President, E-Cell MET
          </p>
          <p className="text-slate-400 font-mono uppercase tracking-[0.25em]" style={{ fontSize: 'clamp(8px, 0.9vw, 11px)' }}>
            Founder, RossInc Media House
          </p>
        </motion.div>

        {/* Badge pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="flex gap-3 mt-5 justify-end"
        >
          {[
            { icon: '🔥', label: 'ALL INDIA RANK 1' },
            { icon: '⚡', label: 'VICE PRESIDENT' },
          ].map(badge => (
            <span
              key={badge.label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-orange-500/40 bg-orange-950/30 text-orange-300 font-mono uppercase tracking-widest backdrop-blur-sm"
              style={{ fontSize: 'clamp(8px, 0.75vw, 10px)' }}
            >
              {badge.icon} {badge.label}
            </span>
          ))}
        </motion.div>

        {/* Kinetic skill marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="mt-6 overflow-hidden"
        >
          <div
            className="flex gap-6 text-slate-600 font-mono uppercase whitespace-nowrap"
            style={{
              fontSize: 'clamp(9px, 0.8vw, 11px)',
              animation: 'marqueeScroll 18s linear infinite',
            }}
          >
            {['ESP32', 'ROS2', 'GAZEBO', 'NAV2', 'PYTHON', 'OPENCV', 'YOLO', 'THREE.JS', 'NEXT.JS', 'PYTORCH', 'CUDA', 'SLAM',
              'ESP32', 'ROS2', 'GAZEBO', 'NAV2', 'PYTHON', 'OPENCV', 'YOLO', 'THREE.JS', 'NEXT.JS', 'PYTORCH', 'CUDA', 'SLAM'
            ].map((s, i) => (
              <span key={i} className="shrink-0">{s} <span className="text-orange-700">·</span></span>
            ))}
          </div>
          <style>{`
            @keyframes marqueeScroll {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
        </motion.div>

        {/* Begin journey CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.8 }}
          className="mt-6 flex flex-col items-end gap-1"
        >
          <p className="text-slate-500 font-mono uppercase tracking-[0.3em] text-[9px]">Begin The Journey</p>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="text-orange-500 text-lg"
          >
            ⌄⌄
          </motion.span>
        </motion.div>
      </motion.div>
    </div>
  );
}
