'use strict';

module.exports = function (listOfCharacters) {
  if (listOfCharacters) {
    const uniqueList = [...new Set(listOfCharacters)];
    return '‘' + uniqueList.join('’, ‘') + '’';
  }

  return '';
};
