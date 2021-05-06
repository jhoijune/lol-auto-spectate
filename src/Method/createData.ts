import { join } from 'path';
import https from 'https';
import { readFileSync } from 'fs';
import OBSWebSocket from 'obs-websocket-js';

import makeProIDs from './makeProIDs';
import { Heap } from '../DataStructure';
import type { Config, Data, DB } from '../types';
import Constants from '../Constants';

export default async (
  config: Config,
  obs: OBSWebSocket,
  db: DB
): Promise<null | Data> => {
  const { ASSET_PATH } = process.env;
  const idPriority: string[][] = [];
  for (const ids of Constants.ID_PRIORITY) {
    idPriority.push([...ids]);
  }
  if (config.type === 'test') {
    const proIDs = await makeProIDs(db);
    if (proIDs === null) {
      return null;
    }
    idPriority.push(proIDs);
  }
  const certPath =
    (ASSET_PATH && join(ASSET_PATH, 'riotgames.pem')) ||
    join(__dirname, '..', '..', 'assets', 'riotgames.pem');
  return {
    isSpectating: false,
    isStreaming: (await obs.send('GetStreamingStatus')).streaming,
    isCommandAvailable: false,
    isPaused: false,
    isPermitted: config.type === 'without permission',
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
    noOnePlayWaitLimit: config.noOnePlayWaitLimitMinute * 60 * 1000,
    gameWaitLimit: config.gameWaitLimitMinute * 60 * 1000,
    spectateWaitLimit: config.spectateWaitLimitMinute * 60 * 1000,
    currSummonerID: 1,
    idPriority,
  };
};
