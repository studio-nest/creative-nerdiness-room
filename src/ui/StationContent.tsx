import type { Station } from '../content/types';

/** Body copy + showcase cards. Shared by the 3D panel and the list view. */
export function StationContent({ station }: { station: Station }) {
  return (
    <>
      {station.body.map((p) => (
        <p key={p}>{p}</p>
      ))}
      {station.note && <p className="note">{station.note}</p>}
      <ul className="items">
        {station.items.map((item) => (
          <li key={item.title} className="item">
            {item.image && <img src={item.image} alt={item.imageAlt ?? ''} loading="lazy" />}
            <h3>
              {item.href ? (
                <a href={item.href} target="_blank" rel="noreferrer noopener">
                  {item.title}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                item.title
              )}
            </h3>
            <p>{item.blurb}</p>
            <ul className="tags" aria-label="Tags">
              {item.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
  );
}
