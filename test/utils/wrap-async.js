'use strict';

const test = require('ava');
const wrapAsync = require('../../src/utils/wrap-async');

test('should export a function', t => {
  t.is(typeof wrapAsync, 'function');
});

test('return function', t => {
  const output = wrapAsync(() => 'test');
  t.is(typeof output, 'function');
});

test('should catch errors in func and pass them to the higher func’s next parameter', async t => {
  t.plan(2);

  function erroringFunc() {
    throw new Error('Test');
  }

  const wrapped = await wrapAsync(erroringFunc);

  const next = err => {
    t.true(err instanceof Error);
    t.is(err.message, 'Test');
  };

  await wrapped(null, null, next);
});

test('should catch async errors in func and pass them to the higher func’s next parameter', async t => {
  t.plan(2);

  async function erroringFunc() {
    await new Promise((resolve, reject) => reject(new Error('Test')));
  }

  const wrapped = await wrapAsync(erroringFunc);

  const next = err => {
    t.true(err instanceof Error);
    t.is(err.message, 'Test');
  };

  await wrapped(null, null, next);
});
