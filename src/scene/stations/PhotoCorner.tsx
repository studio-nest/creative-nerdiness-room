import { useRef } from 'react';
import { MathUtils, type Group, type Mesh, type PointLight } from 'three';
import { palette } from '../palette';
import { Box, Cyl } from '../primitives';
import { drawPolaroid, useCanvasTexture } from '../textures';
import { useStationAnim } from '../useStationAnim';
import type { StationModelProps } from './registry';
import { LIVE, LIVE_CHILDREN } from '../Merge';

function Polaroid({ index, position }: { index: number; position: [number, number, number] }) {
  const tex = useCanvasTexture(drawPolaroid(index), 96, 96);
  return (
    <group position={position}>
      {/* hangs from its top edge so it can sway */}
      <group position={[0, -0.24, 0]}>
        <Box size={[0.36, 0.44, 0.015]} color={palette.paper} />
        <mesh position={[0, 0.035, 0.009]}>
          <planeGeometry args={[0.3, 0.3]} />
          <inkToonMaterial map={tex} />
        </mesh>
      </group>
      <Box size={[0.04, 0.07, 0.03]} position={[0, -0.01, 0]} color={palette.terracotta} shadow={false} />
    </group>
  );
}

/** Camera on a tripod that fires its flash, under a string of swaying polaroids. */
export function PhotoCorner({ station }: StationModelProps) {
  const photos = useRef<Group>(null);
  const flash = useRef<PointLight>(null);
  const flashBulb = useRef<Mesh>(null);
  const head = useRef<Group>(null);

  useStationAnim(station.id, ({ t, hover, active }) => {
    const lively = Math.max(hover, active);
    photos.current?.children.forEach((p, i) => {
      p.rotation.z = Math.sin(t * 1.3 + i * 0.9) * (0.04 + lively * 0.12);
      p.rotation.x = Math.sin(t * 1.1 + i * 1.7) * lively * 0.12;
    });
    // A quick double-pop of the flash every couple of seconds while engaged.
    const cycle = (t * 0.45) % 1;
    const pop = lively * Math.max(0, 1 - Math.abs(cycle - 0.1) * 14);
    if (flash.current) flash.current.intensity = pop * 30;
    if (flashBulb.current) flashBulb.current.scale.setScalar(1 + pop * 2.2);
    if (head.current) {
      head.current.rotation.y = MathUtils.lerp(0, Math.sin(t * 0.7) * 0.35, lively);
      head.current.rotation.x = Math.sin(t * 0.5) * 0.04;
    }
  });

  return (
    <group>
      {/* string + polaroids on the wall (the wall is at local z = -0.6) */}
      <group position={[0, 0, -0.52]}>
        <Box size={[2.3, 0.015, 0.015]} position={[0, 3.02, 0]} color={palette.dark} shadow={false} />
        <group ref={photos} userData={LIVE_CHILDREN}>
          {[-0.9, -0.45, 0, 0.45, 0.9].map((x, i) => (
            <Polaroid key={i} index={i} position={[x, 3.0 - Math.abs(Math.sin(i * 1.3)) * 0.03, 0.02]} />
          ))}
        </group>
        <group position={[0, 2.25, 0]}>
          <Box size={[1.0, 0.7, 0.04]} color={palette.woodDark} />
          <Box size={[0.9, 0.6, 0.02]} position={[0, 0, 0.02]} color="#f1c9a0" shadow={false} />
          <Box size={[0.9, 0.24, 0.022]} position={[0, -0.18, 0.021]} color={palette.teal} shadow={false} />
          <mesh position={[0.2, 0.08, 0.032]}>
            <circleGeometry args={[0.11, 20]} />
            <meshBasicMaterial color="#fff3c4" toneMapped={false} />
          </mesh>
        </group>
      </group>

      {/* tripod */}
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2 + 0.5;
        return (
          <Cyl key={i} args={[0.025, 0.02, 1.5, 8]} position={[Math.cos(a) * 0.26, 0.72, 0.35 + Math.sin(a) * 0.26]} rotation={[-Math.sin(a) * 0.36, 0, Math.cos(a) * 0.36]} color={palette.dark} />
        );
      })}
      <Cyl args={[0.06, 0.06, 0.1, 10]} position={[0, 1.46, 0.35]} color={palette.metal} />

      {/* camera */}
      <group ref={head} userData={LIVE} position={[0, 1.68, 0.35]}>
        <Box size={[0.5, 0.32, 0.24]} color={palette.dark} roughness={0.5} />
        <Box size={[0.5, 0.1, 0.245]} position={[0, 0.11, 0]} color={palette.cream} />
        <Cyl args={[0.13, 0.13, 0.2, 20]} position={[0, -0.02, 0.2]} rotation-x={Math.PI / 2} color={palette.metal} metalness={0.3} roughness={0.4} />
        <Cyl args={[0.09, 0.09, 0.02, 20]} position={[0, -0.02, 0.31]} rotation-x={Math.PI / 2} color="#1d2a3a" roughness={0.1} metalness={0.5} />
        <Box size={[0.14, 0.08, 0.1]} position={[0.12, 0.2, 0]} color={palette.dark} />
        <Cyl args={[0.035, 0.035, 0.04, 10]} position={[-0.16, 0.18, 0]} color={palette.terracotta} />
        <mesh ref={flashBulb} userData={LIVE} position={[0.12, 0.2, 0.06]}>
          <sphereGeometry args={[0.03, 8, 6]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
        <pointLight ref={flash} position={[0.12, 0.25, 0.3]} intensity={0} distance={6} color="#ffffff" />
      </group>

      {/* camera bag */}
      <Box size={[0.5, 0.34, 0.3]} position={[0.75, 0.17, 0.1]} rotation={[0, 0.3, 0]} color={palette.teal} />
      <Box size={[0.52, 0.08, 0.32]} position={[0.75, 0.36, 0.1]} rotation={[0, 0.3, 0]} color="#3d6f70" />
    </group>
  );
}
