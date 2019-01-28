'use strict';

require('marko/node-require').install();

const test = require('ava');
const nock = require('nock');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {API_URL, CHANGE_HISTORY_NEW_CLAIM, API_END_POINT_CLAIMS, API_END_POINT_CLAIMANTS} = require('../../../src/lib/constants');
const {setupClaim} = require('../../../src/pages/start-new-claim/functions');

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
  nino: testData.nino,
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
    created: '2018-01-30T09:00:00.000Z',
    agentIdentifier: 'KONG_DISABLED',
    agentName: 'Kong Disabled',
    changeDescription: CHANGE_HISTORY_NEW_CLAIM
  }]
};

test('should be a function', t => {
  t.is(typeof setupClaim, 'function');
});

test('should set up a claimant and a claim using the data from res.locals.values', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  res.locals.values = testData;

  const mock = nock(API_URL)
    .post(API_END_POINT_CLAIMANTS, claimantRequest)
    .reply(200, claimantResponse)
    .post(API_END_POINT_CLAIMS, claimRequest)
    .reply(200, claimResponse);

  await setupClaim(req, res);
  t.true(mock.isDone());
});

test('should redirect to /claim/:claimId/tasks-to-complete if no verification errors', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  res.locals.values = testData;

  const mock = nock(API_URL)
    .post(API_END_POINT_CLAIMANTS, claimantRequest)
    .reply(200, claimantResponse)
    .post(API_END_POINT_CLAIMS, claimRequest)
    .reply(200, claimResponse);

  await setupClaim(req, res);
  t.is(res.redirectedTo, '/claim/1/tasks-to-complete');
  t.true(mock.isDone());
});
