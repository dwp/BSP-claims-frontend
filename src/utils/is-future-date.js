'use strict';

module.exports = (date, comparedDate = new Date()) => {
  if (date instanceof Date && comparedDate instanceof Date) {
    return date > comparedDate;
  }

  throw new TypeError('inputs must be Dates');
};
