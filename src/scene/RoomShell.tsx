import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Sparkles } from '@react-three/drei';
import { CatmullRomCurve3, Color, MathUtils, Vector3, type Group, type Mesh, type MeshBasicMaterial, type MeshToonMaterial } from 'three';
import { env } from './env';
import { palette } from './palette';
import { Ball, Box, Cyl } from './primitives';
import { drawPlanks, drawPoster, drawWallDots, seeded, useCanvasTexture } from './textures';

const WALL_H = 4.4;
const HALF = 4.2;

function Poster({ lines, colors, size, ...props }: { lines: string[]; colors: [string, string, string]; size: [number, number]; position: [number, number, number]; rotation?: [number, number, number] }) {
  const tex = useCanvasTexture(drawPoster(lines, ...colors), 256, Math.round((256 * size[1]) / size[0]));
  return (
    <group {...props}>
      <Box size={[size[0] + 0.1, size[1] + 0.1, 0.04]} color={palette.woodDark} shadow={false} />
      <mesh position={[0, 0, 0.025]}>
        <planeGeometry args={size} />
        <inkToonMaterial map={tex} />
      </mesh>
    </group>
  );
}

const SKY_DAY = new Color('#a9dcf2');
const SKY_NIGHT = new Color('#2a2452');
const ORB_DAY = new Color('#fff2b0');
const ORB_NIGHT = new Color('#f4f1ff');

function Window({ position }: { position: [number, number, number] }) {
  const sky = useRef<MeshBasicMaterial>(null);
  const orb = useRef<MeshBasicMaterial>(null);
  const clouds = useRef<Group>(null);
  const stars = useRef<Group>(null);
  const starPositions = useMemo(() => {
    const rand = seeded(11);
    return Array.from({ length: 14 }, () => [rand() * 1.4 - 0.7, rand() * 1.1 - 0.55, 0.012] as [number, number, number]);
  }, []);

  useFrame(({ clock }) => {
    const n = env.night;
    const t = env.reducedMotion ? 0 : clock.elapsedTime;
    sky.current?.color.lerpColors(SKY_DAY, SKY_NIGHT, n);
    orb.current?.color.lerpColors(ORB_DAY, ORB_NIGHT, n);
    if (clouds.current) {
      clouds.current.children.forEach((c, i) => {
        c.position.x = ((t * 0.05 * (i + 1) + i * 0.7) % 2.2) - 1.1;
        ((c as Mesh).material as MeshBasicMaterial).opacity = 0.95 * (1 - n);
      });
    }
    if (stars.current) {
      stars.current.children.forEach((s, i) => {
        ((s as Mesh).material as MeshBasicMaterial).opacity = n * (0.6 + 0.4 * Math.sin(t * 2 + i * 1.7));
      });
    }
  });

  return (
    <group position={position}>
      <mesh>
        <planeGeometry args={[1.5, 1.2]} />
        <meshBasicMaterial ref={sky} color={SKY_DAY} toneMapped={false} />
      </mesh>
      <mesh position={[0.36, 0.22, 0.005]}>
        <circleGeometry args={[0.17, 24]} />
        <meshBasicMaterial ref={orb} toneMapped={false} />
      </mesh>
      <group ref={stars}>
        {starPositions.map((p, i) => (
          <mesh key={i} position={p}>
            <circleGeometry args={[0.014, 6]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0} toneMapped={false} />
          </mesh>
        ))}
      </group>
      <group ref={clouds}>
        {[0.1, -0.25].map((y, i) => (
          <mesh key={i} position={[0, y, 0.02]} scale={[1, 0.42, 1]}>
            <circleGeometry args={[0.22 - i * 0.05, 20]} />
            <meshBasicMaterial color="#ffffff" transparent toneMapped={false} />
          </mesh>
        ))}
      </group>
      {/* treetops outside */}
      {[[-0.5, 0.26], [-0.15, 0.2], [0.25, 0.3], [0.6, 0.22]].map(([x, r], i) => (
        <mesh key={i} position={[x, -0.6, 0.015]}>
          <circleGeometry args={[r, 18]} />
          <meshBasicMaterial color={i % 2 ? '#8fc59a' : '#74b085'} toneMapped={false} />
        </mesh>
      ))}
      {/* sill plants */}
      {[-0.5, 0.52].map((x, i) => (
        <group key={x} position={[x, -0.6, 0.14]}>
          <Cyl args={[0.085, 0.065, 0.13, 10]} position={[0, 0.065, 0]} color={palette.terracotta} />
          {[0, 1, 2, 3].map((j) => (
            <Ball key={j} radius={0.07} segments={7} position={[Math.cos(j * 1.6 + i) * 0.07, 0.2 + (j % 2) * 0.09, Math.sin(j * 1.6 + i) * 0.05]} scale={[1, 1.1, 0.5]} color={j % 2 ? palette.leaf : palette.sage} />
          ))}
        </group>
      ))}
      {/* frame hides the clouds as they drift past the edges */}
      <Box size={[1.74, 0.12, 0.14]} position={[0, 0.66, 0.05]} color={palette.trim} />
      <Box size={[1.9, 0.12, 0.26]} position={[0, -0.66, 0.1]} color={palette.trim} />
      <Box size={[0.12, 1.32, 0.14]} position={[-0.81, 0, 0.05]} color={palette.trim} />
      <Box size={[0.12, 1.32, 0.14]} position={[0.81, 0, 0.05]} color={palette.trim} />
      <Box size={[0.05, 1.2, 0.06]} position={[0, 0, 0.04]} color={palette.trim} shadow={false} />
      <Box size={[1.5, 0.05, 0.06]} position={[0, 0, 0.04]} color={palette.trim} shadow={false} />
      {/* masks so clouds never show on the wall */}
      <Box size={[0.5, 1.2, 0.03]} position={[-1.12, 0, 0.0]} color={palette.wall} shadow={false} />
      <Box size={[0.5, 1.2, 0.03]} position={[1.12, 0, 0.0]} color={palette.wall} shadow={false} />
    </group>
  );
}

