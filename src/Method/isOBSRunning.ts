import { execSync } from 'child_process';
import { type } from 'os';

export default () => {
  const command =
    type() === 'Darwin' ? 'pgrep -x obs' : 'tasklist | find "obs64.exe"';
  try {
    const result = execSync(command);
    return result.length !== 0;
  } catch {
    return false;
  }
};
