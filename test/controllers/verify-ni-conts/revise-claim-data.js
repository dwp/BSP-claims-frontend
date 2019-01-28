'use strict';

require('marko/node-require').install();

const test = require('ava');
const nock = require('nock');
const {
  API_URL, API_END_POINT_CLAIMS,
  CHANGE_HISTORY_NICONTS_VERIFIED
} = require('../../../src/lib/constants');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {reviseClaimData} = require('../../../src/pages/verify-ni-conts/functions');

const testData = {
  claimId: 1,
  sufficientNIContributions: 'true',
  niContsYear: '2017'
};

const claimResponse = {
  claimId: 1,
  claimantId: 1,
  title: 'Mrs',
  fullName: 'Testing Tester',
  dateOfBirth: '1986-03-02',
  sex: 'Female',
  dateOfClaim: '2018-06-01'
};

const revisionRequest = {
  ...claimResponse,
  eligibilityCriteria: {sufficientNIContributions: 'true'},
  verificationList: [
    {
      category: 'niConts',
      verificationAttributeList: [
        {
          attributeName: 'year',
          attributeValue: '2017'
        }
      ]
    }
  ],
  changeInfoList: [{
    agentIdentifier: 'KONG_DISABLED',
    agentName: 'Kong Disabled',
    changeDescription: CHANGE_HISTORY_NICONTS_VERIFIED
  }]
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
  t.is(typeof reviseClaimData, 'function');
});

test('should revise claim with new verifications from res.locals if sufficientNIContributions is true', async t => {
  const {req, res} = t.context.setup();

  res.locals.values = testData;
  req.claim = claimResponse;

  const mock = nock(API_URL)
    .put(API_END_POINT_CLAIMS + '/' + req.params.claimId, revisionRequest)
    .reply(200);

  await reviseClaimData(req, res);
  t.true(mock.isDone());
});

test('should revise claim without verification if sufficientNIContributions is false', async t => {
  const {req, res} = t.context.setup();

  res.locals.values = {sufficientNIContributions: 'false'};

  const revisionWithFalse = {
    ...claimResponse,
    eligibilityCriteria: {sufficientNIContributions: 'false'}
  };
  req.claim = claimResponse;

  await reviseClaimData(req, res);
  t.deepEqual(revisionWithFalse, req.session[1].verifyNiConts);
  t.is(res.redirectedTo, `/claim/${req.params.claimId}/verify-national-insurance/disallow-claim`);
});

test('should redirect to tasks-to-complete if sufficientNIContributions is true', async t => {
  const {req, res} = t.context.setup();

  res.locals.values = {...testData, sufficientNIContributions: 'true'};
  req.claim = claimResponse;

  const mock = nock(API_URL)
    .put(API_END_POINT_CLAIMS + '/' + req.params.claimId)
    .reply(200);

  await reviseClaimData(req, res);
  t.is(res.redirectedTo, `/claim/${req.params.claimId}/tasks-to-complete`);
  t.true(mock.isDone());
});
