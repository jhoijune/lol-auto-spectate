import { join } from 'path';
import { Sequelize } from 'sequelize';

import { DB } from '../types';
import Champion from './champion';
import Pro from './pro';
import Summoner from './summoner';
import Team from './team';

const defaultConfig = {
  logging: true,
  dbName: 'db',
};

export default async (config?: { logging?: boolean; dbName?: string }) => {
  const mergedConfig = {
    ...defaultConfig,
    ...config,
  };
  const { ASSET_PATH } = process.env;
  const dbPath =
    (ASSET_PATH && join(ASSET_PATH, `${mergedConfig.dbName}.sqlite3`)) ||
    join(__dirname, '..', '..', 'assets', `${mergedConfig.dbName}.sqlite3`);
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: mergedConfig.logging ? console.log : false,
  });
  const db: DB = {
    Champion: Champion(sequelize),
    Team: Team(sequelize),
    Summoner: Summoner(sequelize),
    Pro: Pro(sequelize),
    sequelize,
  };
  db.Team.hasMany(db.Pro, { foreignKey: 'team_id', sourceKey: 'id' });
  db.Pro.belongsTo(db.Team, { foreignKey: 'team_id', targetKey: 'id' });
  db.Pro.hasMany(db.Summoner, { foreignKey: 'pro_id', sourceKey: 'id' });
  db.Summoner.belongsTo(db.Pro, { foreignKey: 'pro_id', targetKey: 'id' });
  await sequelize.sync();
  return db;
};
