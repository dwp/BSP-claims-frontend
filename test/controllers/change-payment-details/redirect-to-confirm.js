'use strict';

require('marko/node-require').install();
const test = require('ava');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {redirectToConfirm} = require('../../../src/pages/change-payment-details/functions');

const testData = {
  accountType: 'UKBank',
  nameOnAccount: 'Will Tester',
  sortCode: '123456',
  accountNumber: '12345678',
  rollNumber: '12'
};

test.beforeEach(t => {
  t.context.setup = () => {
    const req = new FakeRequest();
    req.params.claimId = 1;
    req.session[req.params.claimId] = req.session[req.params.claimId] || {};
    return {
      req,
      res: new FakeResponse(req)
    };
  };
});

test('should be a function', t => {
  t.is(typeof redirectToConfirm, 'function');
});

test('should revise claim with new data to req.session', async t => {
  const {req, res} = t.context.setup();

  res.locals.values = testData;

  await redirectToConfirm(req, res);
  t.deepEqual(req.session[1].changePayment.values, testData);
});

test('should redirect to confirm-payment-details', async t => {
  const {req, res} = t.context.setup();

  res.locals.values = testData;

  await redirectToConfirm(req, res);
  t.is(res.redirectedTo, `/claim/${req.params.claimId}/confirm-payment-details`);
});
