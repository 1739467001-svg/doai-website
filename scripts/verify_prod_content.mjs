import puppeteer from 'puppeteer-core';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const U = 'https://doai-website-three.vercel.app';
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--disable-gpu'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const check = async (route, mustHave, mustNot) => {
  await page.goto(`${U}${route}`, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 1200));
  const text = await page.evaluate(() => document.body.textContent);
  const have = mustHave.filter(k => text.includes(k));
  const bad = mustNot.filter(k => text.includes(k));
  return { route, have, bad, pass: have.length === mustHave.length && bad.length === 0 };
};
let r;
r = await check('/', ['智汇外滩 · 创享黄浦', '2026 Dobe 外滩 AI 创客大会', '外滩德必园区', '共 3 天', '涂鸦智能', '拓竹科技', '香港高升'],
  ['长宁', '大虹桥', '乐动虹桥', 'Microsoft', 'NVIDIA', 'Intel']);
console.log('首页:', r.pass ? 'PASS' : 'FAIL', JSON.stringify(r));
r = await check('/maker', ['产业命题赛道', '自由创意赛道', '金融科技命题', 'AIGC 宣传视频命题', 'Day 1', 'Day 3', '外滩 After Party', '投资机构', '真格基金'],
  ['8 个节点', '创新能力 30%']);
console.log('赛事中心:', r.pass ? 'PASS' : 'FAIL', JSON.stringify(r));
r = await check('/track/industry', ['产业命题赛道', '金融科技命题', '商贸零售命题', '文旅服务命题', 'AIGC 宣传视频命题', '合作方待官宣'],
  ['AI + 消费', 'AI + 专业服务']);
console.log('赛道详情:', r.pass ? 'PASS' : 'FAIL', JSON.stringify(r));
r = await check('/register/industry', ['产业命题赛道', '更换赛道'], ['申报赛道 *']);
console.log('报名向导只读赛道:', r.pass ? 'PASS' : 'FAIL', JSON.stringify(r));
await browser.close();
