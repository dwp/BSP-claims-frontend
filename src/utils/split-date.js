'use strict';

const isValidDateString = /^[\d]{4}-[\d]{2}-[\d]{2}/;

module.exports = dateString => {
  if (isValidDateString.test(dateString)) {
    return {
      year: parseInt(dateString.substr(0, 4), 10),
      month: parseInt(dateString.substr(5, 7), 10),
      day: parseInt(dateString.substr(8, 10), 10)
    };
  }

  return {context: 'invalid'};
};
