'use strict';

require('marko/node-require').install();

const nock = require('nock');
const test = require('ava');
const {API_URL, API_END_POINT_CLAIMS, CHANGE_HISTORY_DISALLOW_REL, DISALLOW_REL, CHANGE_HISTORY_REL_VERIFIED} = require('../../../src/lib/constants');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {disallowClaim} = require('../../../src/pages/disallow-relationship/functions');

const claimResponse = {
  claimId: 1,
  claimantId: 1,
  dateOfClaim: '2018-01-09',
  claimantDetails: {
    title: 'Mr',
    fullName: 'Hammond Eggs',
    dateOfBirth: '1960-02-03',
    sex: 'Male'
  },
  partnerDetails: {
    title: 'Ms',
    fullName: 'Bacon N. Eggs',
    dateOfDeath: '2017-12-12'
  }
};

const reviseRequest = {
  ...claimResponse,
  decision: {
    allow: false,
    decisionCriteriaList: [{
      criteria: 'marriage',
      reason: DISALLOW_REL
    }]
  },
  changeInfoList: [

    {
      agentIdentifier: 'KONG_DISABLED',
      agentName: 'Kong Disabled',
      changeDescription: CHANGE_HISTORY_REL_VERIFIED
    },
    {
      agentIdentifier: 'KONG_DISABLED',
      agentName: 'Kong Disabled',
      changeDescription: CHANGE_HISTORY_DISALLOW_REL
    }
  ]
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

test('should export a function', t => {
  t.is(typeof disallowClaim, 'function');
});

test('should revise claim with disallowanceReason', async t => {
  const {req, res} = t.context.setup();

  req.claim = claimResponse;

  const mock = nock(API_URL)
    .put(API_END_POINT_CLAIMS + '/' + req.params.claimId, reviseRequest)
    .reply(200);

  await disallowClaim(req, res);
  t.true(mock.isDone());
});

test('should redirect to claim decision page /claim/:claimId/decision', async t => {
  const {req, res} = t.context.setup();

  req.claim = claimResponse;

  const mock = nock(API_URL)
    .put(API_END_POINT_CLAIMS + '/' + req.params.claimId, reviseRequest)
    .reply(200);

  await disallowClaim(req, res);
  t.true(mock.isDone());
  t.is(res.redirectedTo, `/claim/${req.params.claimId}/decision`);
});
