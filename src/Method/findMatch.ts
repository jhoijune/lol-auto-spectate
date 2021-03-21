import sleep from './sleep';
import { CurrentGameInfo } from '../types';
import request from './request';
import Constants from '../Constants';

export default async (rankLimit: number, idPriority: string[][]) => {
  const { RIOT_API_KEY } = process.env;
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
            participants,
          },
        } = await request<CurrentGameInfo>(
          'get',
          `${Constants.SPECTATE_URL}${id}`,
          {
            headers: {
              'X-Riot-Token': RIOT_API_KEY,
            },
          }
        );
        if (
          rank < idPriority.length - 1 ||
          (mapId === Constants.SUMMONERS_RIFT_ID &&
            gameQueueConfigId === Constants.SOLO_RANK_ID)
        ) {
          console.log('Match was found');
          return {
            encryptionKey,
            gameId,
            spectateRank: rank,
            peopleCount: participants.length,
          };
        }
      } catch {
        await sleep(1200);
      }
    }
  }
  return {
    encryptionKey: '',
    gameId: -1,
    spectateRank: -1,
    peopleCount: -1,
  };
};
