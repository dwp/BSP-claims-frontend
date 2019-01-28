'use strict';

module.exports = (year, month, day) => {
  if (typeof year !== 'string' || typeof month !== 'string' || typeof day !== 'string') {
    throw new TypeError('year, month and day must be string');
  }

  const dateString = year + '-' + month.padStart(2, '0') + '-' + day.padStart(2, '0') + 'T00:00:00.000Z';
  const date = new Date(dateString);

  if (isNaN(date) || date.getMonth() + 1 !== parseInt(month, 10)) {
    return NaN;
  }

  return date;
};
