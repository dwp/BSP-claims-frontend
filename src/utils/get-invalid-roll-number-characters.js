'use strict';

const returnUniqueBadCharacters = require('./return-unique-characters-in-array');

const invalidCharacters = /[^A-Za-z0-9 /-]/g;

module.exports = function (rollNumber) {
  const listOfCharacters = rollNumber.match(invalidCharacters);

  return returnUniqueBadCharacters(listOfCharacters);
};

