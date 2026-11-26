import { extend, type ThreeElement } from '@react-three/fiber';
import { DataTexture, MeshToonMaterial, NearestFilter, RedFormat, type MeshToonMaterialParameters } from 'three';

/**
 * The room's "illustrated" surface: cel shading with a soft four-step ramp,
 * so light falls in flat washes like marker or gouache instead of smooth 3D
 * gradients. Every solid object in the scene uses this one material class.
 */
const ramp = new DataTexture(new Uint8Array([120, 185, 232, 255]), 4, 1, RedFormat);
ramp.minFilter = ramp.magFilter = NearestFilter;
ramp.needsUpdate = true;

export class InkToonMaterial extends MeshToonMaterial {
  constructor(params?: MeshToonMaterialParameters) {
    super(params);
    this.gradientMap = ramp;
  }
}

extend({ InkToonMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    inkToonMaterial: ThreeElement<typeof InkToonMaterial>;
  }
}
