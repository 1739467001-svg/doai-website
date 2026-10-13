import React, { useEffect, useRef } from 'react';

interface FloatingCard {
  id: string;
  name: string;
  img: string;
  xPct: number;
  yPct: number;
  rotation: number;
}

export const AiHorizonGlobe: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const floatingCities: FloatingCard[] = [
    {
      id: 'shanghai',
      name: 'Shanghai',
      img: '/src/assets/images/city_shanghai_1790924759447.jpg',
      xPct: 18,
      yPct: 14,
      rotation: -3,
    },
    {
      id: 'florence',
      name: 'Florence',
      img: '/src/assets/images/city_florence_1790924778811.jpg',
      xPct: 22,
      yPct: 62,
      rotation: 2,
    },
    {
      id: 'singapore',
      name: 'Singapore',
      img: '/src/assets/images/city_singapore_1790924769287.jpg',
      xPct: 80,
      yPct: 18,
      rotation: 4,
    },
    {
      id: 'hongkong',
      name: 'Hong Kong',
      img: '/src/assets/images/city_hongkong_1790924787371.jpg',
      xPct: 86,
      yPct: 68,
      rotation: -2,
    },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio);
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio);

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const r = Math.min(width, height) * 0.38;

      angle += 0.005;

      // Soft ambient blue glow behind globe
      const glow = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, r * 1.3);
      glow.addColorStop(0, 'rgba(40, 130, 255, 0.25)');
      glow.addColorStop(0.5, 'rgba(22, 93, 255, 0.12)');
      glow.addColorStop(0.8, 'rgba(0, 196, 140, 0.05)');
      glow.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Main Glass Globe Body
      const globeGrad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r);
      globeGrad.addColorStop(0, 'rgba(220, 240, 255, 0.85)');
      globeGrad.addColorStop(0.4, 'rgba(120, 190, 255, 0.45)');
      globeGrad.addColorStop(0.85, 'rgba(30, 110, 255, 0.25)');
      globeGrad.addColorStop(1, 'rgba(22, 93, 255, 0.6)');

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = globeGrad;
      ctx.fill();

      // Delicate outer rim
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Luminous Latitude Rings
      for (let lat = -50; lat <= 50; lat += 25) {
        const radLat = (lat * Math.PI) / 180;
        const ringY = cy + Math.sin(radLat) * r * 0.5;
        const rx = Math.cos(radLat) * r;
        const ry = rx * 0.32;

        ctx.beginPath();
        ctx.ellipse(cx, ringY, rx, Math.max(1, ry), 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Luminous Longitude Rotating Rings
      for (let lon = 0; lon < Math.PI; lon += Math.PI / 4) {
        const rotLon = lon + angle;
        const rx = Math.abs(Math.cos(rotLon)) * r;
        ctx.beginPath();
        ctx.ellipse(cx, cy, Math.max(2, rx), r, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Connecting Laser rays from center to 4 city cards
      const cityCoords = [
        { x: cx - r * 0.85, y: cy - r * 0.75 },
        { x: cx - r * 0.75, y: cy + r * 0.65 },
        { x: cx + r * 0.85, y: cy - r * 0.7 },
        { x: cx + r * 0.85, y: cy + r * 0.7 },
      ];

      cityCoords.forEach((coord, idx) => {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(coord.x, coord.y);
        ctx.strokeStyle = 'rgba(80, 160, 255, 0.35)';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.setLineDash([]);

        // Small glowing dot on sphere surface
        const pulse = (Math.sin(angle * 3 + idx) + 1) * 2;
        ctx.beginPath();
        ctx.arc(cx + (coord.x - cx) * 0.55, cy + (coord.y - cy) * 0.55, 3 + pulse, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.strokeStyle = '#165DFF';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      {/* 3D Canvas */}
      <canvas ref={canvasRef} className="w-full h-full" style={{ width: '100%', height: '100%' }} />

      {/* Exact Typography in the Center of Globe as in Screenshot */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 pointer-events-none">
        <div className="text-white drop-shadow-[0_2px_12px_rgba(22,93,255,0.7)] font-sans">
          <div className="text-3xl sm:text-4xl lg:text-[46px] font-medium leading-[1.1] tracking-tight">
            AI
          </div>
          <div className="text-2xl sm:text-3xl lg:text-[38px] font-light leading-[1.15] tracking-tight">
            Connects
          </div>
          <div className="text-xl sm:text-2xl lg:text-[32px] font-light leading-[1.2] tracking-tight">
            the World
          </div>
        </div>
      </div>

      {/* The 4 Floating City Glass Cards (Identical to Screenshot) */}
      {floatingCities.map(city => (
        <div
          key={city.id}
          className="absolute z-20 pointer-events-auto transform transition-transform duration-300 hover:scale-105"
          style={{
            left: `${city.xPct}%`,
            top: `${city.yPct}%`,
            transform: `translate(-50%, -50%) rotate(${city.rotation}deg)`,
          }}
        >
          <div className="relative p-1.5 bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_12px_32px_rgba(22,93,255,0.18)] border border-white/90">
            <div className="relative w-24 sm:w-28 h-24 sm:h-28 rounded-xl overflow-hidden">
              <img
                src={city.img}
                alt={city.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2">
                <span className="text-white text-[11px] font-semibold tracking-wide font-sans">
                  {city.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
