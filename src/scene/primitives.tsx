import type { ReactNode } from 'react';
import type { ThreeElements } from '@react-three/fiber';
import './ink';
import { toon } from './materials';

type MeshProps = Omit<ThreeElements['mesh'], 'args'>;

interface MatProps {
  color: string;
  roughness?: number;
  metalness?: number;
  emissive?: string;
  emissiveIntensity?: number;
  flat?: boolean;
}

/** PBR-style props are accepted for call-site convenience but the toon shader only uses colour and glow. */
function Mat({ color, emissive, emissiveIntensity = 0 }: MatProps) {
  return <primitive object={toon(color, emissive, emissiveIntensity)} attach="material" dispose={null} />;
}

/** A shared, cached toon material for meshes written out by hand. */
export function Toon({ color, emissive, emissiveIntensity }: { color: string; emissive?: string; emissiveIntensity?: number }) {
  return <Mat color={color} emissive={emissive} emissiveIntensity={emissiveIntensity} />;
}

type ShapeProps = MeshProps & MatProps & { children?: ReactNode; shadow?: boolean };

function split(props: ShapeProps) {
  const { color, roughness, metalness, emissive, emissiveIntensity, flat, children, shadow = true, ...mesh } = props;
  return { mat: { color, roughness, metalness, emissive, emissiveIntensity, flat }, mesh, children, shadow };
}

/** A box with the room's default matte material. */
export function Box({ size, ...props }: ShapeProps & { size: [number, number, number] }) {
  const { mat, mesh, children, shadow } = split(props);
  // Tiny details would add a draw call to the shadow pass for a shadow nobody can see.
  const casts = shadow && Math.max(...size) >= 0.2;
  return (
    <mesh castShadow={casts} receiveShadow={shadow} {...mesh}>
      <boxGeometry args={size} />
      <Mat {...mat} />
      {children}
    </mesh>
  );
}

/** Cylinder: args are [radiusTop, radiusBottom, height, segments]. */
export function Cyl({ args, ...props }: ShapeProps & { args: [number, number, number, number?] }) {
  const { mat, mesh, children, shadow } = split(props);
  const casts = shadow && (Math.max(args[0], args[1]) >= 0.06 || args[2] >= 0.5);
  return (
    <mesh castShadow={casts} receiveShadow={shadow} {...mesh}>
      <cylinderGeometry args={[args[0], args[1], args[2], args[3] ?? 20]} />
      <Mat {...mat} />
      {children}
    </mesh>
  );
}

export function Ball({ radius, segments = 20, ...props }: ShapeProps & { radius: number; segments?: number }) {
  const { mat, mesh, children, shadow } = split(props);
  const casts = shadow && radius >= 0.1;
  return (
    <mesh castShadow={casts} receiveShadow={shadow} {...mesh}>
      <sphereGeometry args={[radius, segments, Math.max(8, Math.round(segments * 0.75))]} />
      <Mat {...mat} />
      {children}
    </mesh>
  );
}
