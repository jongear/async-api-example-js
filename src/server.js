const dotenv = require('dotenv');
dotenv.config();
const config = require('./config');
const models = require('./models');
const express = require('express');
const morgan = require('morgan');
const routes = require('./routes');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('src/docs/swagger.yml');

const setupServer = async () => {
  const app = express();

  const devMode =
    config.serverSettings.nodeEnv ===
    config.serverSettings.CONSTANTS.ENVIRONMENT.DEVELOPMENT;

  if (devMode) {
    app.use(morgan('dev'));
  }

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  // Add CORS support for localhost:8080 -hub-ui
  app.use((req, res, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, OPTIONS, PUT, PATCH, DELETE'
    );

    // Request headers you wish to allow
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-Requested-With, Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization'
    );

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Pass to next layer of middleware
    next();
  });

  app.use(express.static('src/docs'));

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use((req, res, next) => {
    res.header('Content-Type', 'application/json');
    next();
  });

  app.get('/', (req, res, next) => {
    res.redirect('/api-docs/swagger');
  });

  app.use('/api', routes);

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handler
  // no stacktraces leaked to user unless in development environment
  app.use((err, req, res, next) => {
    let ip = 'unknown';

    try {
      ip = (
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress
      ).split(',')[0];
    } catch (err) {}

    err.remoteAddress = ip;
    err.requestUrl = req.originalUrl;
    err.params = req.params;
    err.httpMethod = req.method;
    if (req.method === 'POST' || req.method === 'PUT') {
      err.requestBody = req.body;
    }
    err.status = err.status || 500;
    if (err.status >= 500) {
      console.error(err);
    } else {
      console.warn(err);
    }

    if (devMode) {
      res.status(err.status || 500).send({
        message: err.message,
        error: err
      });
    } else {
      res.status(err.status || 500).send({
        message: err.message
      });
    }
  });

  await models.sequelize.sync();

  const appListenPromise = new Promise((resolve, reject) => {
    app.listen(config.serverSettings.port, () => {
      console.log(
        `App listening at http://localhost:${config.serverSettings.port}`
      );
      resolve();
    });
  });

  await appListenPromise;
};

setupServer();
