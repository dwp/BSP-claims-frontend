'use strict';

const test = require('ava');
const getUniqueInvalidCharacters = require('../../src/utils/return-unique-characters-in-array');

test('should return unique characters in a string', t => {
  const noInvalid = getUniqueInvalidCharacters('%%%%||||,,,,,');
  t.is(noInvalid, '‘%’, ‘|’, ‘,’');
});

test('should return unique characters in an array', t => {
  const noInvalid = getUniqueInvalidCharacters(['%', '%', '%', '%', '|', '|', '|', '|', ',', ',', ',', ',', ',']);
  t.is(noInvalid, '‘%’, ‘|’, ‘,’');
});

test('should return unique characters in a string if only unique characters exist', t => {
  const noInvalid = getUniqueInvalidCharacters('%|,');
  t.is(noInvalid, '‘%’, ‘|’, ‘,’');
});

test('should return empty string if string is empty', t => {
  const noInvalid = getUniqueInvalidCharacters('');
  t.is(noInvalid, '');
});
