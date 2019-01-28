'use strict';

const test = require('ava');
const getInvalidRollNumberChars = require('../../src/utils/get-invalid-roll-number-characters');

test('should return an empty string if no characters are invalid', t => {
  const noInvalid = getInvalidRollNumberChars('AA/- BB123456789');
  t.is(noInvalid, '');
});

test('should return a \'!\' character that is not [A-Za-z\'\\-. ] in quotes', t => {
  const invalidCharacter = getInvalidRollNumberChars('AA!123456789');
  t.is(invalidCharacter, '‘!’');
});

test('should return a \'+\' character that is not [A-Za-z\'\\-. ] in quotes', t => {
  const invalidCharacter = getInvalidRollNumberChars('+AA/-87654323456');
  t.is(invalidCharacter, '‘+’');
});

test('should return a comma separated list of characters that are not valid', t => {
  const invalidCharacter = getInvalidRollNumberChars('%AA134567654&hg!');
  t.is(invalidCharacter, '‘%’, ‘&’, ‘!’');
});

test('should not return duplicates', t => {
  const invalidCharacter = getInvalidRollNumberChars('$$$$$AA14534&&&&!!!!');
  t.is(invalidCharacter, '‘$’, ‘&’, ‘!’');
});
