import { useEffect } from 'react';
import { stationIds } from '../content';
import { useRoomStore } from '../state/useRoomStore';

function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

/**
 * Global keyboard map.
 *   ← / →      previous / next station        1–7   jump to a station
 *   Esc, Home  back to the whole room         N     day / night
 *   L          toggle list view
 */
export function useKeyboardNav(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;
      const s = useRoomStore.getState();
      const inRoom = s.view === 'room';
      switch (e.key) {
        case 'ArrowRight':
          if (inRoom) { s.next(); e.preventDefault(); }
          break;
        case 'ArrowLeft':
          if (inRoom) { s.prev(); e.preventDefault(); }
          break;
        case 'Escape':
        case 'Home':
          if (inRoom && s.activeId) { s.exit(); e.preventDefault(); }
          break;
        case 'n':
        case 'N':
          s.toggleMode();
          break;
        case 'l':
        case 'L':
          if (!s.fallbackReason) s.setView(inRoom ? 'list' : 'room');
          break;
        default: {
          const n = Number(e.key);
          if (inRoom && Number.isInteger(n) && n >= 1 && n <= stationIds.length) s.focus(stationIds[n - 1]);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enabled]);
}
