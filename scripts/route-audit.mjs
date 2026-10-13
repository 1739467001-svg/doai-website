/* Overflow audit across all main routes at mobile/tablet/desktop widths. */
import puppeteer from 'puppeteer-core';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = 'http://localhost:3000/';
const ROUTES = [
  'home', 'conference', 'forum', 'attend', 'news', 'maker', 'register',
  'rules', 'square/recruit', 'square/talent', 'live', 'dashboard',
];
const WIDTHS = [375, 768, 1440];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--disable-gpu', '--hide-scrollbars'],
});

for (const width of WIDTHS) {
  const page = await browser.newPage();
  await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
  for (const route of ROUTES) {
    // The site is a hash-less SPA driven by state; a fresh load lands on home.
    // Navigate in-page via the router's exposed API when available, else just
    // audit the home page once per width for non-home routes.
    await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.evaluate(route => {
      // RouterView reads activeRoute from AppContext (persisted); driving the
      // UI directly: use the exposed hook if present, else skip.
      window.__doai_test_route = route;
    }, route);
    // Try to set the route through the app's own state when possible.
    const changed = await page.evaluate(async route => {
      // AppContext persists activeRoute in localStorage in some builds; poke
      // the history state and dispatch a re-render via a nav click fallback.
      const map = {
        conference: '大会介绍', forum: '分论坛', attend: '大会报名', news: '活动动态',
        maker: '赛事中心', register: '赛事报名', rules: '赛题与赛制',
        'square/recruit': '组队广场', 'square/talent': '人才市场',
        live: '直播中心', dashboard: '我的 DOAI',
      };
      const label = map[route];
      if (!label) return false;
      const candidates = [...document.querySelectorAll('nav button, nav a')];
      const target = candidates.find(el => el.textContent.trim() === label || el.textContent.trim().startsWith(label));
      if (target) {
        target.click();
        await new Promise(r => setTimeout(r, 700));
        return true;
      }
      return false;
    }, route);

    await new Promise(r => setTimeout(r, 600));
    const audit = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const bad = [];
      document.querySelectorAll('body *').forEach(el => {
        const r = el.getBoundingClientRect();
        const cls = String(el.className);
        // Ignore decorative absolutely-positioned glows inside overflow-hidden heroes.
        if (cls.includes('rounded-full') && cls.includes('pointer-events-none')) return;
        if (r.width > 0 && (r.right > vw + 1 || r.left < -1)) {
          bad.push(`${el.tagName}.${cls.slice(0, 70)} L${Math.round(r.left)} R${Math.round(r.right)}`);
        }
      });
      return { vw, scrollW: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth), bad: bad.slice(0, 6) };
    });
    const flag = audit.scrollW > audit.vw ? '  <<< H-OVERFLOW' : '';
    console.log(`[${width}] ${changed ? route : '(home)'} scrollW=${audit.scrollW}/${audit.vw}${flag}`);
    audit.bad.forEach(b => console.log(`   OVERFLOW:`, b));
  }
  await page.close();
}

await browser.close();
console.log('audit done');
