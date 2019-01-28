'use strict';

const test = require('ava');
const getDateString = require('../../src/utils/get-date-string');

test('should export a function', t => {
  t.is(typeof getDateString, 'function');
});

test('should return a String', t => {
  const day = '12';
  const month = '10';
  const year = '2017';
  const result = getDateString(year, month, day);

  t.true(typeof result === 'string');
  t.is(result, '2017-10-12');
});

test('should return a String with padded zeros', t => {
  const day = '1';
  const month = '1';
  const year = '2017';
  const result = getDateString(year, month, day);

  t.is(result, '2017-01-01');
});

test('should return a String with padded zeros for month', t => {
  const day = '10';
  const month = '1';
  const year = '2017';
  const result = getDateString(year, month, day);

  t.is(result, '2017-01-10');
});

test('should return a String with padded zeros for day', t => {
  const day = '2';
  const month = '10';
  const year = '2017';
  const result = getDateString(year, month, day);

  t.is(result, '2017-10-02');
});

test('should not pad extra zero if zero is present already exist for day', t => {
  const day = '02';
  const month = '10';
  const year = '2017';
  const result = getDateString(year, month, day);

  t.is(result, '2017-10-02');
});

test('should not pad extra zero if zero is present already exist for month', t => {
  const day = '02';
  const month = '03';
  const year = '2017';
  const result = getDateString(year, month, day);

  t.is(result, '2017-03-02');
});

test('should throw error if undefined month passed', t => {
  const day = '02';
  const month = undefined;
  const year = '2017';

  t.throws(() => {
    getDateString(year, month, day);
  });
});

test('should throw error if undefined day passed', t => {
  const day = undefined;
  const month = '03';
  const year = '2017';

  t.throws(() => {
    getDateString(year, month, day);
  });
});

test('should throw not error if undefined year passed', t => {
  const day = '01';
  const month = '03';
  const year = undefined;

  getDateString(year, month, day);

  t.pass();
});
