import { Color, type Texture } from 'three';
import { InkToonMaterial } from './ink';

const cache = new Map<string, InkToonMaterial>();

/**
 * One shared toon material per look. Identical-looking meshes then share a
 * material instance, which is what lets <Merge> batch them into one draw call.
 * Never mutate a material from here; give animated surfaces their own
 * inline <inkToonMaterial>.
 */
export function toon(color: string, emissive = '#000000', emissiveIntensity = 0, map?: Texture | null): InkToonMaterial {
  const key = `${new Color(color).getHexString()}|${new Color(emissive).getHexString()}|${emissiveIntensity}|${map?.uuid ?? ''}`;
  let mat = cache.get(key);
  if (!mat) {
    mat = new InkToonMaterial({ color, emissive, emissiveIntensity, map: map ?? null });
    cache.set(key, mat);
  }
  return mat;
}
