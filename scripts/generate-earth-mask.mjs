/**
 * Generates src/data/earthMask.ts — a real-earth land mask rasterized from
 * Natural Earth coastlines (world-atlas land-50m TopoJSON) onto an
 * equirectangular grid. The ASCII globe samples this mask per frame.
 *
 * Run: node scripts/generate-earth-mask.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as topojson from 'topojson-client';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const topo = JSON.parse(
  readFileSync(path.join(root, 'node_modules/world-atlas/land-50m.json'), 'utf8'),
);
const land = topojson.feature(topo, topo.objects.land); // Feature of MultiPolygon

// Collect every ring with its bounding box; even-odd crossing across all
// rings handles lakes/holes, and the bbox filter skips the far-away rings
// that dominate land-50m.
const rings = [];
const collect = geom => {
  const polys =
    geom.type === 'Polygon'
      ? [geom.coordinates]
      : geom.type === 'MultiPolygon'
        ? geom.coordinates
        : [];
  for (const poly of polys) {
    for (const ring of poly) {
      let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
      for (const [lon, lat] of ring) {
        if (lon < minLon) minLon = lon;
        if (lon > maxLon) maxLon = lon;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
      }
      rings.push({ ring, minLon, maxLon, minLat, maxLat });
    }
  }
};
if (land.type === 'FeatureCollection') land.features.forEach(f => collect(f.geometry));
else collect(land.geometry);

const insideRing = (lon, lat, ring) => {
  let hit = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
};

const isLand = (lon, lat) => {
  let parity = 0;
  for (const { ring, minLon, maxLon, minLat, maxLat } of rings) {
    if (lon < minLon || lon > maxLon || lat < minLat || lat > maxLat) continue;
    if (insideRing(lon, lat, ring)) parity++;
  }
  return parity % 2 === 1;
};

const COLS = 288; // 1.25° per cell
const ROWS = 144;
const SS = 2; // supersample factor per axis for soft coastlines

const rows = [];
for (let y = 0; y < ROWS; y++) {
  // Cell centers from +90 (row 0) down to -90.
  const lat = 90 - ((y + 0.5) * 180) / ROWS;
  let bits = '';
  for (let x = 0; x < COLS; x++) {
    const lon = -180 + ((x + 0.5) * 360) / COLS;
    let n = 0;
    for (let sy = 0; sy < SS; sy++)
      for (let sx = 0; sx < SS; sx++) {
        const dLat = (sy / SS - 0.5) * (180 / ROWS);
        const dLon = (sx / SS - 0.5) * (360 / COLS);
        if (isLand(lon + dLon, lat + dLat)) n++;
      }
    bits += n * 2 >= (SS * SS) / 2 ? '1' : '0';
  }
  // Pack into hex, 4 cells per hex digit (MSB = westernmost cell).
  let hex = '';
  for (let i = 0; i < COLS; i += 4) hex += parseInt(bits.slice(i, i + 4), 2).toString(16);
  rows.push(hex);
}

const out = `/**
 * Real-earth land mask, ${COLS}x${ROWS} equirectangular grid (1.25° per cell),
 * rasterized from Natural Earth 50m coastlines (world-atlas land-50m).
 * Row 0 = 90°N; each row is hex-packed MSB-first, 4 cells per hex digit.
 * Regenerate with: node scripts/generate-earth-mask.mjs
 */
export const EARTH_COLS = ${COLS};
export const EARTH_ROWS = ${ROWS};

export const EARTH_MASK = [
${rows.map(r => `  '${r}',`).join('\n')}
];
`;

writeFileSync(path.join(root, 'src/data/earthMask.ts'), out);
console.log(`earthMask.ts written: ${COLS}x${ROWS}, ${rows.length} rows`);
