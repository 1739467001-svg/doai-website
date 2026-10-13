/* 三档视口全路由截图，供视觉检查排版（过挤/溢出/错位） */
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = 'http://localhost:3000';
const OUT = '/tmp/qa_shots';

const VIEWPORTS = [
  { name: 'm', width: 375, height: 812, dsf: 1 },
  { name: 't', width: 768, height: 1024, dsf: 1 },
  { name: 'd', width: 1440, height: 900, dsf: 1 },
];

const ROUTES = [
  ['home', '/'],
  ['conference', '/conference'],
  ['forum', '/forum'],
  ['forum-detail', '/detail/forum/f-1'],
  ['attend', '/attend'],
  ['news', '/news'],
  ['maker', '/maker'],
  ['track-industry', '/track/industry'],
  ['register', '/register/industry'],
  ['rules', '/rules'],
  ['square', '/square'],
  ['square-detail', '/detail/recruit/rec-1'],
  ['live', '/live'],
  ['dashboard', '/dashboard'],
  ['dashboard-team', '/dashboard/team'],
  ['admin', '/admin'],
];

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--disable-gpu', '--hide-scrollbars'],
});

for (const vp of VIEWPORTS) {
  for (const [name, path] of ROUTES) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: vp.dsf });
    await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 800));
    // 全页截图（限高防超长页）
    await page.screenshot({ path: `${OUT}/${name}__${vp.name}.png`, fullPage: true });
    await page.close();
  }
  console.log(`[${vp.name}] ${ROUTES.length} 页截图完成`);
}
await browser.close();
console.log('saved to', OUT);
