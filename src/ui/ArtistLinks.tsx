import { room } from '../content';

/** The artist's outside links, as a row of small pills. */
export function ArtistLinks({ label = 'Find me elsewhere' }: { label?: string }) {
  const links = room.artist.links;
  if (!links.length) return null;
  return (
    <nav className="links" aria-label={label}>
      <ul>
        {links.map((l) => (
          <li key={l.href}>
            <a href={l.href} target="_blank" rel="noreferrer noopener">
              {l.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
