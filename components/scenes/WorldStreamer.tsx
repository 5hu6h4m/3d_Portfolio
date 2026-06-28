'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { PROJECTS, SKILLS, THREATS, MISSIONS } from '../../lib/data';
import { COLOR_THEMES } from '../../lib/constants';

interface WorldStreamerProps {
  scrollProgress: number;
  activeChapter: number;
  playInteraction: (type: 'chakra' | 'pulse' | 'sword' | 'lightning') => void;
}

export function WorldStreamer({ scrollProgress, activeChapter, playInteraction }: WorldStreamerProps) {
  const gateGroup = useRef<THREE.Group>(null);
  const academyGroup = useRef<THREE.Group>(null);
  const trainingGroup = useRef<THREE.Group>(null);
  const battlefieldGroup = useRef<THREE.Group>(null);

  // Active Zones calculation to stream loading/unloading
  const zonesActive = useMemo(() => {
    return {
      zone1: scrollProgress < 0.3,                 // Village Entrance & Prologue
      zone2: scrollProgress >= 0.1 && scrollProgress < 0.5, // Academy Training
      zone3: scrollProgress >= 0.3 && scrollProgress < 0.75, // Skills & Team
      zone4: scrollProgress >= 0.55                 // Threats, Awakening & Monument Legacy
    };
  }, [scrollProgress]);

  // Rotational values calculated once
  const skillsPositions = useMemo(() => {
    return SKILLS.map((_, i) => {
      const angle = (i / SKILLS.length) * Math.PI * 2;
      return {
        x: Math.cos(angle) * 4,
        z: Math.sin(angle) * 4,
      };
    });
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Idle breathing animations for active zones
    if (zonesActive.zone1 && gateGroup.current) {
      gateGroup.current.position.y = Math.sin(time * 1.5) * 0.1;
    }
    if (zonesActive.zone2 && academyGroup.current) {
      academyGroup.current.position.y = Math.cos(time * 1.2) * 0.08;
    }
    if (zonesActive.zone3 && trainingGroup.current) {
      trainingGroup.current.rotation.y = time * 0.15;
    }
    if (zonesActive.zone4 && battlefieldGroup.current) {
      battlefieldGroup.current.position.y = Math.sin(time * 0.8) * 0.05;
    }
  });

  return (
    <group>
      {/* ================= ZONE 1: VILLAGE ENTRANCE ================= */}
      {zonesActive.zone1 && (
        <group ref={gateGroup} position={[0, 0, 20]}>
          {/* Main Arch columns */}
          <mesh position={[-5, 4, 0]}>
            <cylinderGeometry args={[0.4, 0.5, 8]} />
            <meshStandardMaterial color="#8b2500" roughness={0.7} />
          </mesh>
          <mesh position={[5, 4, 0]}>
            <cylinderGeometry args={[0.4, 0.5, 8]} />
            <meshStandardMaterial color="#8b2500" roughness={0.7} />
          </mesh>
          {/* Crossbeam */}
          <mesh position={[0, 8, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[12, 0.6, 0.8]} />
            <meshStandardMaterial color="#8b2500" roughness={0.7} />
          </mesh>
          {/* Accent secondary arch beam */}
          <mesh position={[0, 7.2, 0]}>
            <boxGeometry args={[10, 0.4, 0.6]} />
            <meshStandardMaterial color="#4a1200" roughness={0.8} />
          </mesh>
          {/* Hanging Kanji sign */}
          <mesh position={[0, 6.2, 0]}>
            <boxGeometry args={[2.5, 1.2, 0.1]} />
            <meshStandardMaterial color="#0f172a" roughness={0.5} />
          </mesh>
          {/* Village gate ground deck */}
          <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[30, 20]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
        </group>
      )}

      {/* ================= ZONE 2: ACADEMY COURTYARD ================= */}
      {zonesActive.zone2 && (
        <group ref={academyGroup} position={[0, 0, 5]}>
          {/* Central training logs platform */}
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[3, 3.2, 0.8, 8]} />
            <meshStandardMaterial color="#334155" roughness={0.8} />
          </mesh>
          {/* Practice targets */}
          {[-2.5, 2.5].map((x, i) => (
            <group key={i} position={[x, 1.2, -1]}>
              <mesh rotation={[0, 0, 0]}>
                <cylinderGeometry args={[0.6, 0.6, 0.1, 16]} />
                <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
              </mesh>
              <mesh position={[0, -0.6, 0]}>
                <boxGeometry args={[0.1, 1.2, 0.1]} />
                <meshStandardMaterial color="#78350f" />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* ================= ZONE 3: TRAINING GROUND ================= */}
      {zonesActive.zone3 && (
        <group ref={trainingGroup} position={[0, 1.5, -15]}>
          {/* Elemental Chakra nature release rings */}
          {SKILLS.map((skill, idx) => {
            const pos = skillsPositions[idx];
            return (
              <group key={idx} position={[pos.x, 0, pos.z]}>
                {/* Chakra Orb Core */}
                <mesh
                  onClick={(e) => {
                    e.stopPropagation();
                    playInteraction('chakra');
                  }}
                >
                  <sphereGeometry args={[0.4, 16, 16]} />
                  <meshBasicMaterial color={skill.glowColor} wireframe />
                </mesh>
                {/* Orbit Glow Ring */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.6, 0.65, 32]} />
                  <meshBasicMaterial color={skill.glowColor} side={THREE.DoubleSide} />
                </mesh>
                {/* Skill Name Floating Tag */}
                <Html distanceFactor={8} position={[0, 0.8, 0]} center>
                  <div className="px-2 py-0.5 bg-slate-950/90 border border-slate-700/80 rounded-md text-xs font-mono select-none pointer-events-none whitespace-nowrap" style={{ color: skill.glowColor }}>
                    {skill.name}
                  </div>
                </Html>
              </group>
            );
          })}
        </group>
      )}

      {/* ================= ZONE 4: BATTLEFIELD & HOKAGE LEGACY ================= */}
      {zonesActive.zone4 && (
        <group ref={battlefieldGroup} position={[0, 0, -65]}>
          {/* Kurama Awakening Platform */}
          <group position={[0, 0.2, 5]}>
            <mesh>
              <cylinderGeometry args={[5, 5.5, 0.5, 32]} />
              <meshStandardMaterial color="#111827" roughness={0.7} />
            </mesh>
            {/* Orange glowing runes rim */}
            <mesh position={[0, 0.26, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[4.6, 4.8, 32]} />
              <meshBasicMaterial color="#ff7b00" side={THREE.DoubleSide} />
            </mesh>
          </group>

          {/* S-Rank Mission Teammates Pillars */}
          {PROJECTS.map((proj, idx) => {
            const angle = (idx / PROJECTS.length) * Math.PI * 2;
            const x = Math.cos(angle) * 7;
            const z = Math.sin(angle) * 7;
            return (
              <group key={idx} position={[x, 2, z]}>
                <mesh
                  onClick={(e) => {
                    e.stopPropagation();
                    playInteraction('pulse');
                  }}
                >
                  <boxGeometry args={[1.5, 4, 1.5]} />
                  <meshStandardMaterial color="#1e293b" roughness={0.6} />
                </mesh>
                {/* Swirling energy ribbons */}
                <mesh rotation={[0, idx * 0.8, 0]}>
                  <cylinderGeometry args={[1.2, 1.2, 4.2, 8, 1, true]} />
                  <meshBasicMaterial color={idx % 2 === 0 ? "#ff7b00" : "#3b82f6"} wireframe />
                </mesh>
                <Html distanceFactor={10} position={[0, 2.5, 0]} center>
                  <div className="px-3 py-1 bg-slate-900/90 border border-slate-700 rounded text-center whitespace-nowrap select-none pointer-events-none">
                    <p className="text-[10px] text-orange-400 font-bold uppercase tracking-widest">{proj.rank} - {proj.symbolicTeammate}</p>
                    <p className="text-xs text-white font-mono">{proj.title}</p>
                  </div>
                </Html>
              </group>
            );
          })}

          {/* Majestic Procedural Hokage Monument in the background */}
          <group position={[0, 10, -35]}>
            {/* Giant mountain background block */}
            <mesh>
              <boxGeometry args={[45, 20, 8]} />
              <meshStandardMaterial color="#1e293b" roughness={0.9} />
            </mesh>
            {/* 4 Procedural carvings columns representing the Hokage Heads */}
            {[-12, -4, 4, 12].map((x, i) => (
              <mesh key={i} position={[x, 2, 4.1]} rotation={[0.1, 0, 0]}>
                <sphereGeometry args={[2.5, 16, 16]} />
                <meshStandardMaterial color="#334155" roughness={0.8} bumpScale={0.2} />
              </mesh>
            ))}
            <Html distanceFactor={15} position={[0, 10, 4.2]} center>
              <div className="px-4 py-1.5 bg-slate-950/80 border border-orange-500/50 rounded-md text-center backdrop-blur-sm select-none pointer-events-none">
                <span className="text-sm font-mono text-orange-400 uppercase tracking-widest">SHINOBI LEGACY MEMORIAL</span>
              </div>
            </Html>
          </group>

          {/* Threat pillars representing Rogue enemy ninja zones */}
          {THREATS.map((threat, i) => {
            const xOffset = i === 0 ? -12 : i === 1 ? 12 : 0;
            const zOffset = i === 2 ? -12 : -18;
            return (
              <group key={i} position={[xOffset, 1.5, zOffset]}>
                <mesh>
                  <coneGeometry args={[1, 3, 4]} />
                  <meshStandardMaterial color="#450a0a" roughness={0.8} />
                </mesh>
                <mesh position={[0, 1.6, 0]}>
                  <sphereGeometry args={[0.3, 8, 8]} />
                  <meshBasicMaterial color="#ef4444" wireframe />
                </mesh>
              </group>
            );
          })}
        </group>
      )}
    </group>
  );
}
export default WorldStreamer;
