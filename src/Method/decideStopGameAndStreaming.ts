import OBSWebSocket from 'obs-websocket-js';

import checkStreaming from './checkStreaming';
import stopStreaming from './stopStreaming';
import Constants from '../Constants';
import { Data } from '../types';
import orderStopSpectate from './orderStopSpectate';

export default async (data: Data, obs: OBSWebSocket) => {
  if (
    data.isSpectating &&
    ((await checkStreaming('faker')) ||
      (data.spectateRank !== Constants.FAKER_RANK &&
        (await checkStreaming(...Constants.PRO_STREAMING_IDS))))
  ) {
    orderStopSpectate(data);
    data.spectateRank = Constants.NONE;
    await stopStreaming(obs);
  }
};
