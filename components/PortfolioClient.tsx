'use client';

import React, { useState, useEffect } from 'react';
import { useLenisScroll } from '../hooks/useLenis';
import { useSoundEngine } from '../hooks/useSound';
import { ThreeCanvas } from './scenes/ThreeCanvas';
import { DiegeticHUD } from './ui/DiegeticHUD';
import { AccessibilityPanel } from './ui/AccessibilityPanel';
import { ContactForm } from './ui/ContactForm';
import { Loader } from './ui/Loader';
import { HeroSection } from './sections/HeroSection';
import { CHAPTERS } from '../lib/data';
import { motion, AnimatePresence } from 'framer-motion';

export default function PortfolioClient() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeChapter, setActiveChapter] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const {
    isMuted,
    toggleMute,
    playInteraction,
    updateAmbienceForChapter
  } = useSoundEngine();

  // Scroll listener to update coordinates
  const handleScroll = (scroll: number) => {
    // Determine max scroll height from document height dynamically
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, scroll / maxScroll));
    
    setScrollProgress(progress);

    // Map scroll progress to active chapter index (1-8)
    const chapterIndex = Math.min(
      CHAPTERS.length,
      Math.floor(progress * CHAPTERS.length) + 1
    );
    setActiveChapter(chapterIndex);
  };

  useLenisScroll(handleScroll);

  // Sync ambient sound to active chapter updates
  useEffect(() => {
    updateAmbienceForChapter(activeChapter);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChapter, isMuted, updateAmbienceForChapter]);

  // Loading animation simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 800);
          return 100;
        }
        return prev + Math.random() * 8;
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const scrollToProgress = (progress: number) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: progress * maxScroll,
      behavior: reducedMotion ? 'auto' : 'smooth'
    });
  };

  const skipIntro = () => {
    scrollToProgress(0.35); // skip straight to Chapter 3 (Training Ground)
    playInteraction('lightning');
  };

  return (
    <main className="relative min-h-[9000px] w-full text-white bg-transparent font-sans selection:bg-orange-500 selection:text-white select-none">
      
      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && <Loader progress={loadingProgress} />}
      </AnimatePresence>

      {/* 3D WebGL Background Canvas */}
      {!loading && (
        <ThreeCanvas 
          scrollProgress={scrollProgress} 
          activeChapter={activeChapter} 
          playInteraction={playInteraction}
        />
      )}

      {/* Cinematic Hero Overlay — fades out after scroll */}
      {!loading && <HeroSection scrollProgress={scrollProgress} />}

      {/* Diegetic Interface HUD */}
      {!loading && (
        <DiegeticHUD
          scrollProgress={scrollProgress}
          activeChapter={activeChapter}
          isMuted={isMuted}
          toggleMute={toggleMute}
          playInteraction={playInteraction}
          scrollToProgress={scrollToProgress}
        />
      )}

      {/* Accessibility HUD overlays */}
      {!loading && (
        <AccessibilityPanel
          reducedMotion={reducedMotion}
          toggleReducedMotion={() => setReducedMotion(prev => !prev)}
          skipIntro={skipIntro}
        />
      )}

      {/* Final Chapter Contact Parchment Form Overlay */}
      {!loading && activeChapter === 8 && (
        <div className="fixed inset-0 pointer-events-none z-20 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="pointer-events-auto"
          >
            <ContactForm playInteraction={playInteraction} />
          </motion.div>
        </div>
      )}

      {/* Scroll indicator help text overlay for start */}
      {!loading && scrollProgress < 0.05 && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 pointer-events-none z-30 text-center animate-bounce">
          <p className="text-[10px] font-mono tracking-widest text-slate-400">SCROLL DOWN TO UNLEASH CHAKRA</p>
          <span className="text-sm">▼</span>
        </div>
      )}

    </main>
  );
}
