import puppeteer from 'puppeteer-core';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--disable-gpu'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

// 1) /admin 直链
await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 1200));
const adminOk = await page.evaluate(() => {
  const tabs = [...document.querySelectorAll('button')].map(b => b.textContent.trim());
  return tabs.includes('扫码核销') && document.querySelector('h1')?.textContent?.includes('组委会管理中枢');
});
console.log('1. /admin 直链打开管理后台:', adminOk ? 'PASS' : 'FAIL');

// 2) 退出登录：首页（默认登录态）→ 我的 DOAI → 资料与隐私 → 退出登录
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 800));
const clickByText = async (text) => {
  const ok = await page.evaluate((t) => {
    const el = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === t || b.textContent.includes(t));
    if (el) { el.click(); return true; }
    return false;
  }, text);
  if (!ok) throw new Error('button not found: ' + text);
};
await clickByText('我的 DOAI');
await new Promise(r => setTimeout(r, 600));
await clickByText('资料与隐私');
await new Promise(r => setTimeout(r, 500));
const logoutVisible = await page.evaluate(() => document.body.textContent.includes('退出登录'));
console.log('2a. 设置页出现退出登录按钮:', logoutVisible ? 'PASS' : 'FAIL');
await page.evaluate(() => {
  const btn = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === '退出登录');
  btn.click();
});
await new Promise(r => setTimeout(r, 800));
const after = await page.evaluate(() => ({
  onHome: location.pathname === '/' || document.querySelector('h1') !== null,
  loggedOut: !document.body.textContent.includes('李晨 Alex Chen'),
  url: location.pathname,
}));
console.log('2b. 退出后返回首页且无登录用户信息:', after.loggedOut ? 'PASS' : 'FAIL', '| url:', after.url);

await browser.close();
console.log('done');
