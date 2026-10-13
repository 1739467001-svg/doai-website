/**
 * DOAI 简单后端（会议 2026-10-13：管理后台 / 入场二维码 / 通行证核销 /
 * 组队协作全部打通；简单后端实现，JSON 文件持久化）
 *
 * 模块：
 *   - 公众号同步   GET  /api/wx/articles · GET /api/wx/cover
 *   - 报名        POST /api/registrations/sync · POST /api/registrations
 *                GET  /api/registrations · POST /api/registrations/:id/work
 *                POST /api/admin/registrations/:id/status
 *   - 入场凭证    POST /api/tickets · GET /api/tickets?holder=
 *   - 核销        POST /api/admin/checkin · GET /api/admin/checkins
 *   - 用户/关注   GET  /api/users · GET /api/follows?userId=
 *                POST /api/follows · DELETE /api/follows
 *   - 队伍        POST /api/teams · GET /api/teams · GET /api/teams/mine
 *                POST /api/teams/:id/remove-member · POST /api/teams/:id/leave
 *   - 组队申请    GET  /api/team-applications?userId=
 *                POST /api/team-applications   （服务端校验互相关注）
 *                POST /api/team-applications/:id/accept · decline
 *
 * 启动：npm run server （端口 3001，Vite 已把 /api 代理过来）
 */
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;
const DATA_DIR = path.join(__dirname, 'data');

const app = express();
app.use(express.json());

/* ------------------------------ JSON 存储 ------------------------------ */

const STORE_FILES = ['registrations', 'tickets', 'checkins', 'teams', 'users', 'follows', 'applications'];

function load(name) {
  try {
    return JSON.parse(fs.readFileSync(path.join(DATA_DIR, `${name}.json`), 'utf8'));
  } catch {
    return [];
  }
}

function save(name, data) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(path.join(DATA_DIR, `${name}.json`), JSON.stringify(data, null, 2));
}

for (const f of STORE_FILES) load(f); // 确保目录存在

const now = () => new Date().toISOString().replace('T', ' ').substring(0, 19);

/* ------------------------------ 种子数据 ------------------------------ */
/* 首次运行时写入演示数据，让后台 / 战队 / 关注功能开箱可用 */

function seed() {
  if (load('users').length === 0) {
    save('users', [
      { id: 'user-101', name: '李晨 Alex Chen', roleTitle: '算法架构', avatarSeed: 'lchen' },
      { id: 'user-102', name: '王嘉敏 (Jasmine)', roleTitle: '全栈架构师', avatarSeed: 'jm' },
      { id: 'user-103', name: '韩立 (Henry)', roleTitle: '产品与商业化', avatarSeed: 'hl' },
      { id: 'user-201', name: '周志恒 Dr. Zhou', roleTitle: '机器视觉专家', avatarSeed: 'zzh' },
      { id: 'user-301', name: '孙博远 (David)', roleTitle: '金融工程', avatarSeed: 'sby' },
      { id: 'user-401', name: '陈昊 Mark Chen', roleTitle: 'Independent Creative Dev', avatarSeed: 'ch' },
      { id: 'user-402', name: '林晚晴', roleTitle: '具身智能研究员', avatarSeed: 'lwq' },
    ]);
  }
  if (load('teams').length === 0) {
    save('teams', [
      {
        id: 'team-synapse',
        name: 'Synapse Core',
        track: 'creator',
        inviteCode: 'NF8921',
        leaderId: 'user-101',
        createdAt: '2026-09-18 14:32',
        members: [
          { id: 'user-101', name: '李晨 Alex Chen', roleTitle: '队长 / 算法架构', isLeader: true },
          { id: 'user-102', name: '王嘉敏 (Jasmine)', roleTitle: '全栈架构师', isLeader: false },
        ],
      },
    ]);
  }
  if (load('follows').length === 0) {
    // 演示两种状态：李晨↔王嘉敏 互相关注（可发组队申请）；李晨→陈昊 单向（暂不可发）
    save('follows', [
      { from: 'user-101', to: 'user-102', since: '2026-09-20 10:00' },
      { from: 'user-102', to: 'user-101', since: '2026-09-20 10:05' },
      { from: 'user-101', to: 'user-401', since: '2026-09-28 09:00' },
      { from: 'user-401', to: 'user-102', since: '2026-09-29 09:00' },
      { from: 'user-103', to: 'user-101', since: '2026-09-25 09:00' },
    ]);
  }
}
seed();

