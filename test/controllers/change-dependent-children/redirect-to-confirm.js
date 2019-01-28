'use strict';

require('marko/node-require').install();
const test = require('ava');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {redirectToConfirm} = require('../../../src/pages/change-dependent-children/functions');

const testData = {
  dependentChildren: 'true',
  pregnantAtDateOfDeath: 'true'
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

test('should redirect to confirm-payment-details if they say pregnant', async t => {
  const {req, res} = t.context.setup();

  res.locals.values = testData;

  await redirectToConfirm(req, res);
  t.is(res.redirectedTo, `/claim/${req.params.claimId}/confirm-dependent-children`);
});

test('should redirect to enter CHIB if they say they have dependent children but not Pregnant', async t => {
  const {req, res} = t.context.setup();

  res.locals.values = {
    dependentChildren: 'true',
    pregnantAtDateOfDeath: 'false'
  };

  await redirectToConfirm(req, res);
  t.is(res.redirectedTo, `/claim/${req.params.claimId}/change-child-benefit`);
});
