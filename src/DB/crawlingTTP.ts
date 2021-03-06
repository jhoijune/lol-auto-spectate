import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import axios from 'axios';
import { type } from 'os';

import { sleep, printDate } from '../Method';
import { updateDB } from '../DB';

import type { DB } from '../types';

export default async (db: DB) => {
  const startUrl = 'https://www.trackingthepros.com/players/';
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
    await page.goto(startUrl);
    await sleep(5 * 1000);
    await page.select('select[name=displayTable_length]', '-1');
    html = await page.content();
  } catch (error: any) {
    console.error(error);
    return;
  } finally {
    await browser.close();
  }
  const $ = cheerio.load(html);
  const rows = $('#displayTable tbody tr');
  const tierSet = new Set(['Challenger', 'Grandmaster', 'Master', 'Diamond']);
  const urls: string[] = [];
  rows.each((index, row) => {
    const extendedTier = $(row).find('.sorting_1').text();
    const [tier] = extendedTier.split(' ');
    if (tierSet.has(tier)) {
      const anchor = $(row).find('a:nth-child(2)');
      const url = anchor.attr('href');
      if (typeof url === 'string') {
        urls.push(url);
      }
    }
  });
  for (const url of urls) {
    let html: string;
    try {
      console.log(`Starting GET ${url} ${printDate()}`);
      ({ data: html } = await axios.get<string>(url));
    } catch (error: any) {
      console.error(JSON.stringify(error));
      console.log("site dooesn't work");
      continue;
    } finally {
      console.log(`GET request finished for: ${url} ${printDate()}`);
    }
    const $ = cheerio.load(html);
    const nameAndTeam = $('section.content-header h1').text().trim();
    let teamName = $('section.content-header h1 a').text().trim();
    let proName: string;
    if (teamName === '') {
      teamName = 'Progamer';
      proName = nameAndTeam;
    } else {
      const index = nameAndTeam.indexOf(teamName);
      proName = nameAndTeam.slice(0, index).trim();
    }
    const infoBox = $('.player-info-inner');
    const rows = $(infoBox[infoBox.length - 2]).find('tr');
    const entries: {
      summonerName: string;
      proName: string;
      teamName: string;
    }[] = [];
    rows.each((index, row) => {
      if (
        typeof $(row).attr('class') === 'undefined' &&
        typeof $(row).attr('id') === 'undefined'
      ) {
        const regionAndNick = $(row).find('td:nth-child(1)').text().trim();
        const index = regionAndNick.indexOf(' ');
        const [region, summonerName] = [
          regionAndNick.slice(0, index),
          regionAndNick.slice(index + 1),
        ];
        if (region === '[KR]' && !/^\d+del$/.test(summonerName)) {
          entries.push({ summonerName, proName, teamName });
        }
      }
    });
    for (const { summonerName, proName, teamName } of entries) {
      if (!(await updateDB(db, summonerName, proName, teamName))) {
        console.log('update db failed');
        return;
      }
    }
  }
};
