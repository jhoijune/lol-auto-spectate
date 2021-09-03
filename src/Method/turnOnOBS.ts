import { type } from 'os';
import { exec } from 'child_process';

export default () => {
  if (type() === 'Darwin') {
    exec('open /Applications/OBS.app');
  } else {
    exec('start /d "C:\\Program Files\\obs-studio\\bin\\64bit\\" obs64.exe');
  }
};
