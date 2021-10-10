import axios from 'axios';
import cheerio from 'cheerio';

import { printDate } from '../Method';
import updateDB from './updateDB';
import { DB } from '../types';

const URL = 'https://euw.op.gg/spectate/list';
// KR:const URL = 'https://op.gg/spectate/list';

export default async (db: DB) => {
  // 정상적으로 완료되었을시 true 반환
  let html: string;
  try {
    console.log(`Starting GET ${URL} ${printDate()}`);
    ({ data: html } = await axios.get<string>(URL, {
      timeout: 5000,
    }));
  } catch (error) {
    console.error(JSON.stringify(error));
    console.log("OP.GG Doesn't work");
    return false;
  } finally {
    console.log(`GET request finished for: ${URL} ${printDate()}`);
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
      if (!/^\d+del$/.test(summonerName)) {
        entries.push({ summonerName, proName, teamName });
      }
    });
  });
  for (const { summonerName, proName, teamName } of entries) {
    if (!(await updateDB(db, summonerName, proName, teamName))) {
      console.log('update db failed');
      return false;
    }
  }
  return true;
};
