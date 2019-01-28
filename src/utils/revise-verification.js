'use strict';

module.exports = (claim, newVerification) => {
  if (typeof claim !== 'object') {
    throw new TypeError('Claim must be an object');
  }

  const {verificationList} = claim;

  if (!verificationList) {
    return {
      ...claim,
      verificationList: [newVerification]
    };
  }

  if (!Array.isArray(verificationList)) {
    throw new TypeError('Can\'t revise verifications, verificationList must be an Array');
  }

  const categoryIndex = verificationList.findIndex(v => v.category === newVerification.category);

  if (categoryIndex === -1) {
    return {
      ...claim,
      verificationList: [...verificationList, newVerification]
    };
  }

  return {
    ...claim,
    verificationList: [
      ...verificationList.slice(0, categoryIndex),
      newVerification,
      ...verificationList.slice(categoryIndex + 1)
    ]
  };
};
