import sleep from './sleep';
import { CurrentGameInfo } from '../types';
import Constants from '../Constants';
import axios from 'axios';
import printDate from './printDate';

export default async (rankLimit: number, idPriority: string[][]) => {
  const { RIOT_API_KEY } = process.env;
  for (let rank = 0; rank < rankLimit; rank++) {
    const ids = idPriority[rank];
    for (const id of ids) {
      try {
        console.log(
          `Starting GET ${Constants.SPECTATE_URL}${id} ${printDate()}`
        );
        const {
          data: {
            observers: { encryptionKey },
            gameId,
            mapId,
            gameQueueConfigId,
            participants,
          },
        } = await axios.get<CurrentGameInfo>(`${Constants.SPECTATE_URL}${id}`, {
          headers: {
            'X-Riot-Token': RIOT_API_KEY,
          },
        });
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
      } catch (error) {
        const errorCode = error.response.data.status.status_code;
        // 404 match was not found
        if (errorCode === 403) {
          console.log('Renew RIOT API key');
          return null;
        } else if (errorCode === 429) {
          await sleep(2 * 60 * 1000);
        } else {
          await sleep(1200);
        }
      } finally {
        console.log(
          `GET request finished for: ${
            Constants.SPECTATE_URL
          }${id} ${printDate()}`
        );
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
