'use strict';

const test = require('ava');
const isComplete = require('../../src/utils/is-complete.js');

test('should export a function', t => {
  t.is(typeof isComplete, 'function');
});

test('should return "view-claim:completed" if all parameters are truthy', t => {
  const output = isComplete('1', '2', '3', '4');
  t.is(output, 'complete');
});

test('should return "view-claim:incomplete" if some parameters are truthy', t => {
  const output = isComplete('1', '2', '', false);
  t.is(output, 'not-complete');
});

test('should return an empty string if no parameters are truthy', t => {
  const output = isComplete('', false);
  t.is(output, '');
});

test('should return an empty string if there are no parameters', t => {
  const output = isComplete();
  t.is(output, '');
});
