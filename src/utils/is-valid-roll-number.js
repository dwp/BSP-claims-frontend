'use strict';

const validRollNumber = /^[A-Za-z0-9 /-]{1,18}$/;

module.exports = function (input) {
  return validRollNumber.test(input);
};
