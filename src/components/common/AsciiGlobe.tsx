import React, { useCallback, useEffect, useRef, useState } from 'react';
import { EARTH_COLS, EARTH_ROWS, EARTH_MASK } from '../../data/earthMask';

/**
 * AsciiGlobe — a globe-cli style real-time ASCII earth.
 *
 * Every visible character cell is ray-cast against a unit sphere, the hit
 * point is un-tilted by 23.4° and converted to lat/lon, then sampled against
 * the real-earth land mask (src/data/earthMask.ts, Natural Earth 50m
 * coastlines). Lambert lighting picks the glyph from a brightness ramp, so
 * continents and the day/night terminator emerge from the ASCII itself — the
 * same trick the terminal `globe` tool uses.
 *
 * Interaction mirrors globe-cli too: drag horizontally to spin (with
 * inertia), drag vertically to tilt the axis.
 */

const MONO_FONT =
  "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";

// Dim → bright ramps. Land reads denser than ocean so coastlines pop out of
// the sea; the night side fades to spaces.
const LAND_RAMP = ':~-+*%#&@';
const OCEAN_RAMP = ' .·;:=~+';

// 23.4° axial tilt, like the real planet.
const TILT = (23.4 * Math.PI) / 180;
const DEG = Math.PI / 180;

// Host city marker: Shanghai (121.47°E, 31.23°N) — DOAI 2026 的举办地.
const MARKERS: { lon: number; lat: number; char: string }[] = [
  { lon: 121.47, lat: 31.23, char: '@' },
];

// Land mask decoded to flat booleans once at module load. Each hex char in a
// row packs 4 cells, MSB = westernmost.
const LAND = (() => {
  const out = new Uint8Array(EARTH_COLS * EARTH_ROWS);
  for (let y = 0; y < EARTH_ROWS; y++) {
    const row = EARTH_MASK[y];
    for (let x = 0; x < EARTH_COLS; x++) {
      const nibble = parseInt(row[x >> 2], 16);
      out[y * EARTH_COLS + x] = (nibble >> (3 - (x & 3))) & 1;
    }
  }
  return out;
})();

const isLand = (lonDeg: number, latDeg: number): boolean => {
  const lon = (((lonDeg + 180) % 360) + 360) % 360 - 180;
  const col = Math.min(EARTH_COLS - 1, Math.floor(((lon + 180) / 360) * EARTH_COLS));
  const lat = Math.max(-89.99, Math.min(89.99, latDeg));
  const row = Math.min(EARTH_ROWS - 1, Math.floor(((90 - lat) / 180) * EARTH_ROWS));
  return LAND[row * EARTH_COLS + col] === 1;
};

interface AsciiGlobeProps {
  /** Base auto-rotation speed, revolutions per minute. */
  rpm?: number;
  className?: string;
}

