/* Verify the ASCII globe animates and responds to drag in animated mode. */
import puppeteer from 'puppeteer-core';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--disable-gpu', '--hide-scrollbars'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 2000));

const grab = () =>
  page.evaluate(() => {
    const pre = document.querySelector('.doa-ascii-globe');
    return pre ? pre.textContent : '';
  });

const f1 = await grab();
await new Promise(r => setTimeout(r, 3000));
const f2 = await grab();
console.log('frame rendered:', f1.length > 100, '| lines:', f1.split('\n').filter(l => l.trim()).length);
console.log('animating (frames differ):', f1 !== f2);

// Drag test: press, move 120px right over a few steps, release.
const box = await page.evaluate(() => {
  const r = document.querySelector('.doa-ascii-globe').parentElement.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
});
await page.mouse.move(box.x, box.y);
await page.mouse.down();
for (let i = 1; i <= 6; i++) await page.mouse.move(box.x + i * 20, box.y, { steps: 1 });
await page.mouse.up();
const f3 = await grab();
await new Promise(r => setTimeout(r, 400));
const f4 = await grab();
console.log('drag produced new frame:', f3 !== f2);
console.log('inertia animating after release:', f4 !== f3);

await browser.close();
console.log('globe interaction check done');
