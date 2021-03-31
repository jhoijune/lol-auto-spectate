import cheerio from 'cheerio';
import axios from 'axios';
import { promises as fs, existsSync } from 'fs';
import { join } from 'path';

import Constants from '../Constants';
import printDate from './printDate';

type TEAM_NAME = keyof typeof Constants.TEAM_ACRONYM;

export default async (correctFileLoc?: string) => {
  const listPath = join(__dirname, '..', '..', 'assets', 'prolist.txt');
  const map = new Map<string, string>();
  let html: string;
  try {
    console.log(`Starting GET ${Constants.PRO_LIST_URL} ${printDate()}`);
    ({ data: html } = await axios.get<string>(Constants.PRO_LIST_URL));
  } catch (error) {
    console.error(JSON.stringify(error));
    console.log("OP.GG Doesn't work");
    if (!existsSync(listPath)) {
      return null;
    }
    const texts = (await fs.readFile(listPath)).toString();
    const entries = texts.split('\n');
    for (const entry of entries) {
      const [nick, name] = entry.split(':');
      map.set(nick.trim(), name.trim());
    }
    return map;
  } finally {
    console.log(
      `GET request finished for: ${Constants.PRO_LIST_URL} ${printDate()}`
    );
  }
  const $ = cheerio.load(html);
  const teams = $('ul.RegisterSummonerList>li');
  teams.each((index, elem) => {
    const lists = $(elem).find('li');
    lists.each((index, elem) => {
      const summonerName = $(elem).find('.SummonerName').text().trim();
      const summonerExtra = $(elem).find('.SummonerExtra').text().trim();
      const teamName = $(elem).find('.SummonerTeam').text().trim();
      let modifiedTeamName: string;
      if (teamName in Constants.TEAM_ACRONYM) {
        modifiedTeamName = Constants.TEAM_ACRONYM[teamName as TEAM_NAME];
      } else {
        modifiedTeamName = teamName.toString().toUpperCase();
      }
      const concat = `${modifiedTeamName} ${summonerExtra}`.trim();
      map.set(summonerName, concat);
    });
  });
  if (correctFileLoc) {
    try {
      const texts = (await fs.readFile(correctFileLoc)).toString();
      const entries = texts.split('\n');
      for (const entry of entries) {
        const [nick, name] = entry.split(':').map((v) => v.trim());
        map.set(nick, name);
      }
    } catch (error) {
      console.error(error);
    }
  }
  // 파일에 정보 저장
  const texts: string[] = [];
  map.forEach((name, nick) => {
    texts.push(`${nick} : ${name}`);
  });
  try {
    fs.writeFile(listPath, texts.join('\n'));
  } catch (error) {
    console.log(error);
  }
  return map;
};
