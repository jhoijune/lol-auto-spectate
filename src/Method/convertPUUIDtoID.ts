import request from './request';

import { SummonerDTO } from '../types';
import Constants from '../Constants';
import sleep from './sleep';

type PRO_NAMES = keyof typeof Constants.PUUID;

export default async (nickMap: Map<string, string>) => {
  const { RIOT_API_KEY } = process.env;
  const puuidToId = new Map<string, string>();
  for (const name in Constants.PUUID) {
    if (!(name in Constants.PUUID)) {
      continue;
    }

    const whosePuuids = Constants.PUUID[name as PRO_NAMES];
    let index = 0;
    while (index < whosePuuids.length) {
      try {
        const puuid = whosePuuids[index];
        const tempUrl = `${Constants.SUMMONER_PUUID_URL}${puuid}`;
        const { data } = await request<SummonerDTO>('get', tempUrl, {
          headers: {
            'X-Riot-Token': RIOT_API_KEY,
          },
        });
        puuidToId.set(puuid, data.id);
        nickMap.set(data.name, name);
        index += 1;
      } catch (error) {
        const errorCode = error.response.data.status.status_code;
        if (errorCode === 403) {
          console.log('Renew RIOT API key');
          return null;
        } else if (errorCode === 429) {
          await sleep(2 * 60 * 1000);
        }
      }
    }
  }
  const idPriority: string[][] = [];
  for (const puuids of Constants.PUUID_PRIORITY) {
    const container: string[] = [];
    for (const puuid of puuids) {
      container.push(puuidToId.get(puuid)!);
    }
    idPriority.push(container);
  }
  return idPriority;
};
