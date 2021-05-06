import axios from 'axios';
import cheerio from 'cheerio';
import { join } from 'path';
import { readdir } from 'fs/promises';

import Constants from '../Constants';
import printDate from './printDate';
import updateDB from './updateDB';
import { DB } from '../types';

export default async (db: DB) => {
  // 정상적으로 완료되었을시 true 반환
  const { ASSET_PATH } = process.env;
  const imagePath =
    (ASSET_PATH && join(ASSET_PATH, 'images')) ||
    join(__dirname, '..', '..', 'assets', 'images');
  let fileNames: string[];
  const fileNameMap = new Map<string, string>();
  try {
    fileNames = await readdir(imagePath);
  } catch (error) {
    console.error(JSON.stringify(error));
    return false;
  }
  for (const fileName of fileNames) {
    const [name] = fileName.split(' ');
    fileNameMap.set(name.trim().toLowerCase(), fileName);
  }
  let html: string;
  try {
    console.log(`Starting GET ${Constants.PRO_LIST_URL} ${printDate()}`);
    ({ data: html } = await axios.get<string>(Constants.PRO_LIST_URL));
  } catch (error) {
    console.error(JSON.stringify(error));
    console.log("OP.GG Doesn't work");
    return false;
  } finally {
    console.log(
      `GET request finished for: ${Constants.PRO_LIST_URL} ${printDate()}`
    );
  }
  const $ = cheerio.load(html);
  const teams = $('ul.RegisterSummonerList>li');
  const entries: {
    summonerName: string;
    proName: string;
    teamName: string;
  }[] = [];
  teams.each((index, elem) => {
    const lists = $(elem).find('li');
    lists.each((index, elem) => {
      const summonerName = $(elem).find('.SummonerName').text();
      const proName = $(elem).find('.SummonerExtra').text().trim();
      const teamName = $(elem).find('.SummonerTeam').text().trim();
      entries.push({ summonerName, proName, teamName });
    });
  });
  for (const { summonerName, proName, teamName } of entries) {
    if (!(await updateDB(db, summonerName, proName, teamName, fileNameMap))) {
      console.log('update db failed');
      return false;
    }
  }
  return true;
};
