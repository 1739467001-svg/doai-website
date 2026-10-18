import puppeteer from 'puppeteer-core';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--disable-gpu', '--hide-scrollbars'] });
const shots = [['hero', '/'], ['track', '/track/industry'], ['register-step3', '/register/industry'], ['rules', '/rules']];
for (const [name, path] of shots) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`http://localhost:3000${path}`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 900));
  // register 页要走到第 3 步
  if (name === 'register-step3') {
    await page.evaluate(() => {
      const b1 = [...document.querySelectorAll('button')].find(b => b.textContent.includes('下一步：参赛模式'));
      b1?.click();
    });
    await new Promise(r => setTimeout(r, 400));
    await page.evaluate(() => {
      const b2 = [...document.querySelectorAll('button')].find(b => b.textContent.includes('下一步：项目与作品'));
      b2?.click();
    });
    await new Promise(r => setTimeout(r, 600));
  }
  await page.screenshot({ path: `/tmp/final_${name}.png` });
  await page.close();
}
await browser.close();
console.log('done');
