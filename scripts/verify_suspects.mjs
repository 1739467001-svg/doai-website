/* 定向复验点击机器人报告的可疑死按钮（MutationObserver 级检测） */
import puppeteer from 'puppeteer-core';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--disable-gpu'] });
const sleep = ms => new Promise(r => setTimeout(r, ms));

const cases = [
  // [路由, 按钮文本, 说明]
  ['/attend', '立即报名参会', '应开报名弹窗或跳转'],
  ['/attend', '全程通票', '票种卡交互'],
  ['/attend', '开幕主会场', '日程卡交互'],
  ['/conference', 'Day 1', 'Day 切换'],
  ['/conference', 'Schedule & Mission', '锚点/模块'],
  ['/maker', '双赛道规则指南', 'footer → rules 导航'],
  ['/home', '主办方代表', '评委手风琴'],
  ['/live', 'Notify When Live', '开播提醒'],
  ['/live', '主会场', '切换直播流'],
  ['/rules', '01参赛资格', '赛制手风琴'],
  ['/rules', 'AI 辅助的专业服务', '赛题卡手风琴'],
  ['/rules', '模型训练', '赛题卡手风琴'],
  ['/square', '前端', '角色筛选'],
  ['/square', '深圳', '城市筛选'],
  ['/square-detail', '申请加入', '开申请弹窗'],
  ['/square-detail', '心动', '点赞+1'],
  ['/admin', '大会日程与使命', 'footer → conference 导航'],
  ['/admin', '导出报名数据', 'CSV 下载'],
  ['/news', '赛事', '分类筛选'],
];

for (const [route, text, desc] of cases) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const downloads = [];
  page.on('download', d => downloads.push(d.suggestedFilename()));
  await page.goto(`http://localhost:3000${route}`, { waitUntil: 'networkidle2' });
  await sleep(700);
  const result = await page.evaluate(async ([text]) => {
    // 安装 MutationObserver
    let mutated = 0;
    const mo = new MutationObserver(() => mutated++);
    mo.observe(document.body, { childList: true, subtree: true, attributes: true, characterData: true });
    const url0 = location.pathname;
    const els = [...document.querySelectorAll('button, a')].filter(b => b.textContent.includes(text) && b.getBoundingClientRect().width > 0);
    if (!els.length) return { status: 'NOT-FOUND' };
    els[0].scrollIntoView({ block: 'center' });
    els[0].click();
    await new Promise(r => setTimeout(r, 800));
    mo.disconnect();
    return {
      status: mutated > 0 || location.pathname !== url0 ? 'REACTED' : 'DEAD',
      mutations: mutated,
      urlNow: location.pathname,
      url0,
    };
  }, [text]);
  const label = `${route} :: "${text}" (${desc})`;
  if (result.status === 'DEAD' && !downloads.length) {
    console.log('❌ DEAD ', label);
  } else if (downloads.length) {
    console.log('✅ DOWNLOAD', label, '→', downloads[0]);
  } else if (result.status === 'NOT-FOUND') {
    console.log('⚠️ NOT-FOUND', label);
  } else {
    console.log('✅ OK  ', label, result.mutations !== undefined ? `(${result.mutations} mutations)` : '');
  }
  await page.close();
}
await browser.close();
