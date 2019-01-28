'use strict';

const test = require('ava');
const isChildBenefitNumber = require('../../src/utils/is-child-benefit-number');

test('should export a function', t => {
  t.is(typeof isChildBenefitNumber, 'function');
});

test('should throw error if input is not a string', t => {
  const error = t.throws(() => isChildBenefitNumber(123), TypeError);
  t.is(error.message, 'input must be a string');
});

test('should return true for a valid Child Benefit number starting with CHB', t => {
  const output = isChildBenefitNumber('12345678AA');
  t.true(output);
});

test('should return false for a Child Benefit number that does not start with CHB', t => {
  const output1 = isChildBenefitNumber('BAD12345678AA');
  const output2 = isChildBenefitNumber('CH12345678AA');
  const output3 = isChildBenefitNumber('9912345678AA');
  t.false(output1);
  t.false(output2);
  t.false(output3);
});

test('should return true for Child Benefit numbers containing 8 numbers', t => {
  t.true(isChildBenefitNumber('CHB00000000AA'));
  t.true(isChildBenefitNumber('CHB11111111AA'));
  t.true(isChildBenefitNumber('CHB22222222AA'));
  t.true(isChildBenefitNumber('CHB33333333AA'));
  t.true(isChildBenefitNumber('CHB44444444AA'));
  t.true(isChildBenefitNumber('CHB55555555AA'));
  t.true(isChildBenefitNumber('CHB66666666AA'));
  t.true(isChildBenefitNumber('CHB77777777AA'));
  t.true(isChildBenefitNumber('CHB99999999AA'));
  t.true(isChildBenefitNumber('CHB12345678AA'));
});

test('should return false for Child Benefit numbers not containing 8 numbers', t => {
  const output = isChildBenefitNumber('CHB1234567AA');
  t.false(output);
});

test('should return true for valid Child Benefit numbers ending with 2 letters', t => {
  t.true(isChildBenefitNumber('CHB12345678AA'));
  t.true(isChildBenefitNumber('CHB12345678BB'));
  t.true(isChildBenefitNumber('CHB12345678CC'));
  t.true(isChildBenefitNumber('CHB12345678DD'));
  t.true(isChildBenefitNumber('CHB12345678EE'));
  t.true(isChildBenefitNumber('CHB12345678FF'));
  t.true(isChildBenefitNumber('CHB12345678GG'));
  t.true(isChildBenefitNumber('CHB12345678HH'));
  t.true(isChildBenefitNumber('CHB12345678II'));
  t.true(isChildBenefitNumber('CHB12345678JJ'));
  t.true(isChildBenefitNumber('CHB12345678KK'));
  t.true(isChildBenefitNumber('CHB12345678LL'));
  t.true(isChildBenefitNumber('CHB12345678MM'));
  t.true(isChildBenefitNumber('CHB12345678NN'));
  t.true(isChildBenefitNumber('CHB12345678OO'));
  t.true(isChildBenefitNumber('CHB12345678PP'));
  t.true(isChildBenefitNumber('CHB12345678QQ'));
  t.true(isChildBenefitNumber('CHB12345678RR'));
  t.true(isChildBenefitNumber('CHB12345678SS'));
  t.true(isChildBenefitNumber('CHB12345678TT'));
  t.true(isChildBenefitNumber('CHB12345678UU'));
  t.true(isChildBenefitNumber('CHB12345678VV'));
  t.true(isChildBenefitNumber('CHB12345678WW'));
  t.true(isChildBenefitNumber('CHB12345678XX'));
  t.true(isChildBenefitNumber('CHB12345678YY'));
  t.true(isChildBenefitNumber('CHB12345678ZZ'));
  t.true(isChildBenefitNumber('CHB12345678AB'));
});

test('should return false for Child Benefit numbers not ending with 2 letters', t => {
  t.false(isChildBenefitNumber('CHB1234567AAA'));
  t.false(isChildBenefitNumber('CHB1234567A'));
  t.false(isChildBenefitNumber('CHB1234567'));
});

test('should return false for an Child Benefit numbers which are not uppercase', t => {
  const output = isChildBenefitNumber('chb1234578a');
  t.false(output);
});
