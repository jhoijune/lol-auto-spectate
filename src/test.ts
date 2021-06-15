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
  isStreaming,
  connectOBS,
  turnOnOBS,
  isOBSRunning,
} from './Method';
import connectDB from './Models';
import { updateDBRegulary, updateDBEntirely, updateImageNames } from './DB';
import COMMAND_SAFE_SECTION from './Method/COMMAND_SAFE_SECTION';
import Constants from './Constants';

import { AuxData, Config } from './types';

//import './Method/logError';

export default async (config: Config) => {
  const db = await connectDB();
  const obs = new OBSWebSocket();
  if ((await connectOBS(obs)) === Constants.OBS_ERROR) {
    return;
  }
  const data = await createData(config, db);
  if (data === null) {
    return;
  }
  if (!(await updateImageNames(db))) {
    return;
  }
  await updateDBEntirely(db);
  injectKeypressEvent(data);
  injectChatCommand(data, obs);
  let isTitleChanged = false;
  while (true) {
    await COMMAND_SAFE_SECTION(data, async () => {
      while (data.spectateRank === Constants.NONE) {
        if (!data.isPaused) {
          const rankLimit = Constants.OTHERS_RANK;
          const matchInfo = await searchGame(data, db, rankLimit);
          if (matchInfo === null) {
            if (await isStreaming(obs)) {
              await stopStreaming(obs);
            }
            return;
          }
          Object.assign(data, matchInfo);
          if (
            data.spectateRank === Constants.NONE &&
            !(await isStreaming(obs))
          ) {
            await updateDBRegulary(data, db);
          }
          if (data.isPaused) {
            // command 보정용
            data.spectateRank = Constants.NONE;
          }
        } else {
          await sleep(10 * 1000);
        }
      }
    });
    try {
      await obs.send('GetStreamingStatus');
    } catch {
      if (!isOBSRunning()) {
        turnOnOBS();
      }
      let obsStatus = await connectOBS(obs);
      if (obsStatus === Constants.OBS_ERROR) {
        return;
      }
      while (obsStatus === Constants.OBS_FAIL) {
        await sleep(1000);
        obsStatus = await connectOBS(obs);
      }
    }
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
    makeStreamingTitle(data, auxData);
    /*
    if (!(await isStreaming(obs))) {
      await startStreaming(obs);
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
    await COMMAND_SAFE_SECTION(data, async () => {
      while (data.isSpectating) {
        await sleep(1000);
        await determineGameOver(data, auxData);
        await decideGameIntercept(data, db);
      }
    });
    try {
      await obs.send('SetCurrentScene', {
        'scene-name': 'Waiting',
      });
      await sleep(1000);
    } catch {}
    stopSpectate(gameProcess);
  }
};
