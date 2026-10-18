import React from 'react';

/**
 * DoAiLogo — the official DOAi lockup drawn entirely in code: smooth
 * hand-authored bezier letterforms (no bitmap tracing, no ragged edges),
 * the signature blue square i-dot, and the three-line blue lockup text.
 *
 * Proportions are measured from doai_logo.png (cap height = 100 units):
 * D/O/A ≈ 0.87 cap width, ~26-unit strokes, A crossbar low, i = stem +
 * detached square dot. Ink uses currentColor; blue elements are brand-fixed.
 */

const BLUE = '#0E7BF2';
const TEXT_BLUE = '#2E7CF6';

// D — flat left stem, fully rounded right bowl (w 87)
const D_PATH =
  'M6 0 H48 C74 0 87 20 87 50 C87 80 74 100 48 100 H6 C2 100 0 98 0 94 V6 C0 2 2 0 6 0 Z ' +
  'M26 26 H45 C58 26 61 34 61 50 C61 66 58 74 45 74 H26 Z';
// O — superellipse ring (w 87)
const O_PATH =
  'M43.5 0 C75 0 87 18 87 50 C87 82 75 100 43.5 100 C12 100 0 82 0 50 C0 18 12 0 43.5 0 Z ' +
  'M43.5 27 C61 27 61 36 61 50 C61 64 61 73 43.5 73 C26 73 26 64 26 50 C26 36 26 27 43.5 27 Z';
// A — soft apex, thick legs, low crossbar (w 97)
const A_PATH =
  'M38 2 Q48.5 -4 59 2 L97 100 L71.5 100 L64.5 79.5 L32.5 79.5 L25.5 100 L0 100 Z ' +
  'M48.5 28 L61 60 L36 60 Z';
// i — short thick stem; the square dot is drawn separately in blue
const I_STEM = 'M0 33 C0 31 1.5 30 4 30 H22 C24.5 30 26 31 26 33 V100 H0 Z';

const LETTERS: { d: string; x: number }[] = [
  { d: D_PATH, x: 0 },
  { d: O_PATH, x: 97 },
  { d: A_PATH, x: 194 },
  { d: I_STEM, x: 301 },
];

interface DoAiLogoProps {
  className?: string;
}

export const DoAiLogo: React.FC<DoAiLogoProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 520 132"
      role="img"
      aria-label="DOAi — Dobe Bund AI Makers Conference 2026"
      className={`block w-auto ${className}`}
    >
      {/* Wordmark: DOA in ink, i with its blue square dot detached on top */}
      <g fill="currentColor" fillRule="evenodd">
        {LETTERS.map((l, i) => (
          <path key={i} d={l.d} transform={`translate(${l.x} 16)`} />
        ))}
      </g>
      <rect x="302.5" y="16" width="23" height="23" rx="2.5" fill={BLUE} />

      {/* Lockup text */}
      <g
        fill={TEXT_BLUE}
        fontFamily="'Plus Jakarta Sans', Inter, -apple-system, 'Segoe UI', Roboto, sans-serif"
        fontWeight={800}
        fontSize={25}
      >
        <text x="366" y="45" textLength="150" lengthAdjust="spacingAndGlyphs">
          Dobe Bund AI
        </text>
        <text x="366" y="82" textLength="75" lengthAdjust="spacingAndGlyphs">
          Makers
        </text>
        <text x="366" y="119" textLength="148" lengthAdjust="spacingAndGlyphs">
          Conference
        </text>
      </g>
    </svg>
  );
};
