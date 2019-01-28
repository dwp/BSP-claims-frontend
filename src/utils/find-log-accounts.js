'use strict';

const findMatchingAccount = require('./find-matching-account');

const ids = /\d+/g;

module.exports = function (changeSummary, paymentAccounts) {
  const [fromId, toId] = changeSummary.match(ids);

  return {
    from: findMatchingAccount(fromId, paymentAccounts),
    to: findMatchingAccount(toId, paymentAccounts)
  };
};
