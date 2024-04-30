import app from "../app";
import {appConfig} from "../config/appConfig";
import {appLogger} from "../logging/log";
import {createServer} from "http";
// get port from config
const port = appConfig.port;
const server = createServer(app);

// start server
server.listen(port, () => {
  appLogger.info(`Server is running on port ${port}`);
});
