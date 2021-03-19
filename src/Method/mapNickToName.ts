import cheerio from 'cheerio';

import request from './request';
import teamAcronymRaw from '../../assets/static/TEAM_ACRONYM.json';

export default async () => {
  const map = new Map<string, string>();
  const teamAcronym = teamAcronymRaw as { [key: string]: string };
  let html: string | null = null;
  while (html === null) {
    try {
      ({ data: html } = await request<string>(
        'get',
        'https://op.gg/spectate/list'
      ));
    } catch {}
  }
  const $ = cheerio.load(html);
  const teams = $('ul.RegisterSummonerList>li');
  teams.each((index, elem) => {
    const lists = $(elem).find('li');
    lists.each((index, elem) => {
      const { teamName, summonerName, summonerExtra } = $(elem).data() as {
        [key: string]: string | number;
      };
      let modifiedTeamName: string;
      if (teamName in teamAcronym) {
        modifiedTeamName = teamAcronym[teamName];
      } else {
        modifiedTeamName = teamName.toString().toUpperCase();
      }
      const name = summonerExtra.toString();
      const concat = `${modifiedTeamName} ${name[0].toUpperCase()}${name.slice(
        1
      )}`.trim();
      map.set(summonerName.toString(), concat);
    });
  });
  return map;
};
