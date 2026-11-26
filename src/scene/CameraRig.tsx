import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { CameraControls, CameraControlsImpl } from '@react-three/drei';
import { getStation, room } from '../content';
import { ORBIT_LIMITS, resolveCamera } from '../lib/camera';
import { IS_EMBED } from '../lib/embed';
import { useRoomStore } from '../state/useRoomStore';
import { env } from './env';

const { ACTION } = CameraControlsImpl;

/**
 * Owns the camera. Each time the focused station (or the viewport) changes it
 * glides to the pose authored in the content file; in between, the visitor can
 * orbit and zoom freely inside the room's limits.
 */
export function CameraRig() {
  const controls = useRef<CameraControlsImpl>(null);
  const placed = useRef(false);
  const activeId = useRoomStore((s) => s.activeId);
  const entered = useRoomStore((s) => s.entered);
  const width = useThree((s) => s.size.width);
  const height = useThree((s) => s.size.height);

  useEffect(() => {
    const c = controls.current;
    if (!c || width === 0 || height === 0) return;
    const viewport = { width, height };
    const station = entered ? getStation(activeId) : undefined;
    const pose = !entered ? room.intro : station ? station.camera : room.overview;
    const cam = resolveCamera(pose, viewport, Boolean(station));
    const overview = resolveCamera(room.overview, viewport, false);
    const intro = resolveCamera(room.intro, viewport, false);

    // Focused: only a gentle zoom either way, so the subject can never leave
    // the part of the screen the panel leaves free. Overview: roam freely.
    if (station) {
      c.minDistance = cam.distance * 0.8;
      c.maxDistance = cam.distance * 1.35;
    } else {
      c.minDistance = ORBIT_LIMITS.minDistance * 2;
      c.maxDistance = (entered ? overview.distance : intro.distance) * 1.15;
    }
    const animate = placed.current && !env.reducedMotion;
    void c.setLookAt(...cam.position, ...cam.target, animate);
    void c.setFocalOffset(cam.focalOffset[0], cam.focalOffset[1], 0, animate);
    placed.current = true;
  }, [activeId, entered, width, height]);

  return (
    <CameraControls
      ref={controls}
      makeDefault
      smoothTime={0.55}
      draggingSmoothTime={0.12}
      minAzimuthAngle={ORBIT_LIMITS.minAzimuth}
      maxAzimuthAngle={ORBIT_LIMITS.maxAzimuth}
      minPolarAngle={ORBIT_LIMITS.minPolar}
      maxPolarAngle={ORBIT_LIMITS.maxPolar}
      dollySpeed={0.6}
      // Embedded in a page, the wheel and one-finger swipes scroll the page;
      // drag with the mouse or two fingers to look around instead.
      mouseButtons={{ left: ACTION.ROTATE, middle: ACTION.DOLLY, right: ACTION.NONE, wheel: IS_EMBED ? ACTION.NONE : ACTION.DOLLY }}
      touches={{
        one: IS_EMBED ? ACTION.NONE : ACTION.TOUCH_ROTATE,
        two: IS_EMBED ? ACTION.TOUCH_DOLLY_ROTATE : ACTION.TOUCH_DOLLY,
        three: ACTION.NONE,
      }}
    />
  );
}
