/**
 * Per-frame scene values shared without React re-renders.
 * `night` eases 0 → 1 as the lights go down; components read it in useFrame.
 */
export const env = {
  night: 0,
  reducedMotion: false,
};
