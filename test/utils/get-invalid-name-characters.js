'use strict';

const test = require('ava');
const getInvalidNameCharacters = require('../../src/utils/get-invalid-name-characters');

test('should export a function', t => {
  t.is(typeof getInvalidNameCharacters, 'function');
});

test('should return a string', t => {
  const output = getInvalidNameCharacters('Hammond D. Eggs-O\'Benedict');
  t.is(typeof output, 'string');
});

test('should return an empty string if no characters are invalid', t => {
  const noInvalid = getInvalidNameCharacters('Hammond D. Eggs-O\'Benedict');
  t.is(noInvalid, '');
});

test('should return a \'!\' character that is not [A-Za-z\'\\-. ] in quotes', t => {
  const invalidCharacter = getInvalidNameCharacters('Hammond Eggs!');
  t.is(invalidCharacter, '‘!’');
});

test('should return a \'+\' character that is not [A-Za-z\'\\-. ] in quotes', t => {
  const invalidCharacter = getInvalidNameCharacters('Hammond+Eggs');
  t.is(invalidCharacter, '‘+’');
});

test('should return a comma separated list of characters that are not valid', t => {
  const invalidCharacter = getInvalidNameCharacters('Hamm0nd Eggs!');
  t.is(invalidCharacter, '‘0’, ‘!’');
});

test('should not return duplicates', t => {
  const invalidCharacter = getInvalidNameCharacters('Hamm0nd Eggs!!!!');
  t.is(invalidCharacter, '‘0’, ‘!’');
});

test('should throw error if input is not a string', t => {
  const error = t.throws(() => getInvalidNameCharacters(12345678), TypeError);
  t.is(error.message, 'Name must be a string');
});
