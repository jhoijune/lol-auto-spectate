import { join } from 'path';
import https from 'https';
import { readFileSync } from 'fs';
import OBSWebSocket from 'obs-websocket-js';

import mapNickToName from './mapNickToName';
import makePictureInfo from './makePictureInfo';
import convertPUUIDtoID from './convertPUUIDtoID';
import makeProIDs from './makeProIDs';
import { Heap } from '../DataStructure';
import type { Config, Data } from '../types';
import Constants from '../Constants';

export default async (
  config: Config
): Promise<null | { data: Data; obs: OBSWebSocket }> => {
  const { ASSET_PATH, OBS_PASSWORD } = process.env;
  const obs = new OBSWebSocket();
  try {
    await obs.connect({
      address: Constants.OBS_ADDRESS,
      password: OBS_PASSWORD,
    });
  } catch (error) {
    if (error.error === 'Connection error.') {
      console.log('Turn on OBS!!!!');
    } else if (error.error === 'Authentication Failed.') {
      console.log('password is wrong');
    } else {
      console.error(error);
    }
    return null;
  }
  const nickMap = await mapNickToName(config.correctFileLoc);
  if (nickMap === null) {
    return null;
  }
  const pictureInfos = await makePictureInfo();
  const idPriority = await convertPUUIDtoID(nickMap);
  if (idPriority === null) {
    return null;
  }
  if (config.type === 'test') {
    const proIDs = await makeProIDs(nickMap);
    if (proIDs === null) {
      return null;
    }
    idPriority.push(proIDs);
  }
  const certPath =
    (ASSET_PATH && join(ASSET_PATH, 'riotgames.pem')) ||
    join(__dirname, '..', '..', 'assets', 'riotgames.pem');
  return {
    obs,
    data: {
      isSpectating: false,
      isStreaming: (await obs.send('GetStreamingStatus')).streaming,
      spectateRank: Constants.NONE, // -1: none 0: faker 1: 1군 2: 2군 3: 프로 챌린저
      exSpectateRank: Constants.NONE,
      encryptionKey: '',
      gameId: Constants.NONE,
      peopleCount: Constants.NONE,
      lastHighRankSpectateTime: new Date().valueOf(),
      lastSpectateTime: new Date().valueOf(),
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
        cert: readFileSync(certPath),
      }),
      pq: new Heap<{
        name: string;
        playerIndex: number;
        championName?: string;
      }>(true),
      resolution: config.resolution,
      isPermitted: config.type === 'without permission',
      noOnePlayWaitLimit: config.noOnePlayWaitLimitMinute * 60 * 1000,
      gameWaitLimit: config.gameWaitLimitMinute * 60 * 1000,
      spectateWaitLimit: config.spectateWaitLimitMinute * 60 * 1000,
      nickMap,
      idPriority,
      ...pictureInfos,
    },
  };
};
