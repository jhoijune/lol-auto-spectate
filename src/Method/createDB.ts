import { promises as fs } from 'fs';
import { join } from 'path';
import Constants from '../Constants';
import connectDB from './connectDB';
import searchSummonerID from './searchSummonerID';
import updateDB from './updateDB';
import updateDBEntirely from './updateDBEntirely';

type Name = keyof typeof Constants.ID;

export default async () => {
  const { ASSET_PATH } = process.env;
  const structurePath =
    (ASSET_PATH && join(ASSET_PATH, 'structure.sqlite3')) ||
    join(__dirname, '..', '..', 'assets', 'structure.sqlite3');
  const buffers = await fs.readFile(structurePath);
  const dbPath =
    (ASSET_PATH && join(ASSET_PATH, 'db.sqlite3')) ||
    join(__dirname, '..', '..', 'assets', 'db.sqlite3');
  await fs.writeFile(dbPath, buffers);
  const db = await connectDB();
  const imagePath =
    (ASSET_PATH && join(ASSET_PATH, 'images')) ||
    join(__dirname, '..', '..', 'assets', 'images');
  let fileNames: string[];
  const imageMap = new Map<string, string>();
  try {
    fileNames = await fs.readdir(imagePath);
  } catch (error) {
    console.error(JSON.stringify(error));
    return;
  }
  for (const fileName of fileNames) {
    const [name] = fileName.split(' ');
    imageMap.set(name.trim().toLowerCase(), fileName);
  }
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
      await updateDB(db, data.name, proName, teamName, imageMap);
    }
  }
  if (!(await updateDBEntirely(db))) {
    return;
  }
  console.log('End db initialization');
};
