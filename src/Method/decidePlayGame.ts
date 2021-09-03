import OBSWebSocket from 'obs-websocket-js';
import { isStreaming } from '.';
import Constants from '../Constants';

import { Data, DB } from '../types';
import decideStopStreaming from './decideStopStreaming';
import searchGame from './searchGame';
import stopStreaming from './stopStreaming';

/**
 * 현재 게임중인 프로확인 작업
 */
export default async (data: Data, obs: OBSWebSocket, db: DB) => {
  let rankLimit: number;
  if (new Date().getHours() > 12 && new Date().getHours() < 23) {
    rankLimit = Constants.FAKER_RANK;
  } else if (await isStreaming(obs)) {
    rankLimit = Constants.GROUP1_RANK;
  } else {
    rankLimit = Constants.FAKER_RANK;
  }
  /*
  const rankLimit = (await isStreaming(obs))
    ? Constants.GROUP1_RANK
    : Constants.FAKER_RANK;
    */
  //const rankLimit = Constants.FAKER_RANK;
  const matchInfo = await searchGame(data, db, rankLimit);
  if (matchInfo === null) {
    if (await isStreaming(obs)) {
      await stopStreaming(obs);
    }
    return false;
  }
  Object.assign(data, matchInfo);
  if ((await isStreaming(obs)) && data.spectateRank !== Constants.FAKER_RANK) {
    await decideStopStreaming(data, obs);
  }
  return true;
};
