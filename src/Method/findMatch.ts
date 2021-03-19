import sleep from './sleep';
import { CurrentGameInfo } from '../types';
import request from './request';

const SPECTATE_URL =
  'https://kr.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/';

const { RIOT_API_KEY } = process.env;

const SUMMONERS_RIFT_ID = 11;
const SOLO_RANK_ID = 420;

export default async (rankLimit: number, idPriority: string[][]) => {
  for (let rank = 0; rank < rankLimit; rank++) {
    const ids = idPriority[rank];
    for (const id of ids) {
      try {
        const {
          data: {
            observers: { encryptionKey },
            gameId,
            mapId,
            gameQueueConfigId,
          },
        } = await request<CurrentGameInfo>('get', `${SPECTATE_URL}${id}`, {
          'X-Riot-Token': RIOT_API_KEY,
        });
        if (
          rank < 3 ||
          (mapId === SUMMONERS_RIFT_ID && gameQueueConfigId === SOLO_RANK_ID)
        ) {
          console.log('Match was found');
          return {
            encryptionKey,
            gameId,
            spectateRank: rank,
          };
        }
      } catch {
        await sleep(1200);
      }
    }
  }
  return {
    encryptionKey: '',
    gameId: 0,
    spectateRank: -1,
  };
};
