import puppeteer from 'puppeteer-core';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--disable-gpu'] });
const page = await browser.newPage();
page.on('framenavigated', f => { if (f === page.mainFrame()) console.log('NAVIGATED →', f.url().slice(0, 100)); });
await page.setViewport({ width: 1440, height: 950 });
await page.goto('http://localhost:3000/register/industry', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 800));
// 安装捕获监听：记录 submit/click 是否发生
await page.evaluate(() => {
  window.__log = [];
  document.addEventListener('submit', e => {
    window.__log.push('submit:cancelable=' + e.cancelable + ',defaultPrevented(after-react?)=' + e.defaultPrevented);
  }, true);
  document.addEventListener('click', e => {
    window.__log.push('click:' + (e.target.textContent || '').trim().slice(0, 14) + ':defaultPrevented=' + e.defaultPrevented);
  }, true);
});
const clickText = async t => {
  const ok = await page.evaluate(txt => {
    const el = [...document.querySelectorAll('button')].find(b => b.textContent.includes(txt));
    if (!el) return false;
    el.click(); return true;
  }, t);
  console.log('click', t, '→', ok);
};
await clickText('下一步：参赛模式');
await new Promise(r => setTimeout(r, 400));
await clickText('下一步：项目与作品');
await new Promise(r => setTimeout(r, 400));
await clickText('立即提交申报');
await new Promise(r => setTimeout(r, 800));
const log = await page.evaluate(() => window.__log.slice(-8));
console.log('events:', JSON.stringify(log, null, 1));
await browser.close();
