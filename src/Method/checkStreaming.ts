import axios from 'axios';
import Constants from '../Constants';
import { GetStreamsResponse } from '../types';
import printDate from './printDate';

export default async (...ids: string[]) => {
  //https://dev.twitch.tv/docs/api/reference#get-streams
  const { TWITCH_TOKEN, TWITCH_CLIENT_ID } = process.env;
  const queries = ids.map((id) => `user_login=${id}`);
  const concat = queries.join('&');
  const url = `${Constants.STREAMS_URL}?${concat}`;
  try {
    console.log(`Starting GET ${url} ${printDate()}`);
    const {
      data: { data },
    } = await axios.get<GetStreamsResponse>(url, {
      headers: {
        Authorization: `Bearer ${TWITCH_TOKEN}`,
        'Client-Id': TWITCH_CLIENT_ID,
      },
    });
    return data.length !== 0;
  } catch (error) {
    console.error(JSON.stringify(error));
    return false;
  } finally {
    console.log(`GET request finished for: ${url} ${printDate()}`);
  }
};
