'use strict';

require('marko/node-require').install();

const test = require('ava');
const nock = require('nock');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {disallowClaim} = require('../../../src/pages/disallow-ni-conts/functions');
const {
  API_URL,
  API_END_POINT_CLAIMS,
  CHANGE_HISTORY_NICONTS_NOT_VERIFIED,
  DISALLOW_NI_CONTS,
  CHANGE_HISTORY_NICONTS_VERIFIED
} = require('../../../src/lib/constants');

const claimResponse = {
  claimId: 1,
  claimantId: 1,
  dateOfClaim: '2018-01-09',
  claimantDetails: {
    title: 'Mr',
    fullName: 'Motor Vater',
    dateOfBirth: '1960-02-03',
    sex: 'Male'
  }
};

const reviseRequest = {
  ...claimResponse,
  decision: {
    allow: false,
    decisionCriteriaList: [{
      criteria: 'niConts',
      reason: DISALLOW_NI_CONTS
    }]
  },
  changeInfoList: [
    {
      agentIdentifier: 'KONG_DISABLED',
      agentName: 'Kong Disabled',
      changeDescription: CHANGE_HISTORY_NICONTS_VERIFIED
    },
    {
      agentIdentifier: 'KONG_DISABLED',
      agentName: 'Kong Disabled',
      changeDescription: CHANGE_HISTORY_NICONTS_NOT_VERIFIED
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

test('should be a funciton', t => {
  t.is(typeof disallowClaim, 'function');
});

test('should revise claim with dissallowance reason', async t => {
  const {req, res} = t.context.setup();

  req.claim = claimResponse;

  const mock = nock(API_URL)
    .put(API_END_POINT_CLAIMS + '/' + req.params.claimId, reviseRequest)
    .reply(200);

  await disallowClaim(req, res);
  t.true(mock.isDone());
});
