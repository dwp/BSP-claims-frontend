'use strict';

require('marko/node-require').install();

const nock = require('nock');
const test = require('ava');
const {API_URL, API_END_POINT_CLAIMS, API_END_POINT_CLAIMANTS, CHANGE_HISTORY_CLAIM_DETAILS_CONFIRMED, CHANGE_HISTORY_DISALLOWED_SPA, DISALLOW_SPA, CHANGE_HISTORY_NEW_CLAIM} = require('../../../src/lib/constants');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {disallowClaim} = require('../../../src/pages/disallow-pension-age/functions');

const testData = {
  title: 'Mr',
  fullName: 'Hammond Eggs',
  nino: 'QQ123123A',
  dateOfBirthDay: '11',
  dateOfBirthMonth: '11',
  dateOfBirthYear: '1985',
  sex: 'Male',
  partnerTitle: 'Mr',
  partnerFullName: 'Bacon N. Eggs',
  partnerNino: 'QQ111111A',
  dateOfDeathDay: '07',
  dateOfDeathMonth: '07',
  dateOfDeathYear: '2017',
  dateOfClaimDay: '12',
  dateOfClaimMonth: '12',
  dateOfClaimYear: '2017'
};

const claimantRequest = {
  nino: testData.nino
};

const claimantResponse = {
  claimantId: 1,
  created: '2018-01-30T09:00:00.000Z',
  nino: testData.nino
};

const claimRequest = {
  claimantId: 1,
  dateOfClaim: '2017-12-12',
  claimantDetails: {
    title: testData.title,
    fullName: testData.fullName,
    sex: testData.sex,
    dateOfBirth: '1985-11-11'
  },
  partnerDetails: {
    title: testData.partnerTitle,
    fullName: testData.partnerFullName,
    nino: testData.partnerNino,
    dateOfDeath: '2017-07-07'
  },
  changeInfoList: [{
    agentIdentifier: 'KONG_DISABLED',
    agentName: 'Kong Disabled',
    changeDescription: CHANGE_HISTORY_NEW_CLAIM
  }]
};

const claimResponse = {
  claimId: 1,
  claimantId: 1,
  dateOfClaim: '2017-12-12',
  claimantDetails: {
    title: testData.title,
    fullName: testData.fullName,
    sex: testData.sex,
    dateOfBirth: '1985-11-11'
  },
  partnerDetails: {
    title: testData.partnerTitle,
    fullName: testData.partnerFullName,
    nino: testData.partnerNino,
    dateOfDeath: '2017-07-07'
  },
  changeInfoList: [{
    agentIdentifier: 'KONG_DISABLED',
    agentName: 'Kong Disabled',
    changeDescription: CHANGE_HISTORY_NEW_CLAIM
  }]
};

const reviseRequest = {
  ...claimResponse,
  decision: {
    allow: false,
    decisionCriteriaList: [{
      criteria: 'dateOfBirth',
      reason: DISALLOW_SPA
    }]
  },
  changeInfoList: [
    {
      agentIdentifier: 'KONG_DISABLED',
      agentName: 'Kong Disabled',
      changeDescription: CHANGE_HISTORY_CLAIM_DETAILS_CONFIRMED
    },
    {
      agentIdentifier: 'KONG_DISABLED',
      agentName: 'Kong Disabled',
      changeDescription: CHANGE_HISTORY_DISALLOWED_SPA
    }
  ]
};

test('should export a function', t => {
  t.is(typeof disallowClaim, 'function');
});

test('should revise claim with disallowanceReason', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.session = {startNewClaim: {values: testData}};

  const mock = nock(API_URL)
    .post(API_END_POINT_CLAIMANTS, claimantRequest)
    .reply(200, claimantResponse)
    .post(API_END_POINT_CLAIMS, claimRequest)
    .reply(200, claimResponse)
    .put(API_END_POINT_CLAIMS + '/1', reviseRequest)
    .reply(200);

  await disallowClaim(req, res);
  t.true(mock.isDone());
});

test('should redirect to claim decision page /claim/:claimId/decision', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.session = {startNewClaim: {values: testData}};

  const mock = nock(API_URL)
    .post(API_END_POINT_CLAIMANTS, claimantRequest)
    .reply(200, claimantResponse)
    .post(API_END_POINT_CLAIMS, claimRequest)
    .reply(200, claimResponse)
    .put(API_END_POINT_CLAIMS + '/1', reviseRequest)
    .reply(200);

  await disallowClaim(req, res);
  t.true(mock.isDone());
  t.is(res.redirectedTo, '/claim/1/decision');
});
