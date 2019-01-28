'use strict';

module.exports = function (accountId, paymentDetails) {
  return paymentDetails.find(e => parseInt(e.paymentAccountIdentifier, 10) === parseInt(accountId, 10)) || {};
};
