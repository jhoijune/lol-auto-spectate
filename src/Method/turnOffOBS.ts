import { type } from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const promisifiedExec = promisify(exec);

export default async () => {
  try {
    if (type() === 'Darwin') {
      const { stdout } = await promisifiedExec('pgrep -x obs');
      await promisifiedExec(`kill -9 ${stdout}`);
    } else {
      await promisifiedExec('taskkill /f /im "obs64.exe"');
    }
  } catch {}
};

/*
export default () => {
  if (type() === 'Darwin') {
    exec('pgrep -x obs', (error, stdout) => {
      exec(`kill -9 ${stdout}`);
    });
  } else {
    exec('taskkill /f /im "obs64.exe"');
  }
};
*/
