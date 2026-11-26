import { useEffect, useRef, useState } from 'react';
import { room } from '../content';
import { ArtistLinks } from './ArtistLinks';
import { useRoomStore } from '../state/useRoomStore';

/** Loading screen that turns into the front door once the room has drawn. */
export function Welcome() {
  const ready = useRoomStore((s) => s.ready);
  const [slow, setSlow] = useState(false);
  const enterBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setSlow(true), 10000);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (ready) enterBtn.current?.focus();
  }, [ready]);

  return (
    <div className="welcome" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
      <div className="welcome__card">
        <div className="yarn" data-spinning={!ready} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p className="eyebrow">{room.artist.role}</p>
        <h1 id="welcome-title">{room.artist.name}</h1>
        <p className="welcome__intro">{room.artist.intro}</p>
        <p className="welcome__status" role="status">
          {ready ? 'The room is ready.' : slow ? 'Still tidying up… this is taking longer than usual.' : 'Tidying up the room…'}
        </p>
        <div className="welcome__actions">
          <button ref={enterBtn} type="button" className="btn btn--primary" disabled={!ready} onClick={() => useRoomStore.getState().enter()}>
            {ready ? 'Step inside' : 'Loading…'}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              const s = useRoomStore.getState();
              s.setView('list');
              s.enter();
            }}
          >
            Browse as a list
          </button>
        </div>
        <p className="welcome__hint">Drag to look around · click or tap things · arrow keys to tour</p>
        <ArtistLinks />
      </div>
    </div>
  );
}
