/**
 * Geometry shared by the Glass Globe's WebGL shader and its 2D overlays.
 *
 * One orthographic camera, unit sphere, y-up screen space. A point on the
 * earth goes through three rotations to reach the screen:
 *   1. spin  — around the polar axis, so `centerLon` faces the viewer;
 *   2. tilt  — around screen-x, tipping the north pole toward the viewer;
 *   3. roll  — around screen-z, leaning the axis like a desk globe.
 * The fragment shader runs the exact inverse (see GlassGlobeEngine.ts), so a
 * city marker drawn in 2D always lands on the right pixel of the sphere.
 */

export const DEG = Math.PI / 180;

export interface GeoCity {
  id: string;
  name: string;
  nameEn: string;
  lat: number;
  lon: number;
}

/** The host city — DOAI 2026 is held at the Bund, Huangpu, Shanghai. */
export const HOST_CITY: GeoCity = {
  id: 'shanghai',
  name: '上海',
  nameEn: 'Shanghai',
  lat: 31.23,
  lon: 121.47,
};

/** Partner cities from the key art; each gets an arc from the host. */
export const LINKED_CITIES: GeoCity[] = [
  { id: 'hongkong', name: '香港', nameEn: 'Hong Kong', lat: 22.32, lon: 114.17 },
  { id: 'singapore', name: '新加坡', nameEn: 'Singapore', lat: 1.35, lon: 103.82 },
  { id: 'florence', name: '佛罗伦萨', nameEn: 'Florence', lat: 43.77, lon: 11.25 },
  { id: 'siliconvalley', name: '硅谷', nameEn: 'Silicon Valley', lat: 37.39, lon: -122.06 },
];

export interface ViewState {
  /** Longitude facing the viewer, radians. */
  centerLon: number;
  /** North pole tipped toward the viewer, radians. */
  tilt: number;
  /** Screen-plane lean of the axis, radians (negative leans the pole right). */
  roll: number;
}

export type Vec3 = [number, number, number];

/** Unit vector for a lat/lon (degrees) in the globe's own frame. */
export const latLonToVec = (latDeg: number, lonDeg: number): Vec3 => {
  const lat = latDeg * DEG;
  const lon = lonDeg * DEG;
  return [Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon)];
};

/**
 * Globe frame → view frame. x right, y up, z toward the viewer; the visible
 * hemisphere has z > 0. Works for any radius (arcs fly above the surface).
 */
export const toView = (v: Vec3, s: ViewState): Vec3 => {
  // spin
  const cs = Math.cos(-s.centerLon);
  const ss = Math.sin(-s.centerLon);
  const x0 = v[0] * cs + v[2] * ss;
  const z0 = -v[0] * ss + v[2] * cs;
  const y0 = v[1];
  // tilt
  const ct = Math.cos(s.tilt);
  const st = Math.sin(s.tilt);
  const y1 = y0 * ct - z0 * st;
  const z1 = y0 * st + z0 * ct;
  // roll
  const cr = Math.cos(s.roll);
  const sr = Math.sin(s.roll);
  return [x0 * cr - y1 * sr, x0 * sr + y1 * cr, z1];
};

/** Spherical interpolation between two unit vectors. */
export const slerp = (a: Vec3, b: Vec3, t: number): Vec3 => {
  const dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const omega = Math.acos(dot);
  if (omega < 1e-5) return a;
  const so = Math.sin(omega);
  const ka = Math.sin((1 - t) * omega) / so;
  const kb = Math.sin(t * omega) / so;
  return [a[0] * ka + b[0] * kb, a[1] * ka + b[1] * kb, a[2] * ka + b[2] * kb];
};

export const angleBetween = (a: Vec3, b: Vec3): number =>
  Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])));

/**
 * A point in view space is visible when it is in front of the sphere, or
 * outside the sphere's silhouette (an arc flying past the limb).
 */
export const isVisible = (p: Vec3): boolean => p[2] > 0 || p[0] * p[0] + p[1] * p[1] > 1;
