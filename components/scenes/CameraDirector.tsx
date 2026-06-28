'use client';

import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useRef } from 'react';

interface CameraDirectorProps {
  scrollProgress: number;
  activeChapter: number;
}

export function CameraDirector({ scrollProgress, activeChapter }: CameraDirectorProps) {
  const currentPos = useRef(new THREE.Vector3(0, 2, 50));
  const currentTarget = useRef(new THREE.Vector3(0, 2, 0));

  useFrame((state) => {
    const { camera } = state;

    // Define target position and look-at targets based on scroll segments
    let targetPos = new THREE.Vector3(0, 2, 40);
    let targetLookAt = new THREE.Vector3(0, 2, 0);
    let fov = 60;

    // 13-stage spline keyframes mapped to scroll progress [0.0 - 1.0]
    if (scrollProgress < 0.1) {
      // 1. Village Gate dolly entrance
      const t = scrollProgress / 0.1;
      targetPos.set(0, 2 + t * 2, 45 - t * 15);
      targetLookAt.set(0, 2, 20);
      fov = 60 - t * 5; // slow zoom
    } else if (scrollProgress < 0.22) {
      // 2. Prologue overview
      const t = (scrollProgress - 0.1) / 0.12;
      targetPos.set(-2, 4, 30 - t * 10);
      targetLookAt.set(0, 2, 10);
      fov = 55;
    } else if (scrollProgress < 0.35) {
      // 3. Academy Courtyard
      const t = (scrollProgress - 0.22) / 0.13;
      targetPos.set(8 * Math.sin(t * Math.PI * 0.5), 3, 20 - t * 15);
      targetLookAt.set(0, 2, 5);
      fov = 55;
    } else if (scrollProgress < 0.48) {
      // 4. Training Grounds - elevated crane shot
      const t = (scrollProgress - 0.35) / 0.13;
      targetPos.set(-8 * Math.cos(t * Math.PI), 6 - t * 2, 5 - t * 15);
      targetLookAt.set(0, 1, -10);
      fov = 65; // wider field of view
    } else if (scrollProgress < 0.6) {
      // 5. Team Section - horizontal tracks
      const t = (scrollProgress - 0.48) / 0.12;
      targetPos.set(-15 + t * 10, 2, -10 - t * 15);
      targetLookAt.set(0, 2, -25);
      fov = 50;
    } else if (scrollProgress < 0.72) {
      // 6. Rogue Threats - close-up dolly with camera shake
      const t = (scrollProgress - 0.6) / 0.12;
      targetPos.set(0, 2, -25 - t * 15);
      targetLookAt.set(0, 2, -45);
      fov = 45; // high focus close-up
    } else if (scrollProgress < 0.85) {
      // 7. Sage Awakening - 360 orbit shot
      const t = (scrollProgress - 0.72) / 0.13;
      const angle = t * Math.PI;
      targetPos.set(12 * Math.sin(angle), 5 + t * 2, -45 - 15 * Math.cos(angle));
      targetLookAt.set(0, 3, -60);
      fov = 60;
    } else if (scrollProgress < 0.95) {
      // 8. Hokage Monument - vertical crane shot
      const t = (scrollProgress - 0.85) / 0.1;
      targetPos.set(0, 6 + t * 15, -75 - t * 10);
      targetLookAt.set(0, 18, -100);
      fov = 70;
    } else {
      // 9. Sunset Ending Final Contact
      const t = (scrollProgress - 0.95) / 0.05;
      targetPos.set(0, 21 - t * 17, -85 - t * 15);
      targetLookAt.set(0, 2, -115);
      fov = 50;
    }

    // Apply smooth linear interpolations (Lerp) to camera position and look-at targets
    currentPos.current.lerp(targetPos, 0.05);
    currentTarget.current.lerp(targetLookAt, 0.05);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentTarget.current);

    // Dynamic FOV adjustments
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, fov, 0.05);

      // Camera shake during heavy moments (e.g. Chapter 05: Rogue Threats and Chapter 06: Sage Awakening)
      if (activeChapter === 5 || activeChapter === 6) {
        const shakeIntensity = activeChapter === 6 ? 0.08 : 0.04;
        camera.position.x += (Math.random() - 0.5) * shakeIntensity;
        camera.position.y += (Math.random() - 0.5) * shakeIntensity;
      }

      camera.updateProjectionMatrix();
    }
  });

  return null;
}
export default CameraDirector;
