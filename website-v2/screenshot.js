import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function capture() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });

  console.log('Navigating to Faceoff Vehicles...');
  await page.goto('https://faceoffvehicles.netlify.app/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: join(__dirname, 'public', 'faceoff.png') });
  console.log('Faceoff Vehicles captured.');

  console.log('Navigating to Obafemi Portfolio...');
  await page.goto('https://obafemiadebayo.netlify.app/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: join(__dirname, 'public', 'portfolio.png') });
  console.log('Obafemi Portfolio captured.');

  await browser.close();
  console.log('Done.');
}

capture().catch(console.error);
