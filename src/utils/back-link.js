'use strict';

module.exports = {
  storeBackLink: (location, backArray) => {
    if (Array.isArray(backArray)) {
      return [...backArray, location];
    }

    return [location];
  },
  returnLink: (backArray, location) => {
    if (Array.isArray(backArray)) {
      if (location === backArray[backArray.length - 1]) {
        backArray.pop();
      }

      return backArray[backArray.length - 1];
    }

    return 'view';
  }
};
