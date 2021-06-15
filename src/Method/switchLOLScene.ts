import OBSWebSocket from 'obs-websocket-js';
import { join } from 'path';
import { Data } from '../types';

export default async (data: Data, obs: OBSWebSocket) => {
  const { ASSET_PATH } = process.env;
  try {
    const path =
      (ASSET_PATH && join(ASSET_PATH, 'overlay', `${data.gameId}.html`)) ||
      join(__dirname, '..', '..', 'assets', 'overlay', `${data.gameId}.html`);
    await obs.send('SetSourceSettings', {
      sourceName: 'Overlay',
      sourceSettings: {
        height: 1080,
        is_local_file: true,
        local_file: path,
        restart_when_active: true,
        width: 1920,
      },
    });
    await obs.send('SetCurrentScene', {
      'scene-name': 'LOL',
    });
  } catch (error) {
    console.error(error);
  }
};
