'use client';

import { useEffect, useRef, useState } from 'react';
import { AUDIO_SOURCES } from '../lib/constants';

export function useSoundEngine() {
  const [isMuted, setIsMuted] = useState(true); // Start muted by default to comply with browser autoplay policies
  const tracksRef = useRef<{ [key: string]: any | null }>({});
  const synthRef = useRef<AudioContext | null>(null);

  // Play synthetic fallback sound if Howler fails or for quick interaction feedback
  const playSynthNote = (freq: number, duration: number, type: 'sine' | 'triangle' | 'sawtooth' | 'square' = 'sine') => {
    if (isMuted) return;
    try {
      if (typeof window === 'undefined') return;
      if (!synthRef.current) {
        synthRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = synthRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Web Audio synthesis failed:", e);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const { Howl } = require('howler');

    // Lazy initialize sounds on client
    tracksRef.current = {
      ambientWind: new Howl({ src: [AUDIO_SOURCES.ambientWind], loop: true, volume: 0.15, html5: true }),
      ambientBirds: new Howl({ src: [AUDIO_SOURCES.ambientBirds], loop: true, volume: 0.1, html5: true }),
      chakraCharge: new Howl({ src: [AUDIO_SOURCES.chakraCharge], volume: 0.2 }),
      energyPulse: new Howl({ src: [AUDIO_SOURCES.energyPulse], volume: 0.2 }),
      swordSwish: new Howl({ src: [AUDIO_SOURCES.swordSwish], volume: 0.25 }),
      lightning: new Howl({ src: [AUDIO_SOURCES.lightning], volume: 0.3 })
    };

    return () => {
      // Clean up Howls
      Object.values(tracksRef.current).forEach(h => h && h.unload());
    };
  }, []);

  // Sync mute state to Howls
  useEffect(() => {
    Object.values(tracksRef.current).forEach(h => {
      if (h) h.mute(isMuted);
    });
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
    // Unlocking AudioContext on user interaction
    if (synthRef.current && synthRef.current.state === 'suspended') {
      synthRef.current.resume();
    }
  };

  const playInteraction = (soundType: 'chakra' | 'pulse' | 'sword' | 'lightning') => {
    if (isMuted) return;
    try {
      switch (soundType) {
        case 'chakra':
          tracksRef.current.chakraCharge?.play();
          playSynthNote(440, 0.4, 'triangle');
          break;
        case 'pulse':
          tracksRef.current.energyPulse?.play();
          playSynthNote(880, 0.2, 'sine');
          break;
        case 'sword':
          tracksRef.current.swordSwish?.play();
          playSynthNote(600, 0.3, 'sawtooth');
          break;
        case 'lightning':
          tracksRef.current.lightning?.play();
          playSynthNote(220, 0.5, 'square');
          break;
      }
    } catch (e) {
      console.warn("Sound play failed:", e);
    }
  };

  const updateAmbienceForChapter = (chapterId: number) => {
    if (isMuted) return;
    try {
      const wind = tracksRef.current.ambientWind;
      const birds = tracksRef.current.ambientBirds;

      // Dynamic crossfading based on storyline chapter
      if (chapterId <= 2) {
        // Village / Academy -> Birds and soft wind
        if (birds && !birds.playing()) birds.play();
        if (wind && !wind.playing()) wind.play();
        birds?.fade(birds.volume(), 0.15, 1000);
        wind?.fade(wind.volume(), 0.1, 1000);
      } else if (chapterId >= 3 && chapterId <= 5) {
        // Training / Battle ground -> Intense wind, no birds
        birds?.fade(birds.volume(), 0, 1000);
        if (wind && !wind.playing()) wind.play();
        wind?.fade(wind.volume(), 0.3, 1000);
      } else {
        // Ending / Sunset -> Peaceful wind, soft volume
        birds?.fade(birds.volume(), 0.05, 1000);
        if (wind && !wind.playing()) wind.play();
        wind?.fade(wind.volume(), 0.15, 1000);
      }
    } catch (e) {
      console.warn("Ambient update failed:", e);
    }
  };

  return {
    isMuted,
    toggleMute,
    playInteraction,
    updateAmbienceForChapter,
    playSynthNote
  };
}
export type SoundEngineType = ReturnType<typeof useSoundEngine>;
