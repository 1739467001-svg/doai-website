/* 文字溢出审计：多视口 × 主要路由，检测元素级文字裁切
 * （scrollWidth/scrollHeight 超出 clientWidth/clientHeight 且内容为文本的元素） */
import puppeteer from 'puppeteer-core';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const VIEWPORTS = [
  { name: 'mobile_375', width: 375, height: 812 },
  { name: 'tablet_768', width: 768, height: 1024 },
  { name: 'laptop_1024x700', width: 1024, height: 700 },
  { name: 'desktop_1440', width: 1440, height: 900 },
  { name: 'wide_1920x800', width: 1920, height: 800 },
];
const ROUTES = [
  'home', 'conference', 'forum', 'attend', 'news', 'maker',
  'track/industry', 'track/creator', 'register', 'rules',
  'square', 'live', 'dashboard', 'dashboard/team', 'dashboard/registrations', 'admin',
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--disable-gpu', '--hide-scrollbars'],
});

let issues = 0;
for (const vp of VIEWPORTS) {
  const page = await browser.newPage();
  await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
  for (const route of ROUTES) {
    await page.goto(`http://localhost:3000/${route === 'home' ? '' : route}`, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });
    await new Promise(r => setTimeout(r, 700));
    const bad = await page.evaluate(() => {
      const out = [];
      document.querySelectorAll('body *').forEach(el => {
        if (!(el instanceof HTMLElement)) return;
        const cls = String(el.className);
        // 忽略故意裁切的装饰/图片容器与弹幕
        if (cls.includes('overflow-hidden') && el.textContent.trim() === '' && el.querySelector('img')) return;
        if (cls.includes('line-clamp')) return;
        const clipX = el.scrollWidth - el.clientWidth;
        const clipY = el.scrollHeight - el.clientHeight;
        const hasText = el.children.length === 0 && el.textContent.trim().length > 0;
        if (!hasText) return;
        if (clipX > 3 || clipY > 3) {
          out.push(`${el.tagName}.${cls.slice(0, 50)} "${el.textContent.trim().slice(0, 24)}" +${clipX}x/+${clipY}y`);
        }
      });
      return out.slice(0, 6);
    });
    if (bad.length) {
      issues += bad.length;
      console.log(`[${vp.name}] /${route}`);
      bad.forEach(b => console.log('   CLIP:', b));
    }
  }
  await page.close();
}
await browser.close();
console.log(issues === 0 ? 'TEXT-OVERFLOW AUDIT: CLEAN' : `TEXT-OVERFLOW AUDIT: ${issues} issues`);
