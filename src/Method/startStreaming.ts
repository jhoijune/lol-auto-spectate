import OBSWebSocket from 'obs-websocket-js';
import { Data } from '../types';

export default async (data: Data, obs: OBSWebSocket) => {
  try {
    await obs.send('SetCurrentScene', {
      'scene-name': 'Waiting',
    });
    await obs.send('StartStreaming', {});
    console.log('Start streaming');
    data.isStreaming = true;
  } catch (error) {
    console.error(error);
  }
};
