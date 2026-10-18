import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT = '/tmp/qa2';
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const VPS = [['m', 375, 812], ['t', 768, 1024], ['d', 1440, 900]];
const ROUTES = [['home', '/'], ['conference', '/conference'], ['maker', '/maker'], ['track-industry', '/track/industry'], ['register', '/register/industry'], ['rules', '/rules'], ['news', '/news'], ['square', '/square']];
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--disable-gpu', '--hide-scrollbars'] });
for (const [vn, w, h] of VPS) {
  for (const [rn, rp] of ROUTES) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: h });
    await page.goto(`http://localhost:3000${rp}`, { waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: `${OUT}/${rn}__${vn}.png`, fullPage: true });
    await page.close();
  }
  console.log(`[${vn}] done`);
}
await browser.close();
