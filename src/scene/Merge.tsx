import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { Matrix4, Mesh, Vector3, type BufferGeometry, type Group, type Material, type Object3D } from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/** Put on an object whose own transform animates: its subtree is merged as one rigid piece that moves with it. */
export const LIVE = Object.freeze({ live: true });
/** Put on a group whose direct children each animate on their own. */
export const LIVE_CHILDREN = Object.freeze({ liveChildren: true });

const KEEP = new Set(['position', 'normal', 'uv']);
/** Matches the outline pass: details this small get no ink line. */
const TINY_RADIUS = 0.045;

type ToonLike = Material & { isMeshToonMaterial?: boolean };

function eligible(mesh: Mesh): boolean {
  if (!mesh.isMesh || !mesh.visible || mesh.userData.isInk || mesh.userData.merged) return false;
  const mat = mesh.material as ToonLike | ToonLike[];
  if (Array.isArray(mat) || !mat.isMeshToonMaterial || mat.transparent) return false;
  const g = mesh.geometry;
  if (!g.attributes.position || !g.attributes.normal || Object.keys(g.morphAttributes).length) return false;
  // Hiding a mesh hides its children, so never merge one that has visible mesh children.
  return !mesh.children.some((c) => (c as Mesh).isMesh && !c.userData.isInk);
}

/** Group meshes by the rigid piece they belong to: the root, or the nearest LIVE ancestor. */
function collect(root: Object3D) {
  const owners = new Map<Object3D, Mesh[]>();
  const visit = (o: Object3D, owner: Object3D) => {
    for (const child of o.children) {
      if (child.userData.isInk) continue;
      const own = child.userData.live || o.userData.liveChildren ? child : owner;
      if (eligible(child as Mesh)) {
        let list = owners.get(own);
        if (!list) owners.set(own, (list = []));
        list.push(child as Mesh);
      }
      visit(child, own);
    }
  };
  visit(root, root);
  return owners;
}

/**
 * Batch the static meshes under `root` into one mesh per shared material.
 * Returns a function that undoes it: removes the batched meshes and shows
 * the originals again.
 */
export function batchStatic(root: Object3D): () => void {
  root.updateWorldMatrix(true, true);
  const created: Mesh[] = [];
  const hidden: Mesh[] = [];
  const rel = new Matrix4();
  const scale = new Vector3();

  for (const [owner, meshes] of collect(root)) {
    const inverse = owner.matrixWorld.clone().invert();
    const groups = new Map<string, Mesh[]>();
    for (const m of meshes) {
      const g = m.geometry;
      if (!g.boundingSphere) g.computeBoundingSphere();
      const tiny = (g.boundingSphere?.radius ?? 1) * m.getWorldScale(scale).x < TINY_RADIUS;
      const key = [(m.material as Material).uuid, m.castShadow, m.receiveShadow, tiny, g.index ? 1 : 0, g.attributes.uv ? 1 : 0].join('|');
      let list = groups.get(key);
      if (!list) groups.set(key, (list = []));
      list.push(m);
    }
    for (const [key, list] of groups) {
      if (list.length < 2) continue;
      const parts: BufferGeometry[] = list.map((m) => {
        const g = m.geometry.clone();
        for (const name of Object.keys(g.attributes)) if (!KEEP.has(name)) g.deleteAttribute(name);
        g.applyMatrix4(rel.multiplyMatrices(inverse, m.matrixWorld));
        return g;
      });
      const geometry = mergeGeometries(parts, false);
      parts.forEach((p) => p.dispose());
      if (!geometry) continue;
      const merged = new Mesh(geometry, list[0].material);
      merged.castShadow = list[0].castShadow;
      merged.receiveShadow = list[0].receiveShadow;
      merged.userData.merged = true;
      if (key.split('|')[3] === 'true') merged.userData.ink = false;
      // Pointer events keep hitting the hidden originals, which React still owns.
      merged.raycast = () => {};
      owner.add(merged);
      created.push(merged);
      for (const m of list) {
        m.visible = false;
        m.userData.ink = false;
        hidden.push(m);
      }
    }
  }

  return () => {
    created.forEach((m) => {
      m.removeFromParent();
      m.geometry.dispose();
    });
    hidden.forEach((m) => {
      m.visible = true;
      delete m.userData.ink;
    });
  };
}

/** Dev switch for profiling: add ?nomerge to the URL to see the unbatched scene. */
const DISABLED = import.meta.env.DEV && typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('nomerge');

/**
 * Batches the static parts of its subtree into a handful of meshes, one per
 * shared material, cutting hundreds of draw calls (and their ink outlines)
 * down to a few. Animated parts keep working: anything marked LIVE (or a
 * child of something marked LIVE_CHILDREN) is batched separately inside
 * itself, so it still moves as one piece.
 *
 * The original meshes stay in the scene, hidden, so React keeps owning them
 * and pointer events still hit them. Batching happens once, on mount.
 */
export function Merge({ children }: { children: ReactNode }) {
  const root = useRef<Group>(null);

  useLayoutEffect(() => {
    const top = root.current;
    if (!top || DISABLED) return;
    return batchStatic(top);
  }, []);

  return <group ref={root}>{children}</group>;
}
