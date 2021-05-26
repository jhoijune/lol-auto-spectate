import { type } from 'os';
import { exec } from 'child_process';

export default () => {
  if (type() === 'Darwin') {
    exec('pgrep -x obs', (error, stdout) => {
      exec(`kill -9 ${stdout}`);
    });
  } else {
    exec('taskkill /f /im "obs64.exe"');
  }
};
