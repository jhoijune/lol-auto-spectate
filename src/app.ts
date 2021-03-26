import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';
import https from 'https';
import OBSWebSocket from 'obs-websocket-js';

import {
  mapNickToName,
  createPictureInfo,
  sleep,
  convertPUUIDtoID,
  spectateGame,
  setUpSpectateIngameInitialSetting,
  createProIDs,
  findMatch,
  modifyChannelInfo,
  getGameInfo,
  fixSpectateView,
  stopSpectate,
  getGameTime,
  makeOverlay,
  startStreaming,
  decideStreaming,
  stopStreaming,
  switchLOLScene,
} from './Method';
import { Heap } from './DataStructure';
import Constants from './Constants';

import { Data } from './types';

import './Method/logError';

config();

const { OBS_PASSWORD } = process.env;

export default async (
  gameWaitLimitMinute: number,
  gameTimeLimitMinute: number,
  spectateWaitLimitMinute: number,
  resolution: 720 | 1080
) => {
  const gameWaitLimit = gameWaitLimitMinute * 60 * 1000;
  const gameTimeLimit = gameTimeLimitMinute * 60 * 1000;
  const spectateWaitLimit = spectateWaitLimitMinute * 60 * 1000;
  let data: Data = {
    picturePath: join(__dirname, '..', 'assets', 'pictures'),
    isSpectating: false,
    isProStreaming: false,
    isStreaming: false,
    spectateRank: Constants.NONE, // -1: none 0: faker 1: 1군 2: 2군 3: 프로 챌린저
    encryptionKey: '',
    gameId: Constants.NONE,
    peopleCount: Constants.NONE,
    lastSpectateTime: new Date().valueOf(),
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
      cert: readFileSync(join(__dirname, '..', 'assets', 'riotgames.pem')),
    }),
    pq: new Heap<{ name: string; playerIndex: number }>(true),
    nickMap: new Map<string, string>(),
    pictures: [],
    pictureMap: new Map<string, number>(),
    idPriority: [],
    resolution: resolution,
  };
  // 초기화 작업
  const obs = new OBSWebSocket();
  await obs.connect({ address: Constants.OBS_ADDRESS, password: OBS_PASSWORD });
  data.isStreaming = (await obs.send('GetStreamingStatus')).streaming;
  const tempNickMap = await mapNickToName();
  if (tempNickMap === null) {
    return;
  }
  data.nickMap = tempNickMap;
  const temp = await createPictureInfo();
  data = { ...data, ...temp };
  const tempIDPriority = await convertPUUIDtoID(data.nickMap);
  if (tempIDPriority === null) {
    return;
  }
  data.idPriority = tempIDPriority;
  const proIDs = await createProIDs(data.nickMap);
  if (proIDs === null) {
    return;
  }
  data.idPriority.push(proIDs);
  data.isProStreaming = await decideStreaming(data.idPriority);
  // Tasks
  while (true) {
    // 프로 방송중이면 대기
    while (data.isProStreaming) {
      if (data.isStreaming) {
        await stopStreaming(obs, data);
      }
      data.isProStreaming = await decideStreaming(data.idPriority);
      await sleep(60 * 1000);
    }
    // 현재 게임중인 프로 확인 과정
    while (data.spectateRank === Constants.NONE) {
      const rankLimit = data.isStreaming
        ? data.idPriority.length
        : data.idPriority.length - 1;
      const matchInfo = await findMatch(rankLimit, data.idPriority);
      if (matchInfo === null) {
        return;
      }
      data = {
        ...data,
        ...matchInfo,
      };
      // 방송중인데 오래 팀 프로관전을 못하면 방송 종료
      if (
        data.isStreaming &&
        (data.spectateRank === data.idPriority.length - 1 ||
          data.spectateRank === Constants.NONE) &&
        new Date().valueOf() - data.lastSpectateTime > spectateWaitLimit
      ) {
        await stopStreaming(obs, data);
        data.spectateRank === Constants.NONE;
      }
    }
    const gameProcess = spectateGame(data.encryptionKey, data.gameId);
    gameProcess.unref();
    const startTime = new Date().valueOf();
    let overlayInfos: { index: number; name: string; imgSrc?: string }[];
    while (
      !data.isSpectating &&
      new Date().valueOf() - startTime < gameWaitLimit
    ) {
      overlayInfos = await getGameInfo(data);
    }
    if (!data.isSpectating) {
      data.spectateRank = Constants.NONE;
      stopSpectate(gameProcess);
      continue;
    }
    let selectedIndex: number = Constants.NONE;
    const proNames: string[] = [];
    while (!data.pq.isEmpty()) {
      const [, { name, playerIndex }] = data.pq.remove();
      proNames.push(name);
      if (selectedIndex === Constants.NONE) {
        selectedIndex = playerIndex;
      }
    }
    await makeOverlay(overlayInfos!, data);
    if (!data.isStreaming) {
      // 방송켜고 설정
      await startStreaming(obs, data);
    }
    await switchLOLScene(obs, data);
    await modifyChannelInfo(
      `관전: ${proNames.length === 0 ? '' : proNames.join(', ')}`
    );
    console.log(
      `Tracking Pros: ${proNames.length === 0 ? '' : proNames.join()}`
    );
    let isUnusualExit = false;
    let exGameTime: number = Constants.NONE;
    let isFixed = false;
    while (data.isSpectating) {
      await sleep(1000);
      {
        // 게임이 진행중인지 판단
        const gameTime = await getGameTime(data.httpsAgent);
        if (gameTime !== Constants.NONE) {
          if (gameTime > 20 && !isFixed) {
            setUpSpectateIngameInitialSetting(selectedIndex);
            isFixed = true;
          }
          if (exGameTime === gameTime && gameTime > 0) {
            // 게임 종료
            data.isSpectating = false;
            if (data.spectateRank < data.idPriority.length - 1) {
              data.lastSpectateTime = new Date().valueOf();
            }
            data.spectateRank = Constants.NONE;
          }
          exGameTime = gameTime;
        } else {
          console.log('Detected abnormal termination');
          data.spectateRank = Constants.NONE;
          data.isSpectating = false;
          isUnusualExit = true;
        }
      }
      if (data.isSpectating) {
        // 랭크가 낮으면 높은거 있는지 확인
        const matchInfo = await findMatch(data.spectateRank, data.idPriority);
        if (matchInfo === null) {
          return;
        }
        if (
          matchInfo.spectateRank !== Constants.NONE &&
          matchInfo.spectateRank < data.spectateRank
        ) {
          data = { ...data, ...matchInfo, isSpectating: false };
        }
      }
      // 게임 시간이 너무 오래지났으면 종료
      if (
        data.isSpectating &&
        new Date().valueOf() - startTime > gameTimeLimit
      ) {
        data.isSpectating = false;
        data.spectateRank = Constants.NONE;
      }
      if (data.isSpectating) {
        // twitch api를 통해 현재 방송중인지 확인
        data.isProStreaming = await decideStreaming(data.idPriority);
        if (data.spectateRank !== 0) {
          data.isSpectating = false;
          data.spectateRank = Constants.NONE;
          await stopStreaming(obs, data);
        }
      }
    }
    // obs 배경화면으로 전환
    if (!isUnusualExit) {
      stopSpectate(gameProcess);
    }
    await obs.send('SetCurrentScene', {
      'scene-name': 'Waiting',
    });
    await modifyChannelInfo('관전 대기중');
  }
};
