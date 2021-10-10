import { Data, DB } from '../types';
import crawlingOPGG from './crawlingOPGG';
import { searchSummonerID } from '../Method';
import crawlingBC from './crawlingBC';

export default async (data: Data, db: DB) => {
  const instance = await db.Summoner.findOne({
    where: {
      id: data.currSummonerID,
    },
  });
  if (instance !== null) {
    const apiData = await searchSummonerID(instance.summonerId);
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
    if (typeof maxId === 'number' && data.currSummonerID < maxId) {
      if (data.currSummonerID === 24) {
        data.currSummonerID = 1403;
      } else {
        data.currSummonerID += 1;
      }
    } else {
      /*
      await crawlingOPGG(db);
      await crawlingBC(db);
      */
      data.currSummonerID = 1;
    }
  }
};
