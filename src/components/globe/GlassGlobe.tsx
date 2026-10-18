import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { BOX_RATIO, GL_RATIO, GlassGlobeConfig, GlassGlobeEngine } from './GlassGlobeEngine';
import { GeoCity, HOST_CITY, LINKED_CITIES } from './geo';
import fallbackImg from '../../assets/images/glass-globe-fallback.webp';

/**
 * GlassGlobe — the DOAI hero earth as a standalone component.
 *
 * Fills its parent's width as a square. The sphere's radius is
 * width / (2 × BOX_RATIO); the margin around it holds the orbit rings and the
 * arcs. Use `globeBoxForRadius()` to size the box from a target radius.
 *
 * Rendering lives in GlassGlobeEngine (WebGL + 2D, framework-free). This
 * wrapper owns lifecycle only: sizing, pausing offscreen, pointer input,
 * reduced motion, and a static image fallback when WebGL is unavailable.
 */

export interface GlassGlobeProps {
  className?: string;
  style?: React.CSSProperties;
  host?: GeoCity;
  cities?: GeoCity[];
  /** Small caption that follows the host city across the globe. */
  hostLabel?: React.ReactNode;
  /** Seconds per revolution at cruising speed. */
  spinSeconds?: number;
  /** Longitude facing the viewer on first paint, degrees. */
  startLon?: number;
  /** Pole tipped toward the viewer, degrees. */
  tilt?: number;
  /** Axis lean, degrees; negative leans the north pole to the right. */
  roll?: number;
  rings?: boolean;
  arcs?: boolean;
  /** Drag to spin, pointer parallax. */
  interactive?: boolean;
  /** Delay before the entrance animation, ms. */
  appearDelay?: number;
  /** Render one static frame (always on under prefers-reduced-motion). */
  still?: boolean;
  ariaLabel?: string;
}

/** Side of the square box that gives the sphere radius `r`. */
export const globeBoxForRadius = (r: number) => 2 * BOX_RATIO * r;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const GlassGlobe: React.FC<GlassGlobeProps> = ({
  className = '',
  style,
  host = HOST_CITY,
  cities = LINKED_CITIES,
  hostLabel,
  spinSeconds = 72,
  startLon = 150,
  tilt = 14,
  roll = -16,
  rings = true,
  arcs = true,
  interactive = true,
  appearDelay = 350,
  still: stillProp = false,
  ariaLabel = '玻璃地球：以上海为中心连接全球的 AI 创客网络，可拖拽旋转',
}) => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const backRef = useRef<HTMLCanvasElement | null>(null);
  const glRef = useRef<HTMLCanvasElement | null>(null);
  const frontRef = useRef<HTMLCanvasElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<GlassGlobeEngine | null>(null);
  /** Re-evaluates whether the loop should run (on screen, tab visible, not still). */
  const syncRef = useRef<() => void>(() => {});
  const [webgl, setWebgl] = useState(true);

  const config: GlassGlobeConfig = {
    host, cities, spinSeconds, startLon, tilt, roll, rings, arcs, appearDelay,
    still: stillProp || prefersReducedMotion(),
  };
  const configRef = useRef(config);
  configRef.current = config;

  // One engine (and one GL context) per mount; settings changes go through
  // engine.update() so the context is never re-created on the same canvas.
  useLayoutEffect(() => {
    const back = backRef.current;
    const gl = glRef.current;
    const front = frontRef.current;
    const wrap = wrapRef.current;
    if (!back || !gl || !front || !wrap) return;

    const engine = new GlassGlobeEngine({ back, gl, front, label: labelRef.current }, configRef.current);
    engineRef.current = engine;
    setWebgl(engine.supported);
    // Dev-only handle for frame-by-frame captures (stripped from builds).
    if (import.meta.env.DEV) (window as unknown as { __glassGlobe?: GlassGlobeEngine }).__glassGlobe = engine;

    const size = () => engine.resize(wrap.clientWidth, window.devicePixelRatio || 1);
    size();
    const ro = new ResizeObserver(size);
    ro.observe(wrap);

    // Only animate while on screen and the tab is visible.
    let onScreen = true;
    const sync = () => {
      if (onScreen && document.visibilityState === 'visible') engine.start();
      else engine.stop();
    };
    syncRef.current = sync;
    const io = new IntersectionObserver(entries => {
      onScreen = entries.some(e => e.isIntersecting);
      sync();
    });
    io.observe(wrap);
    document.addEventListener('visibilitychange', sync);
    // A lost context (GPU reset, too many contexts) falls back to the still.
    const onLost = () => setWebgl(false);
    gl.addEventListener('webglcontextlost', onLost);
    sync();

    return () => {
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', sync);
      gl.removeEventListener('webglcontextlost', onLost);
      syncRef.current = () => {};
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    engineRef.current?.update(configRef.current);
    syncRef.current();
    // cities/host default to module constants; callers pass stable arrays.
  }, [host, cities, spinSeconds, startLon, tilt, roll, rings, arcs, appearDelay, stillProp]);

  // Pointer: drag to spin (horizontal), gentle parallax while hovering nearby.
  useEffect(() => {
    if (!interactive) return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    const onDown = (e: PointerEvent) => {
      engineRef.current?.dragStart(e.clientX);
      try {
        wrap.setPointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
    };
    const onMove = (e: PointerEvent) => engineRef.current?.dragMove(e.clientX);
    const onUp = () => engineRef.current?.dragEnd();
    const onHover = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const r = wrap.getBoundingClientRect();
      const nx = (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2);
      const ny = (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2);
      engineRef.current?.setPointer(nx, ny);
    };

    wrap.addEventListener('pointerdown', onDown);
    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerup', onUp);
    wrap.addEventListener('pointercancel', onUp);
    window.addEventListener('pointermove', onHover, { passive: true });
    return () => {
      wrap.removeEventListener('pointerdown', onDown);
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerup', onUp);
      wrap.removeEventListener('pointercancel', onUp);
      window.removeEventListener('pointermove', onHover);
    };
  }, [interactive]);

  const glInset = `${((1 - GL_RATIO / BOX_RATIO) / 2) * 100}%`;
  const sphereInset = `${((1 - 1 / BOX_RATIO) / 2) * 100}%`;

  return (
    <div
      ref={wrapRef}
      role="img"
      aria-label={ariaLabel}
      className={`relative aspect-square w-full select-none ${
        interactive ? 'cursor-grab active:cursor-grabbing' : ''
      } ${className}`}
      style={{ touchAction: 'pan-y', ...style }}
    >
      <canvas ref={backRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
      <canvas
        ref={glRef}
        aria-hidden="true"
        className="absolute"
        style={{ inset: glInset, width: `calc(100% - 2 * ${glInset})`, height: `calc(100% - 2 * ${glInset})` }}
      />
      {!webgl && (
        <img
          src={fallbackImg}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="absolute"
          style={{ inset: sphereInset, width: `calc(100% - 2 * ${sphereInset})` }}
        />
      )}
      <canvas ref={frontRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
      {hostLabel && webgl && (
        <div
          ref={labelRef}
          aria-hidden="true"
          className="doa-globe-label pointer-events-none absolute left-0 top-0"
          style={{ opacity: 0 }}
        >
          <span className="doa-globe-label-inner">{hostLabel}</span>
        </div>
      )}
    </div>
  );
};
