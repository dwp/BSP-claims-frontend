'use strict';

const test = require('ava');
const outputNameFormat = require('../../src/utils/is-valid-name-format');

test('should export a function', t => {
  t.is(typeof outputNameFormat, 'function');
});

test('should return a boolean', t => {
  const output = outputNameFormat(':)');
  t.is(typeof output, 'boolean');
});

test('should return true for alpha only name', t => {
  const output = outputNameFormat('Hammond Eggs');
  t.true(output);
});

test('should return true for names containing \', -, or .', t => {
  const output = outputNameFormat('George R R O\'Tolkien-McMartin');
  t.true(output);
});

test('should return true for names up to 35 characters', t => {
  t.plan(35);

  for (let i = 1; i < 36; i++) {
    const name = 'A';
    const extendedName = name.padStart(i, name);
    const output = outputNameFormat(extendedName);
    t.true(output);
  }
});

test('should return false for names containg characters other than A-Z, \', -, or .', t => {
  const output = outputNameFormat('Shouty McShoutface!');
  t.false(output);
});

test('should return false for names numeric characters', t => {
  const output = outputNameFormat('Agent 007');
  t.false(output);
});

test('should return false for names longer than 35 characters', t => {
  const output = outputNameFormat('Thirty Six Character Long Name Woman');
  t.false(output);
});

test('should return false for empty string', t => {
  const output = outputNameFormat('');
  t.false(output);
});

test('should throw error if input is not a string', t => {
  const error = t.throws(() => outputNameFormat(12345678), TypeError);
  t.is(error.message, 'Name must be a string');
});
