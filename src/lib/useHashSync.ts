import { useEffect } from 'react';
import { getStation } from '../content';
import { useRoomStore } from '../state/useRoomStore';

export function stationFromHash(hash: string): string | null {
  const id = hash.replace(/^#\/?/, '');
  return getStation(id) ? id : null;
}

/** Keeps `#/station-id` in the URL in step with the focused station (deep links). */
export function useHashSync(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const initial = stationFromHash(window.location.hash);
    if (initial) useRoomStore.getState().focus(initial);

    const unsubscribe = useRoomStore.subscribe((state, prev) => {
      if (state.activeId === prev.activeId) return;
      const next = state.activeId ? `#/${state.activeId}` : '';
      if (window.location.hash !== next) {
        history.replaceState(null, '', next || window.location.pathname + window.location.search);
      }
    });
    const onHash = () => {
      const id = stationFromHash(window.location.hash);
      const s = useRoomStore.getState();
      if (id) s.focus(id);
      else s.exit();
    };
    window.addEventListener('hashchange', onHash);
    return () => {
      unsubscribe();
      window.removeEventListener('hashchange', onHash);
    };
  }, [enabled]);
}
