import { useEffect, useRef } from 'react';
import { getStation, stations } from '../content';
import { useRoomStore } from '../state/useRoomStore';
import { Icon } from './Icon';
import { StationContent } from './StationContent';

/** Detail card for the focused station: a side card on wide screens, a bottom sheet on phones. */
export function Panel() {
  const activeId = useRoomStore((s) => s.activeId);
  const station = getStation(activeId);
  const heading = useRef<HTMLHeadingElement>(null);
  const lastId = useRef<string | null>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (activeId) {
      heading.current?.focus({ preventScroll: true });
    } else if (lastId.current) {
      // Hand focus back to where the visitor came from.
      document.querySelector<HTMLElement>(`.dock__btn[data-station="${lastId.current}"]`)?.focus();
    }
    lastId.current = activeId;
  }, [activeId]);

  if (!station) return null;
  const index = stations.indexOf(station);
  const { exit, next, prev } = useRoomStore.getState();

  return (
    <aside
      className="panel card"
      aria-labelledby="panel-title"
      style={{ ['--accent' as string]: station.accent }}
      onTouchStart={(e) => (swipe.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
      onTouchEnd={(e) => {
        const start = swipe.current;
        swipe.current = null;
        if (!start) return;
        const dx = e.changedTouches[0].clientX - start.x;
        const dy = e.changedTouches[0].clientY - start.y;
        if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 2) (dx < 0 ? next : prev)();
      }}
    >
      <div className="panel__bar">
        <span className="panel__count">
          {index + 1} / {stations.length}
        </span>
        <div className="panel__nav">
          <button type="button" className="icon-btn" onClick={prev} aria-label="Previous station">
            <Icon name="prev" />
          </button>
          <button type="button" className="icon-btn" onClick={next} aria-label="Next station">
            <Icon name="next" />
          </button>
          <button type="button" className="icon-btn" onClick={exit} aria-label="Close and return to the whole room">
            <Icon name="close" />
          </button>
        </div>
      </div>
      <div className="panel__scroll" key={station.id}>
        <p className="eyebrow">{station.label}</p>
        <h2 id="panel-title" ref={heading} tabIndex={-1}>
          {station.title}
        </h2>
        <p className="tagline">{station.tagline}</p>
        <StationContent station={station} />
      </div>
    </aside>
  );
}
