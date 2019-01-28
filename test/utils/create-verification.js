'use strict';

const test = require('ava');
const createVerifcation = require('../../src/utils/create-verification');

test('should export a function', t => {
  t.is(typeof createVerifcation, 'function');
});

test('should throw an error if category is not string', t => {
  const error = t.throws(() => createVerifcation(false, {}), TypeError);
  t.is(error.message, 'Category must be a string');
});

test('should throw an error if verifcation set is not an object', t => {
  const error = t.throws(() => createVerifcation('category', 'fail'), TypeError);
  t.is(error.message, 'Verifcation set must be an object');
});

test('should return a verification object from category and verifications', t => {
  const expectedOutput = {
    category: 'marriage',
    verificationAttributeList: [
      {
        attributeName: 'verifiedInCIS',
        attributeValue: 'true'
      },
      {
        attributeName: 'verifiedInNIRS',
        attributeValue: 'true'
      }
    ]
  };

  const output = createVerifcation('marriage', {
    verifiedInCIS: 'true',
    verifiedInNIRS: 'true'
  });

  t.deepEqual(output, expectedOutput);
});

test('should not add attributes which are falsey', t => {
  const output = createVerifcation('marriage', {
    verifiedInCIS: 'true',
    verifiedInNIRS: undefined,
    verifiedOnCERT: ''
  });

  const expectedOutput = {
    category: 'marriage',
    verificationAttributeList: [
      {
        attributeName: 'verifiedInCIS',
        attributeValue: 'true'
      }
    ]
  };

  t.deepEqual(output, expectedOutput);
});

test('should throw error if an attribute value is not a string (or undefined)', t => {
  const error = t.throws(() => createVerifcation('marriage', {
    verifiedInCIS: 'true',
    verifiedInNIRS: []
  }), TypeError);
  t.is(error.message, 'Verifcation verifiedInNIRS\'s value was not a string');
});
