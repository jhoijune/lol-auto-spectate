import axios from 'axios';
import https from 'https';
import Constants from '../Constants';
import { GameStats } from '../types';
import printDate from './printDate';

export default async (httpsAgent: https.Agent) => {
  try {
    console.log(`Starting GET ${Constants.GAME_STATS_URL} ${printDate()}`);
    const {
      data: { gameTime },
    } = await axios.get<GameStats>(Constants.GAME_STATS_URL, {
      httpsAgent,
      timeout: 5000,
    });
    return gameTime;
  } catch {
    return Constants.NONE;
  } finally {
    console.log(
      `GET request finished for: ${Constants.GAME_STATS_URL} ${printDate()}`
    );
  }
};
