import { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { decor, room, stations } from '../content';
import { CAMERA_FOV, resolveCamera } from '../lib/camera';
import { useRoomStore } from '../state/useRoomStore';
import { CameraRig } from './CameraRig';
import { env } from './env';
import { HotspotProjector } from './HotspotProjector';
import { StationGroup } from './Interactive';
import { Lighting } from './Lighting';
import { InkOutlines } from './InkOutlines';
import { DecorItem } from './props/decorRegistry';
import { Cat, Lamp } from './props/Props';
import { RoomShell } from './RoomShell';
import { stationModels } from './stations/registry';

/** Tells the UI once a real frame has been drawn, so the welcome screen can open the door. */
function ReadySignal() {
  const frames = useRef(0);
  useFrame(() => {
    if (frames.current < 3 && ++frames.current === 3) useRoomStore.getState().setReady();
  });
  return null;
}

export default function Experience({ reducedMotion }: { reducedMotion: boolean }) {
  const quality = useRoomStore((s) => s.quality);
  env.reducedMotion = reducedMotion;

  // Leaving the room disposes the renderer, which also fires "context lost".
  // Only a loss while the room is on screen is a real failure.
  // Phones start one tier down: the shadow pass costs the most and shows the least on a small screen.
  useEffect(() => {
    const small = Math.min(window.innerWidth, window.innerHeight) < 820;
    if (small && window.matchMedia('(pointer: coarse)').matches) useRoomStore.getState().setQuality('medium');
  }, []);

  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      document.body.style.cursor = '';
    };
  }, []);

  const start = resolveCamera(room.intro, { width: window.innerWidth, height: window.innerHeight }, false);

  return (
    <Canvas
      shadows="percentage"
      dpr={[1, quality === 'high' ? 1.75 : quality === 'medium' ? 1.5 : 1.25]}
      camera={{ fov: CAMERA_FOV, near: 0.1, far: 140, position: start.position }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      role="img"
      aria-label="3D view of the creative room. Use the station buttons to explore it."
      onCreated={({ gl }) => {
        // Dev-only handle for reading renderer stats from the console.
        if (import.meta.env.DEV) (window as unknown as { __gl?: unknown }).__gl = gl;
        // Fallback for background tabs, where no animation frame may ever arrive.
        window.setTimeout(() => useRoomStore.getState().setReady(), 1500);
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault();
          if (!mounted.current || !gl.domElement.isConnected) return;
          useRoomStore.getState().fallBackToList('The 3D view lost its graphics context, so here is the room as a list instead.');
        });
      }}
    >
      <PerformanceMonitor flipflops={3} onDecline={() => useRoomStore.getState().lowerQuality()} onFallback={() => useRoomStore.getState().setQuality('low')} />
      <ReadySignal />
      <Lighting />
      <CameraRig />
      <HotspotProjector />
      <RoomShell />
      <Lamp position={[-3.55, 0, 0.02]} />
      <Cat position={[-0.75, 0.04, 1.15]} rotationY={-0.3} />
      {decor.map((item) => (
        <DecorItem key={item.id} item={item} />
      ))}
      {stations.map((station) => {
        const Model = stationModels[station.kind];
        return (
          <StationGroup key={station.id} station={station}>
            <Model station={station} />
          </StationGroup>
        );
      })}
      <InkOutlines />
    </Canvas>
  );
}
