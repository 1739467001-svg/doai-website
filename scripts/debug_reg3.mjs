import puppeteer from 'puppeteer-core';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--disable-gpu'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 950 });
await page.goto('http://localhost:3000/register/industry', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 800));
const clickText = async t => page.evaluate(txt => {
  const el = [...document.querySelectorAll('button')].find(b => b.textContent.includes(txt));
  if (!el) return false;
  el.click(); return true;
}, t);
await clickText('下一步：参赛模式');
await new Promise(r => setTimeout(r, 400));
await clickText('下一步：项目与作品');
await new Promise(r => setTimeout(r, 400));
await clickText('立即提交申报');
// 连续采样 3 秒
for (const ms of [150, 500, 1000, 1500, 2500]) {
  await new Promise(r => setTimeout(r, ms === 150 ? 150 : ms - 150 <= 0 ? 100 : 0));
  const s = await page.evaluate(() => ({
    step1: document.body.textContent.includes('01. 申报人基础信息'),
    step4: document.body.textContent.includes('赛事申报提交成功'),
    loginModal: !!document.querySelector('input[placeholder*="手机"]') || document.body.textContent.includes('验证码'),
    h3s: [...document.querySelectorAll('h3')].map(h => h.textContent.trim()).slice(0, 2),
  }));
  console.log(`t+${ms}ms:`, JSON.stringify(s));
  await new Promise(r => setTimeout(r, 350));
}
await browser.close();
