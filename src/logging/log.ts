import log4js from "log4js";
import path from "path";
import fs from "fs";
import { logConfig } from "../config/appConfig";
// Define the path.
const logDirectory = path.join(__dirname, '../logs');

// check if it exits
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}


// Log4JS configuration
log4js.configure({
  appenders: {
    app: { type: 'file', filename: path.join(logDirectory, 'app.log') },
    console: { type: 'console' },
    error: { type: 'file', filename: path.join(logDirectory, 'error.log') },
    websocket: { type: 'file', filename: path.join(logDirectory, 'websocket.log') },

  },
  categories: {
    default: { appenders: ['app','console'], level: logConfig.level ?? 'info'},
    error: { appenders: ['error', 'console'], level: 'error'},
    websocket: {appenders: ['websocket', 'console'], level: 'info'},
  }
});
const appLogger = log4js.getLogger('default');
const errorLogger = log4js.getLogger('error');
const websocketLogger = log4js.getLogger('websocket');

appLogger.info(`Logging level set to: ${logConfig.level}. ${logConfig.level == 'debug' ? 'THIS IS A SECURITY RISK! DELETE LOG WHEN YOU ARE FINISHED!' : ''}`);

export {
  appLogger,
  errorLogger,
  websocketLogger};
