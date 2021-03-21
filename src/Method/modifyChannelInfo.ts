import request from './request';

export default async (title: string) => {
  // https://dev.twitch.tv/docs/api/reference#modify-channel-information
  // FIXME: 여기도 에러남
  const { TWITCH_ID, TWITCH_TOKEN, TWITCH_CLIENT_ID } = process.env;
  try {
    await request(
      'patch',
      `https://api.twitch.tv/helix/channels?broadcaster_id=${TWITCH_ID}`,
      {
        data: { title },
        headers: {
          Authorization: `Bearer ${TWITCH_TOKEN}`,
          'Content-Type': 'application/json',
          'Client-Id': TWITCH_CLIENT_ID,
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
};
