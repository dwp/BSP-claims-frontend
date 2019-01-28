'use strict';

require('marko/node-require').install();

const nock = require('nock');
const test = require('ava');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {disallowClaim} = require('../../../src/pages/disallow-death-evidence/functions');
const {
  API_URL,
  API_END_POINT_CLAIMS,
  CHANGE_HISTORY_DISALLOW_DEATH_EVIDENCE,
  DISALLOW_DEATH_EVIDENCE,
  CHANGE_HISTORY_DEATH_NOT_VERIFIED
} = require('../../../src/lib/constants');

const claimResponse = {
  claimId: 1,
  claimantId: 1,
  dateOfClaim: '2018-01-09',
  claimantDetails: {
    title: 'Mr',
    fullName: 'Hammond Eggs',
    dateOfBirth: '1960-02-03',
    sex: 'Male'
  }
};

const reviseRequest = {
  ...claimResponse,
  decision: {
    allow: false,
    decisionCriteriaList: [{
      criteria: 'death',
      reason: DISALLOW_DEATH_EVIDENCE
    }]
  },
  changeInfoList: [
    {
      agentIdentifier: 'KONG_DISABLED',
      agentName: 'Kong Disabled',
      changeDescription: CHANGE_HISTORY_DEATH_NOT_VERIFIED
    },
    {
      agentIdentifier: 'KONG_DISABLED',
      agentName: 'Kong Disabled',
      changeDescription: CHANGE_HISTORY_DISALLOW_DEATH_EVIDENCE
    }
  ]
};

test('should export a function', t => {
  t.is(typeof disallowClaim, 'function');
});

test('should revise claim with disallowanceReason', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.params.claimId = 1;
  req.session[1] = {deathVerification: claimResponse};

  const mock = nock(API_URL)
    .put(API_END_POINT_CLAIMS + '/' + req.params.claimId, reviseRequest)
    .reply(200);

  await disallowClaim(req, res);
  t.true(mock.isDone());
});

test('should redirect to claim decision page /claim/:claimId/decision', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.params.claimId = 1;
  req.session[1] = {deathVerification: claimResponse};

  const mock = nock(API_URL)
    .put(API_END_POINT_CLAIMS + '/' + req.params.claimId, reviseRequest)
    .reply(200);

  await disallowClaim(req, res);
  t.true(mock.isDone());
  t.is(res.redirectedTo, `/claim/${req.params.claimId}/decision`);
});
