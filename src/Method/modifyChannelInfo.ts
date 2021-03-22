import axios from 'axios';
import Constants from '../Constants';
import printDate from './printDate';

export default async (title: string) => {
  // https://dev.twitch.tv/docs/api/reference#modify-channel-information
  // FIXME: 여기도 에러남
  const { TWITCH_ID, TWITCH_TOKEN, TWITCH_CLIENT_ID } = process.env;
  const url = `${Constants.BROADCASTER_URL}=${TWITCH_ID}`;
  try {
    console.log(`Starting PATCH ${url} ${printDate()}`);
    await axios.patch(
      url,
      { title },
      {
        headers: {
          Authorization: `Bearer ${TWITCH_TOKEN}`,
          'Content-Type': 'application/json',
          'Client-Id': TWITCH_CLIENT_ID,
        },
      }
    );
  } catch (error) {
    console.error(JSON.stringify(error));
  } finally {
    console.log(`PATCH request finished for: ${url} ${printDate()}`);
  }
};
