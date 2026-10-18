/**
 * GlassGlobeEngine — renders the hero's glass earth.
 *
 * Three stacked canvases share one coordinate system (see geo.ts):
 *   back  (2D)    — the far half of each orbit ring;
 *   gl    (WebGL) — the sphere: a single fragment shader ray-casts a unit
 *                   sphere, then shades glass (fresnel rim, softbox reflection,
 *                   iridescent edge), frosted continents and a dot-matrix
 *                   earth built from real Natural Earth coastlines. The far
 *                   side's dots show faintly through the glass;
 *   front (2D)    — near half of the rings with their satellites, arcs from
 *                   the host city with travelling pulses, and city markers.
 * Because the rings straddle the sphere this way, depth reads correctly with
 * no 3D engine and no depth buffer.
 *
 * Framework-free on purpose: the React wrapper (GlassGlobe.tsx) only owns the
 * DOM and lifecycle, so the engine can be reused in any page or a lab sandbox.
 */
import {
  DEG,
  GeoCity,
  Vec3,
  ViewState,
  angleBetween,
  isVisible,
  latLonToVec,
  slerp,
  toView,
} from './geo';
import { LAND_TEX_H, LAND_TEX_W, buildLandTexture } from './landTexture';

/** Overlay canvases span ±BOX_RATIO sphere radii; rings and arcs fit inside. */
export const BOX_RATIO = 1.55;
/** The WebGL canvas spans ±GL_RATIO radii: the sphere plus its atmosphere. */
export const GL_RATIO = 1.22;

export interface GlassGlobeConfig {
  host: GeoCity;
  cities: GeoCity[];
  /** Seconds per revolution at cruising speed. */
  spinSeconds: number;
  /** Longitude facing the viewer on first paint, degrees. */
  startLon: number;
  /** Pole tipped toward the viewer, degrees. */
  tilt: number;
  /** Axis lean in the screen plane, degrees (negative leans the pole right). */
  roll: number;
  rings: boolean;
  arcs: boolean;
  /** Delay before the entrance animation starts, ms. */
  appearDelay: number;
  /** Render a single still frame and never animate (prefers-reduced-motion). */
  still: boolean;
}

interface Ring {
  radius: number;
  /** Opening angle: how far the ring plane is tipped toward the viewer. */
  open: number;
  /** Screen-plane rotation of the ring. */
  roll: number;
  width: number;
  alpha: number;
  /** Seconds per lap of the satellite; negative runs the other way. */
  lap: number;
  bead: number;
  /** Gradient across the ring's major axis, left → right. */
  colors: [string, string, string];
}

// Two crossing orbits — the atom mark of 原子公社 (AtomClub), drawn in the
// key art's blue → lilac → pink.
const RINGS: Ring[] = [
  {
    radius: 1.36,
    open: 13 * DEG,
    roll: -11 * DEG,
    width: 1.35,
    alpha: 0.95,
    lap: 18,
    bead: 5.2,
    colors: ['rgba(22,93,255,0.85)', 'rgba(150,140,255,0.8)', 'rgba(255,128,196,0.85)'],
  },
  {
    radius: 1.2,
    open: 10 * DEG,
    roll: 64 * DEG,
    width: 1,
    alpha: 0.6,
    lap: -13,
    bead: 3.6,
    colors: ['rgba(111,168,255,0.8)', 'rgba(22,93,255,0.75)', 'rgba(190,150,255,0.75)'],
  },
];

const LIGHT: Vec3 = (() => {
  const v: Vec3 = [0.6, 0.6, 0.53];
  const l = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / l, v[1] / l, v[2] / l];
})();

const ARC_SAMPLES = 72;
const PULSE_PERIOD = 3.6; // s between pulses on one arc
const PULSE_TRAVEL = 0.6; // fraction of the period spent flying

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 uC;        // sphere centre, device px
uniform float uR;       // sphere radius, device px
uniform vec3 uView;     // centerLon, tilt, roll (radians)
uniform vec3 uLight;
uniform sampler2D uLand;
uniform float uAlpha;

