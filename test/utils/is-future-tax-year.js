'use strict';

const test = require('ava');
const timekeeper = require('timekeeper');
const isFutureTaxYear = require('../../src/utils/is-future-tax-year.js');

test.serial('should export a function', t => {
  t.is(typeof isFutureTaxYear, 'function');
});

test.serial('should return false if year is a past year', t => {
  const pastYear = (new Date().getFullYear()) - 2;
  const output = isFutureTaxYear(pastYear);

  t.false(output);
});

test('should return false if year is not a number', t => {
  const pastYear = 'random text for testing';
  const output = t.throws(() => {
    isFutureTaxYear(pastYear);
  }, TypeError);

  t.is(output.message, 'NIYear must be a number');
});

test.serial('should return true if year is a future year', t => {
  const nextYear = (new Date().getFullYear()) + 1;
  const output = isFutureTaxYear(nextYear);

  t.true(output);
});

test.serial('should return true if year is this year', t => {
  const thisYear = (new Date().getFullYear());
  const output = isFutureTaxYear(thisYear);

  t.true(output);
});

test.serial('should return true if year is last year and it is currently before April 6 of this year', t => {
  timekeeper.freeze(new Date('2018-04-05'));
  const output = isFutureTaxYear(2017);

  t.true(output);
  timekeeper.reset();
});

test.serial('should return false if year is this last and it is currently is April 6 of this year', t => {
  timekeeper.freeze(new Date('2018-04-06'));
  const output = isFutureTaxYear(2017);

  t.false(output);
  timekeeper.reset();
});

test.serial('should return false if year is last year is currently after April 6', t => {
  timekeeper.freeze(new Date('2018-04-07'));
  const output = isFutureTaxYear(2017);

  t.false(output);
  timekeeper.reset();
});
