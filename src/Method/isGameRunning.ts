import { ChildProcessWithoutNullStreams } from 'child_process';

import Constants from '../Constants';
import { Data } from '../types';
import getGameInfo from './getGameInfo';
import makeOverlay from './makeOverlay';
import stopSpectate from './stopSpectate';

export default async (
  data: Data,
  gameProcess: ChildProcessWithoutNullStreams
) => {
  const startTime = new Date().valueOf();
  let overlayInfos: { index: number; name: string; imgSrc?: string }[];
  while (
    !data.isSpectating &&
    new Date().valueOf() - startTime < data.gameWaitLimit
  ) {
    const info = await getGameInfo(data);
    if (info === null) {
      break;
    } else {
      overlayInfos = info;
    }
  }
  if (!data.isSpectating) {
    data.exSpectateRank = data.spectateRank;
    data.spectateRank = Constants.NONE;
    stopSpectate(gameProcess);
    return false;
  }
  await makeOverlay(overlayInfos!, data);
  return true;
};
