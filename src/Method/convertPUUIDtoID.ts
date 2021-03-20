import request from './request';
import PUUID from '../../assets/static/PUUID.json';
import PUUID_PRIORITY from '../../assets/static/PUUID_PRIORITY.json';
import { SummonerDTO } from '../types';
import Constants from '../Constants';

export default async (nickMap: Map<string, string>) => {
  const { RIOT_API_KEY } = process.env;
  const puuids = PUUID as { [key: string]: string[] };
  const puuidToId = new Map<string, string>();
  for (const name in puuids) {
    if (!(name in puuids)) {
      continue;
    }
    const whosePuuids = puuids[name];
    let index = 0;
    while (index < whosePuuids.length) {
      try {
        const puuid = puuids[name][index];
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
        console.log(error);
      }
    }
  }
  const idPriority: string[][] = [];
  const puuidPriority = PUUID_PRIORITY as string[][];
  for (const puuids of puuidPriority) {
    const container: string[] = [];
    for (const puuid of puuids) {
      container.push(puuidToId.get(puuid)!);
    }
    idPriority.push(container);
  }
  return idPriority;
};
