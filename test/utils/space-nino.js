'use strict';

const test = require('ava');
const spaceNino = require('../../src/utils/space-nino');

const testNino = 'QQ112233A';

test('should be a funciton', t => {
  t.is(typeof spaceNino, 'function');
});

test('Should return a string', t => {
  const result = spaceNino(testNino);
  t.true(typeof result === 'string');
});

test('should space out the nino', t => {
  const result = spaceNino(testNino);

  t.deepEqual(result, 'QQ 11 22 33 A');
});
