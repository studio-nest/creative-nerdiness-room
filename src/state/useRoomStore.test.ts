import { beforeEach, describe, expect, it } from 'vitest';
import { stationIds } from '../content';
import { resetRoomStore, useRoomStore } from './useRoomStore';

const get = () => useRoomStore.getState();

describe('room store', () => {
  beforeEach(resetRoomStore);

  it('focuses known stations and ignores unknown ids', () => {
    get().focus('nope');
    expect(get().activeId).toBeNull();
    get().focus(stationIds[2]);
    expect(get().activeId).toBe(stationIds[2]);
  });

  it('tours forwards and backwards, wrapping at both ends', () => {
    get().next();
    expect(get().activeId).toBe(stationIds[0]);
    get().prev();
    expect(get().activeId).toBe(stationIds[stationIds.length - 1]);
    get().next();
    expect(get().activeId).toBe(stationIds[0]);
    get().exit();
    get().prev();
    expect(get().activeId).toBe(stationIds[stationIds.length - 1]);
  });

  it('clears hover when focusing', () => {
    get().setHovered(stationIds[0]);
    get().focus(stationIds[1]);
    expect(get().hoveredId).toBeNull();
  });

  it('toggles day and night', () => {
    get().toggleMode();
    expect(get().mode).toBe('night');
    get().toggleMode();
    expect(get().mode).toBe('day');
  });

  it('falls back to the list view with a reason and skips the welcome screen', () => {
    get().fallBackToList('no webgl');
    expect(get()).toMatchObject({ view: 'list', fallbackReason: 'no webgl', entered: true });
  });

  it('gives each toast a fresh id so repeats re-announce', () => {
    get().showToast('meow');
    const first = get().toast!.id;
    get().showToast('meow');
    expect(get().toast!.id).not.toBe(first);
  });

  it('steps quality down one tier at a time and stops at low', () => {
    get().lowerQuality();
    expect(get().quality).toBe('medium');
    get().lowerQuality();
    get().lowerQuality();
    expect(get().quality).toBe('low');
  });
});
