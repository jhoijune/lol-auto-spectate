import sleep from './sleep';
import Constants from '../Constants';
import { AuxData, Data, EventData } from '../types';
import orderStopSpectate from './orderStopSpectate';
import printDate from './printDate';
import axios from 'axios';

export default async (data: Data, auxData: AuxData) => {
  if (data.isSpectating) {
    try {
      console.log(`Starting GET ${Constants.EVENTDATA_URL} ${printDate()}`);
      const {
        data: { Events },
      } = await axios.get<EventData>(Constants.EVENTDATA_URL, {
        httpsAgent: data.httpsAgent,
        timeout: 5000,
      });
      for (const event of Events) {
        if (event.EventName === 'GameEnd') {
          console.log('Wait 10 seconds for normal shutdown');
          await sleep(10 * 1000);
          console.log('Normal Shutdown');
          orderStopSpectate(data);
          data.spectateRank = Constants.NONE;
        }
      }
    } catch {
      // 타임아웃
      console.log('Detected abnormal termination');
      orderStopSpectate(data);
    } finally {
      console.log(
        `GET request finished for: ${Constants.EVENTDATA_URL} ${printDate()}`
      );
    }
  }
};
