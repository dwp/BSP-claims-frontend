'use strict';

const formatting = /[ -]/g;

module.exports = function (input) {
  return input.replace(formatting, '');
};
