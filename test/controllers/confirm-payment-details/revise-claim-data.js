'use strict';

require('marko/node-require').install();
const test = require('ava');
const nock = require('nock');
const {API_URL, API_END_POINT_CLAIMS, CHANGE_HISTORY_CHANGE_PAYMENT_DETAILS} = require('../../../src/lib/constants');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {reviseClaimData} = require('../../../src/pages/confirm-payment-details/functions');

const testData = {
  values: {
    accountType: 'UKBank',
    nameOnAccount: 'Will Tester',
    sortCode: '123456',
    accountNumber: '12345678',
    rollNumber: '12'
  }
};

const claimResponse = {
  claimId: 1,
  paymentAccount: {
    accountType: 'UKBank',
    nameOnAccount: '',
    sortCode: '',
    accountNumber: '',
    rollNumber: ''
  }};

const revisionRequest = {
  claimId: 1,
  paymentAccount: {
    accountType: 'UKBank',
    nameOnAccount: 'Will Tester',
    sortCode: '123456',
    accountNumber: '12345678',
    rollNumber: '12'
  },
  changeInfoList: [{
    agentIdentifier: 'KONG_DISABLED',
    agentName: 'Kong Disabled',
    changeDescription: CHANGE_HISTORY_CHANGE_PAYMENT_DETAILS
  }]
};

test('should be a function', t => {
  t.is(typeof reviseClaimData, 'function');
});

test('should revise claim with new data from req.session', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.params.claimId = 1;
  req.session[1] = {
    changePayment: {...testData}
  };
  req.locals = {...testData};
  req.claim = claimResponse;

  const mock = nock(API_URL)
    .put(API_END_POINT_CLAIMS + '/' + req.params.claimId, revisionRequest)
    .reply(200);

  await reviseClaimData(req, res);
  t.true(mock.isDone());
});

test('should redirect to origin if all is correct', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.params.claimId = 1;
  req.session[1] = {
    changePayment: {...testData}
  };
  req.session.changePaymentDetailsOrigin = 'schedule';
  req.claim = {...claimResponse};

  const mock = nock(API_URL)
    .put(API_END_POINT_CLAIMS + '/' + req.params.claimId)
    .reply(200);

  await reviseClaimData(req, res);
  t.is(res.redirectedTo, `/claim/${req.params.claimId}/schedule`);
  t.true(mock.isDone());
});

test('should redirect to change-payment-details if there is no session data', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.params.claimId = 1;

  await reviseClaimData(req, res);
  t.is(res.redirectedTo, `/claim/${req.params.claimId}/change-payment-details`);
});
