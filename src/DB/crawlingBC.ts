import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import { type } from 'os';

import { sleep } from '../Method';
import { DB } from '../types';
import { updateDB } from '../DB';

export default async (db: DB) => {
  const URL = 'https://www.trackingthepros.com/bootcamp';
  const browser = await puppeteer.launch({
    headless: true,
    executablePath:
      type() === 'Darwin'
        ? '/Applications/Chromium.app/Contents/MacOS/Chromium'
        : undefined,
  });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  let html: string;
  try {
    await page.goto(URL);
    await sleep(5 * 1000);
    await page.select('select[name=displayTable_length]', '-1');
    html = await page.content();
  } catch (error) {
    console.error(error);
    return;
  } finally {
    await browser.close();
  }
  const $ = cheerio.load(html);
  const rows = $('table#displayTable tbody tr');
  const entries: {
    summonerName: string;
    proName: string;
    teamName: string;
  }[] = [];
  rows.each((index, row) => {
    const tds = $(row).find('td');
    const teamName = $(tds[1]).text().trim();
    const proName = $(tds[2]).text().trim().slice(6);
    const summonerName = $(tds[3]).text().trim().slice(6);
    entries.push({
      summonerName,
      teamName,
      proName,
    });
  });
  for (const { summonerName, proName, teamName } of entries) {
    await updateDB(db, summonerName, proName, teamName);
  }
};
