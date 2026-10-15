import puppeteer from 'puppeteer-core';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--disable-gpu'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const sleep = ms => new Promise(r => setTimeout(r, ms));

// 1. 设置页出现个人资料编辑器
await page.goto('http://localhost:3000/dashboard/settings', { waitUntil: 'networkidle2' });
await sleep(1200);
const r1 = await page.evaluate(() => ({
  hasEditor: document.body.textContent.includes('个人资料') && document.body.textContent.includes('同步 AtomClub 头像'),
  hasAvatarBtn: !!document.querySelector('button[title*="AtomClub"]'),
  nameInput: !!document.querySelector('input[maxlength="30"]'),
}));
console.log('1. 个人资料编辑器:', r1.hasEditor && r1.hasAvatarBtn && r1.nameInput ? 'PASS' : 'FAIL', JSON.stringify(r1));

// 2. 点击头像 → 同步 AtomClub 头像（头像应变化 + 导航栏头像变化）
const before = await page.evaluate(() => document.querySelector('header img[title], header button[title] img')?.src || '');
const r2 = await page.evaluate(async () => {
  const btn = document.querySelector('button[title*="AtomClub"]');
  btn.click();
  await new Promise(r => setTimeout(r, 1200));
  const notice = document.body.textContent.includes('已同步 AtomClub 头像');
  const newAvatar = [...document.querySelectorAll('img')].find(i => i.src.includes('1500648767791'));
  return { notice, syncedImg: !!newAvatar };
});
const navbarAfter = await page.evaluate(() => [...document.querySelectorAll('header img')].map(i => i.src).find(s => s.includes('1500648767791')));
console.log('2. 点击头像同步 AtomClub:', r2.notice && r2.syncedImg && navbarAfter ? 'PASS' : 'FAIL', JSON.stringify(r2), navbarAfter ? '| 导航栏头像已更新' : '| 导航栏未更新');

// 3. 改名保存 → 头部用户名更新；刷新后仍保留（后端覆盖生效）
const r3 = await page.evaluate(async () => {
  const input = document.querySelector('input[maxlength="30"]');
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  setter.call(input, '李晨 Alex C.');
  input.dispatchEvent(new Event('input', { bubbles: true }));
  await new Promise(r => setTimeout(r, 200));
  [...document.querySelectorAll('button')].find(b => b.textContent.trim() === '保存资料').click();
  await new Promise(r => setTimeout(r, 900));
  return { h1Updated: document.querySelector('h1')?.textContent.includes('李晨 Alex C.') };
});
await page.goto('http://localhost:3000/dashboard/settings', { waitUntil: 'networkidle2' });
await sleep(1500);
const r3b = await page.evaluate(() => ({
  nameAfterReload: document.querySelector('input[maxlength="30"]')?.value,
}));
console.log('3. 改名保存+刷新持久:', r3.h1Updated && r3b.nameAfterReload === '李晨 Alex C.' ? 'PASS' : 'FAIL', JSON.stringify({h1: r3.h1Updated, reload: r3b.nameAfterReload}));

// 还原演示名
await page.evaluate(async () => {
  const input = document.querySelector('input[maxlength="30"]');
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  setter.call(input, '李晨 Alex Chen');
  input.dispatchEvent(new Event('input', { bubbles: true }));
  await new Promise(r => setTimeout(r, 150));
  [...document.querySelectorAll('button')].find(b => b.textContent.trim() === '保存资料').click();
  await new Promise(r => setTimeout(r, 700));
});
console.log('   已还原演示名');

await browser.close();
