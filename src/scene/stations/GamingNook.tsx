import { useEffect, useMemo, useRef } from 'react';
import { RoundedBox } from '@react-three/drei';
import { CanvasTexture, NearestFilter, SRGBColorSpace, type Group, type MeshToonMaterial } from 'three';
import { env } from '../env';
import { palette } from '../palette';
import { Ball, Box, Cyl } from '../primitives';
import { useStationAnim } from '../useStationAnim';
import type { StationModelProps } from './registry';

const GW = 64;
const GH = 48;

/** One frame of the tiny side-scroller that plays on the CRT. */
function drawGame(ctx: CanvasRenderingContext2D, time: number) {
  ctx.fillStyle = '#7ec8e3';
  ctx.fillRect(0, 0, GW, GH);
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 3; i++) {
    const x = Math.floor(((i * 27 - time * 3) % (GW + 12) + GW + 12) % (GW + 12)) - 12;
    ctx.fillRect(x, 6 + i * 5, 10, 3);
    ctx.fillRect(x + 2, 4 + i * 5, 6, 2);
  }
  ctx.fillStyle = '#6aa84f';
  ctx.fillRect(0, 38, GW, 3);
  ctx.fillStyle = '#8a5433';
  ctx.fillRect(0, 41, GW, 7);
  ctx.fillStyle = '#6b3f25';
  for (let x = -8; x < GW; x += 8) ctx.fillRect(Math.floor(x + 8 - ((time * 12) % 8)), 43, 3, 2);
  // coins
  ctx.fillStyle = '#ffd23f';
  for (let i = 0; i < 3; i++) {
    const x = Math.floor(((i * 30 - time * 12) % (GW + 8) + GW + 8) % (GW + 8)) - 4;
    ctx.fillRect(x, 22 + (i % 2) * 5, 3, 4);
  }
  // hero: hops on a loop
  const hop = Math.abs(Math.sin(time * 3.2));
  const y = Math.floor(30 - hop * 12);
  ctx.fillStyle = '#e2725b';
  ctx.fillRect(18, y, 8, 8);
  ctx.fillStyle = '#fff3df';
  ctx.fillRect(20, y + 2, 2, 2);
  ctx.fillRect(24, y + 2, 2, 2);
  ctx.fillStyle = '#3b2a3a';
  ctx.fillRect(21, y + 2, 1, 2);
  ctx.fillRect(25, y + 2, 1, 2);
  ctx.fillRect(18 + (Math.floor(time * 8) % 2) * 5, y + 8, 3, hop < 0.15 ? 2 : 1);
  // score
  ctx.fillStyle = '#3b2a3a';
  for (let i = 0; i < 4; i++) ctx.fillRect(44 + i * 4, 3, 3, 4);
}

function Figure({ color, hair }: { color: string; hair: string }) {
  return (
    <group>
      <Cyl args={[0.1, 0.1, 0.03, 14]} position={[0, 0.015, 0]} color={palette.dark} />
      <mesh position={[0, 0.14, 0]} castShadow>
        <coneGeometry args={[0.09, 0.22, 10]} />
        <inkToonMaterial color={color} />
      </mesh>
      <Ball radius={0.085} position={[0, 0.3, 0]} color="#ffe2c9" />
      <Ball radius={0.09} position={[0, 0.325, -0.015]} scale={[1, 0.8, 1]} color={hair} />
    </group>
  );
}

