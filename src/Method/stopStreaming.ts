import OBSWebSocket from 'obs-websocket-js';
import sleep from './sleep';
import turnOffOBS from './turnOffOBS';

export default async (obs: OBSWebSocket) => {
  try {
    await obs.send('StopStreaming');
    console.log('Stop streaming');
  } catch (error) {
    console.error(error);
  } finally {
    await turnOffOBS();
    await sleep(1000);
  }
};
