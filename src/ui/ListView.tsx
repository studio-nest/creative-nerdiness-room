import { room, stations } from '../content';
import { useRoomStore } from '../state/useRoomStore';
import { Icon } from './Icon';
import { StationContent } from './StationContent';

/**
 * The whole room as a plain document. It is both the fallback when 3D cannot
 * run and a first-class alternative for anyone who prefers reading.
 */
export function ListView() {
  const reason = useRoomStore((s) => s.fallbackReason);
  return (
    <main className="list">
      <div className="list__inner">
        {reason && (
          <p className="notice" role="alert">
            {reason}
          </p>
        )}
        <p className="list__intro">{room.artist.intro}</p>
        {room.artist.links.length > 0 && (
          <ul className="links">
            {room.artist.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noreferrer noopener">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        )}
        {stations.map((s) => (
          <section key={s.id} id={`list-${s.id}`} className="list__section card" style={{ ['--accent' as string]: s.accent }} aria-labelledby={`list-title-${s.id}`}>
            <p className="eyebrow">
              <Icon name={s.kind} size={18} /> {s.label}
            </p>
            <h2 id={`list-title-${s.id}`}>{s.title}</h2>
            <p className="tagline">{s.tagline}</p>
            <StationContent station={s} />
          </section>
        ))}
      </div>
    </main>
  );
}
