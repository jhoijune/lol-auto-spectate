import Constants from '../Constants';
import { crawl, crawl2, searchSummonerID } from '../Method';
import updateDB from './updateDB';
import updateDBEntirely from './updateDBEntirely';
import { DB } from '../types';

type Name = keyof typeof Constants.ID;

export default async (db: DB) => {
  for (const teamAndName in Constants.ID) {
    if (!(teamAndName in Constants.ID)) continue;
    const [teamName, proName] = teamAndName.split(' ');
    for (const id of Constants.ID[teamAndName as Name]) {
      const data = await searchSummonerID(id);
      if (typeof data === 'number') {
        switch (data) {
          case 403: {
            return;
          }
          default: {
            continue;
          }
        }
      }
      if (!(await updateDB(db, data.name, proName, teamName))) {
        return;
      }
    }
  }
  if (!(await updateDBEntirely(db))) {
    return;
  }
  await crawl(db);
  await crawl2(db);
  console.log('End db initialization');
};
