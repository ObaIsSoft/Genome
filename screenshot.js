import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1440, height: 900 });
  
  console.log("Screenshotting Permutations...");
  await page.goto('https://permutationsonly.vercel.app/', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'website-v2/public/permutations.png' });
  await page.screenshot({ path: 'website/assets/permutations.png' });
  
  await browser.close();
  console.log("Done");
})();