/* ------------------------------ 公众号同步 ------------------------------ */

const WX_ARTICLES = ['https://mp.weixin.qq.com/s/sMWo7pxvNdycwfz07TfBRg'];
const articleCache = new Map();
const CACHE_TTL = 10 * 60 * 1000;

function extractMeta(html, url) {
  const meta = (prop) => {
    const m = html.match(new RegExp(`property="og:${prop}" content="([^"]*)"`, 'i'));
    return m ? m[1] : '';
  };
  const timeMatch = html.match(/var\s+createTime\s*=\s*['"]([^'"]+)['"]/);
  return {
    url,
    title: meta('title') || '未命名文章',
    cover: meta('image'),
    description: meta('description'),
    publishTime: timeMatch ? timeMatch[1] : '',
    source: '微信公众号',
  };
}

async function fetchArticle(url) {
  const cached = articleCache.get(url);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) return cached.data;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.49',
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = extractMeta(await res.text(), url);
    articleCache.set(url, { data, fetchedAt: Date.now() });
    return data;
  } catch (err) {
    if (cached) return cached.data;
    return { url, title: '公众号文章', cover: '', description: '', publishTime: '', source: '微信公众号', error: String(err) };
  }
}

app.get('/api/wx/articles', async (_req, res) => {
  res.json({ ok: true, articles: await Promise.all(WX_ARTICLES.map(fetchArticle)) });
});

app.get('/api/wx/cover', async (req, res) => {
  const u = String(req.query.u || '');
  let host = '';
  try { host = new URL(u).host; } catch { /* ignore */ }
  if (host !== 'mmbiz.qpic.cn') {
    return res.status(400).json({ ok: false, message: 'only mmbiz.qpic.cn allowed' });
  }
  try {
    const upstream = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!upstream.ok) throw new Error(`HTTP ${upstream.status}`);
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.end(Buffer.from(await upstream.arrayBuffer()));
  } catch (err) {
    res.status(502).json({ ok: false, message: String(err) });
  }
});

/* ------------------------------ 报名 ------------------------------ */

function upsertRegistration(incoming) {
  if (!incoming || !incoming.id) return null;
  const list = load('registrations');
  const idx = list.findIndex(r => r.id === incoming.id);
  if (idx >= 0) {
    // 保留服务端已有的 submission / 审核字段，除非来值更新
    const merged = { ...list[idx], ...incoming };
    if (!incoming.submission && list[idx].submission) merged.submission = list[idx].submission;
    if (!incoming.reviewFeedback && list[idx].reviewFeedback) merged.reviewFeedback = list[idx].reviewFeedback;
    list[idx] = merged;
  } else {
    list.unshift(incoming);
  }
  save('registrations', list);
  return incoming;
}

app.post('/api/registrations/sync', (req, res) => {
  const arr = Array.isArray(req.body?.registrations) ? req.body.registrations : [];
  arr.forEach(upsertRegistration);
  res.json({ ok: true, count: arr.length });
});

app.post('/api/registrations', (req, res) => {
  const r = upsertRegistration(req.body);
  if (!r) return res.status(400).json({ ok: false, message: 'registration.id 必填' });
  res.json({ ok: true, registration: r });
});

app.get('/api/registrations', (_req, res) => {
  res.json({ ok: true, registrations: load('registrations') });
});

app.post('/api/registrations/:id/work', (req, res) => {
  const { videoUrl, demoUrl, githubUrl } = req.body || {};
  if (!videoUrl || !demoUrl || !githubUrl) {
    return res.status(400).json({ ok: false, message: '三个链接均必填' });
  }
  const list = load('registrations');
  const idx = list.findIndex(r => r.id === req.params.id);
  if (idx < 0) return res.status(404).json({ ok: false, message: '报名记录不存在' });
  list[idx].submission = { videoUrl, demoUrl, githubUrl, submittedAt: now() };
  save('registrations', list);
  res.json({ ok: true, submission: list[idx].submission });
});

