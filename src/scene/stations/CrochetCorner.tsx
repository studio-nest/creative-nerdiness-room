import { useRef } from 'react';
import type { Group } from 'three';
import { palette } from '../palette';
import { Ball, Cyl, Toon } from '../primitives';
import { useStationAnim } from '../useStationAnim';
import type { StationModelProps } from './registry';
import { LIVE, LIVE_CHILDREN } from '../Merge';

function YarnBall({ color, radius = 0.17 }: { color: string; radius?: number }) {
  return (
    <group>
      <Ball radius={radius} color={color} roughness={1} />
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[i * 1.1, i * 0.7, i * 0.4]}>
          <torusGeometry args={[radius * 1.005, radius * 0.06, 5, 20]} />
          <Toon color={color} />
        </mesh>
      ))}
    </group>
  );
}

const YARN: { color: string; home: [number, number, number] }[] = [
  { color: palette.rose, home: [-0.13, 0.5, 0.05] },
  { color: palette.mustard, home: [0.14, 0.5, -0.06] },
  { color: palette.mint, home: [0.0, 0.66, 0.1] },
  { color: palette.plum, home: [-0.75, 0.17, 0.55] },
];

/** A pouf, a yarn basket and a crocheted bunny that cannot sit still. */
export function CrochetCorner({ station }: StationModelProps) {
  const bunny = useRef<Group>(null);
  const ears = useRef<Group>(null);
  const yarn = useRef<Group>(null);

  useStationAnim(station.id, ({ t, hover, active }) => {
    if (bunny.current) {
      const jump = Math.abs(Math.sin(t * 3)) * active * 0.35;
      bunny.current.position.y = 0.52 + jump;
      bunny.current.rotation.y = -0.3 + Math.sin(t * 1.5) * 0.25 * Math.max(hover, active);
      const squash = 1 + Math.sin(t * 2) * 0.03 - (active > 0.5 && jump < 0.04 ? 0.08 : 0);
      bunny.current.scale.set(1, squash, 1);
    }
    if (ears.current) ears.current.rotation.x = Math.sin(t * 3) * 0.12 * (0.4 + hover + active);
    // Yarn balls jostle in the basket on hover and orbit it when focused.
    yarn.current?.children.forEach((ball, i) => {
      const { home } = YARN[i];
      const a = t * 1.2 + (i / YARN.length) * Math.PI * 2;
      const r = 0.62;
      const ox = Math.cos(a) * r;
      const oz = Math.sin(a) * r;
      const oy = 0.95 + Math.sin(t * 2 + i) * 0.12;
      const bob = Math.abs(Math.sin(t * 4 + i * 1.3)) * 0.07 * hover * (1 - active);
      ball.position.set(home[0] + (ox - home[0]) * active * (i < 3 ? 1 : 0), home[1] + bob + (oy - home[1]) * active * (i < 3 ? 1 : 0), home[2] + (oz - home[2]) * active * (i < 3 ? 1 : 0));
      ball.rotation.x = t * (0.4 + hover + active * 2) * (i % 2 ? 1 : -1);
      ball.rotation.z = t * 0.3 * (hover + active);
      if (i === 3) ball.position.x = home[0] + Math.sin(t * 0.8) * 0.15 * hover;
    });
  });

  return (
    <group>
      {/* pouf */}
      <group position={[0.75, 0, -0.1]}>
        <Ball radius={0.55} position={[0, 0.28, 0]} scale={[1, 0.5, 1]} color={palette.rose} roughness={1} />
        <mesh position={[0, 0.28, 0]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.545, 0.03, 6, 28]} />
          <Toon color="#d77a94" />
        </mesh>
        <Ball radius={0.05} position={[0, 0.555, 0]} color={palette.cream} shadow={false} />
        {/* bunny amigurumi */}
        <group ref={bunny} userData={LIVE} position={[0, 0.52, 0]} rotation-y={-0.3}>
          <Ball radius={0.2} position={[0, 0.18, 0]} scale={[1, 1.05, 0.95]} color={palette.cream} roughness={1} />
          <Ball radius={0.17} position={[0, 0.47, 0]} color={palette.cream} roughness={1} />
          <group ref={ears} userData={LIVE} position={[0, 0.6, 0]}>
            <Ball radius={0.05} position={[-0.07, 0.14, 0]} scale={[0.8, 3, 0.5]} color={palette.cream} roughness={1} />
            <Ball radius={0.05} position={[0.07, 0.14, 0]} scale={[0.8, 3, 0.5]} color={palette.cream} roughness={1} />
          </group>
          <Ball radius={0.018} position={[-0.06, 0.5, 0.155]} color={palette.ink} shadow={false} />
          <Ball radius={0.018} position={[0.06, 0.5, 0.155]} color={palette.ink} shadow={false} />
          <Ball radius={0.02} position={[0, 0.45, 0.17]} color={palette.rose} shadow={false} />
          <Ball radius={0.035} position={[-0.11, 0.44, 0.12]} scale={[1, 0.6, 0.4]} color="#f6b7c5" shadow={false} />
          <Ball radius={0.035} position={[0.11, 0.44, 0.12]} scale={[1, 0.6, 0.4]} color="#f6b7c5" shadow={false} />
          <Ball radius={0.06} position={[-0.19, 0.22, 0.06]} color={palette.cream} roughness={1} />
          <Ball radius={0.06} position={[0.19, 0.22, 0.06]} color={palette.cream} roughness={1} />
          {/* tiny scarf */}
          <mesh position={[0, 0.34, 0]} rotation-x={Math.PI / 2}>
            <torusGeometry args={[0.13, 0.035, 6, 18]} />
            <Toon color={palette.terracotta} />
          </mesh>
        </group>
      </group>

      {/* basket */}
      <group position={[-0.35, 0, 0.15]}>
        <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.42, 0.33, 0.44, 22, 1, true]} />
          <inkToonMaterial color={palette.woodLight} side={2} />
        </mesh>
        <Cyl args={[0.33, 0.33, 0.03, 22]} position={[0, 0.02, 0]} color={palette.wood} />
        {[0.12, 0.26, 0.4].map((y) => (
          <mesh key={y} position={[0, y, 0]} rotation-x={Math.PI / 2}>
            <torusGeometry args={[0.34 + y * 0.2, 0.018, 5, 26]} />
            <Toon color={palette.wood} />
          </mesh>
        ))}
        <group ref={yarn} userData={LIVE_CHILDREN}>
          {YARN.map((y, i) => (
            <group key={i} position={y.home}>
              <YarnBall color={y.color} radius={i === 3 ? 0.17 : 0.16} />
            </group>
          ))}
        </group>
      </group>

      {/* crochet hook + a granny square on the floor */}
      <Cyl args={[0.012, 0.012, 0.42, 6]} position={[0.1, 0.02, 0.75]} rotation={[Math.PI / 2, 0, 0.9]} color={palette.metal} metalness={0.5} roughness={0.3} />
      <group position={[0.45, 0.012, 0.85]} rotation={[-Math.PI / 2, 0, 0.4]}>
        {[
          [0.36, palette.teal],
          [0.26, palette.cream],
          [0.16, palette.mustard],
          [0.07, palette.terracotta],
        ].map(([s, c], i) => (
          <mesh key={i} position={[0, 0, i * 0.003]} receiveShadow>
            <planeGeometry args={[s as number, s as number]} />
            <Toon color={c as string} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
