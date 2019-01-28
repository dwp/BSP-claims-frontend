'use strict';

module.exports = NIYear => {
  if (typeof NIYear !== 'number') {
    throw new TypeError('NIYear must be a number');
  }

  const today = new Date();
  const lastYear = today.getFullYear() - 1;

  if (NIYear < lastYear) {
    return false;
  }

  if (NIYear > lastYear) {
    return true;
  }

  const thisMonth = today.getMonth();

  if (thisMonth > 3 || (thisMonth === 3 && today.getDate() >= 6)) {
    return false;
  }

  return true;
};