const float STEP = 2.0;     // degrees between dot rows
const float DOT_R = 0.5;    // dot radius, degrees

vec2 toLatLon(vec3 v) {
  float cr = cos(uView.z), sr = sin(uView.z);
  float x0 = v.x * cr + v.y * sr;
  float y1 = -v.x * sr + v.y * cr;
  float ct = cos(uView.y), st = sin(uView.y);
  float y0 = y1 * ct + v.z * st;
  float z0 = -y1 * st + v.z * ct;
  return vec2(degrees(atan(x0, z0) + uView.x), degrees(asin(clamp(y0, -1.0, 1.0))));
}

float landAt(vec2 ll) {
  vec2 uv = vec2(fract((ll.x + 180.0) / 360.0), clamp((90.0 - ll.y) / 180.0, 0.0, 1.0));
  return texture2D(uLand, uv).r;
}

// x: coverage of the nearest dot, y: 1.0 when that dot sits on land.
// Rows are 2 deg apart; each row holds as many dots as its circumference
// allows, so the matrix stays even all the way to the poles.
vec2 dots(vec2 ll, float aa) {
  float row = floor((ll.y + 90.0) / STEP);
  float latC = -90.0 + (row + 0.5) * STEP;
  float n = max(1.0, floor(360.0 / STEP * cos(radians(latC)) + 0.5));
  float w = 360.0 / n;
  float lonW = mod(ll.x + 180.0, 360.0);
  float lonC = (floor(lonW / w) + 0.5) * w - 180.0;
  float dLon = (lonW - 180.0 - lonC) * cos(radians(ll.y));
  float d = length(vec2(ll.y - latC, dLon));
  float cov = 1.0 - smoothstep(DOT_R - aa, DOT_R + aa, d);
  return vec2(cov, step(0.5, landAt(vec2(lonC, latC))));
}

