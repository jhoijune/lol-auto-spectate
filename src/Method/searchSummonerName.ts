import axios from 'axios';
import Constants from '../Constants';
import { SummonerDTO } from '../types';
import printDate from './printDate';
import sleep from './sleep';

export default async (name: string) => {
  const { RIOT_API_KEY } = process.env;
  try {
    await sleep(Constants.RIOT_API_WAIT_TIME);
    console.log(
      `Starting GET ${Constants.SUMMONER_NAME_URL}${name} ${printDate()}`
    );
    const { data } = await axios.get<SummonerDTO>(
      `${Constants.SUMMONER_NAME_URL}${encodeURI(name)}`,
      {
        headers: {
          'X-Riot-Token': RIOT_API_KEY,
        },
      }
    );
    return data;
  } catch (error: any) {
    const errorCode = error.response?.data?.status?.status_code;
    if (typeof errorCode === 'number') {
      if (errorCode === 403) {
        console.log('Renew RIOT API key');
      } else if (errorCode === 429) {
        await sleep(Constants.RIOT_API_LIMIT_TIME);
      } else if (errorCode === 404) {
        console.log('Not found summoner name');
      }
      return errorCode;
    }
    return Constants.NONE;
  } finally {
    console.log(
      `GET request finished for: ${
        Constants.SUMMONER_NAME_URL
      }${name} ${printDate()}`
    );
  }
};
