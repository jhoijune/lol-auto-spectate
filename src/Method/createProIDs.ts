import request from './request';
import { LeagueItemDTO, LeagueListDTO } from '../types';
import Constants from '../Constants';

export default async (nickMap: Map<string, string>) => {
  const { RIOT_API_KEY } = process.env;
  const IDs: string[] = [];
  const _ = async (url: string) => {
    let entries: LeagueItemDTO[] | null = null;
    while (entries === null) {
      try {
        ({
          data: { entries },
        } = await request<LeagueListDTO>('get', url, {
          headers: {
            'X-Riot-Token': RIOT_API_KEY,
          },
        }));
      } catch (error) {
        console.log(error);
      }
    }
    entries.sort(({ leaguePoints: a }, { leaguePoints: b }) => b - a);
    for (const { summonerId, summonerName } of entries) {
      const proNick = nickMap.get(summonerName);
      if (proNick !== undefined && proNick.split(' ').length === 2) {
        IDs.push(summonerId);
      }
    }
  };
  for (const URL of Constants.LEAGUE_URLS) {
    _(URL);
  }
  return IDs;
};
