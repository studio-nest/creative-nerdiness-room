import { useCallback, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import type { Group } from 'three';
import { room } from '../../content';
import { useRoomStore } from '../../state/useRoomStore';
import { env } from '../env';
import { useInteractive } from '../Interactive';
import { palette } from '../palette';
import { Ball, Box, Cyl } from '../primitives';
import { drawCrayon, drawLeafPrint, drawPegboard, seeded, useCanvasTexture } from '../textures';
import { Vine } from './Greenery';

export interface DecorModelProps {
  variant?: string;
}

const BOOK_COLORS = [palette.terracotta, palette.mustard, palette.sage, palette.teal, palette.plum, palette.rose, palette.blue, palette.lavender];

/** Conical straw hat hanging on a wall peg. Origin is on the wall; +z points into the room. */
export function NonLa() {
  const hat = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (hat.current && !env.reducedMotion) hat.current.rotation.z = Math.sin(clock.elapsedTime * 0.7) * 0.03;
  });
  return (
    <group>
      <Cyl args={[0.025, 0.025, 0.14, 6]} position={[0, 0.3, 0.07]} rotation={[Math.PI / 2, 0, 0]} color={palette.woodDark} />
      <group ref={hat} position={[0, 0.3, 0.1]}>
        <group position={[0, -0.3, 0.12]} rotation={[Math.PI / 2 - 0.25, 0, 0]}>
          <mesh castShadow>
            <coneGeometry args={[0.5, 0.3, 28]} />
            <inkToonMaterial color={palette.straw} />
          </mesh>
          {[0.17, 0.32, 0.46].map((r) => (
            <mesh key={r} position={[0, 0.15 - (r / 0.5) * 0.3 + 0.012, 0]} rotation-x={Math.PI / 2}>
              <torusGeometry args={[r, 0.008, 4, 28]} />
              <inkToonMaterial color="#c9a866" />
            </mesh>
          ))}
        </group>
        <Box size={[0.03, 0.55, 0.01]} position={[-0.12, -0.72, 0.1]} rotation={[0, 0, 0.12]} color={palette.rose} shadow={false} />
        <Box size={[0.03, 0.5, 0.01]} position={[0.12, -0.7, 0.1]} rotation={[0, 0, -0.14]} color={palette.rose} shadow={false} />
      </group>
    </group>
  );
}

