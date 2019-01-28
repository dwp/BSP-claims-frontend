'use strict';

const GBP = new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
  style: 'currency',
  currency: 'GBP'
});

module.exports = GBP;