app.post('/api/admin/registrations/:id/status', (req, res) => {
  const { status, feedback } = req.body || {};
  const list = load('registrations');
  const idx = list.findIndex(r => r.id === req.params.id);
  if (idx < 0) return res.status(404).json({ ok: false, message: '报名记录不存在' });
  list[idx].status = status ?? list[idx].status;
  if (feedback !== undefined) list[idx].reviewFeedback = feedback;
  if (status) list[idx].reviewedAt = now();
  save('registrations', list);
  res.json({ ok: true, registration: list[idx] });
});

/* ------------------------------ 入场凭证与核销 ------------------------------ */

app.post('/api/tickets', (req, res) => {
  const t = req.body || {};
  if (!t.qrCode) return res.status(400).json({ ok: false, message: 'qrCode 必填' });
  const list = load('tickets');
  const idx = list.findIndex(x => x.qrCode === t.qrCode);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...t };
  } else {
    list.unshift({ ...t, status: t.status || 'claimed', issuedAt: t.issuedAt || now() });
  }
  save('tickets', list);
  res.json({ ok: true, ticket: t });
});

app.get('/api/tickets', (req, res) => {
  const holder = String(req.query.holder || '');
  const list = load('tickets');
  res.json({ ok: true, tickets: holder ? list.filter(t => t.holderName === holder) : list });
});

function loadCheckins() { return load('checkins'); }
function saveCheckins(list) { save('checkins', list); }

app.get('/api/admin/checkins', (_req, res) => {
  res.json({ ok: true, checkins: loadCheckins() });
});

app.post('/api/admin/checkin', (req, res) => {
  const { code, gate, holder } = req.body || {};
  const trimmed = String(code || '').trim();
  if (!trimmed) return res.status(400).json({ ok: false, message: '凭证码不能为空' });

  const tickets = load('tickets');
  const ticket = tickets.find(t => t.qrCode === trimmed);

  // 已登记的凭证必须在库里；历史演示码（DOAI-PASS 前缀）宽容放行
  if (!ticket && !/^DOAI-PASS/i.test(trimmed)) {
    return res.status(422).json({ ok: false, message: '凭证码格式不正确（应以 DOAI-PASS 开头）' });
  }

  const list = loadCheckins();
  if (list.some(c => c.code.toUpperCase() === trimmed.toUpperCase())) {
    return res.status(409).json({ ok: false, message: '该凭证已核销，请勿重复签到', code: trimmed });
  }

  const record = {
    code: trimmed,
    gate: String(gate || '主入口').trim(),
    holder: String(holder || ticket?.holderName || '').trim(),
    time: now(),
  };
  list.unshift(record);
  saveCheckins(list);

  if (ticket) {
    ticket.status = 'checked_in';
    ticket.checkedInAt = record.time;
    save('tickets', tickets);
  }
  res.json({ ok: true, record });
});

/* ------------------------------ 用户与互相关注 ------------------------------ */

app.get('/api/users', (_req, res) => {
  res.json({ ok: true, users: load('users') });
});

const isMutual = (a, b) => {
  const follows = load('follows');
  return follows.some(f => f.from === a && f.to === b) && follows.some(f => f.from === b && f.to === a);
};

app.get('/api/follows', (req, res) => {
  const userId = String(req.query.userId || '');
  const follows = load('follows');
  const following = follows.filter(f => f.from === userId).map(f => f.to);
  const followers = follows.filter(f => f.to === userId).map(f => f.from);
  res.json({
    ok: true,
    following,
    followers,
    mutual: following.filter(u => followers.includes(u)),
  });
});

