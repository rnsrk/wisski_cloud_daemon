import {appLogger} from "../logging/log";
import fs from 'fs';

const envPath = '.env';
require('dotenv').config({ path: envPath });

if (
  !process.env.APP_PORT ||
  !process.env.DB_HOST ||
  !process.env.DB_PORT ||
  !process.env.EXPOSED_PORT ||
  !process.env.LOG_LEVEL ||
  !process.env.MAIL_HOST ||
  !process.env.MAIL_PASSWORD ||
  !process.env.MAIL_PORT ||
  !process.env.MAIL_SECURE ||
  !process.env.MAIL_USER ||
  !process.env.POSTGRES_USER ||
  !process.env.POSTGRES_PASSWORD ||
  !process.env.POSTGRES_DB ||
  !process.env.WEBSOCKET_TOKEN ||
  !process.env.WEBSOCKET_URL
) {
  !process.env.WEBSOCKET_URL ||
  appLogger.warn('Some environment variables are missing. Please check your .env file.');
}
// Port configuration for the application
export const appConfig: { port: number, websocketToken: string, websocketUrl: string } = {
  port: process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 2912,
  websocketToken: process.env.WEBSOCKET_TOKEN || 'token',
  websocketUrl: process.env.WEBSOCKET_URL || 'ws://localhost:2912/'
};

// Database configuration for the application
export const dbConfig: {host: string, user: string, password: string, database: string } = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.POSTGRES_USER || 'root',
  password: process.env.POSTGRES_PASSWORD || 'password',
  database: process.env.POSTGRES_DB || 'db'
};

// Logging configuration for the application
export const logConfig: {level: string} = {
  level: process.env.LOG_LEVEL || 'info'
};

// Mail configuration for the application
export const mailConfig: {
  host: string,
  port: number,
  secure: boolean,
  auth:
  {
    user: string,
    pass: string
  }
} = {
  host: process.env.MAIL_HOST || 'mail.your-server.de',
  port: process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT, 10) : 25,
  secure: process.env.MAIL_SECURE ? process.env.MAIL_SECURE === 'true' : true,
  auth: {
    user: process.env.MAIL_USER || 'user',
    pass: process.env.MAIL_PASSWORD || 'pass'
  }
};
