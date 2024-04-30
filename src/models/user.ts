import { DataTypes, Model, Sequelize } from "sequelize";

export default class User extends Model {
}

export function initUser(sequelize: Sequelize) {
  User.init({
    uid: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    status: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    mail: {
      type: DataTypes.STRING(254),
      allowNull: false
    },
  }, {
    tableName: "users_field_data",
    timestamps: false,
    sequelize, // passing the `sequelize` instance is required
  });

  return User;
}
