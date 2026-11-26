import { useMemo, type ReactNode } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import type { Station } from '../content/types';
import { useRoomStore } from '../state/useRoomStore';

/** Pointer handlers shared by everything clickable in the room. */
export function useInteractive(id: string, onActivate: () => void) {
  return useMemo(
    () => ({
      onPointerOver: (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        useRoomStore.getState().setHovered(id);
        document.body.style.cursor = 'pointer';
      },
      onPointerOut: () => {
        const s = useRoomStore.getState();
        if (s.hoveredId === id) s.setHovered(null);
        document.body.style.cursor = '';
      },
      onClick: (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        // A drag that happens to end on the object is an orbit, not a click.
        if (e.delta > 8) return;
        onActivate();
      },
    }),
    [id, onActivate],
  );
}

/** Places a station from its data and makes the whole thing clickable. */
export function StationGroup({ station, children }: { station: Station; children: ReactNode }) {
  const { position, rotationY, hitbox, hitboxOffset } = station.placement;
  const activate = useMemo(() => () => useRoomStore.getState().focus(station.id), [station.id]);
  const handlers = useInteractive(station.id, activate);
  return (
    <group position={position} rotation-y={rotationY} {...handlers}>
      {children}
      <mesh position={hitboxOffset}>
        <boxGeometry args={hitbox} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}
