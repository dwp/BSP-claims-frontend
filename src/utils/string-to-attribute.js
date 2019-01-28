'use strict';

const allSpaces = / +/g;

module.exports = name => {
  return String(name).trim().toLowerCase().replace(allSpaces, '-');
};
