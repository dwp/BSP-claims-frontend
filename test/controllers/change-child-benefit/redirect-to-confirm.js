'use strict';

require('marko/node-require').install();
const test = require('ava');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {redirectToConfirm} = require('../../../src/pages/change-child-benefit/functions');

const testData = {
  childrenCHIBinCBOL: 'true',
  childrenCHIB: 'CHB12345678AA'
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
  t.deepEqual(req.session[req.params.claimId].changeChildBenefitNumber.values, testData);
});

test('should redirect to confirm dependent children provide answers', async t => {
  const {req, res} = t.context.setup();

  res.locals.values = testData;

  await redirectToConfirm(req, res);
  t.is(res.redirectedTo, `/claim/${req.params.claimId}/confirm-dependent-children`);
});

test('should add childrenCHIB as false to the values when childrenCHIBinCBOL is false', async t => {
  const {req, res} = t.context.setup();

  res.locals.values = {...testData, childrenCHIBinCBOL: false};

  await redirectToConfirm(req, res);
  t.is(res.redirectedTo, `/claim/${req.params.claimId}/confirm-dependent-children`);
});
