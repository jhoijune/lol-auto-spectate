import { exec } from 'child_process';
import inquirer from 'inquirer';
import { type } from 'os';
import { join } from 'path';

export default async () => {
  const { ASSET_PATH } = process.env;
  const soundPath =
    (ASSET_PATH && join(ASSET_PATH, 'bgm.wav')) ||
    join(__dirname, '..', '..', 'assets', 'bgm.wav');
  let intervalID: NodeJS.Timeout;
  if (type() === 'Darwin') {
    exec(`afplay ${soundPath}`);
    intervalID = setInterval(() => {
      exec(`afplay ${soundPath}`);
    }, 15 * 1000);
  } else {
    exec(
      `powershell -c (New-Object Media.SoundPlayer '${soundPath}').PlaySync()`
    );
    intervalID = setInterval(() => {
      exec(
        `powershell -c (New-Object Media.SoundPlayer '${soundPath}').PlaySync()`
      );
    }, 15 * 1000);
  }
  const isPermitted = (
    await inquirer.prompt<{ isPermitted: boolean }>({
      type: 'confirm',
      name: 'isPermitted',
      message: 'Found a match. Do you want to turn on the streaming?',
      default: false,
    })
  ).isPermitted;
  clearInterval(intervalID);
  return isPermitted;
};
