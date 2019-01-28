'use strict';

const validNameFormat = /^[A-Za-z'\-. ]{1,35}$/;

module.exports = name => {
  if (typeof name !== 'string') {
    throw new TypeError('Name must be a string');
  }

  return validNameFormat.test(name);
};
