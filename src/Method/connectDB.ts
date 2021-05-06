import { join } from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import {
  ChampionInstance,
  DB,
  ProInstance,
  SummonerInstance,
  TeamInstance,
} from '../types';

export default async (dbName: string = 'db') => {
  const { ASSET_PATH } = process.env;
  const dbPath =
    (ASSET_PATH && join(ASSET_PATH, `${dbName}.sqlite3`)) ||
    join(__dirname, '..', '..', 'assets', `${dbName}.sqlite3`);
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
  });
  const Champion = sequelize.define<ChampionInstance>(
    'champion',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      kor_name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      eng_name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    }
  );
  const Team = sequelize.define<TeamInstance>(
    'team',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      exact_name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    }
  );
  const Pro = sequelize.define<ProInstance>(
    'pro',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image_name: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      team_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    }
  );
  const Summoner = sequelize.define<SummonerInstance>(
    'summoner',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      summoner_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      summoner_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pro_id: {
        type: DataTypes.INTEGER,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    }
  );
  Team.hasMany(Pro, { foreignKey: 'team_id', sourceKey: 'id' });
  Pro.belongsTo(Team, { foreignKey: 'team_id', targetKey: 'id' });
  Pro.hasMany(Summoner, { foreignKey: 'pro_id', sourceKey: 'id' });
  Summoner.belongsTo(Pro, { foreignKey: 'pro_id', targetKey: 'id' });
  const db: DB = {
    Champion,
    Team,
    Summoner,
    Pro,
    sequelize,
  };
  await sequelize.sync();
  return db;
};
