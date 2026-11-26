import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { env } from '../env';
import { palette } from '../palette';
import { Ball, Box, Cyl, Toon } from '../primitives';
import { seeded } from '../textures';
import { LIVE, LIVE_CHILDREN } from '../Merge';

const GREENS = [palette.leaf, palette.sage, '#4f8a57', palette.sageSoft];

/** A trailing vine: heart-ish leaves alternating down a gently swaying stem. */
export function Vine({ length = 1.4, leaves = 11, seed = 1, position = [0, 0, 0] as [number, number, number] }) {
  const root = useRef<Group>(null);
  const items = useMemo(() => {
    const rand = seeded(seed * 97 + 3);
    return Array.from({ length: leaves }, (_, i) => {
      const u = (i + 0.5) / leaves;
      return {
        y: -u * length,
        x: Math.sin(u * 5 + seed) * 0.07 + (i % 2 ? 0.07 : -0.07),
        z: (rand() - 0.5) * 0.08 + 0.02,
        s: 0.75 + rand() * 0.5,
        tilt: (i % 2 ? -1 : 1) * (0.5 + rand() * 0.4),
        color: GREENS[Math.floor(rand() * GREENS.length)],
      };
    });
  }, [length, leaves, seed]);

  useFrame(({ clock }) => {
    if (!root.current || env.reducedMotion) return;
    root.current.rotation.z = Math.sin(clock.elapsedTime * 0.8 + seed) * 0.035;
    root.current.rotation.x = Math.sin(clock.elapsedTime * 0.6 + seed * 2) * 0.025;
  });

  return (
    <group ref={root} userData={LIVE} position={position}>
      <Cyl args={[0.008, 0.008, length, 5]} position={[0, -length / 2, 0]} color="#5d7a4c" shadow={false} />
      {items.map((l, i) => (
        <Ball key={i} radius={0.075 * l.s} segments={8} position={[l.x, l.y, l.z]} rotation={[0.3, 0, l.tilt]} scale={[1, 1.25, 0.3]} color={l.color} />
      ))}
    </group>
  );
}

/** Hanging planter on a wall bracket, spilling vines. Origin is the bracket on the wall. */
export function HangingPothos() {
  return (
    <group>
      <Cyl args={[0.02, 0.02, 0.5, 6]} position={[0, 0, 0.25]} rotation={[Math.PI / 2, 0, 0]} color={palette.woodDark} />
      <Cyl args={[0.006, 0.006, 0.35, 4]} position={[0, -0.18, 0.45]} color={palette.cream} shadow={false} />
      <group position={[0, -0.48, 0.45]}>
        <Cyl args={[0.2, 0.14, 0.24, 14]} color={palette.cream} />
        <Ball radius={0.2} position={[0, 0.14, 0]} scale={[1, 0.5, 1]} segments={10} color={palette.leaf} />
        {[0, 1, 2, 3, 4].map((i) => {
          const a = (i / 5) * Math.PI * 2 + 0.4;
          return <Vine key={i} seed={i + 2} length={1.0 + (i % 3) * 0.35} leaves={8 + (i % 3) * 3} position={[Math.cos(a) * 0.17, 0.08, Math.sin(a) * 0.17]} />;
        })}
      </group>
    </group>
  );
}

/** Big-leafed plant: broad veined leaves on arching stems. */
export function Monstera() {
  const leaves = useRef<Group>(null);
  const items = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        yaw: (i / 8) * Math.PI * 2 + (i % 2) * 0.3,
        lean: 0.35 + (i % 3) * 0.22,
        h: 0.75 + (i % 4) * 0.2,
        size: 0.26 + (i % 3) * 0.05,
        color: i % 3 === 0 ? palette.sage : i % 3 === 1 ? palette.leaf : '#4f8a57',
      })),
    [],
  );
  useFrame(({ clock }) => {
    if (!leaves.current || env.reducedMotion) return;
    leaves.current.children.forEach((l, i) => (l.rotation.z = items[i].lean + Math.sin(clock.elapsedTime * 0.9 + i) * 0.04));
  });
  return (
    <group>
      <Cyl args={[0.3, 0.22, 0.46, 16]} position={[0, 0.23, 0]} color={palette.terracotta} />
      <Cyl args={[0.32, 0.32, 0.07, 16]} position={[0, 0.47, 0]} color="#c95f49" />
      <group ref={leaves} userData={LIVE_CHILDREN} position={[0, 0.48, 0]}>
        {items.map((l, i) => (
          <group key={i} rotation={[0, l.yaw, l.lean]}>
            <Cyl args={[0.014, 0.018, l.h, 5]} position={[0, l.h / 2, 0]} color="#5d7a4c" shadow={false} />
            <group position={[0, l.h, 0]} rotation={[0, 0, 0.9]}>
              <Ball radius={l.size} segments={10} scale={[1.15, 0.07, 0.95]} position={[0, 0, 0]} color={l.color} />
              {/* pale midrib and two side veins */}
              <Box size={[l.size * 1.9, 0.012, 0.018]} position={[0, l.size * 0.075, 0]} color={palette.sageSoft} shadow={false} />
              <Box size={[0.016, 0.012, l.size * 1.1]} position={[l.size * 0.2, l.size * 0.07, 0]} rotation={[0, 0.5, 0]} color={palette.sageSoft} shadow={false} />
              <Box size={[0.016, 0.012, l.size * 0.9]} position={[-l.size * 0.35, l.size * 0.065, 0]} rotation={[0, 0.5, 0]} color={palette.sageSoft} shadow={false} />
            </group>
          </group>
        ))}
      </group>
    </group>
  );
}

/** Small potted citrus tree with a few bright fruit. */
export function CitrusTree() {
  const crown = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (crown.current && !env.reducedMotion) crown.current.rotation.z = Math.sin(clock.elapsedTime * 0.7) * 0.02;
  });
  const fruit: [number, number, number][] = [
    [0.22, 0.02, 0.2],
    [-0.24, 0.1, 0.12],
    [0.05, -0.12, 0.3],
    [0.3, 0.2, -0.05],
    [-0.1, 0.24, 0.26],
  ];
  return (
    <group>
      <Cyl args={[0.26, 0.2, 0.4, 16]} position={[0, 0.2, 0]} color={palette.terracotta} />
      <Cyl args={[0.28, 0.28, 0.06, 16]} position={[0, 0.41, 0]} color="#c95f49" />
      <Cyl args={[0.03, 0.045, 0.6, 7]} position={[0, 0.7, 0]} color={palette.woodDark} />
      <group ref={crown} userData={LIVE} position={[0, 1.12, 0]}>
        <mesh castShadow>
          <icosahedronGeometry args={[0.34, 1]} />
          <Toon color={palette.leaf} />
        </mesh>
        <mesh castShadow position={[0.2, 0.16, 0.05]}>
          <icosahedronGeometry args={[0.24, 1]} />
          <Toon color={palette.sage} />
        </mesh>
        <mesh castShadow position={[-0.2, 0.1, -0.05]}>
          <icosahedronGeometry args={[0.22, 1]} />
          <Toon color="#4f8a57" />
        </mesh>
        {fruit.map((p, i) => (
          <Ball key={i} radius={0.06} segments={8} position={p} color={palette.orange} />
        ))}
      </group>
    </group>
  );
}
