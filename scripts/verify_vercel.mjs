import puppeteer from 'puppeteer-core';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--disable-gpu'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const errors = [];
page.on('pageerror', e => errors.push(String(e).slice(0, 100)));
await page.goto('https://doai-website-three.vercel.app/', { waitUntil: 'networkidle2', timeout: 60000 });
await new Promise(r => setTimeout(r, 1500));
const r = await page.evaluate(() => ({
  url: location.href,
  hero: document.body.textContent.includes('GLOBAL AI MAKERS') || document.body.textContent.includes('Dobe'),
  title: document.title.slice(0, 40),
  failedAssets: performance.getEntriesByType('resource').filter(e => e.responseStatus >= 400).length,
}));
console.log('公网首页:', r.hero && r.failedAssets === 0 ? 'PASS' : 'FAIL', JSON.stringify(r), '| errors:', errors.length);
await page.goto('https://doai-website-three.vercel.app/dashboard', { waitUntil: 'networkidle2', timeout: 60000 });
await new Promise(r => setTimeout(r, 1200));
const r2 = await page.evaluate(() => ({ url: location.pathname, dash: document.body.textContent.includes('李晨') || document.body.textContent.includes('Passport') }));
console.log('公网深链 /dashboard:', r2.dash ? 'PASS' : 'FAIL', JSON.stringify(r2));
const api = await page.evaluate(async () => {
  const res = await fetch('/api/health');
  return { status: res.status, body: (await res.text()).slice(0, 60) };
});
console.log('公网 API /api/health:', api.status === 200 ? 'PASS' : 'FAIL', JSON.stringify(api));
await page.screenshot({ path: '/tmp/vercel_prod.png' });
await browser.close();
