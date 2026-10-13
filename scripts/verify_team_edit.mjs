import puppeteer from 'puppeteer-core';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--disable-gpu'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const sleep = ms => new Promise(r => setTimeout(r, ms));

// 1. 导航栏头像 → 我的 DOAI
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
await sleep(800);
const r1 = await page.evaluate(async () => {
  const btn = [...document.querySelectorAll('header button')].find(b => b.getAttribute('aria-label') === '我的 DOAI');
  if (!btn) return { found: false };
  btn.click();
  await new Promise(r => setTimeout(r, 900));
  return { found: true, url: location.pathname, onDashboard: !!document.querySelector('h1') };
});
console.log('1. 导航栏头像 → 我的 DOAI:', r1.found && r1.url === '/dashboard' ? 'PASS' : 'FAIL', JSON.stringify(r1));

// 2. 队长编辑战队：改名 + 换标识 + 简介
await page.goto('http://localhost:3000/dashboard/team', { waitUntil: 'networkidle2' });
await sleep(1500);
const r2 = await page.evaluate(async () => {
  const editBtn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('编辑战队'));
  if (!editBtn) return { step: 'no-edit-btn' };
  editBtn.click();
  await new Promise(r => setTimeout(r, 400));
  const nameInput = document.querySelector('form input[maxlength="24"]');
  if (!nameInput) return { step: 'no-name-input' };
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  setter.call(nameInput, 'Synapse Core X');
  nameInput.dispatchEvent(new Event('input', { bubbles: true }));
  // 选 🚀 标识
  const marks = [...document.querySelectorAll('form button')].filter(b => b.textContent.trim() === '🚀');
  if (marks[0]) marks[0].click();
  await new Promise(r => setTimeout(r, 200));
  const save = [...document.querySelectorAll('form button')].find(b => b.textContent.trim() === '保存');
  save.click();
  await new Promise(r => setTimeout(r, 1000));
  return {
    step: 'done',
    nameUpdated: document.body.textContent.includes('战队管理：Synapse Core X'),
    markUpdated: [...document.querySelectorAll('h3')].some(h => h.textContent.includes('🚀')),
  };
});
console.log('2. 队长编辑战队:', r2.nameUpdated && r2.markUpdated ? 'PASS' : 'FAIL', JSON.stringify(r2));

// 3. 服务端确认 + 改回原名
const r3 = await fetch('http://localhost:3001/api/teams/mine?userId=user-101').then(r => r.json());
console.log('3. 服务端战队状态:', r3.team.name, r3.team.mark, r3.team.desc ? 'desc✓' : 'desc✗');
await fetch('http://localhost:3001/api/teams/team-synapse/update', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ byUserId: 'user-101', name: 'Synapse Core', mark: '⚡' }),
}).then(r => r.json());
console.log('   已还原战队名');

await browser.close();
