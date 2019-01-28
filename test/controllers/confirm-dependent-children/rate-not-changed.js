'use strict';

require('marko/node-require').install();
const test = require('ava');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {rateNotChanged} = require('../../../src/pages/confirm-dependent-children/functions');

const testData = {
  claimId: 1,
  values: {
    dependentChildren: 'true',
    pregnantAtDateOfDeath: 'false',
    childrenCHIBinCBOL: 'true',
    childrenCHIB: 'AB12345678AB'
  }
};

const claimResponse = {
  claimId: 1,
  eligibilityCriteria: {
    dependentChildren: 'true',
    pregnantAtDateOfDeath: 'false'
  },
  paymentAccount: {
    accountType: 'UKBank',
    nameOnAccount: '',
    sortCode: '',
    accountNumber: '',
    rollNumber: ''
  }};

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
  t.is(typeof rateNotChanged, 'function');
});

test('should redirect to payment schedule', t => {
  const {req, res} = t.context.setup();

  req.claim = claimResponse;

  rateNotChanged(req, res);
  t.notDeepEqual(req.session[req.params.claimId], undefined);

  req.session[req.params.claimId] = {
    changeDependentChildren: {...testData}
  };

  t.deepEqual(req.session[req.params.claimId], {changeDependentChildren: {...testData}});
  t.is(res.redirectedTo, '/claim/1/payment-schedule');
});
