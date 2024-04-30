import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import {appLogger} from './logging/log';
import {Express} from "express";

// Set middleware
appLogger.info('Setting up API middleware');
const apiSpecPath = path.resolve(__dirname, '..', 'api-spec.yaml'); //eslint-disable-line no-undef
const swaggerDocument = YAML.load(apiSpecPath);

// @TODO: Add API spec to swaggerDocument
export default function setMiddleware(app: Express)  {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cors());
  app.use('/wisski-cloud-daemon/api/v1/api-specs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  morgan.token('time', () => new Date().toISOString());
  app.use(morgan('[:time] :remote-addr :method :url :status :res[content-length] :response-time ms'));
}

