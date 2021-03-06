import { join } from 'path';
import inquirer from 'inquirer';
import { config } from 'dotenv';
import { existsSync } from 'fs';

if (existsSync(join(__dirname, 'assets'))) {
  process.env.ASSET_PATH = join(__dirname, 'assets');
} else {
  process.env.ASSET_PATH = join(__dirname, '..', 'assets');
}

config();

import app from './app';
import { Config } from './types';
import test from './test';

(async () => {
  const config = await inquirer.prompt<Config>([
    {
      type: 'list',
      name: 'type',
      message: 'What type would you like to start with?',
      choices: ['permission', 'without permission', 'test'],
      default: 'without permission',
    },
    {
      type: 'number',
      name: 'gameWaitLimitMinute',
      message: 'How many minutes would you like to set the game wait time to?',
      default: 3,
    },
    {
      type: 'number',
      name: 'noOnePlayWaitLimitMinute',
      message: 'How many minutes will you wait until no one is playing',
      default: 20,
    },
    {
      type: 'number',
      name: 'spectateWaitLimitMinute',
      message:
        'How many minutes would you like to set the waiting time to spectate high rank?',
      default: 1000,
    },
  ]);
  if (config.type === 'test') {
    test(config);
  } else {
    app(config);
  }
})();
