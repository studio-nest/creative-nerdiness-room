/**
 * Content model for the room.
 *
 * Everything a visitor can read, and everything that decides *where* a thing
 * sits and *how the camera looks at it*, lives in plain data. The renderer
 * (src/scene) only knows how to draw a `kind`; it never hard-codes copy.
 */

export type Vec3 = [number, number, number];

/** Which 3D model draws the station. Add a new kind in scene/stations/registry. */
export type StationKind =
  | 'designDesk'
  | 'easel'
  | 'photoCorner'
  | 'bookshelf'
  | 'gamingNook'
  | 'crochetCorner'
  | 'pedestal3d';

/** Camera described on a sphere around a target: easy to bound and to author. */
export interface CameraPose {
  target: Vec3;
  /** Radians around Y. 0 looks at the back wall, PI/2 looks at the left wall. */
  azimuth: number;
  /** Radians from straight up. PI/2 is eye level. */
  polar: number;
  distance: number;
  /**
   * Aspect ratio (w/h) the pose was framed for. Narrower usable viewports pull
   * the camera back proportionally so the subject always fits.
   */
  designAspect: number;
}

export interface ShowcaseItem {
  title: string;
  blurb: string;
  tags: string[];
  /** Optional external link. Omit for items that have nowhere to go yet. */
  href?: string;
  /** Optional image (path under /public or absolute URL). */
  image?: string;
  imageAlt?: string;
}

export interface Station {
  id: string;
  kind: StationKind;
  /** Short label used in the dock and on hotspots. */
  label: string;
  title: string;
  tagline: string;
  /** One or more paragraphs. */
  body: string[];
  /** Accent colour (hex) used by both the 3D hotspot and the panel. */
  accent: string;
  items: ShowcaseItem[];
  /** A small "currently..." note pinned to the panel. */
  note?: string;
  placement: {
    position: Vec3;
    rotationY: number;
    /** Size of the invisible box that makes the station easy to hit. */
    hitbox: Vec3;
    /** Hitbox centre, relative to the station origin. */
    hitboxOffset: Vec3;
    /** Where the floating hotspot sits, relative to the station origin. */
    hotspot: Vec3;
  };
  camera: CameraPose;
}

/** Decorative objects: they make the room feel lived-in but carry no portfolio content. */
export type DecorKind =
  | 'nonLa'
  | 'guitar'
  | 'monstera'
  | 'citrusTree'
  | 'hangingPothos'
  | 'pegboard'
  | 'corkboard'
  | 'crayonDrawing'
  | 'leafPrint'
  | 'wallShelf'
  | 'beanbag'
  | 'letterTray'
  | 'bookStack';

export interface Decor {
  id: string;
  kind: DecorKind;
  position: Vec3;
  rotationY?: number;
  scale?: number;
  /** Kind-specific flavour, e.g. which beanbag. */
  variant?: string;
}

export interface RoomContent {
  artist: {
    name: string;
    role: string;
    intro: string;
    links: { label: string; href: string }[];
  };
  /** Wide shot of the whole room. */
  overview: CameraPose;
  /** Where the camera waits behind the loading screen before gliding in. */
  intro: CameraPose;
  stations: Station[];
  decor: Decor[];
  /** Lines the cat says when poked. */
  catLines: string[];
  /** What happens when someone strums the guitar. */
  guitarLines: string[];
}
