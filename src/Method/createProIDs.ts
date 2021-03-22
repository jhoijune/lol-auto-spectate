import { LeagueItemDTO, LeagueListDTO } from '../types';
import Constants from '../Constants';
import sleep from './sleep';
import axios from 'axios';
import printDate from './printDate';

export default async (nickMap: Map<string, string>) => {
  const { RIOT_API_KEY } = process.env;
  const IDs: string[] = [];
  const _ = async (url: string) => {
    let entries: LeagueItemDTO[] | null = null;
    while (entries === null) {
      try {
        await sleep(1200);
        console.log(`Starting GET ${url} ${printDate()}`);
        ({
          data: { entries },
        } = await axios.get<LeagueListDTO>(url, {
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
      } finally {
        console.log(`GET request finished for: ${url} ${printDate()}`);
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
