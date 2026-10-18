import { EARTH_COLS, EARTH_ROWS, EARTH_MASK } from '../../data/earthMask';

/**
 * The real-earth land mask (Natural Earth 50m, see src/data/earthMask.ts)
 * upsampled 2× and softened, as 8-bit luminance for a WebGL texture.
 *
 * The shader reads it two ways: thresholded at 0.5 per dot centre (which dots
 * are land) and smoothstepped per pixel (the frosted continent tint). The blur
 * is what keeps that tint's coastlines smooth instead of 1.25° stair-steps.
 */
export const LAND_TEX_W = EARTH_COLS * 2;
export const LAND_TEX_H = EARTH_ROWS * 2;

let cached: Uint8Array | null = null;

export const buildLandTexture = (): Uint8Array => {
  if (cached) return cached;

  const W = LAND_TEX_W;
  const H = LAND_TEX_H;
  const buf = new Float32Array(W * H);
  for (let y = 0; y < H; y++) {
    const row = EARTH_MASK[y >> 1];
    for (let x = 0; x < W; x++) {
      const sx = x >> 1;
      const nibble = parseInt(row[sx >> 2], 16);
      buf[y * W + x] = (nibble >> (3 - (sx & 3))) & 1;
    }
  }

  // Two passes of a separable [1 2 1] blur; x wraps around the antimeridian.
  const tmp = new Float32Array(W * H);
  for (let pass = 0; pass < 2; pass++) {
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const l = buf[y * W + ((x - 1 + W) % W)];
        const r = buf[y * W + ((x + 1) % W)];
        tmp[y * W + x] = (l + 2 * buf[y * W + x] + r) * 0.25;
      }
    }
    for (let y = 0; y < H; y++) {
      const up = Math.max(0, y - 1);
      const dn = Math.min(H - 1, y + 1);
      for (let x = 0; x < W; x++) {
        buf[y * W + x] = (tmp[up * W + x] + 2 * tmp[y * W + x] + tmp[dn * W + x]) * 0.25;
      }
    }
  }

  const out = new Uint8Array(W * H);
  for (let i = 0; i < out.length; i++) out[i] = Math.round(buf[i] * 255);
  cached = out;
  return out;
};
