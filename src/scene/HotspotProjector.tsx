import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { stations } from '../content';
import { hotspotElements } from './hotspots';

const UP = new Vector3(0, 1, 0);
const v = new Vector3();

/** Projects each station's hotspot anchor to screen space and moves its DOM button there. */
export function HotspotProjector() {
  const anchors = useMemo(
    () =>
      stations.map((s) => ({
        id: s.id,
        world: new Vector3(...s.placement.hotspot).applyAxisAngle(UP, s.placement.rotationY).add(new Vector3(...s.placement.position)),
      })),
    [],
  );

  useFrame(({ camera, size }) => {
    for (const a of anchors) {
      const el = hotspotElements.get(a.id);
      if (!el) continue;
      v.copy(a.world).project(camera);
      const x = (v.x * 0.5 + 0.5) * size.width;
      const y = (-v.y * 0.5 + 0.5) * size.height;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      el.style.visibility = v.z < 1 ? 'visible' : 'hidden';
    }
  });
  return null;
}
