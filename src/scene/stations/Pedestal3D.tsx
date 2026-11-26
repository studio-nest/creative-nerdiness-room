import { useRef } from 'react';
import { MathUtils, type Group, type Mesh, type MeshBasicMaterial, type MeshToonMaterial } from 'three';
import { env } from '../env';
import { palette } from '../palette';
import { Box, Cyl, Toon } from '../primitives';
import { useStationAnim } from '../useStationAnim';
import type { StationModelProps } from './registry';
import { LIVE, LIVE_CHILDREN } from '../Merge';

/** A floating low-poly study: shows its wireframe on hover, flies apart when focused. */
export function Pedestal3D({ station }: StationModelProps) {
  const shape = useRef<Group>(null);
  const solid = useRef<MeshToonMaterial>(null);
  const wire = useRef<MeshBasicMaterial>(null);
  const orbit = useRef<Group>(null);
  const ring = useRef<Mesh>(null);

  useStationAnim(station.id, ({ t, hover, active }) => {
    const lively = Math.max(hover, active);
    if (shape.current) {
      shape.current.rotation.y = t * 0.6;
      shape.current.rotation.x = Math.sin(t * 0.4) * 0.3;
      shape.current.position.y = 1.62 + Math.sin(t * 1.2) * 0.07 + active * 0.12;
      shape.current.scale.setScalar(1 + active * 0.18 + Math.sin(t * 2.5) * 0.03 * active);
    }
    // Hover peels the surface back to show the mesh underneath.
    if (solid.current) solid.current.opacity = MathUtils.lerp(1, 0.25, hover * (1 - active));
    if (wire.current) wire.current.opacity = MathUtils.lerp(0.25, 1, lively);
    orbit.current?.children.forEach((p, i) => {
      const a = t * (0.8 + i * 0.15) + (i / 3) * Math.PI * 2;
      const r = 0.55 + active * 0.35;
      p.position.set(Math.cos(a) * r, 1.6 + Math.sin(a * 1.3 + i) * (0.12 + active * 0.3), Math.sin(a) * r);
      p.rotation.set(t * 0.9 + i, t * 0.7, 0);
    });
    if (ring.current) {
      ring.current.rotation.z = t * 0.5;
      (ring.current.material as MeshToonMaterial).emissiveIntensity = 0.6 + env.night * 1.2 + active;
    }
  });

  return (
    <group>
      <Cyl args={[0.42, 0.5, 0.12, 8]} position={[0, 0.06, 0]} color={palette.cream} flat />
      <Cyl args={[0.3, 0.36, 0.86, 8]} position={[0, 0.55, 0]} color={palette.paper} flat />
      <Cyl args={[0.44, 0.38, 0.1, 8]} position={[0, 1.03, 0]} color={palette.cream} flat />
      <mesh ref={ring} userData={LIVE} position={[0, 1.09, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.24, 0.3, 6]} />
        <inkToonMaterial color={palette.mint} emissive={palette.mint} emissiveIntensity={0.6} />
      </mesh>

      <group ref={shape} userData={LIVE} position={[0, 1.62, 0]}>
        <mesh castShadow>
          <icosahedronGeometry args={[0.36, 0]} />
          <inkToonMaterial ref={solid} color="#3f9d7c" transparent />
        </mesh>
        <mesh scale={1.02}>
          <icosahedronGeometry args={[0.36, 0]} />
          <meshBasicMaterial ref={wire} color={palette.ink} wireframe transparent opacity={0.25} />
        </mesh>
      </group>

      <group ref={orbit} userData={LIVE_CHILDREN}>
        <mesh castShadow>
          <boxGeometry args={[0.16, 0.16, 0.16]} />
          <Toon color={palette.terracotta} />
        </mesh>
        <mesh castShadow>
          <coneGeometry args={[0.1, 0.2, 5]} />
          <Toon color={palette.mustard} />
        </mesh>
        <mesh castShadow>
          <torusGeometry args={[0.09, 0.04, 6, 10]} />
          <Toon color={palette.plum} />
        </mesh>
      </group>

      {/* XYZ gizmo, because every 3D beginner stares at one */}
      <group position={[0.62, 0.02, 0.45]}>
        <Box size={[0.3, 0.025, 0.025]} position={[0.15, 0.02, 0]} color="#e2725b" shadow={false} />
        <Box size={[0.025, 0.3, 0.025]} position={[0, 0.17, 0]} color="#6aa84f" shadow={false} />
        <Box size={[0.025, 0.025, 0.3]} position={[0, 0.02, 0.15]} color="#5d7bd5" shadow={false} />
      </group>
    </group>
  );
}