void main() {
  vec2 p = (gl_FragCoord.xy - uC) / uR;
  float r = length(p);
  float px = 1.0 / uR;
  vec2 dir = p / max(r, 1e-4);

  // Atmosphere: sky-blue haze hugging the limb, warming to lilac at lower right.
  float warmSide = smoothstep(-0.2, 0.9, dot(dir, vec2(0.755, -0.656)));
  vec3 haloCol = mix(vec3(0.48, 0.68, 1.0), vec3(0.93, 0.72, 0.97), warmSide * 0.6);
  float halo = exp(-max(r - 1.0, 0.0) * 9.0) * smoothstep(0.9, 1.0, r) * 0.3;
  vec4 outC = vec4(haloCol * halo, halo);

  float cover = 1.0 - smoothstep(1.0 - px, 1.0 + px, r);
  if (cover > 0.0) {
    float rr = min(r, 0.9995);
    vec3 n = vec3(dir * rr, sqrt(1.0 - rr * rr));
    float z = n.z;
    float diff = max(dot(n, uLight), 0.0);
    vec2 ll = toLatLon(n);
    float aa = degrees(px) * 0.9 / max(z, 0.22);

    // Ocean: brand blue, deepening on the shadow side, lifting toward the light.
    vec3 deep = vec3(0.03, 0.17, 0.66);
    vec3 brand = vec3(0.086, 0.365, 1.0);
    vec3 light = vec3(0.4, 0.64, 1.0);
    vec3 col = mix(deep, brand, smoothstep(0.0, 0.6, diff));
    col = mix(col, light, smoothstep(0.55, 1.0, diff) * 0.55);
    col += vec3(0.03, 0.05, 0.09) * z;  // light passing through the glass

    // Frosted continents under the dots.
    float land = smoothstep(0.32, 0.68, landAt(ll));
    col = mix(col, vec3(0.84, 0.91, 1.0), land * (0.24 + 0.24 * diff));

    // The far side's continents, seen through the glass (mirrored, softer).
    vec2 db = dots(toLatLon(vec3(n.xy, -z)), aa * 1.6);
    col = mix(col, vec3(0.7, 0.84, 1.0), db.x * db.y * 0.26 * (1.0 - 0.5 * diff));

    // Near side dot matrix: bright on land, a whisper of grid over the ocean.
    vec2 d = dots(ll, aa);
    col = mix(col, vec3(1.0), d.x * mix(0.05, 0.5 + 0.5 * diff, d.y));

    // Caustic: light focused through the ball pools along the inner edge
    // opposite the key light.
    vec2 l2 = normalize(uLight.xy);
    float crescent = smoothstep(0.62, 0.92, r) * (1.0 - smoothstep(0.92, 0.985, r))
                   * smoothstep(0.25, 0.95, dot(dir, -l2));
    col += vec3(0.32, 0.62, 1.0) * crescent * 0.5;

    // Glass: fresnel rim, cool upper-left edge, iridescent lower-right edge.
    float fr = pow(1.0 - z, 3.0);
    col = mix(col, vec3(0.9, 0.95, 1.0), fr * 0.72);
    col = mix(col, vec3(0.76, 0.93, 1.0), fr * smoothstep(0.0, 0.9, dot(dir, vec2(-0.707, 0.707))) * 0.3);
    col = mix(col, vec3(0.97, 0.74, 0.95), fr * warmSide * 0.55);

    // Reflected sky: a crescent along the upper-left rim.
    float rimBand = smoothstep(0.78, 0.9, r) * (1.0 - smoothstep(0.93, 0.975, r))
                  * smoothstep(0.35, 0.95, dot(dir, vec2(-0.6, 0.8)));
    col = mix(col, vec3(0.96, 0.98, 1.0), rimBand * 0.42);

    // Key-light glint plus a broad, faint sheen.
    vec3 h = normalize(uLight + vec3(0.0, 0.0, 1.0));
    float nh = max(dot(n, h), 0.0);
    col += vec3(pow(nh, 420.0) * 0.85 + pow(nh, 30.0) * 0.07);

    // Refraction band just inside the limb, then a crisp bright edge.
    col *= 1.0 - 0.1 * smoothstep(0.8, 0.96, r) * (1.0 - smoothstep(0.96, 0.995, r));
    col = mix(col, vec3(1.0), smoothstep(0.968, 0.997, r) * 0.5);

    float a = mix(0.93, 1.0, fr);
    vec4 sphere = vec4(min(col, vec3(1.0)) * a, a) * cover;
    outC = sphere + outC * (1.0 - sphere.a);
  }
  gl_FragColor = outC * uAlpha;
}
`;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
const smooth = (a: number, b: number, t: number) => {
  const x = clamp01((t - a) / (b - a));
  return x * x * (3 - 2 * x);
};

interface ArcPath {
  city: GeoCity;
  points: Vec3[];
  phase: number;
}

export interface GlassGlobeElements {
  back: HTMLCanvasElement;
  gl: HTMLCanvasElement;
  front: HTMLCanvasElement;
  /** Optional DOM label that follows the host city. */
  label?: HTMLElement | null;
}

export class GlassGlobeEngine {
  readonly supported: boolean;

  private cfg: GlassGlobeConfig;
  private els: GlassGlobeElements;
  private gl: WebGLRenderingContext | null = null;
  private prog: WebGLProgram | null = null;
  private uni: Record<string, WebGLUniformLocation | null> = {};
  private backCtx: CanvasRenderingContext2D | null;
  private frontCtx: CanvasRenderingContext2D | null;

  private boxPx = 0; // overlay canvas side, device px
  private glPx = 0; // WebGL canvas side, device px
  private rPx = 0; // sphere radius, device px
  private dpr = 1;

  private raf = 0;
  private running = false;
  private lastMs = 0;
  /** Seconds of animation played so far (pauses while offscreen). */
  private now = 0;

  // Rotation state (radians). centerLon decreases so features drift west → east.
  private centerLon: number;
  private dragVel = 0;
  private dragging = false;
  private lastPointerX = 0;
  private parallax = { x: 0, y: 0, tx: 0, ty: 0 };

  private hostVec: Vec3;
  private arcs: ArcPath[];

  constructor(els: GlassGlobeElements, cfg: GlassGlobeConfig) {
    this.els = els;
    this.cfg = cfg;
    this.centerLon = cfg.startLon * DEG;
    this.hostVec = latLonToVec(cfg.host.lat, cfg.host.lon);
    this.arcs = cfg.cities.map((city, i) => this.buildArc(city, i));
    this.backCtx = els.back.getContext('2d');
    this.frontCtx = els.front.getContext('2d');
    this.supported = this.initGL();
  }

  // ---------------------------------------------------------------- setup

  private initGL(): boolean {
    const canvas = this.els.gl;
    const gl = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
    });
    if (!gl) return false;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.warn('[GlassGlobe] shader:', gl.getShaderInfoLog(sh));
        return null;
      }
      return sh;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return false;
    const prog = gl.createProgram();
    if (!prog) return false;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn('[GlassGlobe] link:', gl.getProgramInfoLog(prog));
      return false;
    }
    gl.useProgram(prog);

    // One oversized triangle covers the viewport.
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.LUMINANCE, LAND_TEX_W, LAND_TEX_H, 0,
      gl.LUMINANCE, gl.UNSIGNED_BYTE, buildLandTexture(),
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    for (const name of ['uC', 'uR', 'uView', 'uLight', 'uLand', 'uAlpha']) {
      this.uni[name] = gl.getUniformLocation(prog, name);
    }
    gl.uniform1i(this.uni.uLand, 0);
    gl.uniform3f(this.uni.uLight, LIGHT[0], LIGHT[1], LIGHT[2]);
    gl.clearColor(0, 0, 0, 0);

    this.gl = gl;
    this.prog = prog;
    return true;
  }

  private buildArc(city: GeoCity, i: number): ArcPath {
    const a = this.hostVec;
    const b = latLonToVec(city.lat, city.lon);
    const span = angleBetween(a, b);
    // Longer hops fly higher, like flight paths on a departures board.
    const lift = 0.06 + 0.3 * (span / Math.PI);
    const points: Vec3[] = [];
    for (let k = 0; k <= ARC_SAMPLES; k++) {
      const t = k / ARC_SAMPLES;
      const v = slerp(a, b, t);
      const h = 1 + lift * Math.sin(Math.PI * t);
      points.push([v[0] * h, v[1] * h, v[2] * h]);
    }
    return { city, points, phase: i / Math.max(1, this.cfg.cities.length) };
  }

  /**
   * Apply new settings without re-creating the GL context. A new start
   * longitude re-aims the globe; new cities rebuild the arcs.
   */
  update(next: GlassGlobeConfig) {
    const prev = this.cfg;
    this.cfg = next;
    if (next.startLon !== prev.startLon) this.centerLon = next.startLon * DEG;
    if (next.host !== prev.host || next.cities !== prev.cities) {
      this.hostVec = latLonToVec(next.host.lat, next.host.lon);
      this.arcs = next.cities.map((city, i) => this.buildArc(city, i));
    }
    if (next.still) this.stop();
    if (!this.running) this.draw();
  }

  /** Size the canvases. `boxCss` is the overlay square in CSS px. */
  resize(boxCss: number, devicePixelRatio: number) {
    this.dpr = Math.min(2, Math.max(1, devicePixelRatio || 1));
    this.boxPx = Math.max(2, Math.round(boxCss * this.dpr));
    this.rPx = this.boxPx / (2 * BOX_RATIO);
    this.glPx = Math.max(2, Math.round(this.rPx * 2 * GL_RATIO));
    for (const c of [this.els.back, this.els.front]) {
      c.width = this.boxPx;
      c.height = this.boxPx;
    }
    this.els.gl.width = this.glPx;
    this.els.gl.height = this.glPx;
    if (!this.running) this.draw();
  }

  // ---------------------------------------------------------------- loop

  start() {
    if (this.running || this.cfg.still) {
      this.draw();
      return;
    }
    this.running = true;
    const tick = (ms: number) => {
      if (!this.running) return;
      // Clamp dt so a backgrounded tab resumes smoothly instead of jumping.
      const dt = this.lastMs ? Math.min(0.05, (ms - this.lastMs) / 1000) : 1 / 60;
      this.lastMs = ms;
      this.step(dt);
      this.draw();
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  stop() {
    this.running = false;
    this.lastMs = 0;
    cancelAnimationFrame(this.raf);
  }

  /**
   * Jump to `t` seconds after mount and draw that frame, with the loop
   * stopped. Deterministic, for frame-by-frame captures and tests.
   */
  seek(t: number) {
    this.stop();
    this.now = 0;
    this.centerLon = this.cfg.startLon * DEG;
    this.dragVel = 0;
    const dt = 1 / 60;
    for (let x = 0; x < t; x += dt) this.step(Math.min(dt, t - x));
    this.draw();
  }

  destroy() {
    this.stop();
    this.gl?.getExtension('WEBGL_lose_context')?.loseContext();
    this.gl = null;
  }

  private step(dt: number) {
    this.now += dt;
    const cruise = (2 * Math.PI) / this.cfg.spinSeconds;
    const since = this.now - this.cfg.appearDelay / 1000;
    // Spin-up: the globe arrives turning fast and settles to cruising speed.
    const boost = 1 + 5 * (1 - easeOutCubic(clamp01(since / 2.8)));

    if (!this.dragging) {
      this.centerLon -= (cruise * boost + this.dragVel) * dt;
      this.dragVel *= Math.pow(0.12, dt);
      if (Math.abs(this.dragVel) < 0.002) this.dragVel = 0;
    }

    const k = 1 - Math.pow(0.02, dt);
    this.parallax.x += (this.parallax.tx - this.parallax.x) * k;
    this.parallax.y += (this.parallax.ty - this.parallax.y) * k;
  }

  // ---------------------------------------------------------------- input

  /** Pointer position relative to the globe, each axis roughly −1…1. */
  setPointer(nx: number, ny: number) {
    this.parallax.tx = Math.max(-1, Math.min(1, nx));
    this.parallax.ty = Math.max(-1, Math.min(1, ny));
  }

  dragStart(clientX: number) {
    this.dragging = true;
    this.dragVel = 0;
    this.lastPointerX = clientX;
  }

  dragMove(clientX: number) {
    if (!this.dragging) return;
    const dx = clientX - this.lastPointerX;
    this.lastPointerX = clientX;
    const cssR = this.rPx / this.dpr || 100;
    const dLon = dx / cssR; // one radius of drag ≈ one radian of spin
    this.centerLon -= dLon;
    this.dragVel = dLon * 30;
    if (!this.running) this.draw();
  }

  dragEnd() {
    this.dragging = false;
  }

  // ---------------------------------------------------------------- draw

  private view(): ViewState {
    return {
      centerLon: this.centerLon + this.parallax.x * 7 * DEG,
      tilt: (this.cfg.tilt - this.parallax.y * 5) * DEG,
      roll: this.cfg.roll * DEG,
    };
  }

  private draw() {
    const still = this.cfg.still;
    const since = still ? 99 : this.now - this.cfg.appearDelay / 1000;
    const appear = easeOutCubic(clamp01(since / 1.3));
    const view = this.view();

    this.drawSphere(view, appear);

    const back = this.backCtx;
    const front = this.frontCtx;
    if (!back || !front) return;
    back.clearRect(0, 0, this.boxPx, this.boxPx);
    front.clearRect(0, 0, this.boxPx, this.boxPx);
    if (appear <= 0) return;

    if (this.cfg.rings) {
      const draw = easeOutCubic(clamp01((since - 0.25) / 1.6));
      RINGS.forEach((ring, i) => this.drawRing(ring, i, draw, appear, since, still));
    }
    if (this.cfg.arcs && this.supported) {
      const arcsIn = still ? 1 : smooth(1.1, 2.2, since);
      this.drawArcs(view, arcsIn, since, still);
    }
  }

  private drawSphere(view: ViewState, appear: number) {
    const gl = this.gl;
    if (!gl || !this.prog) return;
    gl.viewport(0, 0, this.glPx, this.glPx);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(this.uni.uC, this.glPx / 2, this.glPx / 2);
    gl.uniform1f(this.uni.uR, this.rPx);
    gl.uniform3f(this.uni.uView, view.centerLon, view.tilt, view.roll);
    gl.uniform1f(this.uni.uAlpha, appear);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  /** View space → overlay canvas px. */
  private sx(p: Vec3) {
    return this.boxPx / 2 + p[0] * this.rPx;
  }
  private sy(p: Vec3) {
    return this.boxPx / 2 - p[1] * this.rPx;
  }

  private ringPoint(ring: Ring, theta: number): Vec3 {
    // Start in the horizontal plane, tip it toward the viewer, then roll.
    const x = ring.radius * Math.cos(theta);
    const zf = ring.radius * Math.sin(theta);
    const y1 = -zf * Math.sin(ring.open);
    const z1 = zf * Math.cos(ring.open);
    const cr = Math.cos(ring.roll);
    const sr = Math.sin(ring.roll);
    return [x * cr - y1 * sr, x * sr + y1 * cr, z1];
  }

  private drawRing(ring: Ring, idx: number, drawIn: number, appear: number, since: number, still: boolean) {
    const back = this.backCtx!;
    const front = this.frontCtx!;
    const N = 180;
    const span = Math.PI * 2 * drawIn;
    const start = Math.PI * (0.62 + idx * 0.5);
    const dpr = this.dpr;

    // Gradient along the ring's major axis.
    const a = this.ringPoint(ring, Math.PI);
    const b = this.ringPoint(ring, 0);
    const makeGrad = (ctx: CanvasRenderingContext2D) => {
      const g = ctx.createLinearGradient(this.sx(a), this.sy(a), this.sx(b), this.sy(b));
      g.addColorStop(0, ring.colors[0]);
      g.addColorStop(0.5, ring.colors[1]);
      g.addColorStop(1, ring.colors[2]);
      return g;
    };
    const gradBack = makeGrad(back);
    const gradFront = makeGrad(front);

    // Split the polyline into runs on either side of the sphere.
    const runs: { front: boolean; pts: Vec3[] }[] = [];
    for (let i = 0; i <= N; i++) {
      const th = start + (span * i) / N;
      const p = this.ringPoint(ring, th);
      const isFront = p[2] >= 0;
      const last = runs[runs.length - 1];
      if (!last || last.front !== isFront) {
        const run = { front: isFront, pts: last ? [last.pts[last.pts.length - 1]] : [] };
        runs.push(run);
      }
      runs[runs.length - 1].pts.push(p);
    }

    for (const run of runs) {
      const ctx = run.front ? front : back;
      ctx.save();
      ctx.globalAlpha = ring.alpha * appear * (run.front ? 1 : 0.45);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      run.pts.forEach((p, i) => (i ? ctx.lineTo(this.sx(p), this.sy(p)) : ctx.moveTo(this.sx(p), this.sy(p))));
      // soft glow, then the hairline
      ctx.strokeStyle = run.front ? gradFront : gradBack;
      ctx.lineWidth = ring.width * 4.5 * dpr;
      ctx.globalAlpha *= 0.12;
      ctx.stroke();
      ctx.globalAlpha /= 0.12;
      ctx.lineWidth = ring.width * dpr;
      ctx.stroke();
      ctx.restore();
    }

    // Satellite bead with a fading tail.
    if (drawIn < 0.98) return;
    const lapT = still ? 0.2 : since / ring.lap;
    const th0 = start + Math.PI * 2 * (lapT % 1);
    const dirSign = Math.sign(ring.lap) || 1;
    const TAIL = 26;
    for (let i = TAIL; i >= 1; i--) {
      const p0 = this.ringPoint(ring, th0 - dirSign * (i * 0.018));
      const p1 = this.ringPoint(ring, th0 - dirSign * ((i - 1) * 0.018));
      const ctx = p1[2] >= 0 ? front : back;
      ctx.save();
      ctx.globalAlpha = appear * (1 - i / TAIL) * 0.8 * (p1[2] >= 0 ? 1 : 0.5);
      ctx.strokeStyle = 'rgba(255,255,255,0.95)';
      ctx.lineWidth = ring.width * 1.8 * dpr;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(this.sx(p0), this.sy(p0));
      ctx.lineTo(this.sx(p1), this.sy(p1));
      ctx.stroke();
      ctx.restore();
    }
    const p = this.ringPoint(ring, th0);
    const ctx = p[2] >= 0 ? front : back;
    const r = ring.bead * dpr * (1 + 0.14 * p[2]);
    const x = this.sx(p);
    const y = this.sy(p);
    ctx.save();
    ctx.globalAlpha = appear;
    const halo = ctx.createRadialGradient(x, y, 0, x, y, r * 3.2);
    halo.addColorStop(0, 'rgba(22,93,255,0.28)');
    halo.addColorStop(1, 'rgba(22,93,255,0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(x, y, r * 3.2, 0, Math.PI * 2);
    ctx.fill();
    const body = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
    body.addColorStop(0, '#FFFFFF');
    body.addColorStop(0.35, '#6FA8FF');
    body.addColorStop(1, '#0F47CC');
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  private drawArcs(view: ViewState, arcsIn: number, since: number, still: boolean) {
    const ctx = this.frontCtx!;
    const dpr = this.dpr;
    const host = toView(this.hostVec, view);
    // Markers fade out as they roll over the limb instead of popping.
    const facing = (z: number) => smooth(-0.02, 0.22, z);

    for (const arc of this.arcs) {
      const pts = arc.points.map(p => toView(p, view));

      // Base path: a faint hairline.
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineWidth = 1 * dpr;
      for (let i = 1; i < pts.length; i++) {
        const p0 = pts[i - 1];
        const p1 = pts[i];
        if (!isVisible(p0) || !isVisible(p1)) continue;
        const vis = Math.min(facing(p0[2] + 0.25), facing(p1[2] + 0.25));
        ctx.globalAlpha = 0.5 * vis * arcsIn;
        ctx.strokeStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(this.sx(p0), this.sy(p0));
        ctx.lineTo(this.sx(p1), this.sy(p1));
        ctx.stroke();
      }
      ctx.restore();

      // Destination marker.
      const dest = toView(latLonToVec(arc.city.lat, arc.city.lon), view);
      const dVis = facing(dest[2]) * arcsIn;
      if (dVis > 0.01) {
        ctx.save();
        ctx.globalAlpha = dVis;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(this.sx(dest), this.sy(dest), 2.1 * dpr, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (still) continue;

      // Travelling pulse: a short comet from host to destination.
      const cycle = (since / PULSE_PERIOD + arc.phase) % 1;
      if (cycle < PULSE_TRAVEL) {
        const head = easeOutCubic(cycle / PULSE_TRAVEL);
        const tail = Math.max(0, head - 0.22);
        const i0 = Math.floor(tail * ARC_SAMPLES);
        const i1 = Math.ceil(head * ARC_SAMPLES);
        ctx.save();
        ctx.lineCap = 'round';
        for (let i = i0 + 1; i <= i1; i++) {
          const p0 = pts[i - 1];
          const p1 = pts[i];
          if (!isVisible(p0) || !isVisible(p1)) continue;
          const k = (i - i0) / Math.max(1, i1 - i0);
          const vis = facing(p1[2] + 0.25) * arcsIn;
          ctx.strokeStyle = 'rgba(160,200,255,1)';
          ctx.globalAlpha = 0.4 * k * vis;
          ctx.lineWidth = 6 * dpr;
          ctx.beginPath();
          ctx.moveTo(this.sx(p0), this.sy(p0));
          ctx.lineTo(this.sx(p1), this.sy(p1));
          ctx.stroke();
          ctx.strokeStyle = '#FFFFFF';
          ctx.globalAlpha = k * vis;
          ctx.lineWidth = 2.2 * dpr;
          ctx.stroke();
        }
        ctx.restore();
      } else {
        // Landing ripple at the destination.
        const k = (cycle - PULSE_TRAVEL) / (1 - PULSE_TRAVEL);
        if (dVis > 0.01) this.drawRipple(arc.city, view, 0.6 + 3 * k, (1 - k) * 0.7 * dVis);
      }
    }

    // Host beacon: two expanding ripples and a bright core.
    const hVis = facing(host[2]) * arcsIn;
    if (hVis > 0.01) {
      if (!still) {
        for (let j = 0; j < 2; j++) {
          const k = (since / 2.4 + j * 0.5) % 1;
          this.drawRipple(this.cfg.host, view, 0.8 + 5.5 * k, (1 - k) * (1 - k) * hVis);
        }
      }
      const x = this.sx(host);
      const y = this.sy(host);
      ctx.save();
      ctx.globalAlpha = hVis;
      const g = ctx.createRadialGradient(x, y, 0, x, y, 9 * dpr);
      g.addColorStop(0, 'rgba(255,255,255,0.9)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, 9 * dpr, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#165DFF';
      ctx.lineWidth = 1.4 * dpr;
      ctx.beginPath();
      ctx.arc(x, y, 3.2 * dpr, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    const label = this.els.label;
    if (label) {
      const cssX = this.sx(host) / dpr;
      const cssY = this.sy(host) / dpr;
      label.style.transform = `translate3d(${cssX.toFixed(1)}px, ${cssY.toFixed(1)}px, 0)`;
      label.style.opacity = String(hVis);
    }
  }

  /** A small circle lying on the sphere around a city, radius in degrees. */
  private drawRipple(city: GeoCity, view: ViewState, radiusDeg: number, alpha: number) {
    if (alpha <= 0.01) return;
    const ctx = this.frontCtx!;
    const c = latLonToVec(city.lat, city.lon);
    // Tangent basis at the city.
    const up: Vec3 = Math.abs(c[1]) > 0.95 ? [1, 0, 0] : [0, 1, 0];
    let e1: Vec3 = [c[1] * up[2] - c[2] * up[1], c[2] * up[0] - c[0] * up[2], c[0] * up[1] - c[1] * up[0]];
    const l1 = Math.hypot(e1[0], e1[1], e1[2]);
    e1 = [e1[0] / l1, e1[1] / l1, e1[2] / l1];
    const e2: Vec3 = [c[1] * e1[2] - c[2] * e1[1], c[2] * e1[0] - c[0] * e1[2], c[0] * e1[1] - c[1] * e1[0]];
    const rho = radiusDeg * DEG;
    const cr = Math.cos(rho);
    const sr = Math.sin(rho);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.1 * this.dpr;
    ctx.beginPath();
    let open = false;
    for (let i = 0; i <= 48; i++) {
      const th = (i / 48) * Math.PI * 2;
      const ct = Math.cos(th);
      const st = Math.sin(th);
      const v: Vec3 = [
        c[0] * cr + (e1[0] * ct + e2[0] * st) * sr,
        c[1] * cr + (e1[1] * ct + e2[1] * st) * sr,
        c[2] * cr + (e1[2] * ct + e2[2] * st) * sr,
      ];
      const p = toView(v, view);
      if (p[2] < 0) {
        open = false;
        continue;
      }
      if (open) ctx.lineTo(this.sx(p), this.sy(p));
      else ctx.moveTo(this.sx(p), this.sy(p));
      open = true;
    }
    ctx.stroke();
    ctx.restore();
  }
}
