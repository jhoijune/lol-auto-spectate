import fs from 'fs';
import { join } from 'path';

import printDate from './printDate';

let ymd = '';
const logPath = join(__dirname, '..', '..', 'log');

process.stderr.write = (
  str: string | Uint8Array,
  cbOrEncoding?: BufferEncoding | ((err?: Error) => void),
  cb?: (err?: Error) => void
): boolean => {
  if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath);
  }
  const presentYmd = printDate().slice(0, 10);
  const fileName = `${presentYmd} error.txt`;
  if (ymd !== presentYmd) {
    // 파일 있나 확인
    if (!fs.existsSync(join(logPath, fileName))) {
      fs.writeFileSync(fileName, '');
    }
    ymd = presentYmd;
  }
  fs.appendFile(join(logPath, fileName), str, (error) => {
    console.log(error);
    return false;
  });
  return true;
};
