/* Multi-viewport visual QA shots via system Chrome (no bundled Chromium). */
import puppeteer from 'puppeteer-core';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const URL = process.env.SHOT_URL || 'http://localhost:3000/';

const viewports = [
  { name: 'mobile_375', width: 375, height: 812, dsf: 2, full: true },
  { name: 'tablet_768', width: 768, height: 1024, dsf: 2, full: true },
  { name: 'desktop_1440', width: 1440, height: 900, dsf: 1, full: false },
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--disable-gpu', '--hide-scrollbars', '--force-prefers-reduced-motion'],
});

for (const vp of viewports) {
  const page = await browser.newPage();
  await page.setViewport({
    width: vp.width,
    height: vp.height,
    deviceScaleFactor: vp.dsf,
  });
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));
  // Overflow audit while we're here.
  const audit = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const bad = [];
    document.querySelectorAll('body *').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && (r.right > vw + 1 || r.left < -1)) {
        bad.push(`${el.tagName}.${String(el.className).slice(0, 60)} L${Math.round(r.left)} R${Math.round(r.right)}`);
      }
    });
    return { vw, scrollW: document.documentElement.scrollWidth, bad: bad.slice(0, 10) };
  });
  console.log(`[${vp.name}] vw=${audit.vw} scrollW=${audit.scrollW} overflow=${audit.bad.length}`);
  audit.bad.forEach(b => console.log('  OVERFLOW:', b));
  await page.screenshot({ path: `/tmp/shot_${vp.name}.png`, fullPage: vp.full });
  console.log(`[${vp.name}] saved /tmp/shot_${vp.name}.png`);
  await page.close();
}

await browser.close();
