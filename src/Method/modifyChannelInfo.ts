import axios from 'axios';
import Constants from '../Constants';
import printDate from './printDate';

export default async (title: string) => {
  // https://dev.twitch.tv/docs/api/reference#modify-channel-information
  const { TWITCH_ID, TWITCH_TOKEN, TWITCH_CLIENT_ID } = process.env;
  const url = `${Constants.BROADCASTER_URL}=${TWITCH_ID}`;
  let count = 0;
  while (count < 5) {
    try {
      console.log(`Starting PATCH ${url} ${printDate()}`);
      const { status } = await axios.patch(
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
      if (status === 204) {
        return;
      }
    } catch (error) {
      console.error(error);
    } finally {
      console.log(`PATCH request finished for: ${url} ${printDate()}`);
      count += 1;
    }
  }
};
