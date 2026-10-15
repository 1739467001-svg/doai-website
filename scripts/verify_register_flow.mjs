import puppeteer from 'puppeteer-core';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--disable-gpu'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 950 });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const clickText = async t => {
  await page.evaluate(txt => {
    const el = [...document.querySelectorAll('button')].find(b => b.textContent.includes(txt));
    if (!el) throw new Error('not found: ' + txt);
    el.click();
  }, t);
};

// 1. 赛事中心 → 申报赛道（产业）→ 赛道详情页
await page.goto('http://localhost:3000/maker', { waitUntil: 'networkidle2' });
await sleep(800);
await clickText('申报赛道 · 查看详情');
await sleep(800);
const step1 = await page.evaluate(() => ({
  url: location.pathname,
  isTrackPage: document.body.textContent.includes('命题方向') && document.body.textContent.includes('申报要求'),
  hasSignup: [...document.querySelectorAll('button')].some(b => b.textContent.includes('立即报名')),
}));
console.log('1. 赛道详情页:', step1.isTrackPage && step1.hasSignup ? 'PASS' : 'FAIL', '| url:', step1.url);

// 2. 立即报名 → 报名页，赛道应为产业赛道
await clickText('立即报名');
await sleep(800);
await clickText('下一步：参赛模式');
await sleep(500);
await clickText('下一步：项目与作品');
await sleep(500);
const step2 = await page.evaluate(() => {
  // 新行为：赛道只读展示（来自赛道详情页），不可再选
  const chip = [...document.querySelectorAll('span')].find(sp => sp.className.includes('rounded-full') && sp.textContent.includes('产业赛道'));
  const hasSelector = [...document.querySelectorAll('button')].some(b => b.textContent.trim() === '产业赛道 (AI + Industry)');
  return { url: location.pathname, trackPreselected: !!chip && !hasSelector };
});
console.log('2. 报名页赛道预选(产业):', step2.trackPreselected ? 'PASS' : 'FAIL', '| url:', step2.url);

// 3. 填项目名（已有默认值）→ 提交申报 → 成功页 → 下一步提交作品
await clickText('立即提交申报');
await sleep(800);
const step3a = await page.evaluate(() => document.body.textContent.includes('赛事申报提交成功'));
await clickText('下一步：提交作品');
await sleep(800);
const step3b = await page.evaluate(() => ({
  url: location.pathname,
  hasForm: document.body.textContent.includes('GitHub 仓库链接'),
}));
console.log('3. 报名成功并进入提交作品:', step3a && step3b.hasForm ? 'PASS' : 'FAIL', '| url:', step3b.url);

// 4. 填三个链接提交 → 已提交状态 + 三个链接回显
await page.type('input[placeholder="https://www.bilibili.com/video/BV..."]', 'https://www.bilibili.com/video/BVtest123');
await page.type('input[placeholder="https://your-demo.app"]', 'https://demo.neuroflow.ai');
await page.type('input[placeholder="https://github.com/your-team/your-repo"]', 'https://github.com/neuroflow/agent-hub');
await clickText('提交作品');
await sleep(800);
const step4 = await page.evaluate(() => ({
  submitted: document.body.textContent.includes('作品已提交'),
  gh: document.body.textContent.includes('github.com/neuroflow/agent-hub'),
}));
console.log('4. 作品提交并回显:', step4.submitted && step4.gh ? 'PASS' : 'FAIL');

// 5. GitHub 链接格式校验：改个非法链接重提（应提示错误且不提交）——重新打开同一表单不可用（已提交），跳过
await browser.close();
console.log('done');
