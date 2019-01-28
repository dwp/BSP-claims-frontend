'use strict';

process.env.NODE_ENV = 'something else';

const test = require('ava');
const sinon = require('sinon');
const logger = require('../../src/utils/logger');

const pino = require('../../src/utils/pino');

test.before(() => {
  sinon.replace(pino, 'info', sinon.fake());
});

test.after(() => {
  sinon.restore();
  delete process.env.NODE_ENV;
});

test('should export an object containing two functions', t => {
  t.is(typeof logger, 'object');
  t.is(typeof logger.response, 'function');
  t.is(typeof logger.request, 'function');
});

test('should log info on request', t => {
  logger.request({stuff: 'is Here'}, {stuff: 'is Here'}, 'label', 'url');
  t.true(pino.info.calledOnce);
});

test('should log info on response', t => {
  const response = {
    headers: {
      interactionId: 'blah'
    },
    body: 'heres A body'
  };
  logger.response(response, 'label');
  t.true(pino.info.calledTwice);
});
