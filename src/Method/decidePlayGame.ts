import OBSWebSocket from 'obs-websocket-js';
import Constants from '../Constants';
import { updateDBRegulary } from '../DB';

import { Data } from '../types';
import decideStopStreaming from './decideStopStreaming';
import searchGame from './searchGame';
import stopStreaming from './stopStreaming';

/**
 * 현재 게임중인 프로확인 작업
 */
export default async (data: Data, obs: OBSWebSocket) => {
  const rankLimit = data.isStreaming
    ? Constants.GROUP1_RANK
    : Constants.FAKER_RANK;
  const matchInfo = await searchGame(data, rankLimit);
  if (matchInfo === null) {
    if (data.isStreaming) {
      await stopStreaming(data, obs);
    }
    return;
  }
  Object.assign(data, matchInfo);
  if (data.isStreaming && data.spectateRank !== Constants.FAKER_RANK) {
    await decideStopStreaming(data, obs);
  }
  if (
    data.isPaused ||
    (!data.isStreaming && data.spectateRank > Constants.FAKER_RANK)
  ) {
    // command 보정용
    data.spectateRank = Constants.NONE;
  }
};
