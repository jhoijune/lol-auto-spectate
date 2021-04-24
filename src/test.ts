import {
  sleep,
  startSpectate,
  modifyChannelInfo,
  stopSpectate,
  startStreaming,
  switchLOLScene,
  createData,
  determineGameOver,
  decideGameIntercept,
  isGameRunning,
  searchGame,
  stopStreaming,
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
  let isTitleChanged = false;
  while (true) {
    while (data.spectateRank === Constants.NONE) {
      const rankLimit = data.isStreaming
        ? Constants.OTHERS_RANK
        : Constants.GROUP2_RANK;
      const matchInfo = await searchGame(rankLimit, data.idPriority);
      if (matchInfo === null) {
        if (data.isStreaming) {
          await stopStreaming(data, obs);
        }
        return;
      }
      Object.assign(data, matchInfo);
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
    while (!data.pq.isEmpty()) {
      const [, { playerIndex }] = data.pq.remove();
      if (auxData.selectedIndex === Constants.NONE) {
        auxData.selectedIndex = playerIndex;
      }
    }
    if (!data.isStreaming) {
      await startStreaming(data, obs);
    }
    await switchLOLScene(data, obs);
    if (!isTitleChanged) {
      const streamingTitle = 'Test';
      await modifyChannelInfo(streamingTitle);
      isTitleChanged = true;
    }
    while (data.isSpectating) {
      await sleep(1000);
      await determineGameOver(data, auxData);
      await decideGameIntercept(data);
    }
    if (data.spectateRank === Constants.NONE) {
      await sleep(10 * 1000);
    }
    await obs.send('SetCurrentScene', {
      'scene-name': 'Waiting',
    });
    await sleep(1000);
    stopSpectate(gameProcess);
  }
};