export const AsciiGlobe: React.FC<AsciiGlobeProps> = ({ rpm = 1.4, className = '' }) => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const preRef = useRef<HTMLPreElement | null>(null);

  const [fontSize, setFontSize] = useState(13);

  // Mutable animation state — refs so the rAF loop never re-binds.
  const st = useRef({
    rotation: 2.2, // start with Asia facing the viewer
    tilt: TILT,
    spinVel: 0, // drag inertia on top of the base spin (rad/s)
    dragging: false,
    lastX: 0,
    lastY: 0,
    lastT: 0,
    lastDraw: 0,
    cols: 0,
    rows: 0,
    cellW: 8,
    cellH: 14,
    radius: 100,
  });

  const reduceMotion =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------------- sizing ----------------
  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const s = st.current;
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    if (w < 60 || h < 60) return;

    // Aim for ~80 columns, clamped to a readable glyph size.
    const fs = Math.max(9, Math.min(18, Math.floor(w / (80 * 0.6))));
    setFontSize(fs);

    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) return;
    ctx.font = `500 ${fs}px ${MONO_FONT}`;
    const cellW = Math.max(4, ctx.measureText('M').width);
    const cellH = Math.max(6, Math.round(fs * 1.12));

    s.cellW = cellW;
    s.cellH = cellH;
    s.cols = Math.max(20, Math.floor(w / cellW));
    s.rows = Math.max(12, Math.floor(h / cellH));
    s.radius = (Math.min(s.cols * cellW, s.rows * cellH) / 2) * 0.94;
    if (preRef.current) preRef.current.style.lineHeight = `${cellH}px`;
  }, []);

  // ---------------- rendering ----------------
  const drawFrame = useCallback(() => {
    const pre = preRef.current;
    const s = st.current;
    if (!pre || s.cols < 8 || s.rows < 6) return;

    const { cols, rows, cellW, cellH, radius, tilt, rotation } = s;
    const cosT = Math.cos(tilt);
    const sinT = Math.sin(tilt);

    const lines: string[] = [];
    for (let j = 0; j < rows; j++) {
      let line = '';
      const cy = (j + 0.5 - rows / 2) * cellH;
      const vy0 = -cy / radius;
      const inVert = Math.abs(vy0) <= 1;
      const zRow = inVert ? Math.sqrt(1 - vy0 * vy0) : 0;

      for (let i = 0; i < cols; i++) {
        const cx = (i + 0.5 - cols / 2) * cellW;
        const vx = cx / radius;
        if (!inVert || Math.abs(vx) > zRow) {
          line += ' ';
          continue;
        }
        const vz = Math.sqrt(Math.max(0, 1 - vx * vx - vy0 * vy0));

        // View → earth: un-tilt around the screen x-axis…
        const ex = vx;
        const ey = vy0 * cosT + vz * sinT;
        const ez = vz * cosT - vy0 * sinT;

        const lat = Math.asin(Math.max(-1, Math.min(1, ey))) / DEG;
        // …then unwind the spin. +rotation keeps surface features drifting
        // west→east (left→right), like the real planet seen from space.
        const lon = Math.atan2(ez, ex) / DEG + rotation / DEG;

        // Lambert shading, light from upper-left-front.
        const lum =
          Math.max(0, vx * -0.45 + vy0 * 0.55 + vz * 0.7) / 0.992;

        const land = isLand(lon, lat);
        const ramp = land ? LAND_RAMP : OCEAN_RAMP;
        const idx = Math.min(ramp.length - 1, Math.floor(lum * ramp.length));
        line += ramp[land ? Math.max(idx, 1) : idx];
      }
      lines.push(line);
    }

    // City markers, projected in the same view frame.
    const cosR = Math.cos(rotation);
    const sinR = Math.sin(rotation);
    for (const m of MARKERS) {
      const mLat = m.lat * DEG;
      const mLon = m.lon * DEG;
      // Earth coords (y-up).
      const bx = Math.cos(mLat) * Math.cos(mLon);
      const by = Math.sin(mLat);
      const bz = Math.cos(mLat) * Math.sin(mLon);
      // Spin with the globe (inverse of the sampling unwind)…
      const x1 = bx * cosR + bz * sinR;
      const z1 = bz * cosR - bx * sinR;
      // …then tilt into the view frame.
      const vy = by * cosT - z1 * sinT;
      const vz = by * sinT + z1 * cosT;
      if (vz < 0.25) continue; // behind the limb

      const colF = cols / 2 + (x1 * radius) / cellW;
      const rowF = rows / 2 - (vy * radius) / cellH;
      const col = Math.round(colF - 0.5);
      const row = Math.round(rowF - 0.5);
      if (col < 0 || col >= cols || row < 0 || row >= rows) continue;
      const dx = (colF - cols / 2) * cellW;
      const dy = (rows / 2 - rowF) * cellH;
      if (dx * dx + dy * dy > radius * radius) continue;

      const arr = lines[row].split('');
      arr[col] = m.char;
      lines[row] = arr.join('');
    }

    pre.textContent = lines.join('\n');
  }, []);

  // ---------------- animation loop ----------------
  useEffect(() => {
    if (reduceMotion) {
      drawFrame();
      return;
    }
    const s = st.current;
    let raf = 0;
    let stopped = false;
    const baseVel = (rpm * 2 * Math.PI) / 60; // rad/s

    const loop = (t: number) => {
      if (stopped) return;
      const dt = s.lastT ? Math.min(0.1, (t - s.lastT) / 1000) : 0.016;
      s.lastT = t;

      if (!s.dragging) {
        s.rotation += (baseVel + s.spinVel) * dt;
        // Inertia decays back to the base rotation speed.
        s.spinVel *= Math.pow(0.3, dt);
        if (Math.abs(s.spinVel) < 0.02) s.spinVel = 0;
      }

      // ~30fps is plenty for ASCII and halves the work.
      if (t - s.lastDraw > 33) {
        s.lastDraw = t;
        drawFrame();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
    };
  }, [drawFrame, rpm, reduceMotion]);

  useEffect(() => {
    const remeasure = () => {
      measure();
      // The static (reduced-motion) path has no rAF loop to pick up the new
      // grid, so repaint once here.
      if (reduceMotion) drawFrame();
    };
    remeasure();
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(remeasure);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [measure, drawFrame, reduceMotion]);

  // ---------------- pointer interaction ----------------
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const s = st.current;

    const onDown = (e: PointerEvent) => {
      s.dragging = true;
      s.lastX = e.clientX;
      s.lastY = e.clientY;
      s.spinVel = 0;
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
    };
    const onMove = (e: PointerEvent) => {
      if (!s.dragging) return;
      const dx = e.clientX - s.lastX;
      const dy = e.clientY - s.lastY;
      s.lastX = e.clientX;
      s.lastY = e.clientY;
      const turns = (dx / (s.cols * s.cellW)) * Math.PI * 2;
      s.rotation += turns;
      s.tilt = Math.max(-0.9, Math.min(0.9, s.tilt + dy * 0.004));
      s.spinVel = turns * 10; // release momentum estimate, rad/s
    };
    const onUp = () => {
      s.dragging = false;
    };

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`relative h-full w-full cursor-grab select-none overflow-hidden active:cursor-grabbing ${className}`}
      style={{ touchAction: 'pan-y' }}
      role="img"
      aria-label="实时 ASCII 地球：真实海岸线数据驱动的自转动画，可拖拽改变转速与倾角"
    >
      <pre
        ref={preRef}
        aria-hidden="true"
        className="doa-ascii-globe m-0 p-0 font-medium"
        style={{ fontSize: `${fontSize}px`, fontFamily: MONO_FONT }}
      />
    </div>
  );
};
