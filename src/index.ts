import { join } from 'path';
import inquirer from 'inquirer';
import { config } from 'dotenv';
import { existsSync } from 'fs';
import OBSWebSocket from 'obs-websocket-js';

if (existsSync(join(__dirname, 'assets'))) {
  process.env.ASSET_PATH = join(__dirname, 'assets');
} else {
  process.env.ASSET_PATH = join(__dirname, '..', 'assets');
}

config();

import app from './app';
import { Config } from './types';
import test from './test';
import Constants from './Constants';
import { connectDB } from './Method';

(async () => {
  const { ASSET_PATH, OBS_PASSWORD } = process.env;
  const obs = new OBSWebSocket();
  try {
    await obs.connect({
      address: Constants.OBS_ADDRESS,
      password: OBS_PASSWORD,
    });
  } catch (error) {
    if (error.error === 'Connection error.') {
      console.log('Turn on OBS!!!!');
    } else if (error.error === 'Authentication Failed.') {
      console.log('password is wrong');
    } else {
      console.error(error);
    }
    return;
  }
  const dbPath =
    (ASSET_PATH && join(ASSET_PATH, 'db.sqlite3')) ||
    join(__dirname, '..', 'assets', 'db.sqlite3');
  if (!existsSync(dbPath)) {
    console.log('Initialize the database');
    return;
  }
  const db = await connectDB();
  const config = await inquirer.prompt<Config>([
    {
      type: 'list',
      name: 'type',
      message: 'What type would you like to start with?',
      choices: ['permission', 'without permission', 'test'],
      default: 'permission',
    },
    {
      type: 'number',
      name: 'gameWaitLimitMinute',
      message: 'How many minutes would you like to set the game wait time to?',
      default: 1,
    },
    {
      type: 'number',
      name: 'noOnePlayWaitLimitMinute',
      message: 'How many minutes will you wait until no one is playing',
      default: 10,
    },
    {
      type: 'number',
      name: 'spectateWaitLimitMinute',
      message:
        'How many minutes would you like to set the waiting time to spectate high rank?',
      default: 60,
    },
    {
      type: 'rawlist',
      name: 'resolution',
      message: 'What would you like to set the resolution to?',
      choices: [1080, 720],
      default: 1080,
    },
  ]);
  if (config.type === 'test') {
    test(config, obs, db);
  } else {
    app(config, obs, db);
  }
})();
