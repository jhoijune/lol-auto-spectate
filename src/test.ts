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
  decideGameIntercept,
  isGameRunning,
  searchGame,
  stopStreaming,
  injectChatCommand,
  injectKeypressEvent,
  makeStreamingTitle,
} from './Method';
import { updateDBRegulary, updateDBEntirely, updateImageNames } from './DB';
import COMMAND_SAFE_SECTION from './Method/COMMAND_SAFE_SECTION';
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
  if (!(await updateDBEntirely(db))) {
    return;
  }
  injectKeypressEvent(data);
  injectChatCommand(data, obs);
  let isTitleChanged = false;
  while (true) {
    await COMMAND_SAFE_SECTION(data, async () => {
      while (data.spectateRank === Constants.NONE) {
        if (!data.isPaused) {
          /*
          const rankLimit = data.isStreaming
            ? Constants.OTHERS_RANK
            : Constants.GROUP2_RANK;
            */
          const rankLimit = Constants.OTHERS_RANK;
          const matchInfo = await searchGame(data, rankLimit);
          if (matchInfo === null) {
            if (data.isStreaming) {
              await stopStreaming(data, obs);
            }
            return;
          }
          Object.assign(data, matchInfo);
          if (data.isPaused) {
            // command 보정용
            data.spectateRank = Constants.NONE;
          }
          if (data.spectateRank === Constants.NONE && !data.isStreaming) {
            await updateDBRegulary(data, db);
          }
        } else {
          await sleep(10 * 1000);
        }
      }
    });
    const gameProcess = startSpectate(data);
    data.gameProcess = gameProcess;
    if (!(await isGameRunning(data, db, gameProcess))) {
      continue;
    }
    const auxData: AuxData = {
      selectedIndex: Constants.NONE,
      exGameTime: Constants.NONE,
      fixCount: 0,
    };
    const streamingTitle = makeStreamingTitle(data, auxData);

    /*
    if (!data.isStreaming) {
      await startStreaming(data, obs);
    }
    */
    await switchLOLScene(data, obs);
    /*
    if (!isTitleChanged) {
      const streamingTitle = 'Test';
      await modifyChannelInfo(streamingTitle);
      isTitleChanged = true;
    }
    */
    console.log(streamingTitle);
    await COMMAND_SAFE_SECTION(data, async () => {
      while (data.isSpectating) {
        await sleep(1000);
        await determineGameOver(data, auxData);
        await decideGameIntercept(data);
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
  }
};
