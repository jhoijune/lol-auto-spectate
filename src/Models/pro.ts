import { Sequelize, DataTypes } from 'sequelize';
import { ProInstance } from '../types';

export default (sequelize: Sequelize) => {
  return sequelize.define<ProInstance>(
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
      imageName: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
        field: 'image_name',
      },
      teamId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        field: 'team_id',
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
