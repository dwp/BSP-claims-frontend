'use strict';

const test = require('ava');
const isValidAccountNumber = require('../../src/utils/is-valid-account-number');

test('should return true if account number is 8 digits', t => {
  const output = isValidAccountNumber('12345678');
  t.true(output);
});

test('should return false if account number is less than 8 digits', t => {
  const output1 = isValidAccountNumber('1234567');
  t.false(output1);
});

test('should return false if account number is more than 10 digits', t => {
  const output1 = isValidAccountNumber('12345678910');
  t.false(output1);
});

test('should return false if account number contains characters other than a number', t => {
  const output1 = isValidAccountNumber('A1234567');
  const output2 = isValidAccountNumber('!1234567');
  t.false(output1);
  t.false(output2);
});
