import React, { useLayoutEffect, useRef, useState } from 'react';
import heroPlate from '../../assets/images/hero-plate.webp';
import { GlassGlobe, globeBoxForRadius } from '../globe/GlassGlobe';

/**
 * HeroGlobeStage — the home hero's backdrop: the rooftop plate (sky, Bund
 * skyline, glass platform and an empty pedestal) with the Glass Globe seated
 * on the pedestal.
 *
 * The plate is a still extracted from the old hero film with the globe and
 * its rings removed (see scripts/hero-plate/). Instead of `object-fit: cover`,
 * the stage first decides where the globe should sit — beside the copy on
 * desktop, below it on mobile — then scales and places the plate so its
 * pedestal lands right under the globe. Edges the plate doesn't reach fade
 * into a matching sky gradient.
 */

// Plate geometry, in the plate image's own pixels (1916 × 1080).
const PLATE = {
  w: 1916,
  h: 1080,
  pedestalX: 1182,
  /** Pedestal top face: centre y, half-width, half-height. */
  faceY: 872,
  faceRx: 167,
  faceRy: 22,
  /** The globe this plate is drawn for: radius and centre y. */
  globeR: 245,
  globeY: 603,
};

/** Horizontal reach of the outer orbit ring, in sphere radii. */
const RING_REACH = 1.42;

interface Layout {
  cx: number;
  cy: number;
  r: number;
}

interface HeroGlobeStageProps {
  /** The hero copy; on desktop the globe sits in the space to its right. */
  copyRef: React.RefObject<HTMLElement | null>;
  /** Mobile-only spacer below the copy that reserves room for the globe. */
  spacerRef: React.RefObject<HTMLElement | null>;
  hostLabel?: React.ReactNode;
}

/** Matches Tailwind's `lg`, which also toggles the mobile spacer. */
const WIDE_QUERY = '(min-width: 1024px)';

const computeLayout = (
  wide: boolean,
  sec: DOMRect,
  copy: DOMRect,
  spacer: DOMRect | null,
): Layout => {
  const W = sec.width;
  const H = sec.height;

  if (!wide) {
    // Stacked: the globe takes the spacer below the copy.
    const top = spacer ? spacer.top - sec.top : H * 0.55;
    const r = spacer && spacer.height ? spacer.height / 3 : Math.min(180, Math.max(118, W * 0.3));
    return { cx: W / 2, cy: top + r * 1.2, r };
  }

  // Side by side: centre the globe (rings included) in the free space right
  // of the copy, letting it bleed a little past the content column.
  const container = Math.min(1200, W);
  const freeL = copy.right - sec.left + 28;
  const freeR = Math.min(W - 20, (W + container) / 2 + 100);
  const avail = freeR - freeL;
  const r = Math.max(120, Math.min(avail / (2 * RING_REACH), H * 0.27, 250));
  const cx = freeL + Math.max(avail / 2, r * RING_REACH);
  // Vertically: level with the copy, but keep the pedestal above the bottom
  // fade and the quick-nav card that overlaps it.
  const copyMid = (copy.top + copy.bottom) / 2 - sec.top;
  const pedestalBelow = ((PLATE.faceY - PLATE.globeY) / PLATE.globeR) * r;
  const cy = Math.min(copyMid, H - 150 - pedestalBelow);
  return { cx, cy, r };
};

export const HeroGlobeStage: React.FC<HeroGlobeStageProps> = ({
  copyRef,
  spacerRef,
  hostLabel,
}) => {
  // The stage fills the hero section (absolute, inset 0), so its own box is
  // the section's box. Measuring itself also avoids depending on the parent's
  // ref, which React attaches only after this child's layout effects run.
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [layout, setLayout] = useState<Layout | null>(null);
  const lastKey = useRef('');
  // The backdrop fades in once the plate has decoded; the globe mounts (and
  // starts its entrance) only then, so it never lands on an empty sky.
  const [plateReady, setPlateReady] = useState(false);

  useLayoutEffect(() => {
    const sec = rootRef.current;
    const copy = copyRef.current;
    if (!sec || !copy) return;

    const measure = () => {
      const next = computeLayout(
        window.matchMedia(WIDE_QUERY).matches,
        sec.getBoundingClientRect(),
        copy.getBoundingClientRect(),
        spacerRef.current?.getBoundingClientRect() ?? null,
      );
      // Round so sub-pixel jitter from scrollbars doesn't re-render.
      const key = `${Math.round(next.cx)}:${Math.round(next.cy)}:${Math.round(next.r)}`;
      if (key === lastKey.current) return;
      lastKey.current = key;
      setLayout(next);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(sec);
    ro.observe(copy);
    if (spacerRef.current) ro.observe(spacerRef.current);
    return () => ro.disconnect();
  }, [copyRef, spacerRef]);

  if (!layout) return <div ref={rootRef} className="absolute inset-0" />;

  const { cx, cy, r } = layout;
  const s = r / PLATE.globeR;
  const box = globeBoxForRadius(r);
  const faceCy = cy + (PLATE.faceY - PLATE.globeY) * s;

  return (
    <div ref={rootRef} className="absolute inset-0">
      {/* Plate: scaled so its pedestal sits under the globe. */}
      <img
        ref={img => {
          if (img?.complete && img.naturalWidth) setPlateReady(true);
        }}
        src={heroPlate}
        alt=""
        aria-hidden="true"
        draggable={false}
        onLoad={() => setPlateReady(true)}
        className={`doa-hero-plate pointer-events-none absolute max-w-none select-none transition-opacity duration-700 ${
          plateReady ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          left: cx - PLATE.pedestalX * s,
          top: cy - PLATE.globeY * s,
          width: PLATE.w * s,
          height: PLATE.h * s,
        }}
      />

      {/* Veil: lifts the copy side for contrast, leaves the globe clear. */}
      <div aria-hidden="true" className="doa-hero-veil pointer-events-none absolute inset-0" />

      {plateReady && (
        <>
          {/* Light from the glass, pooled on the pedestal's top face. */}
          <div
            aria-hidden="true"
            className="doa-globe-caustic-in pointer-events-none absolute"
            style={{
              left: cx - PLATE.faceRx * s * 1.05,
              top: faceCy - PLATE.faceRy * s * 1.6,
              width: PLATE.faceRx * s * 2.1,
              height: PLATE.faceRy * s * 3.2,
            }}
          >
            <div className="doa-globe-caustic h-full w-full" />
          </div>

          <div
            className="doa-globe-float absolute"
            style={{ left: cx - box / 2, top: cy - box / 2, width: box }}
          >
            <GlassGlobe hostLabel={hostLabel} appearDelay={120} />
          </div>
        </>
      )}
    </div>
  );
};
