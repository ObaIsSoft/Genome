import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1440, height: 900 });
  
  console.log("Screenshotting V1...");
  await page.goto('https://firstgenome.vercel.app/', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'website-v2/public/v1.png' });
  
  console.log("Screenshotting V2...");
  await page.goto('https://secondgenome.vercel.app/', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'website-v2/public/v2.png' });

  await browser.close();
  console.log("Done");
})();
