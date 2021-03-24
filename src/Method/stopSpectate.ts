import { exec } from 'child_process';
import { ChildProcessWithoutNullStreams } from 'node:child_process';
import { type } from 'os';

export default (gameProcess: ChildProcessWithoutNullStreams) => {
  const osType = type();
  if (osType === 'Darwin' && !gameProcess.isUnusualExit) {
    console.log(process.exitCode); // 자체적으로 꺼버렸을 때 코드
    process.kill(-gameProcess.pid);
    console.log('Stop spectate');
  } else if (osType === 'Windows_NT') {
    exec('taskkill /f /im "League of Legends.exe"');
    console.log('Stop spectate');
  }
};
