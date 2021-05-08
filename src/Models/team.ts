import { Sequelize, DataTypes } from 'sequelize';
import { TeamInstance } from '../types';

export default (sequelize: Sequelize) => {
  return sequelize.define<TeamInstance>(
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
};
