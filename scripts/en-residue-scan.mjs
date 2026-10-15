/* 英文模式中文残留扫描：EN 语言下逐路由提取可见 CJK 文本，量化 i18n 覆盖率 */
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ROUTES = [
  ['home', '/'],
  ['conference', '/conference'],
  ['forum', '/forum'],
  ['forum-detail', '/detail/forum/f-1'],
  ['attend', '/attend'],
  ['news', '/news'],
  ['maker', '/maker'],
  ['track-industry', '/track/industry'],
  ['register', '/register/industry'],
  ['rules', '/rules'],
  ['square', '/square'],
  ['square-detail', '/detail/recruit/rec-1'],
  ['live', '/live'],
  ['dashboard', '/dashboard'],
  ['dashboard-team', '/dashboard/team'],
  ['dashboard-settings', '/dashboard/settings'],
  ['admin', '/admin'],
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--disable-gpu', '--hide-scrollbars'],
});

const report = {};
for (const [name, path] of ROUTES) {
  const page = await browser.newPage();
  // 在应用加载前把语言切到 EN
  await page.evaluateOnNewDocument(() => {
    try { localStorage.setItem('doai_lang', 'en'); } catch { /* noop */ }
  });
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`http://localhost:3000${path}`, { waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 900));
  const hits = await page.evaluate(() => {
    const cjk = /[\u4e00-\u9fff]/;
    const seen = new Set();
    const out = [];
    // 只取直接持有文本的元素（叶子文本节点），避免父容器重复计数
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const t = node.textContent.trim();
      if (!t || !cjk.test(t)) continue;
      const el = node.parentElement;
      if (!el) continue;
      const style = getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') continue;
      const key = t.slice(0, 30);
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(t.slice(0, 40));
    }
    return out;
  });
  report[name] = hits;
  await page.close();
}
await browser.close();

let total = 0;
for (const [route, hits] of Object.entries(report)) {
  total += hits.length;
  console.log(`[${route}] ${hits.length} 处中文`);
  hits.slice(0, 6).forEach(h => console.log('   ', h));
}
console.log(`\n总计: ${total} 处中文残留（EN 模式）`);
fs.writeFileSync('/tmp/en_residue.json', JSON.stringify(report, null, 2));
