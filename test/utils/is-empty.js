'use strict';

const test = require('ava');
const isEmpty = require('../../src/utils/is-empty');

test('should export a function', t => {
  t.is(typeof isEmpty, 'function');
});

test('should return boolean', t => {
  const output = isEmpty(':)');
  t.is(typeof output, 'boolean');
});

test('should return true if string is empty', t => {
  const output = isEmpty('');
  t.true(output);
});

test('should return false if string isn\'t empty', t => {
  const output = isEmpty('Test');
  t.false(output);
});

test('should throw error if input is not a string', t => {
  const error = t.throws(() => isEmpty(12345678), TypeError);
  t.is(error.message, 'Input must be a string');
});
