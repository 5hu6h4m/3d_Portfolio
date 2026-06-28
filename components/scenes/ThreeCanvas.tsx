'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraDirector } from './CameraDirector';
import { WorldStreamer } from './WorldStreamer';
import { ChakraEngine } from './ChakraEngine';
import { Loader } from '../ui/Loader';
import { COLOR_THEMES } from '../../lib/constants';

interface ThreeCanvasProps {
  scrollProgress: number; // Value between 0 and 1
  activeChapter: number;
  playInteraction: (type: 'chakra' | 'pulse' | 'sword' | 'lightning') => void;
}

export function ThreeCanvas({ scrollProgress, activeChapter, playInteraction }: ThreeCanvasProps) {
  return (
    <div className="fixed inset-0 w-full h-full -z-10 bg-slate-950 overflow-hidden">
      {/* Cinematic Vignette Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `radial-gradient(circle, transparent 40%, ${COLOR_THEMES.bgDark} 95%)`,
          mixBlendMode: 'multiply',
          opacity: 0.9
        }}
      />

      {/* Film Grain & Depth Ambient Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />

      <Suspense fallback={<Loader progress={0} />}>
        <Canvas
          camera={{ position: [0, 2, 10], fov: 60, near: 0.1, far: 200 }}
          dpr={[1, 2]} // Adaptive retina rendering
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
            logarithmicDepthBuffer: true
          }}
        >
          {/* Ambient Lighting & Sky Colors */}
          <color attach="background" args={["#030712"]} />
          <ambientLight intensity={0.2} />
          
          {/* Dynamic Sun/Moon Spotlight */}
          <directionalLight
            position={[10, 20, 10]}
            intensity={1.5}
            color={activeChapter >= 8 ? "#ff9c3a" : activeChapter >= 5 ? "#4b5563" : "#3b82f6"} // Sunset orange vs dark battle gray vs morning blue
          />

          {/* Camera Path Controller */}
          <CameraDirector scrollProgress={scrollProgress} activeChapter={activeChapter} />

          {/* GPU Chakra Particle Engine */}
          <ChakraEngine scrollProgress={scrollProgress} activeChapter={activeChapter} />

          {/* Zone Mesh Streamer */}
          <WorldStreamer scrollProgress={scrollProgress} activeChapter={activeChapter} playInteraction={playInteraction} />
        </Canvas>
      </Suspense>
    </div>
  );
}
export default ThreeCanvas;
