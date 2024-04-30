import express, {NextFunction, Request, Response} from 'express';
const app = express();
import path from 'path';
import setMiddleware from './app.middleware';
import apiV1 from './api/v1/apiV1';
import { testDbConnection } from './db/connection';

// test db connection
testDbConnection();

// Express middleware
setMiddleware(app);

// Define EJS as Template Engine
app.set('view engine', 'ejs');

// Define public folder
app.use(express.static(path.join(__dirname, 'public')));
// Path to views
app.set('views', path.join(__dirname, 'templates'));

// Api base route
app.use('/wisski-cloud-daemon/api/v1/', apiV1);

app.get('/', (req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <link rel="icon" href="/favicon.ico" type="image/x-icon">
      <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
      <title>WissKI API Daemon</title>
    </head>
    <body>
      <h1>WissKI API Daemon</h1>
    </body>
    </html>
  `);
});

// Additional routes
app.use('*', (req: Request, res: Response) => {
  res.status(404).send('<!DOCTYPE html>\n' +
    '    <html>\n' +
    '    <head>\n' +
    '      <link rel="icon" href="/favicon.ico" type="image/x-icon">\n' +
    '      <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">\n' +
    '    </head>\n' +
    '    <body>\n' +
    '      Endpoint not found!!!! \n' +
    '    </body>\n' +
    '    </html>');
});


app.use((err :Error, req:Request, res: Response, next:NextFunction) => {
  if (res.headersSent) {
    return next(err)
  } else {
    res.status(500).send('Something went wrong!')
  }
});

export default app;
