'use strict';

import {serial as test} from 'ava';

const got = require('got');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
process.env.MUTUAL_AUTHENTICATION_ENABLED = false;
process.env.KONG_ENABLED = false;
process.env.PORT = 4567;
process.env.SSL_KEY_PATH = 'node_modules/test-certs/certs/server.pem';
process.env.SSL_CERT_PATH = 'node_modules/test-certs/certs/server.crt';
process.env.SSL_CA_PATH = 'node_modules/test-certs/certs/ca.pem';

test.beforeEach(() => {
  delete require.cache[require.resolve('../../server.js')];
  delete require.cache[require.resolve('../../config/app.js')];
});

test('should serve on HTTP if false', async t => {
  process.env.SSL_ENABLED = 'false';
  const server = require('../../server.js');

  const url = 'http://localhost:4567/ping';

  const fullRequest = await got.get(url);

  t.is(fullRequest.statusCode, 200);
  server.close();
});

test('should not serve on HTTPS if false', async t => {
  process.env.SSL_ENABLED = 'false';
  const server = require('../../server.js');

  const url = 'https://localhost:4567/ping';

  const error = await t.throwsAsync(got.get(url));

  t.true(error instanceof Error);
  server.close();
});

test('should serve on HTTPS if true', async t => {
  process.env.SSL_ENABLED = 'true';
  const server = require('../../server.js');

  const url = 'https://localhost:4567/ping';

  const fullRequest = await got.get(url);

  t.is(fullRequest.statusCode, 200);
  server.close();
});

test('should not serve on HTTP if true', async t => {
  process.env.SSL_ENABLED = 'true';
  const server = require('../../server.js');

  const url = 'http://localhost:4567/ping';

  const error = await t.throwsAsync(got.get(url, {timeout: 10, retry: 0}));

  t.true(error instanceof Error);
  server.close();
});
