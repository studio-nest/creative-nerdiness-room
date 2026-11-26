import type { ComponentType } from 'react';
import type { Station, StationKind } from '../../content/types';
import { Bookshelf } from './Bookshelf';
import { CrochetCorner } from './CrochetCorner';
import { DesignDesk } from './DesignDesk';
import { Easel } from './Easel';
import { GamingNook } from './GamingNook';
import { Pedestal3D } from './Pedestal3D';
import { PhotoCorner } from './PhotoCorner';

export interface StationModelProps {
  station: Station;
}

/** Content says *what kind* of station; this says *how to draw* it. */
export const stationModels: Record<StationKind, ComponentType<StationModelProps>> = {
  designDesk: DesignDesk,
  easel: Easel,
  photoCorner: PhotoCorner,
  bookshelf: Bookshelf,
  gamingNook: GamingNook,
  crochetCorner: CrochetCorner,
  pedestal3d: Pedestal3D,
};
