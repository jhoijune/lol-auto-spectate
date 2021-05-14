import OBSWebSocket from 'obs-websocket-js';
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
  injectChatCommand,
  injectKeypressEvent,
  COMMAND_SAFE_SECTION,
  checkStreaming,
  stopStreaming,
  decideStopStreaming,
} from './Method';
import { updateDBRegulary, updateDBEntirely, updateImageNames } from './DB';
import Constants from './Constants';

import { AuxData, Config, DB } from './types';

//import './Method/logError';

export default async (config: Config, obs: OBSWebSocket, db: DB) => {
  const data = await createData(config, obs, db);
  if (data === null) {
    return;
  }
  if (!(await updateImageNames(db))) {
    return;
  }
  await updateDBEntirely(db);
  injectKeypressEvent(data);
  injectChatCommand(data, obs);
  while (true) {
    await COMMAND_SAFE_SECTION(data, async () => {
      while (data.spectateRank === Constants.NONE) {
        if (!data.isPaused) {
          let lastFakerStreamingTime: number = Constants.NONE;
          while (await checkStreaming('faker')) {
            if (data.isStreaming) {
              await stopStreaming(data, obs);
            }
            lastFakerStreamingTime = new Date().valueOf();
            await updateDBRegulary(data, db);
          }
          while (
            lastFakerStreamingTime !== Constants.NONE &&
            new Date().valueOf() - lastFakerStreamingTime < 10 * 60 * 1000
          ) {
            await updateDBRegulary(data, db);
          }
          await decidePlayGame(data, obs);
          if (data.spectateRank === Constants.NONE && !data.isStreaming) {
            await updateDBRegulary(data, db);
          }
        } else {
          await sleep(10 * 1000);
        }
      }
    });
    if (!data.isPermitted) {
      data.isPermitted = await getPermission();
      if (!data.isPermitted) {
        return;
      }
    }
    const gameProcess = startSpectate(data);
    data.gameProcess = gameProcess; // command용
    if (!(await isGameRunning(data, db, gameProcess))) {
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
    await COMMAND_SAFE_SECTION(data, async () => {
      while (data.isSpectating) {
        await sleep(1000);
        await determineGameOver(data, auxData);
        await decideGameIntercept(data);
        await decideStopGameAndStreaming(data, obs);
      }
    });
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
