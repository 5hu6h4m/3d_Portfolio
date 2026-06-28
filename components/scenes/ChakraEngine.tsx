'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ChakraEngineProps {
  scrollProgress: number;
  activeChapter: number;
}

export function ChakraEngine({ scrollProgress, activeChapter }: ChakraEngineProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const particleCount = 2500;

  // Initialize randomized position, sizes, and colors for particles
  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const sz = new Float32Array(particleCount);

    const baseColor = new THREE.Color("#ff7b00"); // default orange

    for (let i = 0; i < particleCount; i++) {
      // Position spread along spline corridor (z from -120 to +50)
      pos[i * 3] = (Math.random() - 0.5) * 20; // x spread
      pos[i * 3 + 1] = (Math.random() - 0.2) * 15; // y spread
      pos[i * 3 + 2] = (Math.random() - 0.5) * 170 - 45; // z spread

      // Color variation depending on scroll depths (nature types)
      const zVal = pos[i * 3 + 2];
      let particleColor = baseColor;

      if (zVal > 15) {
        // Zone 1: Morning fresh green leaf leaves
        particleColor = new THREE.Color("#10b981");
      } else if (zVal > -15) {
        // Zone 2: Tech nature lightning blue
        particleColor = new THREE.Color("#3b82f6");
      } else if (zVal > -45) {
        // Zone 3: Threatening warning dark red/purple
        particleColor = new THREE.Color(i % 2 === 0 ? "#ef4444" : "#9333ea");
      } else {
        // Zone 4: Sunset golden orange
        particleColor = new THREE.Color(i % 2 === 0 ? "#ff7b00" : "#facc15");
      }

      col[i * 3] = particleColor.r;
      col[i * 3 + 1] = particleColor.g;
      col[i * 3 + 2] = particleColor.b;

      sz[i] = Math.random() * 0.15 + 0.05;
    }

    return [pos, col, sz];
  }, []);

  // Custom vertex/fragment shaders to process particle animations natively on GPU
  const chakraShader = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uActiveThemeColor: { value: new THREE.Color("#ff7b00") }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uScroll;
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vColor = color;

          // Compute custom wave motion (wind drifting)
          vec3 pos = position;
          pos.x += sin(uTime * 0.8 + position.z * 0.1) * 0.4;
          pos.y += cos(uTime * 0.5 + position.x * 0.15) * 0.3;

          // Camera distance calculation
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          // Size attenuation (scale particles based on camera depth)
          gl_PointSize = size * (300.0 / -mvPosition.z);
          
          // Fade particles that get too close to prevent clipping
          vAlpha = smoothstep(-2.0, -10.0, mvPosition.z);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          // Render particles as glowing circular entities instead of squares
          float dist = distance(gl_PointCoord, vec2(0.5));
          if (dist > 0.5) discard;

          // Soft glow edges
          float glow = smoothstep(0.5, 0.1, dist);

          gl_FragColor = vec4(vColor, glow * vAlpha * 0.85);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.getElapsedTime();
      
      // Update shader uniforms
      chakraShader.uniforms.uTime.value = time;
      chakraShader.uniforms.uScroll.value = scrollProgress;

      // Slow rotation of the global particle cloud
      pointsRef.current.rotation.z = time * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <primitive object={chakraShader} attach="material" />
    </points>
  );
}
export default ChakraEngine;
