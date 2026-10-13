/* 验证：创客社区（项目墙+名片墙）与报名参赛 CTA 漏斗 */
import puppeteer from 'puppeteer-core';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--disable-gpu'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const sleep = ms => new Promise(r => setTimeout(r, ms));

// 1. 创客社区：项目墙 + 名片墙共存，名片墙在下方
await page.goto('http://localhost:3000/square', { waitUntil: 'networkidle2' });
await sleep(1200);
const r1 = await page.evaluate(() => {
  const txt = document.body.textContent;
  const projectWall = txt.includes('组队广场');
  const cardWall = txt.includes('创客名片墙');
  const order = txt.indexOf('创客名片墙') > txt.indexOf('组队广场');
  const cardCount = [...document.querySelectorAll('section')]
    .find(s => s.textContent.includes('创客名片墙'))
    ?.querySelectorAll('.doa-card').length ?? 0;
  return { projectWall, cardWall, order, cardCount };
});
console.log('1. 创客社区 = 项目墙 + 名片墙:',
  r1.projectWall && r1.cardWall && r1.order && r1.cardCount >= 5 ? 'PASS' : 'FAIL', JSON.stringify(r1));

// 2. 名片墙关注切换（方向无关断言）
const r2 = await page.evaluate(async () => {
  const wall = [...document.querySelectorAll('section')].find(s => s.textContent.includes('创客名片墙'));
  const card = [...wall.querySelectorAll('.doa-card')].find(c => c.textContent.includes('林晚晴'));
  if (!card) return { found: false };
  const btn = [...card.querySelectorAll('button')].find(b => b.textContent.includes('关注'));
  if (!btn) return { found: true, btn: false };
  const before = btn.textContent.trim();
  btn.scrollIntoView({ block: 'center' });
  btn.click();
  await new Promise(r => setTimeout(r, 1500));
  const wall2 = [...document.querySelectorAll('section')].find(s => s.textContent.includes('创客名片墙'));
  const card2 = [...wall2.querySelectorAll('.doa-card')].find(c => c.textContent.includes('林晚晴'));
  const afterText = [...card2.querySelectorAll('button')]
    .map(b => b.textContent.trim())
    .find(t => t.includes('关注'));
  return { found: true, btn: true, before, afterText };
});
console.log('2. 名片墙关注切换:', r2.before !== r2.afterText ? 'PASS' : 'FAIL', JSON.stringify(r2));

// 3. 首页「报名参赛」→ /maker/tracks 并滚到双赛道设置
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
await sleep(800);
await page.evaluate(() => {
  [...document.querySelectorAll('button')].find(b => b.textContent.trim() === '报名参赛').click();
});
await sleep(1500);
const r3 = await page.evaluate(() => {
  const rect = document.getElementById('maker-tracks')?.getBoundingClientRect();
  return {
    url: location.pathname,
    tracksInView: rect ? rect.top > -120 && rect.top < window.innerHeight * 0.6 : false,
  };
});
console.log('3. 报名参赛 → 双赛道设置:', r3.url === '/maker/tracks' && r3.tracksInView ? 'PASS' : 'FAIL', JSON.stringify(r3));

// 4. 双赛道 → 申报 → 详情 → 立即报名（漏斗）
await page.evaluate(() => {
  [...document.querySelectorAll('button')].find(b => b.textContent.includes('申报赛道 · 查看详情')).click();
});
await sleep(1000);
const r4 = await page.evaluate(async () => {
  const onDetail = document.body.textContent.includes('命题方向');
  [...document.querySelectorAll('button')].find(b => b.textContent.trim().startsWith('立即报名')).click();
  await new Promise(r => setTimeout(r, 800));
  return { onDetail, url: location.pathname, onRegister: document.body.textContent.includes('申报人基础信息') };
});
console.log('4. 双赛道→详情→报名:', r4.onDetail && r4.onRegister ? 'PASS' : 'FAIL', JSON.stringify(r4));

await browser.close();
