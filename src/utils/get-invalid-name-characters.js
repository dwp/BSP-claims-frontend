'use strict';

const returnUniqueBadCharacters = require('./return-unique-characters-in-array');

const invalidCharacters = /[^A-Za-z'\-. ]/g;

module.exports = name => {
  if (typeof name !== 'string') {
    throw new TypeError('Name must be a string');
  }

  const listOfCharacters = name.match(invalidCharacters);

  return returnUniqueBadCharacters(listOfCharacters);
};
