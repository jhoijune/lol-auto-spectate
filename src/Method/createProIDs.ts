import { request } from '.';
import { LeagueItemDTO, LeagueListDTO } from '../types';

const CHALLENGER_LEAGUE_URL =
  'https://kr.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5';
const GRANDMASTER_LEAGUE_URL =
  'https://kr.api.riotgames.com/lol/league/v4/grandmasterleagues/by-queue/RANKED_SOLO_5x5';
const MASTER_LEAGUE_URL =
  'https://kr.api.riotgames.com/lol/league/v4/masterleagues/by-queue/RANKED_SOLO_5x5';

const { RIOT_API_KEY } = process.env;

export default async (nickMap: Map<string, string>) => {
  const IDs: string[] = [];
  const _ = async (url: string) => {
    let entries: LeagueItemDTO[] | null = null;
    while (entries === null) {
      try {
        ({
          data: { entries },
        } = await request<LeagueListDTO>('get', url, {
          'X-Riot-Token': RIOT_API_KEY,
        }));
      } catch {}
    }
    entries.sort(({ leaguePoints: a }, { leaguePoints: b }) => b - a);
    for (const { summonerId, summonerName } of entries) {
      const proNick = nickMap.get(summonerName);
      if (proNick !== undefined && proNick.split(' ').length === 2) {
        IDs.push(summonerId);
      }
    }
  };
  _(CHALLENGER_LEAGUE_URL);
  _(GRANDMASTER_LEAGUE_URL);
  _(MASTER_LEAGUE_URL);
  return IDs;
};
