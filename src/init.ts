import fs from 'fs';
import { join } from 'path';
import { collectProPicture } from './Method';

// TODO: .env파일 최상위 디렉토리에 없으면 만들고 있으면 내비둠
// TODO: collect picture로 사진 모으기

(async () => {
  const envPath = join(__dirname, '..', '.env');
  const envArticles = [
    'RIOT_API_KEY',
    'TWITCH_ID',
    'TWITCH_CLIENT_ID',
    'TWITCH_SECRET',
    'TWITCH_TOKEN',
    'OBS_PASSWORD',
  ];
  if (!fs.existsSync(envPath)) {
    fs.writeFile(envPath, envArticles.join('=\n') + '=', (error) => {
      if (error) {
        console.error(error);
      }
    });
  }
  await collectProPicture();
})();
