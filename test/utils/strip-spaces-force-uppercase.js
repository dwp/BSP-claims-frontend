'use strict';

const test = require('ava');
const sanitise = require('../../src/utils/strip-spaces-force-uppercase');

test('should export a function', t => {
  t.is(typeof sanitise, 'function');
});

test('should return a string', t => {
  const output = sanitise(' JJ 11 22 33 A ');
  t.is(typeof output, 'string');
});

test('should strip spaces from string', t => {
  const output = sanitise(' JJ 11 22 33 A ');
  t.is(output, 'JJ112233A');
});

test('should convert string to uppercase', t => {
  const output = sanitise('jj112233a');
  t.is(output, 'JJ112233A');
});

test('should throw error if input is not string', t => {
  const error = t.throws(() => sanitise(123), TypeError);
  t.is(error.message, 'input must be string');
});
