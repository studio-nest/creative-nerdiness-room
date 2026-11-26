import { describe, expect, it } from 'vitest';
import type { CameraPose } from '../content/types';
import { fitFactor, panelLayout, resolveCamera, sphericalToPosition } from './camera';

const pose: CameraPose = { target: [1, 1, 1], azimuth: 0, polar: Math.PI / 2, distance: 5, designAspect: 1.1 };

describe('camera maths', () => {
  it('converts spherical poses to positions', () => {
    const [x, y, z] = sphericalToPosition([1, 1, 1], 0, Math.PI / 2, 5);
    expect(x).toBeCloseTo(1);
    expect(y).toBeCloseTo(1);
    expect(z).toBeCloseTo(6);
    const side = sphericalToPosition([0, 0, 0], Math.PI / 2, Math.PI / 2, 2);
    expect(side[0]).toBeCloseTo(2);
    expect(side[2]).toBeCloseTo(0);
  });

  it('never pulls the camera closer than authored, and caps the pull-back', () => {
    expect(fitFactor(2, 1, 1, 1.1)).toBe(1);
    expect(fitFactor(0.46, 1, 1, 1.1)).toBeCloseTo(1.1 / 0.46);
    expect(fitFactor(0.1, 1, 1, 1.1)).toBe(3.2);
  });

  it('switches panel layout at the breakpoint', () => {
    expect(panelLayout({ width: 390, height: 844 })).toBe('sheet');
    expect(panelLayout({ width: 1440, height: 900 })).toBe('side');
  });

  it('keeps the authored distance on a wide screen with no panel', () => {
    const cam = resolveCamera(pose, { width: 1600, height: 900 }, false);
    expect(cam.distance).toBe(5);
    expect(cam.focalOffset).toEqual([0, 0]);
  });

  it('shifts sideways for the side panel and upwards for the bottom sheet', () => {
    const desktop = resolveCamera(pose, { width: 1440, height: 900 }, true);
    expect(desktop.focalOffset[0]).toBeGreaterThan(0);
    expect(desktop.focalOffset[1]).toBe(0);
    const phone = resolveCamera(pose, { width: 390, height: 844 }, true);
    expect(phone.focalOffset[0]).toBe(0);
    expect(phone.focalOffset[1]).toBeGreaterThan(0);
    expect(phone.distance).toBeGreaterThan(desktop.distance);
  });

  it('survives a zero-sized viewport', () => {
    const cam = resolveCamera(pose, { width: 0, height: 0 }, true);
    cam.position.forEach((n) => expect(Number.isFinite(n)).toBe(true));
  });
});
