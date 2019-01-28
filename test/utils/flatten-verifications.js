'use strict';

const test = require('ava');
const flattenVerifications = require('../../src/utils/flatten-verifications');

test('should export a function', t => {
  t.is(typeof flattenVerifications, 'function');
});

test('should throw an if claim is not an object', t => {
  const error = t.throws(() => flattenVerifications('not an object'), TypeError);
  t.is(error.message, 'Claim must be an object');
});

test('should return the claim if there is no verification list', t => {
  const claim = {
    fullName: 'Hammond Eggs',
    dateOfbirth: '1985-03-23',
    changeInfoList: [
      {changeDescription: 'Changed'}
    ]
  };

  const output = flattenVerifications(claim);
  t.deepEqual(output, claim);
});

test('should return a copy of the claim with verifications flattened into it', t => {
  const claim = {
    fullName: 'Hammond Eggs',
    dateOfbirth: '1985-03-23',
    changeInfoList: [
      {changeDescription: 'Changed'}
    ],
    verificationList: [
      {
        category: 'marriage',
        verificationAttributeList: [
          {
            attributeName: 'verifiedByCert',
            attributeValue: 'Y'
          },
          {
            attributeName: 'verifiedInCIS',
            attributeValue: 'Y'
          },
          {
            attributeName: 'verifiedInNIRS',
            attributeValue: 'N'
          },
          {
            attributeName: 'dateOfMarriage',
            attributeValue: '2017-10-20'
          }
        ]
      },
      {
        category: 'age',
        verificationAttributeList: [
          {
            attributeName: 'dateOfBirth',
            attributeValue: '2017-10-20'
          }
        ]
      }
    ]
  };

  const expectedOutput = {
    fullName: 'Hammond Eggs',
    dateOfbirth: '1985-03-23',
    marriageVerifiedByCert: 'Y',
    marriageVerifiedInCIS: 'Y',
    marriageVerifiedInNIRS: 'N',
    marriageDateOfMarriage: '2017-10-20',
    ageDateOfBirth: '2017-10-20',
    changeInfoList: [
      {changeDescription: 'Changed'}
    ]
  };

  const output = flattenVerifications(claim);
  t.deepEqual(output, expectedOutput);
});
