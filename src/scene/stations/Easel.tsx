import { useRef } from 'react';
import type { Group } from 'three';
import { palette } from '../palette';
import { Ball, Box, Cyl, Toon } from '../primitives';
import { drawPainting, useCanvasTexture } from '../textures';
import { useStationAnim } from '../useStationAnim';
import type { StationModelProps } from './registry';
import { LIVE, LIVE_CHILDREN } from '../Merge';

const PAINTS = [palette.terracotta, palette.mustard, palette.mint, palette.blue, palette.rose, palette.plum];

/** An easel whose brush lifts off its tray and paints when you pay attention to it. */
export function Easel({ station }: StationModelProps) {
  const painting = useCanvasTexture(drawPainting, 384, 480);
  const brush = useRef<Group>(null);
  const splats = useRef<Group>(null);
  const canvas = useRef<Group>(null);

  useStationAnim(station.id, ({ t, hover, active }) => {
    const lively = Math.max(hover, active);
    if (brush.current) {
      // Resting on the tray → sweeping figure-eights across the canvas.
      const sweepX = Math.sin(t * 1.7) * 0.34;
      const sweepY = Math.sin(t * 3.4) * 0.22;
      brush.current.position.set(0.5 + (sweepX - 0.5) * lively, 0.84 + (0.72 + sweepY) * lively, 0.24 + 0.1 * lively);
      brush.current.rotation.set(0.9 * lively, 0, 1.45 - 1.0 * lively + Math.sin(t * 1.7) * 0.2 * lively);
    }
    splats.current?.children.forEach((s, i) => {
      const k = active * (0.6 + 0.4 * Math.sin(t * 1.3 + i * 2.1));
      s.scale.setScalar(Math.max(0.001, k));
      s.position.y = 1.5 + Math.sin(t * 0.8 + i * 1.9) * 0.55;
    });
    if (canvas.current) canvas.current.rotation.z = Math.sin(t * 0.8) * 0.006 * (1 + lively * 2);
  });

  return (
    <group>
      {/* legs */}
      <Box size={[0.07, 2.5, 0.07]} position={[-0.42, 1.2, 0.08]} rotation={[-0.14, 0, 0.1]} color={palette.wood} />
      <Box size={[0.07, 2.5, 0.07]} position={[0.42, 1.2, 0.08]} rotation={[-0.14, 0, -0.1]} color={palette.wood} />
      <Box size={[0.07, 2.4, 0.07]} position={[0, 1.15, -0.42]} rotation={[0.3, 0, 0]} color={palette.woodDark} />
      <Box size={[1.25, 0.07, 0.2]} position={[0, 0.8, 0.2]} color={palette.wood} />

      <group ref={canvas} userData={LIVE} position={[0, 1.58, 0.14]} rotation-x={-0.14}>
        <Box size={[1.14, 1.42, 0.05]} color={palette.paper} />
        <mesh position={[0, 0, 0.027]}>
          <planeGeometry args={[1.06, 1.34]} />
          <inkToonMaterial map={painting} />
        </mesh>
      </group>

      {/* paint blobs that bloom around the canvas when focused */}
      <group ref={splats} userData={LIVE_CHILDREN}>
        {PAINTS.map((c, i) => (
          <mesh key={c} position={[i % 2 ? 0.74 : -0.74, 1.5, 0.2 + (i % 3) * 0.08]} scale={0.001}>
            <icosahedronGeometry args={[0.07, 1]} />
            <Toon color={c} />
          </mesh>
        ))}
      </group>

      <group ref={brush} userData={LIVE} position={[0.5, 0.84, 0.24]} rotation={[0, 0, 1.45]}>
        <Cyl args={[0.014, 0.018, 0.42, 8]} color={palette.mustard} />
        <Cyl args={[0.02, 0.02, 0.06, 8]} position={[0, 0.23, 0]} color={palette.metal} metalness={0.4} roughness={0.4} />
        <mesh position={[0, 0.3, 0]} castShadow>
          <coneGeometry args={[0.028, 0.1, 8]} />
          <Toon color={palette.terracotta} />
        </mesh>
      </group>

      {/* little side table with palette + jar */}
      <Cyl args={[0.3, 0.3, 0.05, 20]} position={[0.95, 0.72, 0.35]} color={palette.woodLight} />
      <Cyl args={[0.04, 0.06, 0.7, 10]} position={[0.95, 0.35, 0.35]} color={palette.woodDark} />
      <Cyl args={[0.2, 0.2, 0.02, 20]} position={[0.92, 0.76, 0.38]} scale={[1.15, 1, 0.85]} color={palette.cream} />
      {PAINTS.slice(0, 5).map((c, i) => (
        <Ball key={c} radius={0.035} position={[0.92 + Math.cos(i * 1.1 + 0.4) * 0.13, 0.775, 0.38 + Math.sin(i * 1.1 + 0.4) * 0.1]} scale={[1, 0.5, 1]} color={c} roughness={0.3} shadow={false} />
      ))}
      <Cyl args={[0.06, 0.06, 0.15, 12]} position={[1.12, 0.82, 0.22]} color="#bfe3ea" roughness={0.2} />
    </group>
  );
}
