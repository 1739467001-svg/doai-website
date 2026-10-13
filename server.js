/**
 * DOAI 简单后端（会议结论 2026-10-13：签到后台做简单后端实现功能）
 *
 * - GET  /api/health          健康检查
 * - GET  /api/wx/articles     公众号文章同步（标题/封面/摘要/时间，服务端抓取解析）
 * - GET  /api/wx/cover?u=     公众号封面图代理（绕过 mmbiz 防盗链）
 * - GET  /api/admin/checkins  签到记录列表
 * - POST /api/admin/checkin   扫码签到（写入 data/checkins.json，重启不丢）
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
const CHECKINS_FILE = path.join(DATA_DIR, 'checkins.json');

// 活动动态同步的公众号文章（协作表 2026-10-13：先用这篇测试）
const WX_ARTICLES = [
  'https://mp.weixin.qq.com/s/sMWo7pxvNdycwfz07TfBRg',
];

const app = express();
app.use(express.json());

// ---------- 公众号文章同步 ----------
const articleCache = new Map(); // url -> { data, fetchedAt }
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
    const html = await res.text();
    const data = extractMeta(html, url);
    articleCache.set(url, { data, fetchedAt: Date.now() });
    return data;
  } catch (err) {
    // 抓取失败时退回上次成功缓存（若有），否则返回占位
    if (cached) return cached.data;
    return { url, title: '公众号文章', cover: '', description: '', publishTime: '', source: '微信公众号', error: String(err) };
  }
}

app.get('/api/wx/articles', async (_req, res) => {
  const articles = await Promise.all(WX_ARTICLES.map(fetchArticle));
  res.json({ ok: true, articles });
});

// 封面图代理：mmbiz.qpic.cn 对第三方 referer 有防盗链，由服务端转发
app.get('/api/wx/cover', async (req, res) => {
  const u = String(req.query.u || '');
  let host = '';
  try { host = new URL(u).host; } catch { /* ignore */ }
  if (host !== 'mmbiz.qpic.cn' && host !== 'mmbiz.qpic.cn.') {
    return res.status(400).json({ ok: false, message: 'only mmbiz.qpic.cn allowed' });
  }
  try {
    const upstream = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!upstream.ok) throw new Error(`HTTP ${upstream.status}`);
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    const buf = Buffer.from(await upstream.arrayBuffer());
    res.end(buf);
  } catch (err) {
    res.status(502).json({ ok: false, message: String(err) });
  }
});

// ---------- 扫码签到（运营后台） ----------
function loadCheckins() {
  try {
    return JSON.parse(fs.readFileSync(CHECKINS_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function saveCheckins(list) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(CHECKINS_FILE, JSON.stringify(list, null, 2));
}

app.get('/api/admin/checkins', (_req, res) => {
  res.json({ ok: true, checkins: loadCheckins() });
});

app.post('/api/admin/checkin', (req, res) => {
  const { code, gate, holder } = req.body || {};
  const trimmed = String(code || '').trim();
  if (!trimmed) return res.status(400).json({ ok: false, message: '凭证码不能为空' });
  // 合法凭证码形如 DOAI-PASS-*-…，宽容匹配：只要包含 DOAI-PASS 前缀即可通过
  if (!/^DOAI-PASS/i.test(trimmed)) {
    return res.status(422).json({ ok: false, message: '凭证码格式不正确（应以 DOAI-PASS 开头）' });
  }
  const list = loadCheckins();
  if (list.some(c => c.code.toUpperCase() === trimmed.toUpperCase())) {
    return res.status(409).json({ ok: false, message: '该凭证已核销，请勿重复签到', code: trimmed });
  }
  const record = {
    code: trimmed,
    gate: String(gate || '主入口').trim(),
    holder: String(holder || '').trim(),
    time: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };
  list.unshift(record);
  saveCheckins(list);
  res.json({ ok: true, record });
});

app.get('/api/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));

app.listen(PORT, () => {
  console.log(`[doai-server] listening on http://localhost:${PORT}`);
});
