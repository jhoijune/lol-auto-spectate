import OBSWebSocket from 'obs-websocket-js';
import { join } from 'path';
import { Data } from '../types';

export default async (obs: OBSWebSocket, data: Data) => {
  try {
    const path = join(
      __dirname,
      '..',
      '..',
      'assets',
      'overlay',
      `${data.encryptionKey}-${data.resolution}.html`
    );
    await obs.send('SetSourceSettings', {
      sourceName: 'Overlay',
      sourceSettings: {
        height: data.resolution,
        is_local_file: true,
        local_file: path,
        restart_when_active: true,
        width: data.resolution === 720 ? 1280 : 1920,
      },
    });
    await obs.send('SetCurrentScene', {
      'scene-name': 'LOL',
    });
  } catch (error) {
    console.error(error);
  }
};
