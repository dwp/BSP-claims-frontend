'use strict';

const sanitiseSortCode = require('./sanitise-sort-code');

const validSortCode = /^\d{6}$/;

module.exports = function (sortCode) {
  return validSortCode.test(sanitiseSortCode(sortCode));
};
