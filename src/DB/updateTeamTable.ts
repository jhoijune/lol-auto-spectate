import { Op } from 'sequelize';

import connectDB from '../Models';

export default async (name: string, exactName?: string) => {
  const db = await connectDB();
  const structureDb = await connectDB('structure');
  if (typeof exactName === 'undefined') {
    const dbInstance = await db.Team.findOne({
      where: {
        [Op.or]: [
          { name: { [Op.like]: name } },
          { exact_name: { [Op.like]: name } },
        ],
      },
    });
    const structureDbInstance = await structureDb.Team.findOne({
      where: {
        [Op.or]: [
          { name: { [Op.like]: name } },
          { exact_name: { [Op.like]: name } },
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
      exact_name: exactName,
    },
  });
  if (searchedByName === null && searchedByExactName === null) {
    db.Team.create({
      exact_name: exactName,
      name,
    });
    structureDb.Team.create({
      exact_name: exactName,
      name,
    });
  } else if (searchedByName === null && searchedByExactName !== null) {
    searchedByExactName.name = name;
    searchedByExactName.save();
    const teamInstance = await structureDb.Team.findOne({
      where: {
        exact_name: exactName,
      },
    });
    if (teamInstance !== null) {
      teamInstance.name = name;
      teamInstance.save();
    }
  } else if (searchedByExactName === null && searchedByName !== null) {
    searchedByName.exact_name = exactName;
    searchedByName.save();
    const teamInstance = await structureDb.Team.findOne({
      where: {
        name,
      },
    });
    if (teamInstance !== null) {
      teamInstance.exact_name = exactName;
      teamInstance.save();
    }
  }
};
