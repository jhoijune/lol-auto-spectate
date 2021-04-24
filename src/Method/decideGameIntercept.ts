import Constants from '../Constants';
import { Data } from '../types';
import searchGame from './searchGame';

export default async (data: Data) => {
  // 랭크가 낮으면 높은거 있는지 확인
  if (data.isSpectating) {
    const matchInfo = await searchGame(data.spectateRank - 1, data.idPriority);
    if (
      matchInfo !== null &&
      matchInfo.spectateRank !== Constants.NONE &&
      matchInfo.spectateRank < data.spectateRank
    ) {
      if (matchInfo.gameId === data.gameId) {
        Object.assign(data, matchInfo);
      } else {
        data.exSpectateRank = data.spectateRank;
        Object.assign(data, matchInfo, {
          isSpectating: false,
          lastSpectateTime: new Date().valueOf(),
        });
      }
    }
  }
};
