/* 生产模式本地验证：静态 dist + /api 代理到 :3001 + SPA fallback（均带 /doai 前缀） */
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use('/doai/api', async (req, res) => {
  const target = await fetch(`http://localhost:3001${req.originalUrl.replace('/doai/api', '/api')}`, {
    method: req.method,
    headers: req.headers,
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : req,
  }).catch(() => null);
  if (!target || !target.ok && target.status !== 409 && target.status !== 422) {
    return res.status(502).json({ ok: false });
  }
  res.status(target.status);
  res.setHeader('Content-Type', target.headers.get('content-type') || 'application/json');
  res.end(Buffer.from(await target.arrayBuffer()));
});
const dist = path.join(__dirname, '..', 'dist');
app.use('/doai', express.static(dist));
app.get('/doai/*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
app.listen(3210, () => console.log('prod preview on :3210'));
