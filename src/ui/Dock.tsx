import { stations } from '../content';
import { useRoomStore } from '../state/useRoomStore';
import { Icon } from './Icon';

/** The accessible way around the room: one real button per station. */
export function Dock() {
  const activeId = useRoomStore((s) => s.activeId);
  const hoveredId = useRoomStore((s) => s.hoveredId);

  return (
    <nav className="dock" aria-label="Room stations" data-panel-open={activeId !== null}>
      <ul>
        <li>
          <button type="button" className="dock__btn" data-station="overview" aria-current={activeId === null ? 'true' : undefined} onClick={() => useRoomStore.getState().exit()}>
            <Icon name="room" />
            <span>Whole room</span>
          </button>
        </li>
        {stations.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              className="dock__btn"
              data-station={s.id}
              data-hovered={hoveredId === s.id}
              aria-current={activeId === s.id ? 'true' : undefined}
              style={{ ['--accent' as string]: s.accent }}
              onClick={() => useRoomStore.getState().focus(s.id)}
              onPointerEnter={() => useRoomStore.getState().setHovered(s.id)}
              onPointerLeave={() => useRoomStore.getState().setHovered(null)}
              onFocus={() => useRoomStore.getState().setHovered(s.id)}
              onBlur={() => useRoomStore.getState().setHovered(null)}
            >
              <Icon name={s.kind} />
              <span>{s.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
