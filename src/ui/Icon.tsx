import type { StationKind } from '../content/types';

const PATHS: Record<StationKind | 'sun' | 'moon' | 'list' | 'room' | 'close' | 'prev' | 'next' | 'help', string> = {
  designDesk: 'M4 5h16v10H4zM9 19h6M12 15v4M7 8h5M7 11h8',
  easel: 'M6 4h12v10H6zM9 14l-3 6M15 14l3 6M12 14v6M9 10l2-3 2 2 2-3',
  photoCorner: 'M4 8h4l1.5-2h5L16 8h4v10H4zM12 16a3 3 0 100-6 3 3 0 000 6z',
  bookshelf: 'M5 4v16M9 4v16M5 4h4M5 20h4M12 6l4-1 3 14-4 1z',
  gamingNook: 'M7 8h10a4 4 0 014 4v2a3 3 0 01-5.5 1.5L15 15H9l-.5.5A3 3 0 013 14v-2a4 4 0 014-4zM8 11v3M6.5 12.5h3M16 11.5h.01M17.5 13.5h.01',
  crochetCorner: 'M12 20a7 7 0 100-14 7 7 0 000 14zM6 11c4-3 8-3 12 0M6 15c4-3 8-3 12 0M17 7l3-4',
  pedestal3d: 'M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12L4 7.5M12 12v9',
  sun: 'M12 16a4 4 0 100-8 4 4 0 000 8zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2',
  moon: 'M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z',
  list: 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01',
  room: 'M3 10l9-6 9 6v10H3zM9 20v-6h6v6',
  close: 'M6 6l12 12M18 6L6 18',
  prev: 'M15 5l-7 7 7 7',
  next: 'M9 5l7 7-7 7',
  help: 'M9.5 9a2.5 2.5 0 114 2c-.9.7-1.5 1.2-1.5 2.5M12 17.5h.01M12 21a9 9 0 100-18 9 9 0 000 18z',
};

export function Icon({ name, size = 20 }: { name: keyof typeof PATHS; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={PATHS[name]} />
    </svg>
  );
}
