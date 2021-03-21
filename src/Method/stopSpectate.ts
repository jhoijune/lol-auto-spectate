import { exec } from 'child_process';
import { ChildProcessWithoutNullStreams } from 'node:child_process';
import { type } from 'os';

export default (gameProcess: ChildProcessWithoutNullStreams) => {
  if (type() === 'Darwin') {
    process.kill(-gameProcess.pid);
  } else {
    exec('taskkill /f /im "League of Legends.exe"');
  }
};
