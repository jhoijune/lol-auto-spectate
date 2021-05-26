import axios from 'axios';
import { ValidateResponse } from '../types';
import printDate from './printDate';

export default async () => {
  const { TWITCH_TOKEN } = process.env;
  const URL = 'https://id.twitch.tv/oauth2/validate';
  //curl -H "Authorization: OAuth <access token>" https://id.twitch.tv/oauth2/validate
  try {
    console.log(`Starting GET ${URL} ${printDate()}`);
    let {
      data: { expires_in },
    } = await axios.get<ValidateResponse>(URL, {
      headers: {
        Authorization: `OAuth ${TWITCH_TOKEN}`,
      },
    });
    const day = Math.floor(expires_in / (24 * 60 * 60));
    expires_in %= 24 * 60 * 60;
    const hour = Math.floor(expires_in / (60 * 60));
    expires_in %= 60 * 60;
    const minute = Math.floor(expires_in / 60);
    expires_in %= 60;
    console.log(
      `Token validity date is ${day} day ${hour}:${minute}:${expires_in} away. `
    );
  } catch (error) {
    console.error(JSON.stringify(error));
  } finally {
    console.log(`GET request finished for: ${URL} ${printDate()}`);
  }
};
