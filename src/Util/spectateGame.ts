import { type } from 'os';
import { spawn } from 'child_process';
import { join } from 'path';

export default (encryptionKey: string, gameId: number) => {
  const scriptLoc =
    type() === 'Darwin'
      ? join(__dirname, '..', '..', 'script', 'spectate.sh')
      : join(__dirname, '..', '..', 'script', 'spectate.bat');
  const process = spawn(scriptLoc, [encryptionKey, gameId.toString()]);
  process.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  process.stderr.on('data', (data) => {
    console.log(data.toString());
  });
  process.on('close', (code) => {
    console.log(code);
  });

  return process;
};
