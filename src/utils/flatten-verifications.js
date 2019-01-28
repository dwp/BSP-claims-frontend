'use strict';

const flattenVerificationList = (clone, verificationItem) => ({
  ...clone,
  ...verificationItem.verificationAttributeList.reduce((clone, attribute) => {
    const combinedKey = verificationItem.category +
      attribute.attributeName.charAt(0).toUpperCase() +
      attribute.attributeName.substr(1);
    return {...clone, [combinedKey]: attribute.attributeValue};
  }, {})
});

module.exports = claim => {
  if (typeof claim !== 'object') {
    throw new TypeError('Claim must be an object');
  }

  const {verificationList, ...claimWithOutVerificationList} = claim;

  if (!verificationList) {
    return claimWithOutVerificationList;
  }

  return {
    ...claimWithOutVerificationList,
    ...verificationList.reduce(flattenVerificationList, {})
  };
};
