'use strict';

const test = require('ava');
const isNino = require('../../src/utils/is-national-insurance-number');

test('should export a function', t => {
  t.is(typeof isNino, 'function');
});

test('should return a boolean', t => {
  const output = isNino(':)');
  t.is(typeof output, 'boolean');
});

test('should return true if valid format (2 chars, 6 numbers, 1 char)', t => {
  const output = isNino('JJ123123D');
  t.true(output);
});

test('should return false if contains less than 6 numbers', t => {
  const output = isNino('JJ12312D');
  t.false(output);
});

test('should return false if contains more than 6 numbers', t => {
  const output = isNino('JJ1231234D');
  t.false(output);
});

test('should return true if 6 middle chars are digits from 0-9', t => {
  t.plan(10);

  for (let i = 0; i < 10; i++) {
    const string = String(i);
    const number = string.padStart(6, string);
    const output = isNino(`AA${number}A`);
    t.true(output);
  }
});

test('should return false if contains a letter amongst the numbers', t => {
  const output1 = isNino('JJA11111D');
  const output2 = isNino('JJ1A1111D');
  const output3 = isNino('JJ11A111D');
  const output4 = isNino('JJ111A11D');
  const output5 = isNino('JJ1111A1D');
  const output6 = isNino('JJ11111AD');
  t.false(output1);
  t.false(output2);
  t.false(output3);
  t.false(output4);
  t.false(output5);
  t.false(output6);
});

test('should return false if does not end in a letter', t => {
  const output = isNino('JJ123123');
  t.false(output);
});

test('should return false if numeric section contains alpha', t => {
  const output = isNino('JJ123A56D');
  t.false(output);
});

test('should return false if less than 1 alpha at start of string', t => {
  const output1 = isNino('D123123A');
  const output2 = isNino('123123A');
  t.false(output1);
  t.false(output2);
});

test('should return false if contains spaces', t => {
  const output1 = isNino('JJ 11 22 33 D');
  const output2 = isNino(' JJ123123D ');
  t.false(output1);
  t.false(output2);
});

test('should return true if the first char is in the set [A-CEGHJ-PR-TW-Z]', t => {
  t.plan(20);

  for (const char of 'ABCEGHJKLMNOPRSTWXYZ') {
    const output = isNino(`${char}A123123D`);
    t.true(output);
  }
});

test('should return false if the first char is not in the set [A-CEGHJ-PR-TW-Z]', t => {
  t.plan(6);

  for (const char of 'DFIQUV') {
    const output = isNino(`${char}A123123D`);
    t.false(output);
  }
});

test('should return true if the second char is in the set [A-CEGHJ-NPR-TW-Z]', t => {
  t.plan(19);

  for (const char of 'ABCEGHJKLMNPRSTWXYZ') {
    const output = isNino(`A${char}123123D`);
    t.true(output);
  }
});

test('should return false if the second char is not in the set [A-CEGHJ-NPR-TW-Z]', t => {
  t.plan(7);

  for (const char of 'DFIOQUV') {
    const output = isNino(`A${char}123123D`);
    t.false(output);
  }
});

test('should return true if final char is A, B, C or D', t => {
  t.plan(4);

  for (const char of 'ABCD') {
    const output = isNino(`JJ123123${char}`);
    t.true(output);
  }
});

test('should return false if final char is in the range [E-Z]', t => {
  t.plan(22);

  for (const char of 'EFGHIJKLMNOPQRSTUVWXYZ') {
    const output = isNino(`JJ123123${char}`);
    t.false(output);
  }
});

test('should return false if starts with BG, GB, NK, KN, TN, NT or ZZ', t => {
  t.plan(7);

  for (const chars of ['BG', 'GB', 'NK', 'KN', 'TN', 'NT', 'ZZ']) {
    const output = isNino(`${chars}123123A`);
    t.false(output);
  }
});

test('should return false if valid characters are lower case', t => {
  const output1 = isNino('Jj123123D');
  const output2 = isNino('jJ123123D');
  const output3 = isNino('Jj123123d');
  const output4 = isNino('jJ123123d');
  const output5 = isNino('jj123123D');
  const output6 = isNino('jj123123d');
  t.false(output1);
  t.false(output2);
  t.false(output3);
  t.false(output4);
  t.false(output5);
  t.false(output6);
});

test('should throw error if input is not a string', t => {
  const error = t.throws(() => isNino(12345678), TypeError);
  t.is(error.message, 'Input must be a string');
});
