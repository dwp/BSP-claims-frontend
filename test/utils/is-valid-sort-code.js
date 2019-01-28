'use strict';

const test = require('ava');
const isValidSortCode = require('../../src/utils/is-valid-sort-code');

test('should return true if sort code is six digits', t => {
  const output = isValidSortCode('123456');
  t.true(output);
});

test('should return true if sort code is six digits separated by spaces', t => {
  const output = isValidSortCode('11 22 33');
  t.true(output);
});

test('should return true if sort code is six digits separated by dashes', t => {
  const output = isValidSortCode('11-22-33');
  t.true(output);
});

test('should return false if sort code does not contain six digits', t => {
  const output1 = isValidSortCode('12345');
  const output2 = isValidSortCode('1234567');
  t.false(output1);
  t.false(output2);
});

test('should return false if sort code contains characters other than a number, dash or space', t => {
  const output1 = isValidSortCode('11/22/33');
  const output2 = isValidSortCode('AA-22-44');
  t.false(output1);
  t.false(output2);
});

