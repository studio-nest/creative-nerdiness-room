import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { IS_EMBED } from './lib/embed';
import { useHashSync } from './lib/useHashSync';
import { useKeyboardNav } from './lib/useKeyboardNav';
import { usePrefersReducedMotion } from './lib/usePrefersReducedMotion';
import { isWebGLAvailable } from './lib/webgl';
import { useRoomStore } from './state/useRoomStore';
import { Announcer } from './ui/Announcer';
import { Dock } from './ui/Dock';
import { ErrorBoundary } from './ui/ErrorBoundary';
import { Hotspots } from './ui/Hotspots';
import { Hud } from './ui/Hud';
import { ListView } from './ui/ListView';
import { Panel } from './ui/Panel';
import { Toast } from './ui/Toast';
import { Welcome } from './ui/Welcome';

// three.js and the whole scene live in their own chunk, fetched behind the welcome screen.
const Experience = lazy(() => import('./scene/Experience'));

export function App() {
  const view = useRoomStore((s) => s.view);
  const mode = useRoomStore((s) => s.mode);
  const entered = useRoomStore((s) => s.entered);
  const reducedMotion = usePrefersReducedMotion();
  const webgl = useMemo(isWebGLAvailable, []);
  // Embedded in another page, the 3D scene only downloads once someone asks for it.
  const [booted, setBooted] = useState(!IS_EMBED);

  useEffect(() => {
    if (!webgl) {
      useRoomStore.getState().fallBackToList('This browser could not start the 3D view, so here is the room as a list instead.');
    }
  }, [webgl]);

  useKeyboardNav(entered);
  useHashSync(entered && view === 'room');

  const inRoom = view === 'room' && webgl;
  const showScene = inRoom && booted;

  return (
    <div className="app" data-mode={mode} data-reduced={reducedMotion} data-embed={IS_EMBED}>
      <div className="backdrop" aria-hidden="true" />
      {showScene && (
        <ErrorBoundary
          onError={() =>
            useRoomStore.getState().fallBackToList('Something went wrong while drawing the 3D room, so here it is as a list instead.')
          }
        >
          <Suspense fallback={null}>
            <div className="stage">
              <Experience reducedMotion={reducedMotion} />
            </div>
          </Suspense>
        </ErrorBoundary>
      )}
      {view === 'list' && <ListView />}
      {entered && <Hud />}
      {entered && inRoom && (
        <>
          <Hotspots />
          <Dock />
          <Panel />
        </>
      )}
      {!entered && <Welcome onBoot={() => setBooted(true)} />}
      <Toast />
      <Announcer />
    </div>
  );
}