app.post('/api/follows', (req, res) => {
  const { from, to } = req.body || {};
  if (!from || !to) return res.status(400).json({ ok: false, message: 'from/to 必填' });
  if (from === to) return res.status(422).json({ ok: false, message: '不能关注自己' });
  const list = load('follows');
  if (!list.some(f => f.from === from && f.to === to)) {
    list.push({ from, to, since: now() });
    save('follows', list);
  }
  res.json({ ok: true, mutual: isMutual(from, to) });
});

app.delete('/api/follows', (req, res) => {
  const { from, to } = req.body || {};
  if (!from || !to) return res.status(400).json({ ok: false, message: 'from/to 必填' });
  save('follows', load('follows').filter(f => !(f.from === from && f.to === to)));
  res.json({ ok: true });
});

/* ------------------------------ 队伍 ------------------------------ */

const teamOf = userId => load('teams').find(t => t.members.some(m => m.id === userId));

app.post('/api/teams', (req, res) => {
  const { name, track, leaderId, leaderName } = req.body || {};
  if (!name?.trim()) return res.status(400).json({ ok: false, message: '战队名称必填' });
  if (!leaderId) return res.status(400).json({ ok: false, message: 'leaderId 必填' });
  if (teamOf(leaderId)) {
    return res.status(409).json({ ok: false, message: '您已拥有战队（先退出或解散当前战队）' });
  }
  const code = `${name.trim().slice(0, 2).toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`;
  const team = {
    id: `team-${Date.now()}`,
    name: name.trim(),
    track: track === 'industry' ? 'industry' : 'creator',
    inviteCode: code,
    leaderId,
    createdAt: now(),
    members: [
      { id: leaderId, name: leaderName || leaderId, roleTitle: '队长', isLeader: true },
    ],
  };
  const list = load('teams');
  list.push(team);
  save('teams', list);
  res.json({ ok: true, team });
});

app.get('/api/teams', (_req, res) => {
  res.json({ ok: true, teams: load('teams') });
});

app.get('/api/teams/mine', (req, res) => {
  const team = teamOf(String(req.query.userId || ''));
  res.json({ ok: true, team: team || null });
});

app.post('/api/teams/:id/remove-member', (req, res) => {
  const { memberId, byUserId } = req.body || {};
  const list = load('teams');
  const team = list.find(t => t.id === req.params.id);
  if (!team) return res.status(404).json({ ok: false, message: '战队不存在' });
  if (byUserId !== team.leaderId) {
    return res.status(403).json({ ok: false, message: '只有队长可以移出队员' });
  }
  const member = team.members.find(m => m.id === memberId);
  if (!member) return res.status(404).json({ ok: false, message: '成员不存在' });
  if (member.isLeader) return res.status(422).json({ ok: false, message: '队长不能移出自己，请使用解散' });
  team.members = team.members.filter(m => m.id !== memberId);
  save('teams', list);
  res.json({ ok: true, team });
});

app.post('/api/teams/:id/leave', (req, res) => {
  const { userId } = req.body || {};
  const list = load('teams');
  const team = list.find(t => t.id === req.params.id);
  if (!team) return res.status(404).json({ ok: false, message: '战队不存在' });
  const member = team.members.find(m => m.id === userId);
  if (!member) return res.status(404).json({ ok: false, message: '您不是该战队成员' });
  if (member.isLeader) {
    // 队长离开 = 解散战队（同时撤回未处理的组队申请）
    save('teams', list.filter(t => t.id !== team.id));
    save('applications', load('applications').filter(a => a.teamId !== team.id));
    return res.json({ ok: true, team: null, disbanded: true });
  }
  team.members = team.members.filter(m => m.id !== userId);
  save('teams', list);
  res.json({ ok: true, team });
});

/* ------------------------------ 组队申请（需互相关注） ------------------------------ */

app.get('/api/team-applications', (req, res) => {
  const userId = String(req.query.userId || '');
  const list = load('applications');
  res.json({
    ok: true,
    received: list.filter(a => a.toUserId === userId && a.status === 'pending'),
    sent: list.filter(a => a.fromUserId === userId),
  });
});

