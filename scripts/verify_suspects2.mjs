import puppeteer from 'puppeteer-core';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--disable-gpu'] });
const sleep = ms => new Promise(r => setTimeout(r, ms));

const cases = [
  // [路由, 精确匹配文本（全匹配按钮）, 说明]
  ['/attend', null, 'CTA 锚点滚动'], // 特殊：点 立即报名参会 看 hash + scroll
  ['/attend', '公众开放日', '切换未选中票种'],
  ['/attend', 'After Party 创客社交之夜', '勾选场次席位'],
  ['/conference', 'Day 2 · 11/15 赛果绽放', '切到 Day 2'],
  ['/live', '分会场 A · Agent 架构', '切换直播流'],
  ['/live', '全球连线', '切海外流'],
];

for (const [route, text, desc] of cases) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`http://localhost:3000${route}`, { waitUntil: 'networkidle2' });
  await sleep(700);
  if (text === null) {
    // 锚点用例
    const r = await page.evaluate(async () => {
      const y0 = window.scrollY;
      const a = [...document.querySelectorAll('a')].find(x => x.textContent.includes('立即报名参会'));
      a.scrollIntoView({ block: 'center' });
      await new Promise(r2 => setTimeout(r2, 200));
      window.scrollTo(0, 0);
      await new Promise(r2 => setTimeout(r2, 100));
      a.click();
      await new Promise(r2 => setTimeout(r2, 900));
      return { hash: location.hash, scrolled: window.scrollY > 100, y0 };
    });
    console.log(r.scrolled || r.hash ? '✅' : '❌', `/attend :: 立即报名参会 锚点 (${desc})`, JSON.stringify(r));
  } else {
    const r = await page.evaluate(async (text) => {
      let mutated = 0;
      const mo = new MutationObserver(() => mutated++);
      mo.observe(document.body, { childList: true, subtree: true, attributes: true, characterData: true });
      const els = [...document.querySelectorAll('button')].filter(b => b.textContent.trim().startsWith(text) && b.getBoundingClientRect().width > 0);
      if (!els.length) return { status: 'NOT-FOUND' };
      els[0].scrollIntoView({ block: 'center' });
      els[0].click();
      await new Promise(r2 => setTimeout(r2, 700));
      mo.disconnect();
      return { status: mutated > 0 ? 'REACTED' : 'DEAD', mutations: mutated };
    }, text);
    console.log(r.status === 'REACTED' ? '✅' : r.status === 'NOT-FOUND' ? '⚠️' : '❌', `${route} :: "${text}" (${desc})`, r.mutations !== undefined ? `(${r.mutations})` : '');
  }
  await page.close();
}
await browser.close();
