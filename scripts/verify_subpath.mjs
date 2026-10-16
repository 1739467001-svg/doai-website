/* 子路径模式视觉+功能验证：/doai/ 下首页渲染、QR、API */
import puppeteer from 'puppeteer-core';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--disable-gpu'] });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e).slice(0, 120)));
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3210/doai/', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 1500));
const r = await page.evaluate(() => ({
  hero: document.body.textContent.includes('GLOBAL AI MAKERS'),
  globe: !!document.querySelector('.doa-ascii-globe'),
  assetsLoaded: performance.getEntriesByType('resource').filter(e => e.responseStatus && e.responseStatus >= 400).length,
}));
console.log('首页渲染:', r.hero && r.globe && r.assetsLoaded === 0 ? 'PASS' : 'FAIL', JSON.stringify(r), '| JS errors:', errors.length);
// 深链 + API
await page.goto('http://localhost:3210/doai/dashboard', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 1200));
const r2 = await page.evaluate(() => ({
  dash: document.body.textContent.includes('李晨') || document.body.textContent.includes('My DOAI'),
}));
console.log('深链 /doai/dashboard:', r2.dash ? 'PASS' : 'FAIL', '| JS errors:', errors.length);
await browser.close();
