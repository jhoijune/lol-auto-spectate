import { Op } from 'sequelize';

import connectDB from '../Models';
import { DB } from '../types';

export default async (db: DB, name: string, exactName?: string) => {
  const structureDb = await connectDB({ dbName: 'structure' });
  if (typeof exactName === 'undefined') {
    const dbInstance = await db.Team.findOne({
      where: {
        [Op.or]: [
          { name: { [Op.like]: name } },
          { exactName: { [Op.like]: name } },
        ],
      },
    });
    const structureDbInstance = await structureDb.Team.findOne({
      where: {
        [Op.or]: [
          { name: { [Op.like]: name } },
          { exactName: { [Op.like]: name } },
        ],
      },
    });
    if (dbInstance !== null) {
      dbInstance.destroy();
    }
    if (structureDbInstance !== null) {
      structureDbInstance.destroy();
    }
    return;
  }
  const searchedByName = await db.Team.findOne({
    where: {
      name,
    },
  });
  const searchedByExactName = await db.Team.findOne({
    where: {
      exactName: exactName,
    },
  });
  if (searchedByName === null && searchedByExactName === null) {
    try {
      db.Team.create({
        name,
        exactName: exactName,
      });
    } catch {}
    try {
      structureDb.Team.create({
        name,
        exactName: exactName,
      });
    } catch {}
  } else if (searchedByName === null && searchedByExactName !== null) {
    searchedByExactName.name = name;
    searchedByExactName.save();
    const teamInstance = await structureDb.Team.findOne({
      where: {
        exactName: exactName,
      },
    });
    if (teamInstance !== null) {
      teamInstance.name = name;
      teamInstance.save();
    }
  } else if (searchedByExactName === null && searchedByName !== null) {
    searchedByName.exactName = exactName;
    searchedByName.save();
    const teamInstance = await structureDb.Team.findOne({
      where: {
        name,
      },
    });
    if (teamInstance !== null) {
      teamInstance.exactName = exactName;
      teamInstance.save();
    }
  }
};
