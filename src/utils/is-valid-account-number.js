'use strict';

const validAccountNumber = /^\d{8}$/;

module.exports = function (input) {
  return validAccountNumber.test(input);
};
