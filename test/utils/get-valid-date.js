'use strict';

const test = require('ava');
const getDate = require('../../src/utils/get-valid-date');

test('should export a function', t => {
  t.is(typeof getDate, 'function');
});

test('should return date object if date is valid date', t => {
  const output = getDate('2016', '12', '20');
  t.true(output instanceof Date);
  t.deepEqual(output, new Date('2016-12-20'));
});

test('should return NaN if day isn\'t valid', t => {
  const output = getDate('2016', '15', '50');
  t.is(output, NaN);
});

test('should return NaN if month isn\'t valid', t => {
  const output = getDate('2016', '50', '2');
  t.is(output, NaN);
});

test('should return NaN if year isn\'t valid', t => {
  const output = getDate('A', '12', '20');
  t.is(output, NaN);
});

test('should return NaN if date isn\'t valid date', t => {
  const output = getDate('2016', '02', '30');
  t.is(output, NaN);
});

test('should throw error if year isn\'t string', t => {
  const error = t.throws(() => getDate(2017, '11', '11'), TypeError);
  t.is(error.message, 'year, month and day must be string');
});

test('should throw error if month isn\'t string', t => {
  const error = t.throws(() => getDate('2017', 11, '11'), TypeError);
  t.is(error.message, 'year, month and day must be string');
});

test('should throw error if day isn\'t string', t => {
  const error = t.throws(() => getDate('2017', '11', 11), TypeError);
  t.is(error.message, 'year, month and day must be string');
});
