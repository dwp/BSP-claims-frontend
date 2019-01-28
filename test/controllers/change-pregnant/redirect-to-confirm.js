'use strict';

require('marko/node-require').install();
const test = require('ava');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {redirectToConfirm} = require('../../../src/pages/change-pregnant/functions');

const testData = {
  dependentChildren: 'true',
  pregnantAtDateOfDeath: 'false'
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
  t.deepEqual(req.session[req.params.claimId].changeDependentChildren.values, testData);
});

test('should redirect to confirm-payment-details if not pregnant', async t => {
  const {req, res} = t.context.setup();

  res.locals.values = testData;

  await redirectToConfirm(req, res);
  t.is(res.redirectedTo, `/claim/${req.params.claimId}/change-child-benefit`);
});

test('should redirect to change-child-benefit if pregnant', async t => {
  const {req, res} = t.context.setup();

  res.locals.values = {...testData, pregnantAtDateOfDeath: 'true'};

  await redirectToConfirm(req, res);
  t.is(res.redirectedTo, `/claim/${req.params.claimId}/confirm-dependent-children`);
});