/** CRT with a playable-looking pixel game, a console, and a shelf of hopping figures. */
export function GamingNook({ station }: StationModelProps) {
  const figures = useRef<Group>(null);
  const screenMat = useRef<MeshToonMaterial>(null);
  const pad = useRef<Group>(null);
  const lastDraw = useRef(-1);

  const game = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = GW;
    canvas.height = GH;
    const ctx = canvas.getContext('2d');
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.magFilter = texture.minFilter = NearestFilter;
    texture.generateMipmaps = false;
    if (ctx) drawGame(ctx, 0);
    return { ctx, texture };
  }, []);
  useEffect(() => () => game.texture.dispose(), [game]);

  useStationAnim(station.id, ({ t, hover, active }) => {
    // Redraw the game at ~12fps: plenty for pixel art, cheap for the GPU.
    if (game.ctx && t - lastDraw.current > 1 / 12) {
      lastDraw.current = t;
      drawGame(game.ctx, t);
      game.texture.needsUpdate = true;
    }
    if (screenMat.current) screenMat.current.emissiveIntensity = 0.75 + env.night * 0.5 + active * 0.25;
    const lively = Math.max(hover, active);
    figures.current?.children.forEach((f, i) => {
      const k = Math.max(0, Math.sin(t * 4 - i * 0.9));
      f.position.y = k * 0.16 * lively;
      f.rotation.y = active * t * 1.2 * (i % 2 ? -1 : 1);
    });
    if (pad.current) {
      pad.current.position.y = 0.05 + lively * (0.5 + Math.sin(t * 2) * 0.05);
      pad.current.rotation.x = lively * -0.9;
      pad.current.rotation.z = Math.sin(t * 2.6) * 0.12 * lively;
    }
  });

  return (
    <group>
      {/* low cabinet */}
      <RoundedBox args={[1.9, 0.5, 0.75]} radius={0.04} position={[0, 0.36, 0]} castShadow receiveShadow>
        <inkToonMaterial color={palette.woodLight} />
      </RoundedBox>
      {[-0.8, 0.8].map((x) => (
        <Cyl key={x} args={[0.04, 0.03, 0.12, 8]} position={[x, 0.06, 0.25]} color={palette.woodDark} />
      ))}
      <Box size={[0.8, 0.32, 0.02]} position={[-0.45, 0.36, 0.38]} color={palette.cream} shadow={false} />
      <Box size={[0.8, 0.32, 0.02]} position={[0.45, 0.36, 0.38]} color={palette.cream} shadow={false} />

      {/* CRT */}
      <group position={[-0.25, 1.1, 0]}>
        <RoundedBox args={[1.15, 0.95, 0.8]} radius={0.08} castShadow>
          <inkToonMaterial color={palette.cream} />
        </RoundedBox>
        <Box size={[0.9, 0.7, 0.04]} position={[-0.06, 0.04, 0.4]} color={palette.dark} shadow={false} />
        <mesh position={[-0.06, 0.04, 0.425]}>
          <planeGeometry args={[0.8, 0.6]} />
          <inkToonMaterial ref={screenMat} map={game.texture} emissiveMap={game.texture} emissive="#ffffff" emissiveIntensity={0.75} />
        </mesh>
        <Ball radius={0.03} position={[0.48, 0.2, 0.41]} color={palette.terracotta} shadow={false} />
        <Ball radius={0.03} position={[0.48, 0.08, 0.41]} color={palette.mustard} shadow={false} />
        <Cyl args={[0.01, 0.01, 0.5, 6]} position={[-0.2, 0.68, -0.1]} rotation={[0, 0, 0.5]} color={palette.metal} />
        <Cyl args={[0.01, 0.01, 0.5, 6]} position={[0.1, 0.68, -0.1]} rotation={[0, 0, -0.5]} color={palette.metal} />
      </group>

      {/* console + cartridges */}
      <Box size={[0.42, 0.1, 0.34]} position={[0.62, 0.66, 0.1]} color={palette.blue} />
      <Box size={[0.2, 0.03, 0.12]} position={[0.62, 0.72, 0.1]} color={palette.dark} shadow={false} />
      <Box size={[0.16, 0.2, 0.04]} position={[0.62, 0.76, -0.2]} rotation={[-0.2, 0, 0]} color={palette.mustard} />
      <Box size={[0.16, 0.2, 0.04]} position={[0.76, 0.76, -0.26]} rotation={[-0.2, 0.3, 0]} color={palette.rose} />

      {/* controller: lifts off the floor as if someone picked it up */}
      <group ref={pad} position={[-0.45, 0.05, 1.0]}>
        <RoundedBox args={[0.42, 0.07, 0.22]} radius={0.03} castShadow>
          <inkToonMaterial color={palette.cream} />
        </RoundedBox>
        <Box size={[0.1, 0.02, 0.03]} position={[-0.11, 0.04, 0]} color={palette.dark} shadow={false} />
        <Box size={[0.03, 0.02, 0.1]} position={[-0.11, 0.04, 0]} color={palette.dark} shadow={false} />
        <Ball radius={0.025} position={[0.09, 0.04, 0.03]} color={palette.terracotta} shadow={false} />
        <Ball radius={0.025} position={[0.14, 0.04, -0.02]} color={palette.mustard} shadow={false} />
      </group>

      {/* beanbag */}
      <Ball radius={0.5} position={[0.55, 0.3, 1.35]} scale={[1.1, 0.62, 1]} color={palette.blue} roughness={0.95} />
      <Ball radius={0.3} position={[0.55, 0.52, 1.18]} scale={[1.2, 0.5, 0.8]} color="#6f8be0" roughness={0.95} />

      {/* figure shelf on the wall */}
      <Box size={[1.3, 0.05, 0.26]} position={[0.15, 2.5, -0.62]} color={palette.wood} />
      <group ref={figures} position={[0.15, 2.525, -0.62]}>
        <group position={[-0.42, 0, 0]}><Figure color={palette.terracotta} hair={palette.ink} /></group>
        <group position={[0, 0, 0]}><Figure color={palette.mint} hair={palette.rose} /></group>
        <group position={[0.42, 0, 0]}><Figure color={palette.plum} hair={palette.mustard} /></group>
      </group>
    </group>
  );
}
