'use strict';

const test = require('ava');
const removeVerification = require('../../src/utils/remove-verification');

test('should export a function', t => {
  t.is(typeof removeVerification, 'function');
});

test('should throw an error if claim is not an object', t => {
  const error = t.throws(() => removeVerification('not an object', 'age'), TypeError);
  t.is(error.message, 'Claim must be an object');
});

test('should throw an error if verificationList is not an Array', t => {
  const claim = {
    fullName: 'Hammond Eggs',
    verificationList: 'not an array'
  };
  const error = t.throws(() => removeVerification(claim, 'age'), TypeError);
  t.is(error.message, 'Can\'t remove verification, verificationList must be an Array');
});

test('should return claim if there is no verificationList list to remove an item from', t => {
  const claim = {
    fullName: 'Hammond Eggs'
  };
  const output = removeVerification(claim, 'age');
  t.deepEqual(claim, output);
});

test('should remove a verification object from the list by category', t => {
  const claim = {
    fullName: 'Hammond Eggs',
    verificationList: [
      {
        category: 'age',
        verificationAttributeList: [
          {
            attributeName: 'dateOfBirth',
            attributeValue: '2017-10-20'
          }
        ]
      },
      {
        category: 'height',
        verificationAttributeList: [
          {
            attributeName: 'height',
            attributeValue: '6ft'
          }
        ]
      }
    ]
  };

  const expectedOutput = {
    fullName: 'Hammond Eggs',
    verificationList: [{
      category: 'height',
      verificationAttributeList: [
        {
          attributeName: 'height',
          attributeValue: '6ft'
        }
      ]
    }]
  };

  const output = removeVerification(claim, 'age');

  t.deepEqual(output, expectedOutput);
});

test('should return an empty array if there\'s nothing left', t => {
  const claim = {
    fullName: 'Hammond Eggs',
    verificationList: [{
      category: 'age',
      verificationAttributeList: [
        {
          attributeName: 'dateOfBirth',
          attributeValue: '2017-10-20'
        }
      ]
    }]
  };

  const expectedOutput = {
    fullName: 'Hammond Eggs',
    verificationList: []
  };
  const output = removeVerification(claim, 'age');

  t.deepEqual(output, expectedOutput);
});
