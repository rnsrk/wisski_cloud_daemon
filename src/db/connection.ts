import { Sequelize } from 'sequelize';
import { dbConfig, logConfig } from "../config/appConfig";
import { appLogger, errorLogger } from "../logging/log";

// create a Sequelize instance
export const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect: 'postgres',
  logging: logConfig.level == 'debug' ? msg => appLogger.debug(msg) : false,
});

// test db connection
export const testDbConnection = async () => {
  try {
    await sequelize.authenticate();
    appLogger.info('Successfully connected to database: ' + dbConfig.host);
  } catch (error) {
    errorLogger.error('Failed to connect to database: ' + dbConfig.host + ' error: ' + error);
  }
}
