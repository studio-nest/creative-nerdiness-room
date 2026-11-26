import type { CameraPose, Vec3 } from '../content/types';

/** Vertical field of view used everywhere, in degrees. */
export const CAMERA_FOV = 38;

/** Limits the visitor can orbit within: the room is a two-walled cutaway. */
export const ORBIT_LIMITS = {
  minAzimuth: 0.06,
  maxAzimuth: Math.PI / 2 - 0.06,
  minPolar: 0.55,
  maxPolar: 1.42,
  minDistance: 2.6,
} as const;

export interface Viewport {
  width: number;
  height: number;
}

export type PanelLayout = 'side' | 'sheet';

/** Width below which the detail panel becomes a bottom sheet. */
export const SHEET_BREAKPOINT = 820;
export const SIDE_PANEL_PX = 440;
export const SHEET_FRACTION = 0.46;

export function panelLayout(viewport: Viewport): PanelLayout {
  return viewport.width < SHEET_BREAKPOINT ? 'sheet' : 'side';
}

export function sphericalToPosition(target: Vec3, azimuth: number, polar: number, distance: number): Vec3 {
  const sinPolar = Math.sin(polar);
  return [
    target[0] + distance * sinPolar * Math.sin(azimuth),
    target[1] + distance * Math.cos(polar),
    target[2] + distance * sinPolar * Math.cos(azimuth),
  ];
}

/**
 * How much further back the camera must sit so a pose framed for
 * `designAspect` still fits in the part of the viewport not covered by UI.
 */
export function fitFactor(aspect: number, usableW: number, usableH: number, designAspect: number): number {
  const byHeight = 1 / usableH;
  const byWidth = designAspect / (aspect * usableW);
  return Math.min(3.2, Math.max(1, byHeight, byWidth));
}

export interface ResolvedCamera {
  position: Vec3;
  target: Vec3;
  distance: number;
  /** Screen-parallel shift (world units) that re-centres the subject beside the panel. */
  focalOffset: [number, number];
}

/**
 * Turn an authored pose into a concrete camera for this viewport.
 * When the panel is open the subject is framed in the remaining free area.
 */
export function resolveCamera(pose: CameraPose, viewport: Viewport, panelOpen: boolean): ResolvedCamera {
  const width = Math.max(1, viewport.width);
  const height = Math.max(1, viewport.height);
  const aspect = width / height;
  const layout = panelLayout(viewport);

  let usableW = 1;
  let usableH = 1;
  if (panelOpen) {
    if (layout === 'side') usableW = Math.max(0.35, 1 - SIDE_PANEL_PX / width);
    else usableH = 1 - SHEET_FRACTION;
  }

  const distance = pose.distance * fitFactor(aspect, usableW, usableH, pose.designAspect);
  const position = sphericalToPosition(pose.target, pose.azimuth, pose.polar, distance);

  // World units covered by the full viewport at the target's depth.
  const viewH = 2 * distance * Math.tan((CAMERA_FOV * Math.PI) / 360);
  const viewW = viewH * aspect;
  const focalOffset: [number, number] = [
    panelOpen && layout === 'side' ? (viewW * (1 - usableW)) / 2 : 0,
    panelOpen && layout === 'sheet' ? (viewH * (1 - usableH)) / 2 : 0,
  ];

  return { position, target: pose.target, distance, focalOffset };
}
