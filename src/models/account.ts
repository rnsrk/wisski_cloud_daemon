import { DataTypes, Model, Sequelize } from "sequelize";

export default class Account extends Model {
}

export function initAccount(sequelize: Sequelize) {
  Account.init({
    aid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    uid: {
      type: DataTypes.INTEGER,
    },
    person_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    organisation: {
      type: DataTypes.STRING,
    },
    subdomain: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    validation_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    provisioned: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    tableName: "wisski_cloud_account_manager_accounts",
    timestamps: false,
    sequelize, // passing the `sequelize` instance is required
  });


    return Account;
  }
