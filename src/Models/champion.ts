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
};
