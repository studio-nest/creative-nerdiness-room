import { describe, expect, it } from 'vitest';
import { ORBIT_LIMITS } from '../lib/camera';
import { decorModels } from '../scene/props/decorRegistry';
import { stationModels } from '../scene/stations/registry';
import { decor, room, stations } from './index';

const HALF_ROOM = 4.2;

describe('room content', () => {
  it('has unique, URL-safe station ids', () => {
    const ids = stations.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    ids.forEach((id) => expect(id).toMatch(/^[a-z0-9-]+$/));
  });

  it('gives every station copy, items and a valid accent colour', () => {
    for (const s of stations) {
      expect(s.label.length).toBeGreaterThan(0);
      expect(s.title.length).toBeGreaterThan(0);
      expect(s.body.length).toBeGreaterThan(0);
      expect(s.items.length).toBeGreaterThan(0);
      expect(s.accent).toMatch(/^#[0-9a-f]{6}$/i);
      s.items.forEach((item) => {
        expect(item.title).toBeTruthy();
        if (item.href) expect(item.href).toMatch(/^https?:\/\//);
        if (item.image) expect(item.imageAlt, `${item.title} needs alt text`).toBeTruthy();
      });
    }
  });

  it('has a 3D model registered for every station kind', () => {
    for (const s of stations) expect(stationModels[s.kind], s.kind).toBeTypeOf('function');
  });

  it('places every station inside the room', () => {
    for (const s of stations) {
      const [x, y, z] = s.placement.position;
      expect(Math.abs(x)).toBeLessThanOrEqual(HALF_ROOM);
      expect(Math.abs(z)).toBeLessThanOrEqual(HALF_ROOM);
      expect(y).toBe(0);
    }
  });

  it('keeps every camera pose inside the orbit limits', () => {
    const poses = [room.overview, room.intro, ...stations.map((s) => s.camera)];
    for (const p of poses) {
      expect(p.azimuth).toBeGreaterThanOrEqual(ORBIT_LIMITS.minAzimuth);
      expect(p.azimuth).toBeLessThanOrEqual(ORBIT_LIMITS.maxAzimuth);
      expect(p.polar).toBeGreaterThanOrEqual(ORBIT_LIMITS.minPolar);
      expect(p.polar).toBeLessThanOrEqual(ORBIT_LIMITS.maxPolar);
      expect(p.distance).toBeGreaterThanOrEqual(ORBIT_LIMITS.minDistance);
    }
  });

  it('gives every decoration a unique id, a model and a spot inside the room', () => {
    const ids = decor.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const d of decor) {
      expect(decorModels[d.kind], d.kind).toBeTypeOf('function');
      expect(Math.abs(d.position[0])).toBeLessThanOrEqual(HALF_ROOM);
      expect(Math.abs(d.position[2])).toBeLessThanOrEqual(HALF_ROOM);
    }
  });

  it('has lines for the cat and the guitar', () => {
    expect(room.catLines.length).toBeGreaterThan(0);
    expect(room.guitarLines.length).toBeGreaterThan(0);
  });
});
