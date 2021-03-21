import https from 'https';
import Constants from '../Constants';
import { GameStats } from '../types';
import request from './request';

export default async (httpsAgent: https.Agent) => {
  try {
    const {
      data: { gameTime },
    } = await request<GameStats>('get', Constants.GAME_STATS_URL, {
      httpsAgent,
    });
    return gameTime;
  } catch {
    return Constants.NONE;
  }
};
