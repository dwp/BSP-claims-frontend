'use strict';

const test = require('ava');
const GBP = require('../../src/utils/gbp-formater');

test('should return a valid currency string', t => {
  const output = GBP.format('2000');
  t.is(output, '£2,000');
});
