import puppeteer from 'puppeteer-core';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--disable-gpu'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 950 });
await page.goto('http://localhost:3000/register/industry', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 800));
const clickText = async t => page.evaluate(txt => {
  const el = [...document.querySelectorAll('button')].find(b => b.textContent.includes(txt));
  if (!el) return false;
  el.click(); return true;
}, t);
await clickText('下一步：参赛模式');
await new Promise(r => setTimeout(r, 400));
await clickText('下一步：项目与作品');
await new Promise(r => setTimeout(r, 400));
const setup = await page.evaluate(() => {
  const forms = [...document.querySelectorAll('form')];
  const describe = f => ({
    cls: (f.className || '').slice(0, 40),
    hasOnSubmit: typeof f.getAttribute('onsubmit'),
    children: f.querySelectorAll('button[type="submit"]').length,
  });
  return { count: forms.length, forms: forms.map(describe) };
});
console.log('forms at step3:', JSON.stringify(setup, null, 1));
// 点提交，统计 submit 事件次数与目标
const out = await page.evaluate(() => new Promise(resolve => {
  sessionStorage.setItem('__log', '[]');
  const log = s => sessionStorage.setItem('__log', JSON.stringify([...JSON.parse(sessionStorage.getItem('__log')), s]));
  let n = 0;
  document.addEventListener('submit', e => {
    n++;
    log(`SUBMIT#${n} target=${(e.target.className || '').toString().slice(0, 30)} prevented=${e.defaultPrevented}`);
    e.preventDefault(); // 全部拦下，阻止导航以便观察
  }, true);
  const btn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('立即提交申报'));
  btn.click();
  setTimeout(() => { log('survived'); resolve('ok'); }, 1000);
}));
console.log(out);
console.log('log:', await page.evaluate(() => sessionStorage.getItem('__log')));
await browser.close();
