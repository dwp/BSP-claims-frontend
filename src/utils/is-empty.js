'use strict';

module.exports = input => {
  if (typeof input !== 'string') {
    throw new TypeError('Input must be a string');
  }

  return input.length === 0;
};
