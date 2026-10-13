/* 全站点击机器人：模拟选手点遍每个路由的所有可点元素，
 * 检测：JS 报错、点了没反应（无 DOM 变化、无导航、无新窗口）。
 * 输出问题清单 JSON 供修复。 */
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = 'http://localhost:3000';

// 选手会走到的所有路由（含深链）
const ROUTES = [
  { name: 'home', path: '/' },
  { name: 'conference', path: '/conference' },
  { name: 'forum', path: '/forum' },
  { name: 'forum-detail', path: '/detail/forum/f-1' },
  { name: 'attend', path: '/attend' },
  { name: 'news', path: '/news' },
  { name: 'maker', path: '/maker' },
  { name: 'track-industry', path: '/track/industry' },
  { name: 'track-creator', path: '/track/creator' },
  { name: 'register', path: '/register/industry' },
  { name: 'rules', path: '/rules' },
  { name: 'square', path: '/square' },
  { name: 'square-detail', path: '/detail/recruit/rec-1' },
  { name: 'live', path: '/live' },
  { name: 'dashboard', path: '/dashboard' },
  { name: 'dashboard-registrations', path: '/dashboard/registrations' },
  { name: 'dashboard-team', path: '/dashboard/team' },
  { name: 'dashboard-settings', path: '/dashboard/settings' },
  { name: 'admin', path: '/admin' },
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--disable-gpu', '--hide-scrollbars', '--window-size=1440,900'],
});

const issues = [];
const popupUrls = [];

for (const route of ROUTES) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  const jsErrors = [];
  page.on('pageerror', e => jsErrors.push(String(e).slice(0, 160)));
  page.on('popup', p => popupUrls.push(p.url()));

  await page.goto(`${BASE}${route.path}`, { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(900);

  // 枚举所有可见可点元素（按钮 + 站内 a 链接）
  const clickables = await page.evaluate(() => {
    const els = [...document.querySelectorAll('button, a[href]')];
    return els
      .map((el, i) => {
        const r = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        const visible = r.width > 0 && r.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
        const text = (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 30);
        return {
          idx: i,
          tag: el.tagName,
          text,
          visible,
          // 外链（新窗口）单独标记，不算死按钮
          external: el.tagName === 'A' && (el.getAttribute('target') === '_blank' || /^https?:/.test(el.getAttribute('href') || '') && !el.getAttribute('href').startsWith(BASE) && !el.getAttribute('href').startsWith('/')),
        };
      })
      .filter(e => e.visible && !e.external);
  });

  for (const c of clickables) {
    const before = await page.evaluate(() => ({
      url: location.pathname,
      textLen: document.body.textContent.length,
      modalCount: document.querySelectorAll('.fixed.inset-0').length,
    }));
    jsErrors.length = 0;

    let clicked = false;
    try {
      clicked = await page.evaluate(idx => {
        const els = [...document.querySelectorAll('button, a[href]')];
        const el = els[idx];
        if (!el) return false;
        el.scrollIntoView({ block: 'center' });
        el.click();
        return true;
      }, c.idx);
    } catch (e) {
      issues.push({ route: route.name, el: c.text, kind: 'click-threw', detail: String(e).slice(0, 120) });
      continue;
    }
    if (!clicked) continue;

    await sleep(600);

    const after = await page.evaluate(() => ({
      url: location.pathname,
      textLen: document.body.textContent.length,
      modalCount: document.querySelectorAll('.fixed.inset-0').length,
    }));

    const changed =
      after.url !== before.url ||
      Math.abs(after.textLen - before.textLen) > 2 ||
      after.modalCount !== before.modalCount ||
      jsErrors.length > 0;

    if (!changed) {
      issues.push({ route: route.name, el: c.text, kind: 'dead-click', detail: `点击后无任何变化 (url=${after.url})` });
    }
    if (jsErrors.length > 0) {
      issues.push({ route: route.name, el: c.text, kind: 'js-error', detail: jsErrors[0] });
    }

    // 恢复现场：关弹窗 / 回原路由，继续下一轮
    const gone = after.url !== before.url || after.modalCount !== before.modalCount;
    if (gone) {
      await page.evaluate(() => {
        // 关闭可能的弹窗（点 X 或 scrim）
        const closeBtn = [...document.querySelectorAll('button')].find(b => {
          const r = b.getBoundingClientRect();
          return r.width > 0 && b.querySelector('svg') && b.closest('.fixed');
        });
        if (closeBtn) closeBtn.click();
      });
      await sleep(250);
      if ((await page.evaluate(() => location.pathname)) !== route.path) {
        await page.goto(`${BASE}${route.path}`, { waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});
        await sleep(500);
      }
    }
  }

  await page.close();
  console.log(`[${route.name}] ${clickables.length} 个可点元素检查完成`);
}

await browser.close();

fs.writeFileSync('/tmp/click_issues.json', JSON.stringify({ issues, popupUrls }, null, 2));
console.log('\n===== 问题清单 =====');
const dead = issues.filter(i => i.kind === 'dead-click');
const errs = issues.filter(i => i.kind === 'js-error');
const threw = issues.filter(i => i.kind === 'click-threw');
console.log(`死按钮(无反应): ${dead.length} | JS报错: ${errs.length} | 点击抛错: ${threw.length}`);
for (const i of issues) {
  console.log(`  [${i.kind}] ${i.route} :: "${i.el}" :: ${i.detail}`);
}
console.log('\n新窗口打开的外链:', popupUrls.length, '个');
