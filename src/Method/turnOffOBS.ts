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
