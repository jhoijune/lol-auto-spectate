import { type } from 'os';
import { spawn } from 'child_process';
import { join } from 'path';

export default (encryptionKey: string, gameId: number) => {
  const scriptLoc =
    type() === 'Darwin'
      ? join(__dirname, '..', '..', 'assets', 'script', 'spectate.sh')
      : join(__dirname, '..', '..', 'assets', 'script', 'spectate.bat');

  const process = spawn(scriptLoc, [encryptionKey, gameId.toString()], {
    detached: true,
  });
  console.log('Start spectate!');
  return process;
};
