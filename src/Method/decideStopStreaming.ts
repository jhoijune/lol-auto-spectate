import OBSWebSocket from 'obs-websocket-js';

import Constants from '../Constants';
import { Data } from '../types';
import checkStreaming from './checkStreaming';
import stopStreaming from './stopStreaming';

export default async (data: Data, obs: OBSWebSocket) => {
  // 방송중인데 오래 팀 프로관전을 못하면 방송 종료
  let isStopStreaming = false;
  if (
    new Date().valueOf() - data.lastHighRankSpectateTime >
    data.spectateWaitLimit
  ) {
    isStopStreaming = true;
  } else if (
    data.spectateRank === Constants.NONE &&
    new Date().valueOf() - data.lastSpectateTime > data.noOnePlayWaitLimit
  ) {
    isStopStreaming = true;
  } else if (await checkStreaming(...Constants.PRO_STREAMING_IDS)) {
    isStopStreaming = true;
  }
  if (isStopStreaming) {
    await stopStreaming(obs);
    data.spectateRank = Constants.NONE;
  }
};
