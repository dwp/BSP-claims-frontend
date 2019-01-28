'use strict';

const test = require('ava');
const timekeeper = require('timekeeper');
const isFutureDate = require('../../src/utils/is-future-date');

test('should export a function', t => {
  t.is(typeof isFutureDate, 'function');
});

test('should return a boolean', t => {
  const date = new Date('3000', '12', '20');
  const anotherDate = new Date('3000', '12', '20');
  const output = isFutureDate(date, anotherDate);
  t.is(typeof output, 'boolean');
});

test('should return true if date is in the future', t => {
  const date = new Date('3000', '12', '20');
  const compareDate = new Date('2018', '12', '20');
  const output = isFutureDate(date, compareDate);
  t.true(output);
});

test('should return false if day isn\'t in the future', t => {
  const date = new Date('1967', '10', '20');
  const compareDate = new Date('2018', '12', '20');
  const output = isFutureDate(date, compareDate);
  t.false(output);
});

test('should return false if date is today', t => {
  const now = new Date();
  timekeeper.freeze(now);
  const output = isFutureDate(now, new Date());
  t.false(output, 'wasn\'t false when date was today');
  timekeeper.reset();
});

test('should return true if date is in the future and only date one parameter is passed in', t => {
  const date = new Date('3000', '12', '20');
  const output = isFutureDate(date);
  t.true(output);
});

test('should return false if date is today and only date one parameter is passed in', t => {
  const now = new Date();
  timekeeper.freeze(now);
  const output = isFutureDate(now);
  t.false(output, 'wasn\'t false when date was today');
  timekeeper.reset();
});

test('should throw error if input is not date', t => {
  const error = t.throws(() => isFutureDate(123), TypeError);
  t.is(error.message, 'inputs must be Dates');
});
