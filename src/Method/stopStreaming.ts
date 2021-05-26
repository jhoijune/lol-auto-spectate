import OBSWebSocket from 'obs-websocket-js';
import turnOffOBS from './turnOffOBS';

export default async (obs: OBSWebSocket) => {
  try {
    await obs.send('StopStreaming');
    console.log('Stop streaming');
    turnOffOBS();
  } catch (error) {
    console.error(error);
  }
};
