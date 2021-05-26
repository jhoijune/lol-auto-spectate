import OBSWebSocket from 'obs-websocket-js';

export default async (obs: OBSWebSocket) => {
  try {
    return (await obs.send('GetStreamingStatus')).streaming;
  } catch {
    return false;
  }
};
