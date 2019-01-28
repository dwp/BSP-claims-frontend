'use strict';

require('marko/node-require').install();
const test = require('ava');
const nock = require('nock');
const {API_URL, API_END_POINT_CLAIMS,
  CHANGE_HISTORY_ADD_PAYMENT_DETAILS, CHANGE_HISTORY_NO_PAYMENT_DETAILS} = require('../../../src/lib/constants');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {reviseClaimData} = require('../../../src/pages/payment-details/functions');

const testData = {
  detailsPresent: 'yes',
  accountType: 'UKBank',
  nameOnAccount: 'Will Tester',
  sortCode: '123456',
  accountNumber: '12345678',
  rollNumber: '12'
};

const claimResponse = {
  claimId: 1,
  paymentAccount: {
    accountType: 'UKBank',
    nameOnAccount: '',
    sortCode: '',
    accountNumber: '',
    rollNumber: ''
  }
};

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
    changeDescription: CHANGE_HISTORY_ADD_PAYMENT_DETAILS
  }]
};

test('should be a function', t => {
  t.is(typeof reviseClaimData, 'function');
});

test('should revise claim with new data from res.locals if dataPresent is yes', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.params.claimId = 1;
  res.locals.values = {...testData};
  req.claim = claimResponse;

  const mock = nock(API_URL)
    .put(API_END_POINT_CLAIMS + '/' + req.params.claimId, revisionRequest)
    .reply(200);

  await reviseClaimData(req, res);
  t.true(mock.isDone());
});

test('should revise claim to remove data if data present is no', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.params.claimId = 1;
  res.locals.values = {...testData, detailsPresent: 'no'};
  req.claim = claimResponse;
  const revisionRequestNo = {
    claimId: 1,
    paymentAccount: null,
    changeInfoList: [{
      agentIdentifier: 'KONG_DISABLED',
      agentName: 'Kong Disabled',
      changeDescription: CHANGE_HISTORY_NO_PAYMENT_DETAILS
    }]
  };

  const mock = nock(API_URL)
    .put(API_END_POINT_CLAIMS + '/' + req.params.claimId, revisionRequestNo)
    .reply(200);

  await reviseClaimData(req, res);
  t.true(mock.isDone());
});

test('should redirect to tasks-to-complete', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.params.claimId = 1;
  res.locals.values = {...testData};
  req.claim = {...claimResponse};

  const mock = nock(API_URL)
    .put(API_END_POINT_CLAIMS + '/' + req.params.claimId)
    .reply(200);

  await reviseClaimData(req, res);
  t.is(res.redirectedTo, `/claim/${req.params.claimId}/tasks-to-complete`);
  t.true(mock.isDone());
});

test('should throw an error if detailPresent is not yes or no', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.params.claimId = 1;
  res.locals.values = {...testData, detailsPresent: 'maybe'};
  req.claim = {...claimResponse};

  const mock = nock(API_URL)
    .put(API_END_POINT_CLAIMS + '/' + req.params.claimId)
    .reply(200);

  const error = await t.throwsAsync(reviseClaimData(req, res));
  t.is(error.message, 'invalid detailsPresent values sent to payment details controller');
  t.false(mock.isDone());
});
