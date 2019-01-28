'use strict';

module.exports = (log, ...match) => {
  if (match.length === 0) {
    return false;
  }

  return log.some(item => match.indexOf(item.changeDescription) > -1);
};
