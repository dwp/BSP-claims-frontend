'use strict';

const spaces = /\s+/g;

module.exports = input => {
  if (typeof input !== 'string') {
    throw new TypeError('input must be string');
  }

  return input.replace(spaces, '').toUpperCase();
};
