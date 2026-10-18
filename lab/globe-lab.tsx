/**
 * Glass Globe Lab — a dev-only sandbox for designing the hero globe in
 * isolation. Not part of the production build (only index.html is built);
 * with `npm run dev:web` open http://localhost:3000/lab/globe.html
 *
 * URL params seed the controls, so a tuned state can be shared as a link:
 *   ?size=720&tilt=14&roll=-16&spin=72&lon=150&rings=1&arcs=1&bg=plate&still=0
 */
import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../src/index.css';
import heroPlate from '../src/assets/images/hero-plate.webp';
import { GlassGlobe } from '../src/components/globe/GlassGlobe';

type Bg = 'plate' | 'paper' | 'ink' | 'none';

const params = new URLSearchParams(location.search);
const num = (k: string, d: number) => (params.has(k) ? Number(params.get(k)) : d);
const flag = (k: string, d: boolean) => (params.has(k) ? params.get(k) === '1' : d);

const BACKGROUNDS: Record<Bg, React.CSSProperties> = {
  plate: { background: `#E3EEFC url(${heroPlate}) 62% 60% / cover no-repeat` },
  paper: { background: '#FFFFFF' },
  ink: { background: '#0B1B3A' },
  // Transparent: for exporting stills (e.g. the WebGL fallback image).
  none: { background: 'transparent' },
};

const Lab: React.FC = () => {
  const [size, setSize] = useState(num('size', 720));
  const [tilt, setTilt] = useState(num('tilt', 14));
  const [roll, setRoll] = useState(num('roll', -16));
  const [spin, setSpin] = useState(num('spin', 72));
  const [lon, setLon] = useState(num('lon', 150));
  const [rings, setRings] = useState(flag('rings', true));
  const [arcs, setArcs] = useState(flag('arcs', true));
  const [still, setStill] = useState(flag('still', false));
  const [bg, setBg] = useState<Bg>((params.get('bg') as Bg) || 'plate');
  const [nonce, setNonce] = useState(0);

  const share = useMemo(() => {
    const q = new URLSearchParams({
      size: String(size), tilt: String(tilt), roll: String(roll), spin: String(spin),
      lon: String(lon), rings: rings ? '1' : '0', arcs: arcs ? '1' : '0',
      still: still ? '1' : '0', bg,
    });
    return `${location.pathname}?${q}`;
  }, [size, tilt, roll, spin, lon, rings, arcs, still, bg]);

  const slider = (label: string, value: number, set: (n: number) => void, min: number, max: number, step = 1) => (
    <label className="block">
      <span className="flex justify-between text-[11px] font-semibold text-[#48597A]">
        {label}
        <span className="font-mono text-[#0B1B3A]">{value}</span>
      </span>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => set(Number(e.target.value))}
        className="w-full accent-[#165DFF]"
      />
    </label>
  );

  const toggle = (label: string, value: boolean, set: (b: boolean) => void) => (
    <label className="flex items-center gap-2 text-[12px] font-semibold text-[#1A2B4D]">
      <input type="checkbox" checked={value} onChange={e => set(e.target.checked)} className="accent-[#165DFF]" />
      {label}
    </label>
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={BACKGROUNDS[bg]}>
      <aside className="lg:w-[260px] shrink-0 m-4 p-4 space-y-3 doa-card self-start">
        <div className="doa-eyebrow">Glass Globe Lab</div>
        {slider('尺寸 size (px)', size, setSize, 240, 1100, 10)}
        {slider('前倾 tilt (°)', tilt, setTilt, -30, 40)}
        {slider('侧倾 roll (°)', roll, setRoll, -40, 40)}
        {slider('自转周期 spin (s)', spin, setSpin, 20, 180, 2)}
        {slider('起始经度 lon (°)', lon, setLon, -180, 180)}
        <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1">
          {toggle('轨道环', rings, setRings)}
          {toggle('城市弧线', arcs, setArcs)}
          {toggle('静帧', still, setStill)}
        </div>
        <div className="flex gap-1.5 pt-1">
          {(['plate', 'paper', 'ink', 'none'] as Bg[]).map(b => (
            <button
              key={b}
              type="button"
              onClick={() => setBg(b)}
              className={`doa-chip ${bg === b ? '!bg-[#165DFF] !text-white' : ''}`}
            >
              {b}
            </button>
          ))}
        </div>
        <button type="button" className="doa-btn doa-btn-secondary w-full !h-9 !text-xs" onClick={() => setNonce(n => n + 1)}>
          重播入场 Replay entrance
        </button>
        <a href={share} className="block text-[10px] font-mono text-[#6B7C9B] break-all hover:text-[#165DFF]">
          {share}
        </a>
      </aside>

      <main className="flex-1 flex items-center justify-center p-6 overflow-hidden">
        <div style={{ width: size, maxWidth: '100%' }}>
          <GlassGlobe
            key={nonce}
            tilt={tilt}
            roll={roll}
            spinSeconds={spin}
            startLon={lon}
            rings={rings}
            arcs={arcs}
            still={still}
            hostLabel="上海 · 外滩"
          />
        </div>
      </main>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<Lab />);
