import { stations } from '../content';
import { hotspotElements } from '../scene/hotspots';
import { useRoomStore } from '../state/useRoomStore';

/**
 * Floating markers over each station. They are a pointer/touch convenience:
 * the dock is the keyboard and screen-reader route, so these stay out of the
 * tab order and the accessibility tree.
 */
export function Hotspots() {
  const hoveredId = useRoomStore((s) => s.hoveredId);
  const hidden = useRoomStore((s) => s.activeId !== null);
  return (
    <div className="hotspots" aria-hidden="true">
      {stations.map((s) => (
        <div
          key={s.id}
          className="hotspot-anchor"
          ref={(el) => {
            if (el) hotspotElements.set(s.id, el);
            else hotspotElements.delete(s.id);
          }}
        >
          <button
            type="button"
            className="hotspot"
            tabIndex={-1}
            data-hovered={hoveredId === s.id}
            data-hidden={hidden}
            style={{ ['--accent' as string]: s.accent }}
            onClick={() => useRoomStore.getState().focus(s.id)}
            onPointerEnter={() => useRoomStore.getState().setHovered(s.id)}
            onPointerLeave={() => useRoomStore.getState().setHovered(null)}
          >
            <span className="hotspot__dot" />
            <span className="hotspot__label">{s.label}</span>
          </button>
        </div>
      ))}
    </div>
  );
}
