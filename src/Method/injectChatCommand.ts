import tmi from 'tmi.js';
import OBSWebSocket from 'obs-websocket-js';

import { Data } from '../types';
import Constants from '../Constants';
import stopStreaming from './stopStreaming';
import fixSpectateView from './fixSpectateView';
import setUpSpectateIngameInitialSetting from './setUpSpectateIngameInitialSetting';
import sleep from './sleep';
import stopSpectate from './stopSpectate';
import orderStopSpectate from './orderStopSpectate';
import isStreaming from './isStreaming';
import turnOffOBS from './turnOffOBS';

export default (data: Data, obs: OBSWebSocket) => {
  const wrapper = async function (func: Function) {
    while (!data.isCommandAvailable) {
      await sleep(1000);
    }
    await func();
  };
  const { CHANNEL, AUTH_USERS } = process.env;
  const userSet = new Set(AUTH_USERS.toLowerCase().split('&'));
  const chatClient = new tmi.Client({
    connection: { reconnect: true },
    channels: [CHANNEL],
  });
  chatClient.connect();
  chatClient.on('message', async (channel, tags, message, self) => {
    const name = tags['display-name'];
    if (name && userSet.has(name.toLowerCase())) {
      console.log(`${name} : ${message}`);
      if (message === '!stopgame') {
        await wrapper(() => {
          if (data.isSpectating) {
            orderStopSpectate(data);
          }
          data.spectateRank = Constants.NONE;
        });
      } else if (message === '!stopstreaming') {
        await wrapper(async () => {
          if (await isStreaming(obs)) {
            await stopStreaming(obs);
          }
          if (data.isSpectating) {
            orderStopSpectate(data);
          }
          data.spectateRank = Constants.NONE;
        });
      } else if (message === '!stopprogram') {
        await wrapper(async () => {
          if (await isStreaming(obs)) {
            await stopStreaming(obs);
          }
          if (data.isSpectating) {
            stopSpectate(data.gameProcess!);
          }
          process.exit();
        });
      } else if (message === '!pauseprogram') {
        await wrapper(async () => {
          if (await isStreaming(obs)) {
            await stopStreaming(obs);
          }
          if (data.isSpectating) {
            orderStopSpectate(data);
          }
          data.spectateRank = Constants.NONE;
          data.isPaused = true;
        });
      } else if (message === '!restartprogram') {
        await wrapper(() => {
          data.isPaused = false;
        });
      } else if (message === '!openinterface') {
        await wrapper(() => {
          if (data.isSpectating) {
            setUpSpectateIngameInitialSetting(Constants.NONE);
          }
        });
      } else if (/^\!fix\d{1,2}$/.test(message)) {
        await wrapper(() => {
          if (data.isSpectating) {
            const charNum = message.slice(4);
            const num = Number(charNum);
            if (num >= 1 && num <= 10) {
              fixSpectateView(num - 1);
            }
          }
        });
      }
    }
  });
};
