import { exec } from 'child_process';
import inquirer from 'inquirer';
import { type } from 'os';
import { join } from 'path';
import { Data } from '../types';

export default async () => {
  const { ASSET_PATH } = process.env;
  const soundPath =
    (ASSET_PATH && join(ASSET_PATH, 'bgm.m4a')) ||
    join(__dirname, '..', '..', 'assets', 'bgm.m4a');
  let intervalID: NodeJS.Timeout;
  if (type() === 'Darwin') {
    exec(`afplay ${soundPath}`);
    intervalID = setInterval(() => {
      exec(`afplay ${soundPath}`);
    }, 15 * 1000);
  } else {
    // TODO: window상에서 소리 틀기
    intervalID = setInterval(() => {}, 15 * 1000);
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
