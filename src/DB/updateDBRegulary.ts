import { Data, DB } from '../types';
import updateDBEntirely from './updateDBEntirely';
import { searchSummonerID } from '../Method';

export default async (data: Data, db: DB) => {
  const instance = await db.Summoner.findOne({
    where: {
      id: data.currSummonerID,
    },
  });
  if (instance !== null) {
    const apiData = await searchSummonerID(instance.summoner_id);
    if (typeof apiData === 'number') {
      // 에러 발생
      switch (apiData) {
        case 403: {
          return;
        }
        case 404: {
          instance.destroy();
          break;
        }
      }
    } else if (apiData.name !== instance.name) {
      instance.name = apiData.name;
      instance.save();
    }
    data.currSummonerID += 1;
  } else {
    const maxId = await db.Summoner.max('id');
    if (typeof maxId === 'number' && data.currSummonerID <= maxId) {
      data.currSummonerID += 1;
    } else {
      await updateDBEntirely(db);
      data.currSummonerID = 1;
    }
  }
};
