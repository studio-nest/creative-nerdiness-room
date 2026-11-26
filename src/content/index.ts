import { room } from './room';
import type { Station } from './types';

export { room };
export type * from './types';

export const stations: readonly Station[] = room.stations;
export const stationIds: readonly string[] = stations.map((s) => s.id);

export function getStation(id: string | null | undefined): Station | undefined {
  return id ? stations.find((s) => s.id === id) : undefined;
}

export const decor = room.decor;
