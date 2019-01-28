'use strict';

const test = require('ava');
const isValidRollNumber = require('../../src/utils/is-valid-roll-number');

test('should return true if roll number is 18 characters', t => {
  const output = isValidRollNumber('123456789123456789');
  t.true(output);
});

test('should return false if roll number is less than 1 digits', t => {
  const output1 = isValidRollNumber('');
  t.false(output1);
});

test('should return false if roll number is more than 18 digits', t => {
  const output1 = isValidRollNumber('1234567898765432190');
  t.false(output1);
});

test('should return false if roll number contains commas , or pipes | ', t => {
  const output1 = isValidRollNumber('12345|67');
  const output2 = isValidRollNumber('1234,567');
  t.false(output1);
  t.false(output2);
});

test('should return true if roll number contains slash / , dash - or space  ', t => {
  const output1 = isValidRollNumber('12345/67');
  const output2 = isValidRollNumber('1234-567');
  const output3 = isValidRollNumber('1234 567');
  t.true(output1);
  t.true(output2);
  t.true(output3);
});
