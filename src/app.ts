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
  injectChatCommand,
  injectKeypressEvent,
  COMMAND_SAFE_SECTION,
  checkStreaming,
  stopStreaming,
  connectOBS,
  isStreaming,
  turnOnOBS,
  isOBSRunning,
} from './Method';
import connectDB from './Models';
import {
  updateDBRegulary,
  crawlingOPGG,
  updateImageNames,
  crawlingBC,
} from './DB';
import Constants from './Constants';

import { AuxData, Config } from './types';

//import './Method/logError';

/*
KR:
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
  await crawlingOPGG(db);
  injectKeypressEvent(data);
  injectChatCommand(data, obs);
  while (true) {
    const isNormal = await COMMAND_SAFE_SECTION(data, async () => {
      while (data.spectateRank === Constants.NONE) {
        if (!data.isPaused) {
          let lastFakerStreamingTime: number = Constants.NONE;
          while (await checkStreaming('faker')) {
            if (await isStreaming(obs)) {
              await stopStreaming(obs);
            }
            lastFakerStreamingTime = new Date().valueOf();
            await updateDBRegulary(data, db);
          }
          if (lastFakerStreamingTime !== Constants.NONE) {
            while (
              new Date().valueOf() - lastFakerStreamingTime <
              10 * 60 * 1000
            ) {
              await updateDBRegulary(data, db);
            }
          }
          if (!(await decidePlayGame(data, obs, db))) {
            return false;
          }
          if (
            data.spectateRank === Constants.NONE &&
            !(await isStreaming(obs))
          ) {
            await updateDBRegulary(data, db);
          }
          if (
            data.isPaused ||
            (!(await isStreaming(obs)) &&
              data.spectateRank > Constants.FAKER_RANK)
          ) {
            // command 보정용
            data.spectateRank = Constants.NONE;
          }
        } else {
          await sleep(10 * 1000);
        }
      }
    });
    if (!isNormal) {
      return;
    }
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
    data.gameProcess = gameProcess; // command용
    if (!(await isGameRunning(data, db, gameProcess))) {
      continue;
    }
    const auxData: AuxData = {
      selectedIndex: Constants.NONE,
      exGameTime: Constants.NONE,
      fixCount: 0,
      endReservation: false,
    };
    const streamingTitle = makeStreamingTitle(data, auxData);
    if (!(await isStreaming(obs))) {
      await startStreaming(obs);
    }
    await switchLOLScene(data, obs);
    await modifyChannelInfo(streamingTitle);
    await COMMAND_SAFE_SECTION(data, async () => {
      while (data.isSpectating) {
        await sleep(1000);
        await determineGameOver(data, auxData);
        await decideGameIntercept(data, db);
        await decideStopGameAndStreaming(data, obs);
      }
    });
    try {
      await obs.send('SetCurrentScene', {
        'scene-name': 'Waiting',
      });
      await sleep(1000);
    } catch {}
    stopSpectate(gameProcess);
    
    if (
      data.spectateRank === Constants.NONE &&
      (await isStreaming(obs)) &&
      new Date().getHours() > 12 &&
      new Date().getHours() < 23
    ) {
      //await modifyChannelInfo('Waiting to spectate');
      await stopStreaming(obs);
    }
    
  }
};
*/

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
  injectKeypressEvent(data);
  injectChatCommand(data, obs);
  while (true) {
    const isNormal = await COMMAND_SAFE_SECTION(data, async () => {
      while (data.spectateRank === Constants.NONE) {
        if (!data.isPaused) {
          if (!(await decidePlayGame(data, obs, db))) {
            return false;
          }
          if (
            data.spectateRank === Constants.NONE &&
            !(await isStreaming(obs))
          ) {
            await updateDBRegulary(data, db);
          }
          if (
            data.isPaused ||
            (!(await isStreaming(obs)) &&
              data.spectateRank > Constants.FAKER_RANK)
          ) {
            // command 보정용
            data.spectateRank = Constants.NONE;
          }
        } else {
          await sleep(10 * 1000);
        }
      }
    });
    if (!isNormal) {
      return;
    }
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
    data.gameProcess = gameProcess; // command용
    if (!(await isGameRunning(data, db, gameProcess))) {
      continue;
    }
    const auxData: AuxData = {
      selectedIndex: Constants.NONE,
      exGameTime: Constants.NONE,
      fixCount: 0,
      endReservation: false,
    };
    const streamingTitle = makeStreamingTitle(data, auxData);
    if (!(await isStreaming(obs))) {
      await startStreaming(obs);
    }
    await switchLOLScene(data, obs);
    await modifyChannelInfo(streamingTitle);
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
    if (
      data.spectateRank === Constants.NONE &&
      (await isStreaming(obs)) &&
      data.gameStartHour !== undefined &&
      (data.gameStartHour < 4 || data.gameStartHour >= 12)
    ) {
      await stopStreaming(obs);
    }
  }
};
