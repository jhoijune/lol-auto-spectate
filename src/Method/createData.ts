import { join } from 'path';
import https from 'https';
import { readFileSync } from 'fs';

import { Heap } from '../DataStructure';
import type { Config, Data } from '../types';
import Constants from '../Constants';

export default (config: Config): Data => {
  const { ASSET_PATH } = process.env;
  const certPath =
    (ASSET_PATH && join(ASSET_PATH, 'riotgames.pem')) ||
    join(__dirname, '..', '..', 'assets', 'riotgames.pem');
  return {
    isSpectating: false,
    isProStreaming: false,
    isStreaming: false,
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
    pq: new Heap<{ name: string; playerIndex: number }>(true),
    nickMap: new Map<string, string>(),
    pictures: [],
    pictureMap: new Map<string, number>(),
    idPriority: [],
    resolution: config.resolution,
    isConfirm: !config.type.includes('confirm'),
    isLimit: !config.type.includes('limitless'),
  };
};
