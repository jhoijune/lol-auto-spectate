import Constants from '../Constants';
import { AuxData, Data } from '../types';
import fixSpectateView from './fixSpectateView';
import getGameTime from './getGameTime';
import setUpSpectateIngameInitialSetting from './setUpSpectateIngameInitialSetting';

export default async (data: Data, auxData: AuxData) => {
  if (data.isSpectating) {
    const gameTime = await getGameTime(data.httpsAgent);
    if (gameTime !== Constants.NONE) {
      if (gameTime > 20 && auxData.fixCount === 0) {
        setUpSpectateIngameInitialSetting(auxData.selectedIndex);
        auxData.fixCount += 1;
      } else if (auxData.fixCount > 0 && auxData.fixCount <= 3) {
        fixSpectateView(auxData.selectedIndex);
        auxData.fixCount += 1;
      }
      if (auxData.exGameTime === gameTime && gameTime > 0) {
        // 게임 종료
        data.isSpectating = false;
        if (data.spectateRank === Constants.FAKER_RANK) {
          data.lastHighRankSpectateTime = new Date().valueOf();
        }
        data.lastSpectateTime = new Date().valueOf();
        data.exSpectateRank = data.spectateRank;
        data.spectateRank = Constants.NONE;
      }
      auxData.exGameTime = gameTime;
    } else {
      console.log('Detected abnormal termination');
      data.isSpectating = false;
      if (data.spectateRank === Constants.FAKER_RANK) {
        data.lastHighRankSpectateTime = new Date().valueOf();
      }
      data.lastSpectateTime = new Date().valueOf();
      data.exSpectateRank = data.spectateRank;
    }
  }
};
