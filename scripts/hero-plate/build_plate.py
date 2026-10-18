"""
Builds src/assets/images/hero-plate.webp — the home hero backdrop with the
old film's globe "cut out": sky, Bund skyline, glass platform, empty pedestal.

The old hero (scripts/hero-plate/source/, formerly src/assets/video/) baked
the globe into an AI-generated film, so there was no layer to lift it from.
The background is static while the globe, rings and satellite move, which
lets us recover it:

  1. Temporal median over the film's frames  → rings and satellite vanish
     (they never sit on the same pixel for long); only the globe's disc,
     which never leaves, survives.
  2. Use that median wherever the poster still (sharper, 1916×1080) differs
     from it → a full-res frame without rings.
  3. Fill the globe's disc: a smooth sky gradient above the horizon, the
     skyline translated in from either side below it (translation keeps
     buildings vertical), cross-faded through a wide haze band.

The new Glass Globe is drawn on top in code, seated on the pedestal.
Plate geometry the stage relies on lives in HeroGlobeStage.tsx (PLATE).

Requires: ffmpeg on PATH; python3 with numpy, pillow, opencv-python-headless.
Run from the repo root:  python3 scripts/hero-plate/build_plate.py
"""
import glob
import os
import subprocess
import sys
import tempfile

import cv2
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
VIDEO = os.path.join(ROOT, 'scripts/hero-plate/source/hero-globe.mp4')
POSTER = os.path.join(ROOT, 'scripts/hero-plate/source/hero-globe-poster.jpg')
OUT = os.path.join(ROOT, 'src/assets/images/hero-plate.webp')

# Old globe disc in poster pixels (1916×1080), with a safety margin.
CX, CY, R = 1195, 560, 292
Y_STOP = 846          # pedestal's far rim: never touch below this
SKY_END, BAND = 505, 120  # sky fill above, skyline below, blended over BAND rows
SHIFT_L, SHIFT_R = 610, 295  # skyline donors; both avoid the two landmark towers


def temporal_median(tmp):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', VIDEO, '-vf', 'fps=8',
                    os.path.join(tmp, 'f_%03d.png')], check=True)
    frames = sorted(glob.glob(os.path.join(tmp, 'f_*.png')))
    stack = np.stack([np.asarray(Image.open(f).convert('RGB')) for f in frames])
    return np.median(stack, axis=0).astype(np.uint8)[..., ::-1]  # → BGR


def remove_rings(poster, median):
    h, w = poster.shape[:2]
    up = cv2.resize(median, (w, h), interpolation=cv2.INTER_LANCZOS4)
    d = np.abs(poster.astype(np.int16) - up.astype(np.int16)).max(axis=2).astype(np.uint8)
    m = (cv2.GaussianBlur(d, (0, 0), 1.5) > 10).astype(np.uint8) * 255
    m = cv2.dilate(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15)))
    m = cv2.GaussianBlur(m, (0, 0), 4).astype(np.float32)[..., None] / 255.0
    return (poster * (1 - m) + up * m).astype(np.float32)


def fill_disc(img):
    h, w = img.shape[:2]
    sky = img.copy()
    city = img.copy()
    mask = np.zeros((h, w), np.float32)
    for y in range(CY - R, Y_STOP):
        half = np.sqrt(max(0.0, R * R - (y - CY) ** 2))
        if half < 2:
            continue
        xl, xr = int(CX - half) - 6, int(CX + half) + 6
        xs = np.arange(xl, xr + 1)
        t = (xs - xl) / max(1, xr - xl)
        k = (t * t * (3 - 2 * t))[:, None]
        cl = img[y, max(0, xl - 10):xl - 2].mean(axis=0)
        cr = img[y, xr + 2:xr + 10].mean(axis=0)
        sky[y, xl:xr + 1] = cl * (1 - k) + cr * k
        city[y, xl:xr + 1] = (img[y, np.clip(xs - SHIFT_L, 0, w - 1)] * (1 - k)
                              + img[y, np.clip(xs + SHIFT_R, 0, w - 1)] * k)
        mask[y, xl:xr + 1] = 1
    sky = cv2.GaussianBlur(sky, (0, 0), 6)
    city = cv2.GaussianBlur(city, (0, 0), 1.6)
    rows = np.arange(h, dtype=np.float32)
    b = np.clip((rows - SKY_END) / BAND, 0, 1)
    b = (b * b * (3 - 2 * b))[:, None, None]
    fill = sky * (1 - b) + city * b
    fm = cv2.GaussianBlur(mask, (0, 0), 7)[..., None]
    out = img * (1 - fm) + fill * fm
    out += np.random.default_rng(7).normal(0, 1.3, out.shape).astype(np.float32) * fm
    out = np.clip(out, 0, 255).astype(np.uint8)
    # A stray streak the vertical ring left at its apex.
    streak = np.zeros((h, w), np.uint8)
    cv2.ellipse(streak, (1200, 236), (48, 12), 0, 0, 360, 255, -1)
    return cv2.inpaint(out, streak, 9, cv2.INPAINT_TELEA)


def main():
    poster = cv2.imread(POSTER)
    if poster is None:
        sys.exit(f'missing {POSTER}')
    with tempfile.TemporaryDirectory() as tmp:
        median = temporal_median(tmp)
    plate = fill_disc(remove_rings(poster, median))
    Image.fromarray(plate[..., ::-1]).save(OUT, 'WEBP', quality=84, method=6)
    print(f'wrote {os.path.relpath(OUT, ROOT)} ({os.path.getsize(OUT) // 1024} KB)')


if __name__ == '__main__':
    main()
