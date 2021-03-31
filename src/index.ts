import { join } from 'path';
import inquirer from 'inquirer';

import app from './app';
import { Config } from './types';

(async () => {
  const config = await inquirer.prompt<Config>([
    {
      type: 'list',
      name: 'type',
      message: 'What type would you like to start with?',
      choices: ['limitless', 'limit', 'limit-confirm'],
      default: 'limit-confirm',
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
        'How many minutes would you like to set the waiting time to spectate Faker?',
      default: 60,
    },
    {
      type: 'rawlist',
      name: 'resolution',
      message: 'What would you like to set the resolution to?',
      choices: [1080, 720],
      default: 1080,
    },
    {
      type: 'input',
      name: 'correctFileLoc',
      message: 'What is the path of the correction file?',
      default: join(__dirname, '..', 'assets', 'correct.txt'),
    },
  ]);
  app(config);
})();
