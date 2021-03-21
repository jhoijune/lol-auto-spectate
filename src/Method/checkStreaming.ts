import { GetStreamsResponse } from '../types';
import request from './request';

export default async (...ids: string[]) => {
  //https://dev.twitch.tv/docs/api/reference#get-streams
  try {
    const { TWITCH_TOKEN, TWITCH_CLIENT_ID } = process.env;
    const queries = ids.map((id) => `user_login=${id}`);
    const concat = queries.join('&');
    const {
      data: { data },
    } = await request<GetStreamsResponse>(
      'get',
      `https://api.twitch.tv/helix/streams?${concat}`,
      {
        headers: {
          Authorization: `Bearer ${TWITCH_TOKEN}`,
          'Client-Id': TWITCH_CLIENT_ID,
        },
      }
    );
    return data.length !== 0;
  } catch (error) {
    console.log(error);
    return false;
  }
};
