import { exec } from 'child_process';
import { ChildProcessWithoutNullStreams } from 'child_process';
import { type } from 'os';

export default (gameProcess: ChildProcessWithoutNullStreams) => {
  const osType = type();
  if (osType === 'Darwin' && !gameProcess.isUnusualExit) {
    process.kill(-gameProcess.pid);
    console.log('Stop spectate');
  } else if (osType === 'Windows_NT') {
    exec('taskkill /f /im "League of Legends.exe"');
    console.log('Stop spectate');
  }
};
