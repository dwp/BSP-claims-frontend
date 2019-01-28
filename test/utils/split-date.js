'use strict';

const test = require('ava');
const splitDate = require('../../src/utils/split-date');

test('should export a function', t => {
  t.is(typeof splitDate, 'function');
});

test('should return an object', t => {
  const date = '2017-12-17';
  const result = splitDate(date);
  t.is(typeof result, 'object');
});

test('should return a context property of \'invalid\' when invalid string input sent', t => {
  const date = 'I-AM-NOT-A-DATE';
  const result = splitDate(date);
  t.deepEqual(result, {context: 'invalid'});
});

test('should return a context property of \'invalid\' when invalid type of input sent', t => {
  const date = 1;
  const result = splitDate(date);
  t.deepEqual(result, {context: 'invalid'});
});

test('should return object with a day property', t => {
  const date = '2017-11-12';
  const result = splitDate(date);
  t.is(result.day, 12);
});

test('should return object with a single digit day property when day of month is < 10', t => {
  const date = '2017-12-09';
  const result = splitDate(date);
  t.is(result.day, 9);
});

test('should return object with a single digit day property when day of month is > 10', t => {
  const date = '2017-12-25';
  const result = splitDate(date);
  t.is(result.day, 25);
});

test('should return object with a month property', t => {
  const date = '2017-09-15';
  const result = splitDate(date);
  t.is(result.month, 9);
});

test('should return object with a year property', t => {
  const date = '2017-12-11';
  const result = splitDate(date);
  t.is(result.year, 2017);
});

test('should support ISO date-time format', t => {
  const date = '2017-12-01T12:30:00.000~';
  const result = splitDate(date);
  t.deepEqual(result, {year: 2017, month: 12, day: 1});
});
