import { sleep } from '.';
import Constants from '../Constants';
import { AuxData, Data } from '../types';
import fixSpectateView from './fixSpectateView';
import getGameTime from './getGameTime';
import orderStopSpectate from './orderStopSpectate';
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
        if (auxData.endReservation) {
          console.log('Wait 10 seconds for normal shutdown');
          await sleep(10 * 1000);
          console.log('Normal Shutdown');
          orderStopSpectate(data);
          data.spectateRank = Constants.NONE;
        } else {
          console.log('The time is the same, so it is scheduled to end');
          auxData.endReservation = true;
        }
      } else if (auxData.exGameTime !== gameTime && gameTime > 0) {
        auxData.endReservation = false;
      }
      auxData.exGameTime = gameTime;
    } else {
      console.log('Detected abnormal termination');
      orderStopSpectate(data);
    }
  }
};
