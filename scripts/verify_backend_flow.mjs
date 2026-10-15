import puppeteer from 'puppeteer-core';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--disable-gpu'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 950 });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const clickText = async t => {
  await page.evaluate(txt => {
    const el = [...document.querySelectorAll('button')].find(b => b.textContent.includes(txt));
    if (!el) throw new Error('button not found: ' + txt);
    el.click();
  }, t);
};


// ---------- 0. 状态准备：确保战队有非队长成员（可重复执行） ----------
const API = 'http://localhost:3001';
const j = (r) => r.json();
const team = await fetch(`${API}/api/teams/mine?userId=user-101`).then(j);
if (team.team && team.team.members.length < 2) {
  let app = null;
  const res = await fetch(`${API}/api/team-applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fromUserId: 'user-101', fromName: '李晨', toUserId: 'user-102', toName: '王嘉敏 (Jasmine)', teamId: team.team.id, message: '回归战队' }),
  }).then(j);
  app = res.application || null;
  if (!app) {
    // 待处理申请是李晨发给王嘉敏的：查王嘉敏的收件箱或李晨的发件箱
    const pendTo = await fetch(`${API}/api/team-applications?userId=user-102`).then(j);
    const pendFrom = await fetch(`${API}/api/team-applications?userId=user-101`).then(j);
    app = pendTo.received?.find(a => a.teamId === team.team.id && a.status === 'pending')
      || pendFrom.sent?.find(a => a.teamId === team.team.id && a.status === 'pending')
      || null;
  }
  if (app) {
    await fetch(`${API}/api/team-applications/${app.id}/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ byUserId: 'user-101' }),
    }).then(j);
  }
}
console.log('0. 状态准备: OK');

// ---------- 1. 入场二维码 + 核销 ----------
await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle2' });
await sleep(1500);
const qr = await page.evaluate(() => ({
  qrCount: [...document.querySelectorAll('svg')].filter(s => {
    const vb = s.getAttribute('viewBox') || '';
    return s.querySelectorAll('rect').length > 0 || vb.startsWith('0 0 2') && vb !== '0 0 24 24';
  }).length,
}));
console.log('1. 入场二维码渲染(qrCount>=2):', qr.qrCount >= 2 ? 'PASS' : 'FAIL', `(${qr.qrCount})`);

// 核销按钮（论坛票 A01 之前测过已核销→会 409；选手票 8921 也核销过。
// 用新预约一张论坛票来测干净路径）
await page.evaluate(() => { window.__doaiNav = true; });
await page.goto('http://localhost:3000/forum', { waitUntil: 'networkidle2' });
await sleep(1000);
const booked = await page.evaluate(() => {
  const btns = [...document.querySelectorAll('button')].filter(b => b.textContent.includes('免费预约'));
  if (btns.length) { btns[0].click(); return true; }
  return false;
});
await sleep(800);
await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle2' });
await sleep(1200);
const checkin = await page.evaluate(async () => {
  const btn = [...document.querySelectorAll('button')].reverse().find(b => b.textContent.includes('模拟现场闸机扫码核销'));
  if (!btn) return { found: false };
  btn.click();
  await new Promise(r => setTimeout(r, 900));
  return { found: true, ok: document.body.textContent.includes('核销成功') || document.body.textContent.includes('已核销过') };
});
console.log('2. 凭证核销(按钮→后端):', checkin.found && checkin.ok ? 'PASS' : 'FAIL', JSON.stringify(checkin));

// ---------- 3. 战队面板：移出队员 + 互关邀请 ----------
await page.goto('http://localhost:3000/dashboard/team', { waitUntil: 'networkidle2' });
await sleep(1500);
const teamState = await page.evaluate(() => ({
  hasTeam: document.body.textContent.includes('战队管理') && document.body.textContent.includes('Synapse Core'),
  hasRemove: document.body.textContent.includes('移出'),
  hasMutualBadge: document.body.textContent.includes('互相关注'),
  hasPending: document.body.textContent.includes('待对方处理'),
}));
console.log('3. 战队面板(队伍/移出按钮/互关标识/待处理):',
  teamState.hasTeam && teamState.hasRemove && teamState.hasMutualBadge ? 'PASS' : 'FAIL', JSON.stringify(teamState));

// 移出队员王嘉敏
const before = await page.evaluate(() => document.body.textContent.includes('王嘉敏'));
await page.evaluate(() => {
  const rows = [...document.querySelectorAll('div')].filter(d => d.className.includes('doa-panel') && d.textContent.includes('王嘉敏'));
  const row = rows[0];
  const btn = row && [...row.querySelectorAll('button')].find(b => b.textContent.includes('移出'));
  if (btn) btn.click();
});
await sleep(1000);
const afterRemove = await page.evaluate(async () => {
  await new Promise(r => setTimeout(r, 400));
  const memberRows = [...document.querySelectorAll('div')].filter(d =>
    typeof d.className === 'string' && d.className.includes('doa-panel') && d.textContent.includes('战队队长'));
  const stillMember = memberRows.some(row => row.textContent.includes('王嘉敏'));
  const server = await fetch('/api/teams/mine?userId=user-101').then(r => r.json());
  return { memberGone: !stillMember && !server.team.members.some(m => m.name.includes('王嘉敏')) };
});
console.log('4. 队长移出队员:', afterRemove.memberGone ? 'PASS' : 'FAIL', JSON.stringify(afterRemove));

// 关注一个未互关用户（孙博远 user-301）→ 按钮应从禁用变为可邀请？单向关注仍禁用
const followState = await page.evaluate(() => {
  const row = [...document.querySelectorAll('div')].filter(d => d.className.includes('doa-panel') && d.textContent.includes('孙博远'))[0];
  if (!row) return { found: false };
  const inviteBtn = [...row.querySelectorAll('button')].find(b => b.textContent.includes('邀请入队'));
  return { found: true, inviteDisabledBefore: inviteBtn?.disabled, followBtn: [...row.querySelectorAll('button')].find(b => b.textContent.includes('关注')) ? true : false };
});
console.log('5. 单向关注时邀请按钮禁用:', followState.found && followState.inviteDisabledBefore === true ? 'PASS' : 'FAIL', JSON.stringify(followState));

await browser.close();
console.log('done');
