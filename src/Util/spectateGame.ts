import { type } from 'os';
import { spawn, execFile } from 'child_process';
import { join } from 'path';

export default (encryptionKey: string, gameId: number) => {
  const scriptLoc =
    type() === 'Darwin'
      ? join(__dirname, '..', '..', 'script', 'spectate.sh')
      : join(__dirname, '..', '..', 'script', 'spectate.bat');

  const process = spawn(scriptLoc, [encryptionKey, gameId.toString()], {
    detached: true,
  });
  // const process = execFile(scriptLoc, [encryptionKey, gameId.toString()]);
  console.log('Start spectate!');
  return process;
};
