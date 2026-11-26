import { useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { BackSide, Color, Mesh, ShaderMaterial, type BufferGeometry, type Material } from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { useRoomStore } from '../state/useRoomStore';

/** Flat shapes sit on other surfaces; an outline shell would only z-fight. */
const SKIP = new Set(['PlaneGeometry', 'CircleGeometry', 'RingGeometry', 'TubeGeometry']);

const vertexShader = /* glsl */ `
  uniform float thickness;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vec3 n = normalize(normalMatrix * normal);
    // Uneven line weight, like a brush pen pressed harder in places.
    float wobble = 0.72 + 0.45 * sin(position.x * 9.0 + position.y * 7.0 + position.z * 11.0);
    // Shrink with the object so things that scale to nothing leave no dot behind.
    float size = min(1.0, length(vec3(modelMatrix[0])) * 2.5);
    mv.xyz += n * thickness * wobble * size;
    gl_Position = projectionMatrix * mv;
  }
`;
const fragmentShader = /* glsl */ `
  uniform vec3 color;
  void main() {
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

/**
 * Draws an ink line around every solid object. It walks the scene graph and gives each toon-shaded mesh a slightly inflated,
 * inside-out copy of itself in a dark colour (the "inverted hull" trick).
 * Normals are smoothed first so the shell stays closed at hard corners.
 */
export function InkOutlines({ color = '#4a2f3d', thickness = 0.02 }: { color?: string; thickness?: number }) {
  const scene = useThree((s) => s.scene);
  const quality = useRoomStore((s) => s.quality);
  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: { thickness: { value: thickness }, color: { value: new Color(color) } },
        vertexShader,
        fragmentShader,
        side: BackSide,
      }),
    [color, thickness],
  );

  // Outline everything present now, then re-check now and then so meshes that
  // mount later (a remount, hot reload, a prop added at runtime) get one too.
  const shells = useMemo(() => new Map<string, BufferGeometry>(), []);
  useEffect(() => {
    const added: Mesh[] = [];
    const ink = () => {
      const targets: Mesh[] = [];
      scene.traverse((o) => {
        const mesh = o as Mesh;
        if (!mesh.isMesh || mesh.userData.isInk || mesh.userData.inked || mesh.userData.ink === false) return;
        if (Array.isArray(mesh.material)) return;
        const mat = mesh.material as Material & { isMeshToonMaterial?: boolean };
        if (!mat.isMeshToonMaterial || mat.transparent || SKIP.has(mesh.geometry.type)) return;
        // Pins, keys and eyes are too small for a line to read; skip them.
        if (!mesh.geometry.boundingSphere) mesh.geometry.computeBoundingSphere();
        if ((mesh.geometry.boundingSphere?.radius ?? 1) < 0.045) return;
        targets.push(mesh);
      });
      for (const mesh of targets) {
        let shell = shells.get(mesh.geometry.uuid);
        if (!shell) {
          const bare = mesh.geometry.clone();
          bare.deleteAttribute('normal');
          bare.deleteAttribute('uv');
          shell = mergeVertices(bare, 1e-4);
          shell.computeVertexNormals();
          bare.dispose();
          shells.set(mesh.geometry.uuid, shell);
        }
        const outline = new Mesh(shell, material);
        outline.userData.isInk = true;
        outline.raycast = () => {};
        mesh.userData.inked = true;
        mesh.add(outline);
        added.push(outline);
      }
    };
    ink();
    const timer = window.setInterval(ink, 1000);
    return () => {
      window.clearInterval(timer);
      added.forEach((o) => {
        if (o.parent) o.parent.userData.inked = false;
        o.removeFromParent();
      });
    };
  }, [scene, material, shells]);

  useEffect(
    () => () => {
      shells.forEach((g) => g.dispose());
      shells.clear();
    },
    [shells],
  );
  useEffect(() => () => material.dispose(), [material]);
  // Outlines roughly double the draw calls, so the lowest tier drops them.
  useEffect(() => {
    material.visible = quality !== 'low';
  }, [material, quality]);

  return null;
}
