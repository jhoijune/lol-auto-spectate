import cheerio from 'cheerio';

import request from './request';
import teamAcronymRaw from '../../static/TEAM_ACRONYM.json';

export default async () => {
  try {
    const teamAcronym = teamAcronymRaw as { [key: string]: string };
    const map = new Map<string, string>();
    const { data: html } = await request<string>(
      'get',
      'https://op.gg/spectate/list'
    );
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
  } catch (err) {
    console.log(err);
  }
};
