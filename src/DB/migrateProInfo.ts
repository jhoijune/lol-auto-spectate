import { DB } from '../types';

export default async (db: DB, from: string, to: string) => {
  /**
   * from에 있는 summoner 정보 to에 이전하고
   * from 정보 파기
   */
  const fromInstance = await db.Pro.findOne({
    where: {
      name: from,
    },
  });
  const toInstance = await db.Pro.findOne({
    where: {
      name: to,
    },
  });
  if (fromInstance === null || toInstance === null) {
    return;
  }
  const fromSummonerInstances = await db.Summoner.findAll({
    where: {
      proId: fromInstance.id,
    },
  });
  for (const fromSummonerInstance of fromSummonerInstances) {
    fromSummonerInstance.proId = toInstance.id;
    fromSummonerInstance.save();
  }
  fromInstance.destroy();
};
