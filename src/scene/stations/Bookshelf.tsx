import { useMemo, useRef } from 'react';
import { MathUtils, type Group, type MeshToonMaterial } from 'three';
import { env } from '../env';
import { palette } from '../palette';
import { Ball, Box, Cyl } from '../primitives';
import { Vine } from '../props/Greenery';
import { seeded } from '../textures';
import { useStationAnim } from '../useStationAnim';
import type { StationModelProps } from './registry';

const SPINES = [palette.terracotta, palette.mustard, palette.sage, palette.teal, palette.plum, palette.rose, palette.blue, palette.cream];
const SHELF_Y = [0.12, 0.86, 1.6, 2.34];
const W = 1.7;

/** Shelf of stories. One book slides out, floats forward and falls open. */
export function Bookshelf({ station }: StationModelProps) {
  const hero = useRef<Group>(null);
  const coverL = useRef<Group>(null);
  const coverR = useRef<Group>(null);
  const glow = useRef<MeshToonMaterial>(null);
  const wiggle = useRef<Group>(null);

  const books = useMemo(() => {
    const rand = seeded(42);
    const out: { x: number; y: number; w: number; h: number; color: string; lean: number }[] = [];
    SHELF_Y.forEach((y, row) => {
      let x = -W / 2 + 0.1;
      while (x < W / 2 - 0.22) {
        const w = 0.07 + rand() * 0.07;
        const h = 0.42 + rand() * 0.2;
        // leave a gap on the third shelf for the hero book and one for trinkets
        const gap = (row === 2 && x > -0.15 && x < 0.1) || (row === 3 && x > 0.2);
        if (!gap) out.push({ x: x + w / 2, y: y + 0.04 + h / 2, w, h, color: SPINES[Math.floor(rand() * SPINES.length)], lean: rand() > 0.9 ? 0.18 : 0 });
        x += w + 0.012;
      }
    });
    return out;
  }, []);

  useStationAnim(station.id, ({ t, hover, active }) => {
    if (hero.current) {
      const out = Math.max(hover * 0.35, active);
      hero.current.position.set(0, 1.94 + active * 0.12 + Math.sin(t * 1.5) * 0.03 * active, 0.02 + out * 0.75);
      hero.current.rotation.y = active * (Math.PI / 2);
      hero.current.rotation.x = -active * 0.35;
    }
    const open = MathUtils.smoothstep(active, 0.4, 1) * 1.15;
    if (coverL.current) coverL.current.rotation.z = open;
    if (coverR.current) coverR.current.rotation.z = -open;
    if (glow.current) glow.current.emissiveIntensity = active * (1.2 + Math.sin(t * 3) * 0.3) + env.night * 0.2;
    // neighbours shuffle a little when hovered
    wiggle.current?.children.forEach((b, i) => {
      b.position.z = Math.max(0, Math.sin(t * 2 + i * 0.8)) * hover * 0.05 * (i % 3 === 0 ? 1 : 0);
    });
  });

  return (
    <group>
      <Box size={[W + 0.12, 3.1, 0.06]} position={[0, 1.55, -0.2]} color={palette.woodDark} />
      <Box size={[0.07, 3.1, 0.5]} position={[-W / 2 - 0.03, 1.55, 0.02]} color={palette.wood} />
      <Box size={[0.07, 3.1, 0.5]} position={[W / 2 + 0.03, 1.55, 0.02]} color={palette.wood} />
      {[...SHELF_Y, 3.08].map((y) => (
        <Box key={y} size={[W + 0.12, 0.06, 0.5]} position={[0, y, 0.02]} color={palette.wood} />
      ))}

      <group ref={wiggle}>
        {books.map((b, i) => (
          <group key={i}>
            <Box size={[b.w, b.h, 0.32]} position={[b.x, b.y, 0]} rotation={[0, 0, b.lean]} color={b.color} shadow={false} />
          </group>
        ))}
      </group>

      {/* hero book: two covers hinged at the spine with glowing pages between */}
      <group ref={hero} position={[0, 1.94, 0.02]}>
        <group ref={coverL}>
          <Box size={[0.03, 0.56, 0.36]} position={[-0.03, 0, 0]} color={palette.plum} />
          <Box size={[0.004, 0.3, 0.2]} position={[-0.047, 0.04, 0]} color={palette.mustard} shadow={false} />
        </group>
        <group ref={coverR}>
          <Box size={[0.03, 0.56, 0.36]} position={[0.03, 0, 0]} color={palette.plum} />
        </group>
        <mesh>
          <boxGeometry args={[0.03, 0.52, 0.33]} />
          <inkToonMaterial ref={glow} color={palette.paper} emissive="#ffe6a8" emissiveIntensity={0} />
        </mesh>
      </group>

      {/* trinkets */}
      <Ball radius={0.13} position={[0.5, 2.53, 0.02]} color={palette.mint} flat segments={6} />
      <Box size={[0.2, 0.26, 0.04]} position={[0.72, 2.53, 0.0]} rotation={[-0.15, -0.3, 0]} color={palette.cream} />
      {/* the little figure who guards the shelf */}
      <group position={[-0.45, 3.11, 0.04]}>
        <Ball radius={0.11} position={[0, 0.11, 0]} scale={[1, 1.1, 0.9]} color={palette.teal} />
        <Ball radius={0.1} position={[0, 0.3, 0]} color="#ffe2c9" />
        <Ball radius={0.108} position={[0, 0.33, -0.02]} scale={[1.05, 0.85, 1]} color={palette.ink} />
        <Ball radius={0.05} position={[-0.09, 0.24, -0.02]} scale={[0.6, 1.4, 0.8]} color={palette.ink} />
        <Ball radius={0.05} position={[0.09, 0.24, -0.02]} scale={[0.6, 1.4, 0.8]} color={palette.ink} />
        <Ball radius={0.012} position={[-0.035, 0.3, 0.095]} color={palette.ink} shadow={false} segments={6} />
        <Ball radius={0.012} position={[0.035, 0.3, 0.095]} color={palette.ink} shadow={false} segments={6} />
      </group>
      {/* potted vine trailing down the side */}
      <Cyl args={[0.1, 0.08, 0.14, 10]} position={[-0.72, 3.18, 0.06]} color={palette.terracotta} />
      <Ball radius={0.1} position={[-0.72, 3.27, 0.06]} scale={[1, 0.6, 1]} segments={8} color={palette.leaf} />
      <Vine seed={3} length={2.2} leaves={16} position={[-0.93, 3.22, 0.12]} />
      <Vine seed={4} length={1.3} leaves={10} position={[-0.8, 3.22, 0.24]} />
      <Box size={[0.5, 0.1, 0.34]} position={[0.3, 3.16, 0.02]} rotation={[0, 0.2, 0]} color={palette.teal} />
      <Box size={[0.44, 0.08, 0.3]} position={[0.3, 3.25, 0.02]} rotation={[0, -0.15, 0]} color={palette.mustard} />
    </group>
  );
}
