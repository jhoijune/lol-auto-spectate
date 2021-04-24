import OBSWebSocket from 'obs-websocket-js';

import checkStreaming from './checkStreaming';
import stopStreaming from './stopStreaming';
import Constants from '../Constants';
import { Data } from '../types';

export default async (data: Data, obs: OBSWebSocket) => {
  if (data.isSpectating && data.spectateRank !== Constants.FAKER_RANK) {
    const isProStreaming = await checkStreaming(...Constants.PRO_STREAMING_IDS);
    const isFakerStreaming = await checkStreaming('faker');
    if (isProStreaming || isFakerStreaming) {
      data.isSpectating = false;
      data.lastSpectateTime = new Date().valueOf();
      data.exSpectateRank = data.spectateRank;
      data.spectateRank = Constants.NONE;
      await stopStreaming(data, obs);
    }
  }
};
