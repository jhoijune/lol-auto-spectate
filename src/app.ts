import {
  sleep,
  startSpectate,
  modifyChannelInfo,
  stopSpectate,
  startStreaming,
  switchLOLScene,
  createData,
  determineGameOver,
  makeStreamingTitle,
  decideGameIntercept,
  decidePlayGame,
  decideStopGameAndStreaming,
  isGameRunning,
  getPermission,
} from './Method';
import Constants from './Constants';

import { AuxData, Config } from './types';

//import './Method/logError';

export default async (config: Config) => {
  const temp = await createData(config);
  if (temp === null) {
    return;
  }
  const { data, obs } = temp;
  while (true) {
    while (data.spectateRank === Constants.NONE) {
      await decidePlayGame(data, obs);
    }
    if (!data.isPermitted) {
      data.isPermitted = await getPermission();
      if (!data.isPermitted) {
        return;
      }
    }
    const gameProcess = startSpectate(data.encryptionKey, data.gameId);
    if (!(await isGameRunning(data, gameProcess))) {
      continue;
    }
    const auxData: AuxData = {
      selectedIndex: Constants.NONE,
      exGameTime: Constants.NONE,
      fixCount: 0,
    };
    const streamingTitle = makeStreamingTitle(data, auxData);
    if (!data.isStreaming) {
      await startStreaming(data, obs);
    }
    await switchLOLScene(data, obs);
    await modifyChannelInfo(streamingTitle);
    console.log(streamingTitle);
    while (data.isSpectating) {
      await sleep(1000);
      await determineGameOver(data, auxData);
      await decideGameIntercept(data);
      await decideStopGameAndStreaming(data, obs);
    }
    if (data.spectateRank === Constants.NONE) {
      await sleep(10 * 1000);
    }
    await obs.send('SetCurrentScene', {
      'scene-name': 'Waiting',
    });
    await sleep(1000);
    stopSpectate(gameProcess);
    if (data.spectateRank === Constants.NONE && data.isStreaming) {
      await modifyChannelInfo('Waiting to spectate');
    }
  }
};
