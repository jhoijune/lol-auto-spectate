import { exec } from 'child_process';
import { type } from 'os';

export default () => {
  const command =
    type() === 'Darwin'
      ? 'kill -9 `pgrep -f League\\ of\\ Legends.app`'
      : 'window script';
  exec(command);
  console.log('Close LOL Client');
};
