'use strict';

module.exports = (...inputs) => {
  if (inputs.length > 0) {
    if (inputs.every(v => v)) {
      return 'complete';
    }

    if (inputs.some(v => v)) {
      return 'not-complete';
    }
  }

  return '';
};
