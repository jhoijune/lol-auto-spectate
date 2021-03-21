import cheerio from 'cheerio';

import request from './request';
import Constants from '../Constants';

type TEAM_NAME = keyof typeof Constants.TEAM_ACRONYM;

export default async () => {
  const map = new Map<string, string>();
  let html: string | null = null;
  while (html === null) {
    try {
      ({ data: html } = await request<string>(
        'get',
        'https://op.gg/spectate/list'
      ));
    } catch (error) {
      console.log(error);
    }
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
  return map;
};
