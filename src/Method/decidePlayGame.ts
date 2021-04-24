import OBSWebSocket from 'obs-websocket-js';
import Constants from '../Constants';

import { Data } from '../types';
import checkStreaming from './checkStreaming';
import decideStopStreaming from './decideStopStreaming';
import searchGame from './searchGame';
import sleep from './sleep';
import stopStreaming from './stopStreaming';

/**
 * 현재 게임중인 프로확인 작업
 */
export default async (data: Data, obs: OBSWebSocket) => {
  if (await checkStreaming('faker')) {
    if (data.isStreaming) {
      await stopStreaming(data, obs);
    }
    await sleep(10 * 1000);
    return;
  }
  const rankLimit = data.isStreaming
    ? Constants.GROUP1_RANK
    : Constants.FAKER_RANK;
  const matchInfo = await searchGame(rankLimit, data.idPriority);
  if (matchInfo === null) {
    if (data.isStreaming) {
      await stopStreaming(data, obs);
    }
    return;
  }
  Object.assign(data, matchInfo);
  await decideStopStreaming(data, obs);
};
