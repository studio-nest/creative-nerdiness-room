import { useState } from 'react';
import { room } from '../content';
import { useRoomStore } from '../state/useRoomStore';
import { ArtistLinks } from './ArtistLinks';
import { Icon } from './Icon';

const SHORTCUTS: [string, string][] = [
  ['Drag / one finger', 'Look around'],
  ['Scroll / pinch', 'Zoom'],
  ['Click / tap', 'Visit a station'],
  ['← →', 'Previous / next station'],
  ['1 – 7', 'Jump to a station'],
  ['Esc', 'Back to the whole room'],
  ['N', 'Day / night'],
  ['L', 'List view'],
];

export function Hud() {
  const mode = useRoomStore((s) => s.mode);
  const view = useRoomStore((s) => s.view);
  const locked = useRoomStore((s) => s.fallbackReason !== null);
  const [help, setHelp] = useState(false);

  return (
    <header className="hud">
      <div className="hud__brand">
        <h1>{room.artist.name}</h1>
        <p>{room.artist.role}</p>
      </div>
      <div className="hud__tools">
        <button type="button" className="chip" aria-pressed={mode === 'night'} onClick={() => useRoomStore.getState().toggleMode()}>
          <Icon name={mode === 'night' ? 'moon' : 'sun'} />
          <span className="chip__text">Night lights</span>
        </button>
        {!locked && (
          <button type="button" className="chip" onClick={() => useRoomStore.getState().setView(view === 'room' ? 'list' : 'room')}>
            <Icon name={view === 'room' ? 'list' : 'room'} />
            <span className="chip__text">{view === 'room' ? 'List view' : '3D room'}</span>
          </button>
        )}
        {view === 'room' && (
          <button type="button" className="chip" aria-expanded={help} aria-controls="help-card" onClick={() => setHelp((h) => !h)}>
            <Icon name="help" />
            <span className="chip__text">Controls</span>
          </button>
        )}
      </div>
      {help && view === 'room' && (
        <div id="help-card" className="help card">
          <h2>How to explore</h2>
          <dl>
            {SHORTCUTS.map(([key, what]) => (
              <div key={key}>
                <dt>{key}</dt>
                <dd>{what}</dd>
              </div>
            ))}
          </dl>
          <ArtistLinks />
          <button type="button" className="btn" onClick={() => setHelp(false)}>
            Got it
          </button>
        </div>
      )}
    </header>
  );
}