const BULB_COLORS = [palette.mustard, palette.rose, palette.mint, '#ffd9a0', palette.blue];

/** A sagging string of bulbs between two points; glows harder at night. */
function FairyLights({ from, to, count }: { from: [number, number, number]; to: [number, number, number]; count: number }) {
  const bulbs = useRef<Group>(null);
  const { curve, points } = useMemo(() => {
    const a = new Vector3(...from);
    const b = new Vector3(...to);
    const swags = 3;
    const pts: Vector3[] = [];
    for (let i = 0; i <= swags * 8; i++) {
      const u = i / (swags * 8);
      const p = a.clone().lerp(b, u);
      p.y -= Math.abs(Math.sin(u * Math.PI * swags)) * 0.28;
      pts.push(p);
    }
    const c = new CatmullRomCurve3(pts);
    return { curve: c, points: c.getSpacedPoints(count + 1).slice(1, -1) };
  }, [from, to, count]);

  useFrame(({ clock }) => {
    if (!bulbs.current) return;
    const t = env.reducedMotion ? 0 : clock.elapsedTime;
    bulbs.current.children.forEach((b, i) => {
      const twinkle = 0.75 + 0.25 * Math.sin(t * 2.2 + i * 1.3);
      ((b as Mesh).material as MeshToonMaterial).emissiveIntensity = MathUtils.lerp(0.5, 3.2, env.night) * twinkle;
    });
  });

  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 48, 0.012, 5]} />
        <inkToonMaterial color={palette.dark} />
      </mesh>
      <group ref={bulbs}>
        {points.map((p, i) => (
          <mesh key={i} position={[p.x, p.y - 0.06, p.z]} userData={{ ink: false }}>
            <sphereGeometry args={[0.055, 10, 8]} />
            <inkToonMaterial color={BULB_COLORS[i % BULB_COLORS.length]} emissive={BULB_COLORS[i % BULB_COLORS.length]} emissiveIntensity={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Rug() {
  return (
    <group position={[0.45, 0, 0.45]} rotation-y={0.06}>
      <RoundedBox args={[4.0, 0.03, 2.9]} radius={0.012} position={[0, 0.016, 0]} receiveShadow>
        <inkToonMaterial color={palette.lavender} />
      </RoundedBox>
      <RoundedBox args={[3.6, 0.03, 2.5]} radius={0.012} position={[0, 0.021, 0]} receiveShadow>
        <inkToonMaterial color={palette.lavenderLight} />
      </RoundedBox>
      <RoundedBox args={[3.3, 0.03, 2.2]} radius={0.012} position={[0, 0.026, 0]} receiveShadow>
        <inkToonMaterial color={palette.lavender} />
      </RoundedBox>
      {/* fringe */}
      {Array.from({ length: 18 }, (_, i) => (
        <group key={i}>
          <Box size={[0.03, 0.012, 0.14]} position={[-1.9 + i * (3.8 / 17), 0.012, 1.5]} color={palette.cream} shadow={false} />
          <Box size={[0.03, 0.012, 0.14]} position={[-1.9 + i * (3.8 / 17), 0.012, -1.5]} color={palette.cream} shadow={false} />
        </group>
      ))}
    </group>
  );
}

/** Floor, the two cutaway walls, window, posters, fairy lights and dust motes. */
export function RoomShell() {
  const floorTex = useCanvasTexture(drawPlanks, 512, 512, { repeat: [2, 2] });
  const wallTex = useCanvasTexture(drawWallDots, 256, 256, { repeat: [5, 3] });
  const wallTexSide = useCanvasTexture(drawWallDots, 256, 256, { repeat: [5, 3] });

  return (
    <group>
      {/* floor slab */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <boxGeometry args={[HALF * 2, 0.3, HALF * 2]} />
        <inkToonMaterial attach="material-0" color={palette.floorDark} />
        <inkToonMaterial attach="material-1" color={palette.floorDark} />
        <inkToonMaterial attach="material-2" map={floorTex} />
        <inkToonMaterial attach="material-3" color={palette.floorDark} />
        <inkToonMaterial attach="material-4" color={palette.floorDark} />
        <inkToonMaterial attach="material-5" color={palette.floorDark} />
      </mesh>

      {/* back wall (z-) */}
      <mesh position={[0, WALL_H / 2 - 0.3, -HALF - 0.1]} receiveShadow>
        <boxGeometry args={[HALF * 2 + 0.4, WALL_H + 0.6, 0.2]} />
        <inkToonMaterial attach="material-0" color={palette.wallAccent} />
        <inkToonMaterial attach="material-1" color={palette.wallAccent} />
        <inkToonMaterial attach="material-2" color={palette.trim} />
        <inkToonMaterial attach="material-3" color={palette.wallAccent} />
        <inkToonMaterial attach="material-4" map={wallTex} />
        <inkToonMaterial attach="material-5" color={palette.wallAccent} />
      </mesh>
      {/* left wall (x-) */}
      <mesh position={[-HALF - 0.1, WALL_H / 2 - 0.3, 0]} receiveShadow>
        <boxGeometry args={[0.2, WALL_H + 0.6, HALF * 2]} />
        <inkToonMaterial attach="material-0" map={wallTexSide} />
        <inkToonMaterial attach="material-1" color={palette.wallAccent} />
        <inkToonMaterial attach="material-2" color={palette.trim} />
        <inkToonMaterial attach="material-3" color={palette.wallAccent} />
        <inkToonMaterial attach="material-4" color={palette.wallAccent} />
        <inkToonMaterial attach="material-5" color={palette.wallAccent} />
      </mesh>

      {/* skirting boards */}
      <Box size={[HALF * 2, 0.22, 0.06]} position={[0, 0.11, -HALF + 0.03]} color={palette.trim} />
      <Box size={[0.06, 0.22, HALF * 2]} position={[-HALF + 0.03, 0.11, 0]} color={palette.trim} />

      <Window position={[0.2, 3.05, -HALF + 0.02]} />
      <Poster position={[1.72, 3.42, -HALF + 0.03]} size={[0.8, 1.05]} lines={['MAKE', 'STUFF']} colors={[palette.cream, palette.ink, palette.terracotta]} />
      <Poster position={[-HALF + 0.03, 3.25, -0.3]} rotation={[0, Math.PI / 2, 0]} size={[0.9, 1.15]} lines={['STAY', 'NERDY']} colors={[palette.teal, palette.cream, palette.mustard]} />

      <FairyLights from={[-HALF + 0.1, 4.25, -HALF + 0.12]} to={[HALF - 0.1, 4.25, -HALF + 0.12]} count={17} />
      <FairyLights from={[-HALF + 0.12, 4.25, -HALF + 0.3]} to={[-HALF + 0.12, 4.25, HALF - 0.1]} count={17} />

      <Rug />
      <Sparkles count={36} scale={[7, 3, 7]} position={[0, 2.2, 0]} size={2.4} speed={env.reducedMotion ? 0 : 0.25} opacity={0.5} color="#fff3c4" />
    </group>
  );
}
