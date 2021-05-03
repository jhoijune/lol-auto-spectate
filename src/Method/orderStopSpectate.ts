import Constants from '../Constants';
import { Data } from '../types';

export default (data: Data) => {
  data.isSpectating = false;
  if (data.spectateRank === Constants.FAKER_RANK) {
    data.lastHighRankSpectateTime = new Date().valueOf();
  }
  data.lastSpectateTime = new Date().valueOf();
  data.exSpectateRank = data.spectateRank;
};
