'use strict';

require('marko/node-require').install();
require('lasso').configure(require('./config/lasso'));

const fs = require('fs');
const https = require('https');
const path = require('path');
const bodyParser = require('body-parser');
const csrf = require('csurf');
const express = require('express');
const helmet = require('helmet');
const i18next = require('i18next');
const favicon = require('serve-favicon');
const FilesystemBackend = require('i18next-node-fs-backend');
const i18nextMiddleware = require('i18next-express-middleware');
const markoExpress = require('marko/express');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const pino = require('./src/utils/pino');
const config = require('./config/app');
const error = require('./src/pages/error');

i18next
  .use(FilesystemBackend)
  .use(i18nextMiddleware.LanguageDetector)
  .init(require('./config/i18next'));

const app = express();
const port = process.env.PORT || 4001;

app.disable('x-powered-by');

app.get('/ping', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send('pong');
});

app.use(express.static('public'));
app.use('/static/:file', (req, res, next) => {
  res.setHeader('Cache-Control', 'max-age=365000000, immutable');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});
app.use(require('lasso/middleware').serveStatic());

app.use(i18nextMiddleware.handle(i18next));
app.use(bodyParser.urlencoded({extended: false}));

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(helmet(require('./config/helmet')));

app.use(markoExpress());

const sessionConfig = require('./config/session');
const store = new RedisStore(require('./config/redis'));

app.set('trust proxy', 1);
app.use(session({store, ...sessionConfig}));

app.use(csrf());

app.use((req, res, next) => {
  res.setHeader('X-UA-Compatible', 'ie=edge');
  next();
});

if (config.sslEnabled && config.mutualAuthenticationEnabled) {
  app.use(error.handleError);
}

app.use(require('./src/middleware/kong-auth'));

app.use('/claim/:claimId/*', require('./src/middleware/gate-keeper'));

app.use('/start-new-claim', require('./src/pages/start-new-claim'));
app.use('/find-claim', require('./src/pages/find-claim'));
app.use('/claim',
  require('./src/pages/start-new-claim'),
  require('./src/pages/duplicate-claim'),
  require('./src/pages/tasks-to-complete'),
  require('./src/pages/view'),
  require('./src/pages/schedule'),
  require('./src/pages/verify-relationship'),
  require('./src/pages/verify-death'),
  require('./src/pages/verify-child-benefit'),
  require('./src/pages/wait-for-evidence'),
  require('./src/pages/wait-for-death'),
  require('./src/pages/dependent-children'),
  require('./src/pages/change-dependent-children'),
  require('./src/pages/change-pregnant'),
  require('./src/pages/change-child-benefit'),
  require('./src/pages/confirm-dependent-children'),
  require('./src/pages/standard-rate'),
  require('./src/pages/disallow-pension-age'),
  require('./src/pages/disallow-relationship'),
  require('./src/pages/disallow-relationship-evidence'),
  require('./src/pages/payment-details'),
  require('./src/pages/change-payment-details'),
  require('./src/pages/disallow-death-evidence'),
  require('./src/pages/decision'),
  require('./src/pages/confirm-claim'),
  require('./src/pages/confirm-payment-details'),
  require('./src/pages/verify-ni-conts'),
  require('./src/pages/disallow-ni-conts'),
  require('./src/pages/stop'),
  require('./src/pages/delete')
);
app.use('/schedule',
  require('./src/pages/old-schedule'));
app.use('/', require('./src/pages/start-new-claim'));
app.use(require('./src/middleware/duplicate'));
app.use(require('./src/middleware/not-found'));
app.use(require('./src/pages/error'));

const server = config.sslEnabled ? https.createServer({
  key: fs.readFileSync(config.sslKeyPath),
  cert: fs.readFileSync(config.sslCertPath),
  ca: fs.readFileSync(config.sslCaPath),
  requestCert: config.mutualAuthenticationEnabled,
  rejectUnauthorized: false
}, app) : app;

module.exports = server.listen(port, err => {
  const protocol = config.sslEnabled ? '[HTTPS/SSL]' : '[HTTP]';

  if (err) {
    pino.error(`${protocol} Errored while listening on ${port}.\n${err}`);
    throw err;
  }

  pino.info(`${protocol} BSP Manager listening on port ${port}.`);
});
