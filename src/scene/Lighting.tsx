import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, MathUtils, type DirectionalLight, type HemisphereLight } from 'three';
import { useRoomStore } from '../state/useRoomStore';
import { env } from './env';

const DAY = { sky: new Color('#fff3df'), ground: new Color('#e0a47c'), sun: new Color('#fff0d6') };
const NIGHT = { sky: new Color('#6f6bc0'), ground: new Color('#3a2a55'), sun: new Color('#9fb0ff') };

/** Sun + sky fill. Also the single place where day/night is eased. */
export function Lighting() {
  const hemi = useRef<HemisphereLight>(null);
  const sun = useRef<DirectionalLight>(null);
  const shadows = useRoomStore((s) => s.quality === 'high');

  useFrame((_, dt) => {
    const target = useRoomStore.getState().mode === 'night' ? 1 : 0;
    env.night = env.reducedMotion ? target : MathUtils.damp(env.night, target, 2.5, Math.min(dt, 0.05));
    const n = env.night;
    if (hemi.current) {
      hemi.current.color.lerpColors(DAY.sky, NIGHT.sky, n);
      hemi.current.groundColor.lerpColors(DAY.ground, NIGHT.ground, n);
      hemi.current.intensity = MathUtils.lerp(1.5, 0.65, n);
    }
    if (sun.current) {
      sun.current.color.lerpColors(DAY.sun, NIGHT.sun, n);
      sun.current.intensity = MathUtils.lerp(2.4, 0.5, n);
    }
  });

  return (
    <>
      <hemisphereLight ref={hemi} intensity={1.5} />
      <directionalLight
        ref={sun}
        position={[6, 11, 8]}
        intensity={2.4}
        castShadow={shadows}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
      >
        <orthographicCamera attach="shadow-camera" args={[-8, 8, 8, -8, 1, 30]} />
      </directionalLight>
    </>
  );
}
