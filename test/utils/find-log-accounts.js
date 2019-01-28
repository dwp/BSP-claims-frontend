'use strict';

const test = require('ava');
const findLogAccounts = require('../../src/utils/find-log-accounts');

test('should export a function', t => {
  t.is(typeof findLogAccounts, 'function');
});

test('should return the two account objects matching the input string', t => {
  const changeSummary = 'oldPaymentAccountId:1, newPaymentAccountId:2';
  const accountDetails = [
    {
      paymentAccountIdentifier: 2,
      sortCode: '654321',
      accountNumber: '87654321',
      accountName: 'Duke Red'
    },
    {
      paymentAccountIdentifier: 1,
      sortCode: '123456',
      accountNumber: '12345678',
      accountName: 'Hammond Eggs'
    }
  ];

  const output = findLogAccounts(changeSummary, accountDetails);
  t.deepEqual(output, {
    from: accountDetails[1],
    to: accountDetails[0]
  });
});
