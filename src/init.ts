import fs from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

if (fs.existsSync(join(__dirname, '..', 'assets'))) {
  process.env.ASSET_PATH = join(__dirname, '..', 'assets');
} else {
  process.env.ASSET_PATH = join(__dirname, 'assets');
}

import { collectProImage, createDB, connectDB } from './Method';

(async () => {
  const envPath = join(process.env.ASSET_PATH, '..');
  const envArticles = [
    'RIOT_API_KEY',
    'TWITCH_ID',
    'TWITCH_CLIENT_ID',
    'TWITCH_SECRET',
    'TWITCH_TOKEN',
    'OBS_PASSWORD',
    'CHANNEL',
    'AUTH_USERS',
  ];
  if (!fs.existsSync(envPath)) {
    fs.writeFile(envPath, envArticles.join('=\n') + '=', (error) => {
      if (error) {
        console.error(error);
      }
    });
  }
  await createDB();
  const db = await connectDB();
  await collectProImage(db);
})();
