import OBSWebSocket from 'obs-websocket-js';
import { Data } from '../types';

export default async (obs: OBSWebSocket) => {
  try {
    await obs.send('SetCurrentScene', {
      'scene-name': 'Waiting',
    });
    await obs.send('StartStreaming', {});
    console.log('Start streaming');
  } catch (error) {
    console.error(error);
  }
};
