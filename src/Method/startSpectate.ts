import { type } from 'os';
import { spawn } from 'child_process';
import { join } from 'path';

export default (encryptionKey: string, gameId: number) => {
  const { ASSET_PATH } = process.env;
  const scriptPath =
    (ASSET_PATH && join(ASSET_PATH, 'script')) ||
    join(__dirname, '..', '..', 'assets', 'script');
  const scriptLoc =
    type() === 'Darwin'
      ? join(scriptPath, 'spectate.sh')
      : join(scriptPath, 'spectate.bat');
  const gameProcess = spawn(scriptLoc, [encryptionKey, gameId.toString()], {
    detached: true,
  });
  gameProcess.on('exit', () => {
    gameProcess.isUnusualExit = true;
  });
  console.log('Start spectate!');
  return gameProcess;
};
