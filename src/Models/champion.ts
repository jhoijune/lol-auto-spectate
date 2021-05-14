import { Sequelize, DataTypes } from 'sequelize';
import { ChampionInstance } from '../types';

export default (sequelize: Sequelize) => {
  return sequelize.define<ChampionInstance>(
    'champion',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      korName: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        field: 'kor_name',
      },
      engName: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        field: 'eng_name',
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
