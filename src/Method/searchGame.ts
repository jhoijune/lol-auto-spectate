import sleep from './sleep';
import { CurrentGameInfo, Data, DB } from '../types';
import Constants from '../Constants';
import axios from 'axios';
import printDate from './printDate';

export default async (data: Data, db: DB, rankLimit: number) => {
  const { RIOT_API_KEY } = process.env;
  for (let rank = 0; rank <= rankLimit && !data.isPaused; rank++) {
    const ids = data.idPriority[rank];
    const size = ids.length;
    let index = 0;
    while (index < size && !data.isPaused) {
      const id = ids[index];
      try {
        await sleep(Constants.RIOT_API_WAIT_TIME);
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
            gameLength,
          },
        } = await axios.get<CurrentGameInfo>(`${Constants.SPECTATE_URL}${id}`, {
          headers: {
            'X-Riot-Token': RIOT_API_KEY,
          },
        });
        if (
          (rank === Constants.FAKER_RANK && participants.length > 1) ||
          (mapId === Constants.SUMMONERS_RIFT_ID &&
            gameQueueConfigId === Constants.SOLO_RANK_ID)
        ) {
          if (gameLength <= 0) {
            if (data.isSpectating) {
              index += 1;
            }
            continue;
          }
          for (const { summonerName, summonerId } of participants) {
            const instance = await db.Summoner.findOne({
              where: {
                summonerId,
              },
            });
            if (instance !== null && instance.name !== summonerName) {
              instance.name = summonerName;
              await instance.save();
            }
          }
          console.log('Match was found');
          return {
            encryptionKey,
            gameId,
            spectateRank: rank,
            peopleCount: participants.length,
          };
        }
      } catch (error) {
        const errorCode = error.response?.data?.status?.status_code;
        if (errorCode === 403) {
          console.log('Renew RIOT API key');
          return null;
        } else if (errorCode === 429) {
          await sleep(Constants.RIOT_API_LIMIT_TIME);
        }
      } finally {
        console.log(
          `GET request finished for: ${
            Constants.SPECTATE_URL
          }${id} ${printDate()}`
        );
      }
      index += 1;
    }
  }
  return {
    encryptionKey: '',
    gameId: Constants.NONE,
    spectateRank: Constants.NONE,
    peopleCount: Constants.NONE,
  };
};
