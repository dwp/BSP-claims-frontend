'use strict';

const test = require('ava');
const sanitiseSortCode = require('../../src/utils/sanitise-sort-code');

test('should remove any spaces from sort code', t => {
  const output = sanitiseSortCode('12 34 56');
  t.is(output, '123456');
});

test('should remove any dashes from sort code', t => {
  const output = sanitiseSortCode('12-34-56');
  t.is(output, '123456');
});

