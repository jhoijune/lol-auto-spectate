import request from './request';
import { LeagueItemDTO, LeagueListDTO } from '../types';
import Constants from '../Constants';
import sleep from './sleep';

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
        const errorCode = error.response.data.status.status_code;
        if (errorCode === 403) {
          console.log('Renew RIOT API key');
          return false;
        } else if (errorCode === 429) {
          await sleep(2 * 60 * 1000);
        }
      }
    }
    entries.sort(({ leaguePoints: a }, { leaguePoints: b }) => b - a);
    for (const { summonerId, summonerName } of entries) {
      const proNick = nickMap.get(summonerName);
      if (proNick !== undefined && proNick.split(' ').length === 2) {
        IDs.push(summonerId);
      }
    }
    return true;
  };
  for (const URL of Constants.LEAGUE_URLS) {
    try {
      const isNormal = await _(URL);
      if (!isNormal) {
        return null;
      }
    } catch {}
  }
  return IDs;
};
