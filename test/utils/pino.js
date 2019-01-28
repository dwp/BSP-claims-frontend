const test = require('ava');
const sinon = require('sinon');

const pino = require('../../src/utils/pino');

test.before(() => {
  sinon.replace(pino, 'info', sinon.fake());
  sinon.replace(pino, 'error', sinon.fake());
  process.env.NODE_ENV = 'Not Test';
});

test.after(() => {
  process.env.NODE_ENV = 'test';
});

test('should export an object', t => {
  t.is(typeof pino, 'object');
});
