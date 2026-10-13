import puppeteer from 'puppeteer-core';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--disable-gpu'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3000/square', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 1000));
const r1 = await page.evaluate(() => ({
  title: document.querySelector('h1')?.textContent,
  hasTabs: document.body.textContent.includes('人才市场'),
  cards: document.querySelectorAll('.doa-card').length,
}));
console.log('1. 组队广场单页:', r1.title === '组队广场' && !r1.hasTabs ? 'PASS' : 'FAIL', '| 招募卡片数:', r1.cards);
// 点第一张卡的标题 → 详情页
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find(x => x.textContent.includes('工业级微缺陷'));
  b?.click();
});
await new Promise(r => setTimeout(r, 900));
const r2 = await page.evaluate(() => ({
  url: location.pathname,
  onDetail: document.body.textContent.includes('申请加入') || document.body.textContent.includes('招募详情'),
}));
console.log('2. 招募详情页跳转:', r2.onDetail ? 'PASS' : 'FAIL', '| url:', r2.url);
await browser.close();
