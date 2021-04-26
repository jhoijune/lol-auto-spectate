import tmi from 'tmi.js';
import OBSWebSocket from 'obs-websocket-js';

import { Data } from '../types';
import Constants from '../Constants';
import stopStreaming from './stopStreaming';
import fixSpectateView from './fixSpectateView';

const stopGame = function (data: Data) {
  if (data.isSpectating) {
    data.isSpectating = false;
    if (data.spectateRank === Constants.FAKER_RANK) {
      data.lastHighRankSpectateTime = new Date().valueOf();
    }
    data.lastSpectateTime = new Date().valueOf();
    data.exSpectateRank = data.spectateRank;
  }
  data.spectateRank = Constants.NONE;
};

// FIXME: 버그가 백퍼 있다

export default (data: Data, obs: OBSWebSocket) => {
  const { CHANNEL, AUTH_USERS } = process.env;
  const userSet = new Set(AUTH_USERS.toLowerCase().split('&'));
  const chatClient = new tmi.Client({
    connection: { reconnect: true },
    channels: [CHANNEL],
  });
  chatClient.connect();
  chatClient.on('message', async (channel, tags, message, self) => {
    if (data.isCommandAvailable) {
      const name = tags['display-name'];
      console.log(`${name} : ${message}`);
      if (name && userSet.has(name.toLowerCase())) {
        if (message === '!stopgame') {
          stopGame(data);
        } else if (message === '!stopstreaming') {
          if (data.isStreaming) {
            await stopStreaming(data, obs);
          }
          stopGame(data);
        } else if (message === '!stopprogram') {
          if (data.isStreaming) {
            await stopStreaming(data, obs);
          }
          stopGame(data);
          process.exit();
        } else if (message === '!pauseprogram') {
          if (data.isStreaming) {
            await stopStreaming(data, obs);
          }
          stopGame(data);
          data.isPaused = true;
        } else if (message === '!restartprogram') {
          data.isPaused = false;
        } else if (data.isSpectating && /^\!fix\d{1,2}$/.test(message)) {
          const charNum = message.slice(4);
          const num = Number(charNum);
          if (num >= 1 && num <= 10) {
            fixSpectateView(num - 1);
          }
        }
      }
    }
  });
};
