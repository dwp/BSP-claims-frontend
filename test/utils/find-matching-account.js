'use strict';

const test = require('ava');
const findMatchingAccount = require('../../src/utils/find-matching-account');

const data = [
  {
    paymentAccountIdentifier: '111',
    thing: 'a'
  },
  {
    paymentAccountIdentifier: '222',
    thing: 'b'
  },
  {
    paymentAccountIdentifier: '333',
    thing: 'c'
  },
  {
    paymentAccountIdentifier: '444',
    thing: 'd'
  }
];

test('should return object from array where paymentAccountIdentifier property matches input', t => {
  const output = findMatchingAccount('222', data);
  t.deepEqual(output, data[1]);
});

test('should return and empty object if there is no match', t => {
  const output = findMatchingAccount('555', data);
  t.deepEqual(output, {});
});
