import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import { sleep } from '.';
import { DB } from '../types';
import { updateDB } from '../DB';
import { type } from 'os';

const exceptionList = ['Creme', 'irma', 'Xiaoxu', 'neny', 'shiye', 'S1xu'];

export default async (db: DB) => {
  const URL = 'https://www.scoregg.com/big-data/ranking';
  const exceptionSet = new Set(exceptionList);
  const browser = await puppeteer.launch({
    headless: true,
    executablePath:
      type() === 'Darwin'
        ? '/Applications/Chromium.app/Contents/MacOS/Chromium'
        : undefined,
  });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  try {
    await page.goto(URL);
    await sleep(5 * 1000);
  } catch (error) {
    console.error(error);
    return;
  }
  for (let count = 0; count < 150; count++) {
    try {
      await page.click('div.more-page');
      await sleep(1000);
    } catch (error) {
      console.error(error);
      return;
    }
  }
  const html = await page.content();
  await browser.close();
  const $ = cheerio.load(html);
  const rows = $('div.tables tbody tr');
  const entries: { summonerName: string; proName: string }[] = [];
  rows.each((index, row) => {
    const tds = $(row).find('td');
    const proName = $(tds[4]).text().trim();
    if (proName.length !== 0 && !exceptionSet.has(proName)) {
      const summonerName = $(tds[1]).text().trim();
      entries.push({ summonerName, proName });
    }
  });
  for (const { summonerName, proName } of entries) {
    await updateDB(db, summonerName, proName);
  }
};
