'use strict';

module.exports = (category, verifications) => {
  if (typeof category !== 'string') {
    throw new TypeError('Category must be a string');
  }

  if (typeof verifications !== 'object') {
    throw new TypeError('Verifcation set must be an object');
  }

  return {
    category,
    verificationAttributeList: Object.keys(verifications).reduce((clone, key) => {
      if (!verifications[key]) {
        return clone;
      }

      if (typeof verifications[key] === 'string') {
        return [...clone, {attributeName: key, attributeValue: verifications[key]}];
      }

      throw new TypeError(`Verifcation ${key}'s value was not a string`);
    }, [])
  };
};
