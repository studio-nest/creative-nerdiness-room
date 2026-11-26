import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';
import { useRoomStore } from '../state/useRoomStore';
import { env } from './env';

export interface AnimState {
  /** Station-local clock. Runs faster while hovered/active, stops under reduced motion. */
  t: number;
  dt: number;
  /** Eased 0–1: pointer is over the station. */
  hover: number;
  /** Eased 0–1: the camera is focused on the station. */
  active: number;
}

/**
 * Drives a station's animation. Every station gets the same three inputs
 * (idle time, hover, active) and decides for itself what to do with them,
 * which is what gives each object its own personality.
 */
export function useStationAnim(id: string, tick: (a: AnimState) => void) {
  const state = useRef<AnimState>({ t: Math.random() * 10, dt: 0, hover: 0, active: 0 });
  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const s = useRoomStore.getState();
    const a = state.current;
    a.hover = MathUtils.damp(a.hover, s.hoveredId === id ? 1 : 0, 7, dt);
    a.active = MathUtils.damp(a.active, s.activeId === id ? 1 : 0, 5, dt);
    const speed = env.reducedMotion ? 0 : 1 + a.hover * 0.6 + a.active * 0.6;
    a.dt = dt;
    a.t += dt * speed;
    tick(a);
  });
}