app.post('/api/team-applications', (req, res) => {
  const { fromUserId, fromName, toUserId, toName, teamId, message } = req.body || {};
  if (!fromUserId || !toUserId || !teamId) {
    return res.status(400).json({ ok: false, message: '缺少必要参数' });
  }
  if (fromUserId === toUserId) {
    return res.status(422).json({ ok: false, message: '不能向自己发送组队申请' });
  }

  // 会议结论：组队申请需双方互相关注
  if (!isMutual(fromUserId, toUserId)) {
    return res.status(403).json({ ok: false, message: '需要双方互相关注后才能发送组队申请' });
  }

  const teams = load('teams');
  const team = teams.find(t => t.id === teamId);
  if (!team) return res.status(404).json({ ok: false, message: '战队不存在' });
  if (team.members.some(m => m.id === toUserId)) {
    return res.status(409).json({ ok: false, message: '该用户已是战队成员' });
  }
  if (team.members.length >= 5) {
    return res.status(409).json({ ok: false, message: '战队已满员（上限 5 人）' });
  }
  if (teamOf(toUserId)) {
    return res.status(409).json({ ok: false, message: '该用户已有战队' });
  }

  const list = load('applications');
  if (list.some(a => a.teamId === teamId && a.toUserId === toUserId && a.status === 'pending')) {
    return res.status(409).json({ ok: false, message: '已发送过申请，等待对方处理' });
  }

  const application = {
    id: `app-${Date.now()}`,
    teamId,
    teamName: team.name,
    fromUserId,
    fromName: fromName || fromUserId,
    toUserId,
    toName: toName || toUserId,
    message: String(message || '').trim(),
    status: 'pending',
    createdAt: now(),
  };
  list.push(application);
  save('applications', list);
  res.json({ ok: true, application });
});

app.post('/api/team-applications/:id/accept', (req, res) => {
  const { byUserId } = req.body || {};
  const apps = load('applications');
  const app_ = apps.find(a => a.id === req.params.id);
  if (!app_) return res.status(404).json({ ok: false, message: '申请不存在' });
  if (app_.status !== 'pending') return res.status(409).json({ ok: false, message: '该申请已处理' });
  // 接受方 = 被邀请人本人（toUserId），或队长代审（team leader）
  const teams = load('teams');
  const team = teams.find(t => t.id === app_.teamId);
  if (!team) return res.status(404).json({ ok: false, message: '战队已解散' });
  const isInvitee = byUserId === app_.toUserId;
  const isLeader = byUserId === team.leaderId;
  if (!isInvitee && !isLeader) {
    return res.status(403).json({ ok: false, message: '无权处理该申请' });
  }
  if (team.members.length >= 5) {
    return res.status(409).json({ ok: false, message: '战队已满员（上限 5 人）' });
  }
  team.members.push({
    id: app_.toUserId,
    name: app_.toName,
    roleTitle: '队员',
    isLeader: false,
  });
  app_.status = 'accepted';
  app_.handledAt = now();
  save('teams', teams);
  save('applications', apps);
  res.json({ ok: true, team });
});

app.post('/api/team-applications/:id/decline', (req, res) => {
  const { byUserId } = req.body || {};
  const apps = load('applications');
  const app_ = apps.find(a => a.id === req.params.id);
  if (!app_) return res.status(404).json({ ok: false, message: '申请不存在' });
  if (app_.status !== 'pending') return res.status(409).json({ ok: false, message: '该申请已处理' });
  const teams = load('teams');
  const team = teams.find(t => t.id === app_.teamId);
  const isInvitee = byUserId === app_.toUserId;
  const isLeader = team && byUserId === team.leaderId;
  if (!isInvitee && !isLeader) {
    return res.status(403).json({ ok: false, message: '无权处理该申请' });
  }
  app_.status = 'declined';
  app_.handledAt = now();
  save('applications', apps);
  res.json({ ok: true });
});

/* ------------------------------ 健康检查 ------------------------------ */

app.get('/api/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));

app.listen(PORT, () => {
  console.log(`[doai-server] listening on http://localhost:${PORT}`);
});
