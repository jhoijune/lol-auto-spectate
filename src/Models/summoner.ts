import { Sequelize, DataTypes } from 'sequelize';
import { SummonerInstance } from '../types';

export default (sequelize: Sequelize) => {
  return sequelize.define<SummonerInstance>(
    'summoner',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      summonerId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'summoner_id',
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      proId: {
        type: DataTypes.INTEGER,
        field: 'pro_id',
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    }
  );
};
