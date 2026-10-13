import puppeteer from 'puppeteer-core';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--disable-gpu'] });
const sleep = ms => new Promise(r => setTimeout(r, ms));

// 1) 心动点赞
let page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3000/detail/recruit/rec-1', { waitUntil: 'networkidle2' });
await sleep(1000);
const like = await page.evaluate(async () => {
  let mutated = 0;
  const mo = new MutationObserver(() => mutated++);
  mo.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true });
  const btn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('心动'));
  btn.scrollIntoView({ block: 'center' });
  const before = btn.textContent.trim();
  btn.click();
  await new Promise(r => setTimeout(r, 700));
  mo.disconnect();
  return { before, after: btn.textContent.trim(), mutated };
});
console.log((like.before !== like.after || like.mutated > 0) ? '✅' : '❌', '心动点赞:', JSON.stringify(like));
await page.close();

// 2) 申请加入 → 开弹窗 → 填写 → 提交
page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3000/detail/recruit/rec-1', { waitUntil: 'networkidle2' });
await sleep(1000);
const flow = await page.evaluate(async () => {
  const results = {};
  const btn = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === '申请加入');
  btn.scrollIntoView({ block: 'center' });
  btn.click();
  await new Promise(r => setTimeout(r, 600));
  results.modalOpened = !!document.querySelector('.fixed.inset-0, [class*="fixed inset-0"]');
  // 填留言并提交
  const ta = document.querySelector('.fixed textarea, [class*="fixed"] textarea');
  if (ta) {
    const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
    setter.call(ta, '自动化测试申请');
    ta.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise(r => setTimeout(r, 200));
    const submit = [...document.querySelectorAll('.fixed button')].find(b => b.textContent.includes('发送申请') || b.textContent.includes('提交'));
    if (submit) { submit.click(); results.submitted = true; }
    await new Promise(r => setTimeout(r, 900));
    results.successShown = document.body.textContent.includes('申请已提交') || document.body.textContent.includes('已发送');
  }
  return results;
});
console.log(flow.modalOpened && flow.submitted && flow.successShown ? '✅' : '❌', '申请加入全流程:', JSON.stringify(flow));
await browser.close();
