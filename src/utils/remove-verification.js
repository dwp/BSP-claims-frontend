'use strict';

module.exports = (claim, category) => {
  if (typeof claim !== 'object') {
    throw new TypeError('Claim must be an object');
  }

  if (!claim.verificationList) {
    return {...claim};
  }

  if (!Array.isArray(claim.verificationList)) {
    throw new TypeError('Can\'t remove verification, verificationList must be an Array');
  }

  return {
    ...claim,
    verificationList: claim.verificationList.filter(v => v.category !== category)
  };
};
