'use strict';

const isChildBenefitNumber = /^(CHB)?\d{8}[A-Z]{2}$/;

module.exports = input => {
  if (typeof input !== 'string') {
    throw new TypeError('input must be a string');
  }

  return isChildBenefitNumber.test(input);
};
