'use strict';

module.exports = (year, month, day) => `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
