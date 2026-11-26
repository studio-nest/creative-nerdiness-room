import { useEffect, useRef, useState } from 'react';
import { room } from '../content';
import { IS_EMBED } from '../lib/embed';
import { ArtistLinks } from './ArtistLinks';
import { useRoomStore } from '../state/useRoomStore';

/** Loading screen that turns into the front door once the room has drawn. */
export function Welcome({ onBoot }: { onBoot: () => void }) {
  const ready = useRoomStore((s) => s.ready);
  const [slow, setSlow] = useState(false);
  // Embedded: nothing loads until the visitor asks, then we walk in as soon as it's ready.
  const [requested, setRequested] = useState(!IS_EMBED);
  const enterBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!requested) return;
    const timer = window.setTimeout(() => setSlow(true), 10000);
    return () => window.clearTimeout(timer);
  }, [requested]);
  useEffect(() => {
    if (!ready) return;
    // Inside another page, moving focus would scroll that page; just walk in.
    if (IS_EMBED) useRoomStore.getState().enter();
    else enterBtn.current?.focus({ preventScroll: true });
  }, [ready]);

  const waiting = requested && !ready;
  const status = ready
    ? 'The room is ready.'
    : !requested
      ? 'A small 3D room you can walk around in.'
      : slow
        ? 'Still tidying up… this is taking longer than usual.'
        : 'Tidying up the room…';

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
          {status}
        </p>
        <div className="welcome__actions">
          <button
            ref={enterBtn}
            type="button"
            className="btn btn--primary"
            disabled={waiting}
            onClick={() => {
              if (ready) useRoomStore.getState().enter();
              else {
                setRequested(true);
                onBoot();
              }
            }}
          >
            {waiting ? 'Loading…' : 'Step inside'}
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
