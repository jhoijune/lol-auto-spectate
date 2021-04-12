import { join } from 'path';
import OBSWebSocket from 'obs-websocket-js';
import { type } from 'os';
import { exec } from 'child_process';
import inquirer from 'inquirer';

import {
  mapNickToName,
  makePictureInfo,
  sleep,
  convertPUUIDtoID,
  startSpectate,
  setUpSpectateIngameInitialSetting,
  makeProIDs,
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
  createData,
} from './Method';
import Constants from './Constants';

import { Config, Data } from './types';

//import './Method/logError';

export default async (config: Config) => {
  const { OBS_PASSWORD, ASSET_PATH } = process.env;
  const noOnePlayWaitLimit = config.noOnePlayWaitLimitMinute * 60 * 1000;
  const gameWaitLimit = config.gameWaitLimitMinute * 60 * 1000;
  const spectateWaitLimit = config.spectateWaitLimitMinute * 60 * 1000;
  let data: Data = createData(config);
  // 초기화 작업
  const obs = new OBSWebSocket();
  try {
    await obs.connect({
      address: Constants.OBS_ADDRESS,
      password: OBS_PASSWORD,
    });
  } catch (error) {
    console.log('Turn on OBS!!!!');
    return;
  }
  data.isStreaming = (await obs.send('GetStreamingStatus')).streaming;
  const tempNickMap = await mapNickToName(config.correctFileLoc);
  if (tempNickMap === null) {
    return;
  }
  data.nickMap = tempNickMap;
  data = { ...data, ...(await makePictureInfo()) };
  const tempIDPriority = await convertPUUIDtoID(data.nickMap);
  if (tempIDPriority === null) {
    return;
  }
  data.idPriority = tempIDPriority;
  if (!data.isLimit) {
    const proIDs = await makeProIDs(data.nickMap);
    if (proIDs === null) {
      return;
    }
    data.idPriority.push(proIDs);
  }
  data.isProStreaming = await decideStreaming(data.idPriority);
  // Tasks
  while (true) {
    // 프로 방송중이면 대기
    while (data.isProStreaming) {
      await sleep(60 * 1000);
      if (data.isStreaming && data.exSpectateRank !== Constants.FAKER_RANK) {
        await stopStreaming(obs, data);
      }
      data.isProStreaming = await decideStreaming(data.idPriority);
    }
    // 현재 게임중인 프로 확인 과정
    while (data.spectateRank === Constants.NONE) {
      let rankLimit: number;
      if (!data.isLimit) {
        rankLimit = data.isStreaming
          ? Constants.OTHERS_RANK
          : Constants.GROUP2_RANK;
      } else {
        rankLimit = data.isStreaming
          ? Constants.GROUP1_RANK
          : Constants.FAKER_RANK;
      }
      const matchInfo = await findMatch(rankLimit, data.idPriority);
      if (matchInfo === null) {
        if (data.isStreaming) {
          stopStreaming(obs, data);
        }
        return;
      }
      data = {
        ...data,
        ...matchInfo,
      };
      // 방송중인데 오래 팀 프로관전을 못하면 방송 종료
      if (
        data.isStreaming &&
        ((data.spectateRank === Constants.NONE &&
          (new Date().valueOf() - data.lastSpectateTime > noOnePlayWaitLimit ||
            new Date().valueOf() - data.lastHighRankSpectateTime >
              spectateWaitLimit)) ||
          (((!data.isLimit && data.spectateRank === Constants.OTHERS_RANK) ||
            (data.isLimit && data.spectateRank === Constants.GROUP1_RANK)) &&
            new Date().valueOf() - data.lastHighRankSpectateTime >
              spectateWaitLimit))
      ) {
        await stopStreaming(obs, data);
      }
    }
    if (!data.isConfirm) {
      if (type() === 'Darwin') {
        exec(`afplay ${join(ASSET_PATH, 'bgm.m4a')}`);
      } else {
        // TODO: window상에서 소리 틀기
      }
      data.isConfirm = (
        await inquirer.prompt<{ isConfirm: boolean }>({
          type: 'confirm',
          name: 'isConfirm',
          message: 'Found a match. Do you want to turn on the streaming?',
          default: false,
        })
      ).isConfirm;
      if (!data.isConfirm) {
        return;
      }
    }
    const gameProcess = startSpectate(data.encryptionKey, data.gameId);
    gameProcess.unref();
    const startTime = new Date().valueOf();
    let overlayInfos: { index: number; name: string; imgSrc?: string }[];
    while (
      !data.isSpectating &&
      new Date().valueOf() - startTime < gameWaitLimit
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
      continue;
    }
    let selectedIndex: number = Constants.NONE;
    const proNames: string[] = [];
    let isFaker = false;
    while (!data.pq.isEmpty()) {
      const [, { name, playerIndex }] = data.pq.remove();
      if (name === 'Faker') {
        isFaker = true;
      }
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
    let streamingTitle: string;
    if (proNames.length === 0) {
      const names = overlayInfos!.map(({ name }) => name);
      streamingTitle = `Spectating: ${
        names.length === 0 ? 'unknown' : names.join(', ')
      } for a while`;
    } else {
      streamingTitle = `Spectating: ${proNames.join(', ')}${
        !isFaker ? ' for a while' : ''
      }`;
    }
    await modifyChannelInfo(streamingTitle);
    console.log(streamingTitle);
    let isUnusualExit = false; // FIXME: 삭제 가능할듯
    let exGameTime: number = Constants.NONE;
    let fixCount = 0;
    while (data.isSpectating) {
      await sleep(1000);
      {
        // 게임이 진행중인지 판단
        const gameTime = await getGameTime(data.httpsAgent);
        if (gameTime !== Constants.NONE) {
          if (gameTime > 20 && fixCount === 0) {
            setUpSpectateIngameInitialSetting(selectedIndex);
            fixCount += 1;
          } else if (fixCount > 0 && fixCount <= 3) {
            fixSpectateView(selectedIndex);
            fixCount += 1;
          }
          if (exGameTime === gameTime && gameTime > 0) {
            // 게임 종료
            data.isSpectating = false;
            if (
              (data.isLimit && data.spectateRank === Constants.FAKER_RANK) ||
              (!data.isLimit && data.spectateRank < Constants.OTHERS_RANK)
            ) {
              data.lastHighRankSpectateTime = new Date().valueOf();
            }
            data.lastSpectateTime = new Date().valueOf();
            data.exSpectateRank = data.spectateRank;
            data.spectateRank = Constants.NONE;
          }
          exGameTime = gameTime;
        } else {
          console.log('Detected abnormal termination');
          // FIXME: 만약에 무한 루프 돌게 되면 다시 넣어야 함 data.spectateRank = Constants.NONE;
          data.isSpectating = false;
          isUnusualExit = true;
        }
      }
      if (data.isSpectating) {
        // 랭크가 낮으면 높은거 있는지 확인
        const matchInfo = await findMatch(
          data.spectateRank - 1,
          data.idPriority
        );
        if (
          matchInfo !== null &&
          matchInfo.spectateRank !== Constants.NONE &&
          matchInfo.spectateRank < data.spectateRank
        ) {
          if (matchInfo.gameId === data.gameId) {
            data = { ...data, ...matchInfo };
          } else {
            data = { ...data, ...matchInfo, isSpectating: false };
          }
        }
      }
      if (data.isSpectating) {
        // 현재 방송중인지 확인
        data.isProStreaming = await decideStreaming(data.idPriority);
        if (data.isProStreaming && data.spectateRank !== Constants.FAKER_RANK) {
          // 현재 페이커 관전중인데 곧 게임끝나면 매치정보가 없기 때문에 이를 통한 꺼짐 방지
          data.isSpectating = false;
          data.exSpectateRank = data.spectateRank;
          data.spectateRank = Constants.NONE;
          await stopStreaming(obs, data);
        }
      }
    }
    // obs 배경화면으로 전환
    if (data.spectateRank === Constants.NONE) {
      await sleep(10 * 1000);
    }
    await obs.send('SetCurrentScene', {
      'scene-name': 'Waiting',
    });
    await sleep(1000);
    stopSpectate(gameProcess);
    if (data.spectateRank === Constants.NONE) {
      await modifyChannelInfo('Waiting to spectate');
    }
  }
};
