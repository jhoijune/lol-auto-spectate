import OBSWebSocket from 'obs-websocket-js';
import { Data } from '../types';

export default async (obs: OBSWebSocket, data: Data) => {
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
