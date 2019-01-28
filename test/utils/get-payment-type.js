'use strict';

const test = require('ava');
const getPaymentType = require('../../src/utils/get-payment-type');

test('should export a function', t => {
  t.is(typeof getPaymentType, 'function');
});

test('should BackdatedInitialUprating if its uprated initial backdated', t => {
  const result = getPaymentType({description: 'UpratedInitialBackdating'});
  t.is(result, 'BackdatedInitialUprating');
});

test('should BackdatedInitialUprating if its uprated monthly backdating', t => {
  const result = getPaymentType({description: 'UpratedMonthlyBackdating'});
  t.is(result, 'BackdatedMonthlyUprating');
});

test('should return the description if it has anything else', t => {
  const result = getPaymentType({description: 'Something else'});
  t.is(result, 'Something else');
});

test('should return the StandardInitial if the benefit codes match the initial', t => {
  const result = getPaymentType({benefitCode: '73130'});
  t.is(result, 'StandardInitial');
});

test('should return the StandardMonthly if the benefit codes match the Monthly', t => {
  const result = getPaymentType({
    paymentType: 'Irregular',
    benefitCode: '73132'
  });
  t.is(result, 'StandardMonthly');
});
