'use strict';

const test = require('ava');
const redact = require('../../src/utils/redact');

test('should export a function', t => {
  t.is(typeof redact, 'function');
});

test('should return a redacted string when VERBOSE_LOGGING is not set', t => {
  process.env.VERBOSE_LOGGING = '';
  const output = redact('accountNumber:"12345678"');
  t.is(output, '"accountNumber:\\"REDACTED\\""');
});

test('should NOT return a redacted string when VERBOSE_LOGGING is set to `true`', t => {
  process.env.VERBOSE_LOGGING = 'true';
  delete require.cache[require.resolve('../../src/lib/constants')];
  delete require.cache[require.resolve('../../src/utils/redact')];

  const redact = require('../../src/utils/redact');
  const output = redact('accountNumber:"12345678"');

  t.is(output, 'accountNumber:"12345678"');
});

test('should return a redacted Nino', t => {
  const output = redact('AB100100A');
  t.is(output, '"REDACTED"');
});

test('should return a redacted account Number', t => {
  const output = redact('accountNumber:"12345678"');
  t.is(output, '"accountNumber:\\"REDACTED\\""');
});

test('should return a redacted sortCode', t => {
  const output = redact('sortCode:"121212"');
  t.is(output, '"sortCode:\\"REDACTED\\""');
});

test('should return a redacted rollNumber', t => {
  const output = redact('rollNumber:"1313131313"');
  t.is(output, '"rollNumber:\\"REDACTED\\""');
});

test('should return a redacted CHB', t => {
  const output = redact('CHB12345678BB');
  t.is(output, '"REDACTED"');
});

test('should return a redacted date of death', t => {
  const output = redact('dateOfDeath:"2013-03-02"');
  t.is(output, '"dateOfDeath:\\"REDACTED\\""');
});

test('should return a redacted date of births', t => {
  const output = redact('dateOfBirth:"2018-02-02"');
  t.is(output, '"dateOfBirth:\\"REDACTED\\""');
});

test('should return a redacted string for all attribute value dates', t => {
  const output = redact('attributeValue:"2018-02-02"');
  t.is(output, '"attributeValue:\\"REDACTED\\""');
});

test('should not redact string for all attribute values that are not dates', t => {
  const output = redact('attributeValue:"SillyString"');
  t.is(output, '"attributeValue:\\"SillyString\\""');
});
