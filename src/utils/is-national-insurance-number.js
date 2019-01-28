'use strict';

const isNationalInsuranceNumber = /^(?!BG|GB|NK|KN|TN|NT|ZZ)[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}\d{6}[A-D]{1}$/;

module.exports = input => {
  if (typeof input !== 'string') {
    throw new TypeError('Input must be a string');
  }

  return isNationalInsuranceNumber.test(input);
};
