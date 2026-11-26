import { getStation } from '../content';
import { useRoomStore } from '../state/useRoomStore';

/** Tells screen-reader users what the camera just did. */
export function Announcer() {
  const activeId = useRoomStore((s) => s.activeId);
  const entered = useRoomStore((s) => s.entered);
  const view = useRoomStore((s) => s.view);
  const mode = useRoomStore((s) => s.mode);
  const station = getStation(activeId);
  let message = '';
  if (entered && view === 'room') message = station ? `Now looking at: ${station.title}.` : 'Viewing the whole room.';
  return (
    <div className="sr-only" aria-live="polite">
      <span>{message}</span> <span>{entered ? (mode === 'night' ? 'Night lights on.' : 'Daylight.') : ''}</span>
    </div>
  );
}
