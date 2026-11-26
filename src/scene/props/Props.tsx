import { useCallback, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils, type Group, type MeshToonMaterial, type PointLight } from 'three';
import { room } from '../../content';
import { useRoomStore } from '../../state/useRoomStore';
import { env } from '../env';
import { useInteractive } from '../Interactive';
import { palette } from '../palette';
import { Ball, Box, Cyl } from '../primitives';

/** Floor lamp. Click it to switch between day and night. */
export function Lamp({ position }: { position: [number, number, number] }) {
  const bulb = useRef<MeshToonMaterial>(null);
  const light = useRef<PointLight>(null);
  const shade = useRef<Group>(null);
  const toggle = useCallback(() => useRoomStore.getState().toggleMode(), []);
  const handlers = useInteractive('lamp', toggle);

  useFrame((_, dt) => {
    const hovered = useRoomStore.getState().hoveredId === 'lamp';
    if (bulb.current) bulb.current.emissiveIntensity = MathUtils.lerp(0.3, 4, env.night);
    if (light.current) light.current.intensity = MathUtils.lerp(0, 38, env.night);
    if (shade.current) shade.current.rotation.z = MathUtils.damp(shade.current.rotation.z, hovered ? 0.12 : 0, 6, dt);
  });

  return (
    <group position={position} {...handlers}>
      <Cyl args={[0.32, 0.36, 0.08, 24]} position={[0, 0.04, 0]} color={palette.woodDark} />
      <Cyl args={[0.035, 0.035, 2.0, 10]} position={[0, 1.05, 0]} color={palette.woodDark} />
      <group ref={shade} position={[0, 2.15, 0]}>
        <Cyl args={[0.24, 0.42, 0.5, 24]} color={palette.mustard} roughness={0.7} />
        <mesh position={[0, -0.08, 0]}>
          <sphereGeometry args={[0.13, 14, 10]} />
          <inkToonMaterial ref={bulb} color="#fff1c9" emissive="#ffcc7a" emissiveIntensity={0.3} />
        </mesh>
        <pointLight ref={light} position={[0, -0.15, 0]} color="#ffb866" intensity={0} distance={9} decay={1.6} />
      </group>
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 2.5, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

export function Plant({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const leaves = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!leaves.current || env.reducedMotion) return;
    const t = clock.elapsedTime;
    leaves.current.children.forEach((leaf, i) => {
      leaf.rotation.z = 0.5 + Math.sin(t * 0.9 + i) * 0.05;
    });
  });
  return (
    <group position={position} scale={scale}>
      <Cyl args={[0.26, 0.2, 0.42, 16]} position={[0, 0.21, 0]} color={palette.terracotta} />
      <Cyl args={[0.28, 0.28, 0.06, 16]} position={[0, 0.43, 0]} color="#c95f49" />
      <group ref={leaves} position={[0, 0.45, 0]}>
        {Array.from({ length: 7 }, (_, i) => (
          <group key={i} rotation={[0, (i / 7) * Math.PI * 2, 0.5]}>
            <mesh position={[0, 0.45 + (i % 3) * 0.14, 0]} scale={[0.32, 1, 0.08]} castShadow>
              <sphereGeometry args={[0.42 + (i % 2) * 0.1, 10, 8]} />
              <inkToonMaterial color={i % 2 ? palette.leaf : palette.sage} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

/** The resident cat. Purely for joy: poke it for a comment. */
export function Cat({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  const body = useRef<Group>(null);
  const tail = useRef<Group>(null);
  const hop = useRef(0);
  const line = useRef(0);
  const poke = useCallback(() => {
    const s = useRoomStore.getState();
    s.showToast(room.catLines[line.current++ % room.catLines.length]);
    hop.current = 1;
  }, []);
  const handlers = useInteractive('cat', poke);

  useFrame(({ clock }, dt) => {
    const t = env.reducedMotion ? 0 : clock.elapsedTime;
    hop.current = Math.max(0, hop.current - dt * 2.2);
    if (body.current) {
      const breathe = 1 + Math.sin(t * 1.6) * 0.03;
      body.current.scale.set(1, breathe, 1);
      body.current.position.y = env.reducedMotion ? 0 : Math.sin(hop.current * Math.PI) * 0.35;
    }
    if (tail.current) tail.current.rotation.y = Math.sin(t * 1.2) * 0.35;
  });

  const fur = '#f2a65a';
  return (
    <group position={position} rotation-y={rotationY} {...handlers}>
      <group ref={body}>
        <Ball radius={0.3} position={[0, 0.2, 0]} scale={[1.25, 0.7, 0.95]} color={fur} />
        <Ball radius={0.2} position={[0.3, 0.26, 0.1]} color={fur} />
        <mesh position={[0.24, 0.45, 0.02]} rotation={[0, 0, 0.2]} castShadow>
          <coneGeometry args={[0.07, 0.14, 4]} />
          <inkToonMaterial color={fur} />
        </mesh>
        <mesh position={[0.38, 0.44, 0.16]} rotation={[0, 0, -0.2]} castShadow>
          <coneGeometry args={[0.07, 0.14, 4]} />
          <inkToonMaterial color={fur} />
        </mesh>
        {/* sleepy eyes + nose */}
        <Box size={[0.07, 0.015, 0.01]} position={[0.4, 0.29, 0.25]} rotation={[0, 0.6, 0]} color={palette.ink} shadow={false} />
        <Box size={[0.07, 0.015, 0.01]} position={[0.47, 0.29, 0.13]} rotation={[0, 1.1, 0]} color={palette.ink} shadow={false} />
        <Ball radius={0.022} position={[0.47, 0.24, 0.2]} color={palette.rose} shadow={false} />
        <group ref={tail} position={[-0.32, 0.12, 0]}>
          <mesh position={[-0.12, 0, 0.14]} rotation={[Math.PI / 2, 0, 0.6]} castShadow>
            <torusGeometry args={[0.2, 0.05, 8, 14, Math.PI]} />
            <inkToonMaterial color="#e08f3f" />
          </mesh>
        </group>
      </group>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1.1, 0.7, 0.9]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}