/** Acoustic guitar leaning on the wall. Click it for a strum. */
export function Guitar() {
  const body = useRef<Group>(null);
  const strum = useRef(0);
  const line = useRef(0);
  const play = useCallback(() => {
    useRoomStore.getState().showToast(room.guitarLines[line.current++ % room.guitarLines.length]);
    strum.current = 1;
  }, []);
  const handlers = useInteractive('guitar', play);
  useFrame(({ clock }, dt) => {
    strum.current = Math.max(0, strum.current - dt * 1.2);
    if (!body.current) return;
    const hovered = useRoomStore.getState().hoveredId === 'guitar';
    const shake = env.reducedMotion ? 0 : Math.sin(clock.elapsedTime * 38) * strum.current * 0.03;
    body.current.rotation.z = shake + (hovered ? 0.04 : 0);
  });
  return (
    <group {...handlers}>
      <group position={[0, 0, 0.42]} rotation={[-0.22, 0, 0]}>
        <group ref={body}>
          <Ball radius={0.3} position={[0, 0.34, 0]} scale={[1, 1, 0.3]} color={palette.wood} />
          <Ball radius={0.22} position={[0, 0.72, 0]} scale={[1, 1, 0.34]} color={palette.wood} />
          <mesh position={[0, 0.5, 0.095]}>
            <circleGeometry args={[0.075, 18]} />
            <meshBasicMaterial color={palette.dark} />
          </mesh>
          <Box size={[0.16, 0.035, 0.03]} position={[0, 0.24, 0.1]} color={palette.dark} shadow={false} />
          <Box size={[0.085, 0.82, 0.04]} position={[0, 1.28, 0.03]} color={palette.woodDark} />
          <Box size={[0.13, 0.2, 0.04]} position={[0, 1.78, 0.02]} color={palette.wood} />
          <Box size={[0.012, 1.42, 0.006]} position={[0, 0.95, 0.075]} color={palette.cream} shadow={false} />
          {[-0.07, 0.07].map((x) => [1.72, 1.8].map((y) => <Ball key={`${x}${y}`} radius={0.018} position={[x, y, 0.02]} color={palette.cream} shadow={false} />))}
        </group>
      </group>
      <mesh position={[0, 0.9, 0.25]}>
        <boxGeometry args={[0.75, 1.9, 0.6]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

/** Tool pegboard above the desk: cups of pens, scissors, tape. */
export function Pegboard() {
  const tex = useCanvasTexture(drawPegboard, 256, 170);
  return (
    <group>
      <Box size={[1.1, 0.76, 0.04]} color={palette.woodLight} />
      <mesh position={[0, 0, 0.022]}>
        <planeGeometry args={[1.02, 0.68]} />
        <inkToonMaterial map={tex} />
      </mesh>
      {[-0.36, -0.12, 0.12].map((x, i) => (
        <group key={x} position={[x, 0.08, 0.1]}>
          <Cyl args={[0.07, 0.06, 0.16, 10]} color={[palette.sageSoft, palette.cream, palette.lavender][i]} />
          {[0, 1, 2].map((j) => (
            <Cyl key={j} args={[0.01, 0.01, 0.2, 5]} position={[(j - 1) * 0.03, 0.14, 0]} rotation={[0, 0, (j - 1) * 0.12]} color={BOOK_COLORS[(i * 3 + j) % BOOK_COLORS.length]} shadow={false} />
          ))}
        </group>
      ))}
      {/* scissors */}
      <group position={[0.38, 0.12, 0.05]} rotation={[0, 0, 0.1]}>
        {[-0.035, 0.035].map((x) => (
          <mesh key={x} position={[x, 0.08, 0]}>
            <torusGeometry args={[0.035, 0.012, 5, 12]} />
            <inkToonMaterial color={palette.terracotta} />
          </mesh>
        ))}
        <Box size={[0.02, 0.2, 0.01]} position={[0.012, -0.06, 0]} rotation={[0, 0, 0.12]} color={palette.metal} shadow={false} />
        <Box size={[0.02, 0.2, 0.01]} position={[-0.012, -0.06, 0]} rotation={[0, 0, -0.12]} color={palette.metal} shadow={false} />
      </group>
      {/* washi tape rolls on a peg */}
      {[palette.rose, palette.mustard, palette.mint].map((c, i) => (
        <mesh key={c} position={[-0.38 + i * 0.13, -0.2, 0.06]} castShadow>
          <torusGeometry args={[0.04, 0.02, 6, 14]} />
          <inkToonMaterial color={c} />
        </mesh>
      ))}
      <Box size={[0.4, 0.03, 0.12]} position={[0.28, -0.24, 0.07]} color={palette.wood} />
      <Ball radius={0.05} position={[0.2, -0.18, 0.08]} color={palette.leaf} segments={7} />
      <Cyl args={[0.035, 0.03, 0.06, 8]} position={[0.2, -0.2, 0.08]} color={palette.terracotta} />
      <Box size={[0.1, 0.12, 0.03]} position={[0.38, -0.165, 0.08]} color={palette.lavender} />
    </group>
  );
}

/** Corkboard of pinned notes and sketches. */
export function Corkboard() {
  const leaf = useCanvasTexture(drawLeafPrint('sprig'), 96, 128);
  const notes: { p: [number, number]; s: [number, number]; r: number; c: string }[] = [
    { p: [-0.26, 0.2], s: [0.2, 0.2], r: 0.08, c: '#fff2a8' },
    { p: [0.22, 0.24], s: [0.24, 0.16], r: -0.1, c: palette.rose },
    { p: [0.26, -0.2], s: [0.2, 0.22], r: 0.12, c: palette.mint },
    { p: [-0.02, 0.27], s: [0.16, 0.12], r: -0.04, c: palette.lavenderLight },
    { p: [-0.3, -0.24], s: [0.16, 0.16], r: -0.14, c: palette.paper },
  ];
  return (
    <group>
      <Box size={[0.98, 0.86, 0.04]} color={palette.woodDark} />
      <Box size={[0.9, 0.78, 0.02]} position={[0, 0, 0.018]} color={palette.cork} shadow={false} />
      <mesh position={[-0.03, -0.06, 0.032]} rotation-z={0.05}>
        <planeGeometry args={[0.26, 0.34]} />
        <inkToonMaterial map={leaf} />
      </mesh>
      {notes.map((n, i) => (
        <group key={i} position={[n.p[0], n.p[1], 0.031 + i * 0.001]} rotation-z={n.r}>
          <mesh>
            <planeGeometry args={n.s} />
            <inkToonMaterial color={n.c} />
          </mesh>
          <Ball radius={0.016} position={[0, n.s[1] / 2 - 0.025, 0.012]} color={i % 2 ? palette.terracotta : palette.blue} shadow={false} segments={6} />
        </group>
      ))}
    </group>
  );
}

/** A crayon drawing taped to the wall, slightly crooked on purpose. */
export function CrayonDrawing() {
  const tex = useCanvasTexture(drawCrayon, 192, 240);
  return (
    <group rotation-z={-0.06}>
      <mesh position={[0, 0, 0.012]}>
        <planeGeometry args={[0.62, 0.78]} />
        <inkToonMaterial map={tex} />
      </mesh>
      <Box size={[0.16, 0.05, 0.004]} position={[-0.22, 0.38, 0.016]} rotation={[0, 0, 0.4]} color={palette.mustard} shadow={false} />
      <Box size={[0.16, 0.05, 0.004]} position={[0.24, 0.37, 0.016]} rotation={[0, 0, -0.5]} color={palette.rose} shadow={false} />
    </group>
  );
}

export function LeafPrint({ variant = 'fern' }: DecorModelProps) {
  const tex = useCanvasTexture(drawLeafPrint(variant), 96, 128);
  return (
    <group rotation-z={variant === 'fern' ? 0.03 : -0.04}>
      <Box size={[0.46, 0.6, 0.035]} color={palette.woodLight} />
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[0.38, 0.52]} />
        <inkToonMaterial map={tex} />
      </mesh>
    </group>
  );
}

/** Wall shelf of books and jars with a vine trailing off one end. */
export function WallShelf() {
  const books = useMemo(() => {
    const rand = seeded(9);
    const out: { x: number; w: number; h: number; color: string }[] = [];
    let x = -0.72;
    while (x < 0.15) {
      const w = 0.06 + rand() * 0.06;
      out.push({ x: x + w / 2, w, h: 0.3 + rand() * 0.14, color: BOOK_COLORS[Math.floor(rand() * BOOK_COLORS.length)] });
      x += w + 0.01;
    }
    return out;
  }, []);
  return (
    <group>
      <Box size={[1.7, 0.05, 0.3]} color={palette.wood} />
      {[-0.65, 0.65].map((x) => (
        <Box key={x} size={[0.04, 0.2, 0.22]} position={[x, -0.12, -0.03]} color={palette.woodDark} />
      ))}
      {books.map((b, i) => (
        <Box key={i} size={[b.w, b.h, 0.22]} position={[b.x, 0.025 + b.h / 2, 0]} color={b.color} />
      ))}
      {/* jars */}
      {[0.3, 0.46].map((x, i) => (
        <group key={x} position={[x, 0.025, 0.02]}>
          <Cyl args={[0.06, 0.06, 0.16 - i * 0.04, 10]} position={[0, 0.08 - i * 0.02, 0]} color={i ? '#f1d9a8' : '#cfe6dc'} />
          <Cyl args={[0.064, 0.064, 0.025, 10]} position={[0, 0.17 - i * 0.04, 0]} color={palette.woodDark} />
        </group>
      ))}
      <Cyl args={[0.1, 0.08, 0.14, 10]} position={[0.7, 0.095, 0.02]} color={palette.cream} />
      <Ball radius={0.11} position={[0.7, 0.19, 0.02]} scale={[1, 0.6, 1]} segments={8} color={palette.leaf} />
      <Vine seed={7} length={1.1} leaves={10} position={[0.78, 0.16, 0.12]} />
      <Vine seed={8} length={0.7} leaves={7} position={[0.62, 0.16, 0.14]} />
    </group>
  );
}

function OpenBook({ pencil = false }: { pencil?: boolean }) {
  return (
    <group>
      <Box size={[0.3, 0.02, 0.4]} position={[-0.15, 0, 0]} rotation={[0, 0, 0.12]} color={palette.paper} />
      <Box size={[0.3, 0.02, 0.4]} position={[0.15, 0, 0]} rotation={[0, 0, -0.12]} color={palette.paper} />
      {[-0.12, -0.04, 0.04, 0.12].map((z) => (
        <Box key={z} size={[0.2, 0.004, 0.012]} position={[-0.15, 0.03, z]} rotation={[0, 0, 0.12]} color="#c9b8a4" shadow={false} />
      ))}
      <Ball radius={0.06} position={[0.15, 0.03, 0]} scale={[1, 0.08, 1.3]} segments={8} color={palette.sage} shadow={false} />
      {pencil && <Cyl args={[0.012, 0.012, 0.26, 6]} position={[0.36, 0.02, 0.1]} rotation={[Math.PI / 2, 0, 0.5]} color={palette.ink} shadow={false} />}
    </group>
  );
}

/** Squashy beanbag. `sketchbook`: butter yellow with an open sketchbook; `reading`: sage with a pillow and a novel. */
export function Beanbag({ variant = 'sketchbook' }: DecorModelProps) {
  const reading = variant === 'reading';
  const color = reading ? palette.sageSoft : palette.butter;
  const shade = reading ? '#93bd90' : '#e3b63a';
  return (
    <group>
      <Ball radius={0.72} position={[0, 0.3, 0]} scale={[1.08, 0.5, 1]} segments={18} color={color} />
      <Ball radius={0.5} position={[-0.08, 0.5, -0.12]} scale={[1.15, 0.42, 1]} segments={14} color={shade} />
      {reading && (
        <RoundedBox args={[0.5, 0.14, 0.44]} radius={0.06} position={[-0.2, 0.72, -0.26]} rotation={[0.5, 0.4, 0]} castShadow>
          <inkToonMaterial color={palette.butter} />
        </RoundedBox>
      )}
      <group position={[0.14, reading ? 0.68 : 0.7, 0.12]} rotation={[0.08, -0.4, 0]}>
        <OpenBook pencil={!reading} />
      </group>
    </group>
  );
}

/** Round wooden tray with a mug of tea, a few letters and a bud vase. */
export function LetterTray() {
  return (
    <group>
      <Cyl args={[0.46, 0.42, 0.05, 22]} position={[0, 0.025, 0]} color={palette.wood} />
      <mesh position={[0, 0.05, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.44, 0.03, 6, 26]} />
        <inkToonMaterial color={palette.woodDark} />
      </mesh>
      <Cyl args={[0.08, 0.07, 0.14, 12]} position={[-0.18, 0.12, -0.1]} color={palette.cream} />
      <mesh position={[-0.27, 0.12, -0.1]}>
        <torusGeometry args={[0.04, 0.012, 5, 10]} />
        <inkToonMaterial color={palette.cream} />
      </mesh>
      <Ball radius={0.035} position={[-0.18, 0.12, -0.02]} scale={[1, 1, 0.2]} color={palette.leaf} shadow={false} segments={6} />
      {[0, 1, 2].map((i) => (
        <Box key={i} size={[0.26, 0.012, 0.18]} position={[0.1 + i * 0.03, 0.062 + i * 0.013, 0.1 - i * 0.04]} rotation={[0, 0.3 - i * 0.4, 0]} color={i === 1 ? palette.lavenderLight : palette.paper} />
      ))}
      <Ball radius={0.02} position={[0.16, 0.1, 0.02]} color={palette.terracotta} shadow={false} segments={6} />
      <Cyl args={[0.035, 0.05, 0.14, 8]} position={[0.14, 0.12, -0.22]} color="#cfe6dc" />
      {[-0.05, 0, 0.05].map((x, i) => (
        <group key={x} position={[0.14 + x, 0.19, -0.22]} rotation={[0, 0, -x * 5]}>
          <Cyl args={[0.005, 0.005, 0.2, 4]} position={[0, 0.1, 0]} color="#5d7a4c" shadow={false} />
          <Ball radius={0.028} position={[0, 0.21, 0]} color={i === 1 ? palette.butter : palette.paper} segments={6} />
        </group>
      ))}
    </group>
  );
}

/** A leaning pile of books. `tall` stacks a few more. */
export function BookStack({ variant }: DecorModelProps) {
  const books = useMemo(() => {
    const rand = seeded(variant === 'tall' ? 61 : 17);
    let y = 0;
    return Array.from({ length: variant === 'tall' ? 7 : 4 }, () => {
      const h = 0.06 + rand() * 0.04;
      const b = { y: y + h / 2, h, w: 0.36 + rand() * 0.12, d: 0.26 + rand() * 0.08, rot: (rand() - 0.5) * 0.7, color: BOOK_COLORS[Math.floor(rand() * BOOK_COLORS.length)] };
      y += h;
      return b;
    });
  }, [variant]);
  return (
    <group>
      {books.map((b, i) => (
        <group key={i} position={[0, b.y, 0]} rotation-y={b.rot}>
          <Box size={[b.w, b.h, b.d]} color={b.color} />
          <Box size={[b.w - 0.03, b.h * 0.6, b.d + 0.004]} position={[0.02, 0, 0]} color={palette.paper} shadow={false} />
        </group>
      ))}
    </group>
  );
}
