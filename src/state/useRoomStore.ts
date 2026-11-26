import { create } from 'zustand';
import { stationIds } from '../content';

export type LightMode = 'day' | 'night';
export type ViewMode = 'room' | 'list';
/** high: shadows + ink outlines. medium: outlines only. low: neither. */
export type Quality = 'high' | 'medium' | 'low';

export interface RoomState {
  /** Station the camera is focused on, or null for the overview. */
  activeId: string | null;
  /** Station (or prop) under the pointer. */
  hoveredId: string | null;
  mode: LightMode;
  view: ViewMode;
  /** The 3D scene has rendered its first frame. */
  ready: boolean;
  /** The visitor has dismissed the welcome screen. */
  entered: boolean;
  /** Set when 3D failed; the list view explains why it took over. */
  fallbackReason: string | null;
  toast: { id: number; text: string } | null;
  /** Renderer quality tier, lowered automatically when frames drop. */
  quality: Quality;

  focus: (id: string) => void;
  exit: () => void;
  next: () => void;
  prev: () => void;
  setHovered: (id: string | null) => void;
  toggleMode: () => void;
  setView: (view: ViewMode) => void;
  setReady: () => void;
  enter: () => void;
  fallBackToList: (reason: string) => void;
  showToast: (text: string) => void;
  clearToast: () => void;
  setQuality: (quality: Quality) => void;
  /** Step down one tier; called when the frame rate keeps dropping. */
  lowerQuality: () => void;
}

let toastSeq = 0;

function step(current: string | null, delta: 1 | -1): string {
  const n = stationIds.length;
  if (current === null) return delta === 1 ? stationIds[0] : stationIds[n - 1];
  const i = stationIds.indexOf(current);
  return stationIds[(i + delta + n) % n];
}

export const useRoomStore = create<RoomState>((set, get) => ({
  activeId: null,
  hoveredId: null,
  mode: 'day',
  view: 'room',
  ready: false,
  entered: false,
  fallbackReason: null,
  toast: null,
  quality: 'high',

  focus: (id) => {
    if (stationIds.includes(id)) set({ activeId: id, hoveredId: null });
  },
  exit: () => set({ activeId: null }),
  next: () => set({ activeId: step(get().activeId, 1), hoveredId: null }),
  prev: () => set({ activeId: step(get().activeId, -1), hoveredId: null }),
  setHovered: (id) => {
    if (get().hoveredId !== id) set({ hoveredId: id });
  },
  toggleMode: () => set({ mode: get().mode === 'day' ? 'night' : 'day' }),
  setView: (view) => set({ view, hoveredId: null }),
  setReady: () => set({ ready: true }),
  enter: () => set({ entered: true }),
  fallBackToList: (reason) => set({ view: 'list', fallbackReason: reason, entered: true }),
  showToast: (text) => set({ toast: { id: ++toastSeq, text } }),
  clearToast: () => set({ toast: null }),
  setQuality: (quality) => set({ quality }),
  lowerQuality: () => set({ quality: get().quality === 'high' ? 'medium' : 'low' }),
}));

/** Test helper: put the store back to its initial values. */
export function resetRoomStore() {
  useRoomStore.setState({
    activeId: null,
    hoveredId: null,
    mode: 'day',
    view: 'room',
    ready: false,
    entered: false,
    fallbackReason: null,
    toast: null,
    quality: 'high',
  });
}
