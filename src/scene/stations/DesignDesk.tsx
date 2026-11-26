import { useRef } from 'react';
import { RoundedBox } from '@react-three/drei';
import { MathUtils, type Group, type Mesh, type MeshToonMaterial } from 'three';
import { env } from '../env';
import { palette } from '../palette';
import { Ball, Box, Cyl, Toon } from '../primitives';
import { useStationAnim } from '../useStationAnim';
import type { StationModelProps } from './registry';
import { LIVE, LIVE_CHILDREN } from '../Merge';

const CARDS: { pos: [number, number]; size: [number, number]; color: string }[] = [
  { pos: [-0.12, 0.17], size: [0.5, 0.2], color: palette.terracotta },
  { pos: [0.34, 0.17], size: [0.3, 0.2], color: palette.mustard },
  { pos: [-0.2, -0.1], size: [0.34, 0.24], color: palette.teal },
  { pos: [0.24, -0.1], size: [0.5, 0.24], color: palette.rose },
];
const SWATCHES = [palette.terracotta, palette.mustard, palette.sage, palette.teal, palette.plum, palette.rose];

/** Desk with a monitor showing a living UI mock-up, a swatch fan and a steaming mug. */
export function DesignDesk({ station }: StationModelProps) {
  const cards = useRef<Group>(null);
  const cursor = useRef<Mesh>(null);
  const swatches = useRef<Group>(null);
  const steam = useRef<Group>(null);
  const screen = useRef<MeshToonMaterial>(null);

  useStationAnim(station.id, ({ t, hover, active }) => {
    const lively = Math.max(hover, active);
    // UI cards breathe in sequence, like a layout being nudged into place.
    cards.current?.children.forEach((card, i) => {
      const pulse = 1 + Math.sin(t * 1.6 + i * 1.4) * (0.03 + lively * 0.05);
      card.scale.set(pulse, pulse, 1);
      card.position.z = 0.004 + (0.5 + 0.5 * Math.sin(t * 1.6 + i * 1.4)) * lively * 0.05;
    });
    if (cursor.current) {
      cursor.current.position.x = Math.sin(t * 0.9) * 0.42;
      cursor.current.position.y = Math.sin(t * 1.35) * 0.2 - 0.02;
    }
    // The colour swatches fan out when you take an interest.
    swatches.current?.children.forEach((s, i) => {
      const spread = MathUtils.lerp(0.06, 0.34, lively);
      s.rotation.y = (i - (SWATCHES.length - 1) / 2) * spread;
    });
    steam.current?.children.forEach((puff, i) => {
      const k = (t * 0.35 + i / 3) % 1;
      puff.position.y = k * 0.32;
      puff.position.x = Math.sin(k * 6 + i) * 0.03;
      puff.scale.setScalar(Math.sin(k * Math.PI) * 0.9 + 0.01);
    });
    if (screen.current) screen.current.emissiveIntensity = 0.35 + env.night * 0.5 + active * 0.2;
  });

  return (
    <group>
      {/* desk */}
      <RoundedBox args={[2.7, 0.1, 1.15]} radius={0.04} position={[0, 0.95, 0]} castShadow receiveShadow>
        <Toon color={palette.woodLight} />
      </RoundedBox>
      {[[-1.2, -0.45], [1.2, -0.45], [-1.2, 0.45], [1.2, 0.45]].map(([x, z], i) => (
        <Cyl key={i} args={[0.05, 0.035, 0.9, 10]} position={[x, 0.45, z]} color={palette.woodDark} />
      ))}
      <Box size={[0.7, 0.42, 0.9]} position={[0.9, 0.67, 0]} color={palette.cream} />
      <Ball radius={0.03} position={[0.9, 0.78, 0.46]} color={palette.terracotta} shadow={false} />
      <Ball radius={0.03} position={[0.9, 0.58, 0.46]} color={palette.terracotta} shadow={false} />

      {/* monitor */}
      <Cyl args={[0.2, 0.24, 0.04, 20]} position={[-0.15, 1.02, -0.3]} color={palette.dark} />
      <Cyl args={[0.035, 0.035, 0.36, 10]} position={[-0.15, 1.2, -0.3]} color={palette.dark} />
      <group position={[-0.15, 1.72, -0.28]} rotation-x={-0.06}>
        <RoundedBox args={[1.38, 0.86, 0.07]} radius={0.03} castShadow>
          <Toon color={palette.dark} />
        </RoundedBox>
        <mesh position={[0, 0, 0.037]}>
          <planeGeometry args={[1.28, 0.76]} />
          <inkToonMaterial ref={screen} color={palette.paper} emissive={palette.paper} emissiveIntensity={0.35} />
        </mesh>
        <group position={[0, 0, 0.04]}>
          {/* app chrome */}
          <mesh position={[-0.52, 0, 0.001]}>
            <planeGeometry args={[0.22, 0.74]} />
            <meshBasicMaterial color={palette.ink} toneMapped={false} />
          </mesh>
          {[0.24, 0.12, 0, -0.12].map((y, i) => (
            <mesh key={i} position={[-0.52, y, 0.002]}>
              <planeGeometry args={[0.14, 0.05]} />
              <meshBasicMaterial color={i === 1 ? palette.mustard : '#6b5a6c'} toneMapped={false} />
            </mesh>
          ))}
          <mesh position={[0.11, 0.33, 0.002]}>
            <planeGeometry args={[0.6, 0.04]} />
            <meshBasicMaterial color="#d9c9b5" toneMapped={false} />
          </mesh>
          <group ref={cards} userData={LIVE_CHILDREN} position={[0.05, -0.03, 0]}>
            {CARDS.map((c, i) => (
              <mesh key={i} position={[c.pos[0], c.pos[1], 0.004]}>
                <planeGeometry args={c.size} />
                <meshBasicMaterial color={c.color} toneMapped={false} />
              </mesh>
            ))}
          </group>
          <mesh ref={cursor} userData={LIVE} position={[0, 0, 0.07]} rotation-z={0.5}>
            <coneGeometry args={[0.03, 0.08, 3]} />
            <meshBasicMaterial color={palette.ink} toneMapped={false} />
          </mesh>
        </group>
      </group>

      {/* keyboard, mouse, sketchbook */}
      <RoundedBox args={[0.72, 0.03, 0.24]} radius={0.012} position={[-0.15, 1.02, 0.22]} castShadow>
        <Toon color={palette.cream} />
      </RoundedBox>
      {Array.from({ length: 24 }, (_, i) => (
        <Box key={i} size={[0.065, 0.014, 0.045]} position={[-0.47 + (i % 8) * 0.082, 1.04, 0.15 + Math.floor(i / 8) * 0.066]} color={i === 5 || i === 18 ? palette.terracotta : '#e8d6bd'} shadow={false} />
      ))}
      <Ball radius={0.07} position={[0.4, 1.03, 0.25]} scale={[0.8, 0.5, 1.2]} color={palette.rose} />
      {/* pen display: the drawing tablet, propped up with a sketch in progress */}
      <group position={[-0.92, 1.0, 0.14]} rotation={[0, 0.3, 0]}>
        <group rotation-x={-1.15} position={[0, 0.13, 0]}>
          <RoundedBox args={[0.62, 0.42, 0.035]} radius={0.015} castShadow>
            <Toon color={palette.dark} />
          </RoundedBox>
          <mesh position={[0, 0, 0.019]}>
            <planeGeometry args={[0.54, 0.34]} />
            <inkToonMaterial color={palette.paper} emissive={palette.paper} emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[-0.06, 0.01, 0.021]} rotation-z={0.4}>
            <circleGeometry args={[0.08, 5]} />
            <meshBasicMaterial color={palette.sage} toneMapped={false} />
          </mesh>
          <mesh position={[0.1, -0.04, 0.021]}>
            <circleGeometry args={[0.05, 14]} />
            <meshBasicMaterial color={palette.rose} toneMapped={false} />
          </mesh>
          <Cyl args={[0.009, 0.009, 0.2, 6]} position={[0.2, 0.02, 0.05]} rotation={[0.9, 0, -0.5]} color={palette.cream} shadow={false} />
        </group>
        <Box size={[0.3, 0.2, 0.02]} position={[0, 0.09, -0.12]} rotation={[0.5, 0, 0]} color={palette.dark} />
      </group>

      {/* laptop */}
      <group position={[0.7, 1.0, -0.22]} rotation={[0, -0.35, 0]}>
        <Box size={[0.44, 0.02, 0.3]} position={[0, 0.01, 0]} color="#d9d3e6" />
        <group position={[0, 0.02, -0.15]} rotation-x={-0.3}>
          <Box size={[0.44, 0.3, 0.015]} position={[0, 0.15, 0]} color="#d9d3e6" />
          <mesh position={[0, 0.15, 0.009]}>
            <planeGeometry args={[0.4, 0.26]} />
            <inkToonMaterial color={palette.lavenderLight} emissive={palette.lavenderLight} emissiveIntensity={0.35} />
          </mesh>
          <mesh position={[0, 0.15, 0.011]}>
            <circleGeometry args={[0.06, 6]} />
            <meshBasicMaterial color={palette.mint} toneMapped={false} />
          </mesh>
        </group>
      </group>

      {/* swatch fan */}
      <group ref={swatches} userData={LIVE_CHILDREN} position={[0.72, 1.01, 0.38]}>
        {SWATCHES.map((c, i) => (
          <group key={i} position={[0, i * 0.006, 0]}>
            <Box size={[0.09, 0.006, 0.34]} position={[0, 0, -0.17]} color={c} shadow={false} />
          </group>
        ))}
      </group>

      {/* mug + steam */}
      <group position={[1.18, 1.0, 0.12]}>
        <Cyl args={[0.075, 0.065, 0.14, 16]} position={[0, 0.07, 0]} color={palette.teal} />
        <mesh position={[0.085, 0.07, 0]} rotation-y={0}>
          <torusGeometry args={[0.04, 0.012, 6, 12]} />
          <Toon color={palette.teal} />
        </mesh>
        <group ref={steam} userData={LIVE_CHILDREN} position={[0, 0.17, 0]}>
          {[0, 1, 2].map((i) => (
            <mesh key={i}>
              <sphereGeometry args={[0.035, 8, 6]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.55} />
            </mesh>
          ))}
        </group>
      </group>

      {/* pencil pot */}
      <Cyl args={[0.07, 0.07, 0.16, 12]} position={[-1.12, 1.08, -0.3]} color={palette.mustard} />
      {[palette.terracotta, palette.teal, palette.plum].map((c, i) => (
        <Cyl key={c} args={[0.012, 0.012, 0.26, 6]} position={[-1.14 + i * 0.025, 1.22, -0.3]} rotation={[0.15 * (i - 1), 0, 0.12 * (i - 1)]} color={c} shadow={false} />
      ))}

      {/* stool */}
      <Cyl args={[0.3, 0.3, 0.1, 20]} position={[-0.15, 0.6, 1.0]} color={palette.sageSoft} />
      {[0, 1, 2].map((i) => (
        <Cyl key={i} args={[0.03, 0.03, 0.58, 8]} position={[-0.15 + Math.cos((i * Math.PI * 2) / 3) * 0.2, 0.28, 1.0 + Math.sin((i * Math.PI * 2) / 3) * 0.2]} color={palette.woodDark} />
      ))}
    </group>
  );
}
