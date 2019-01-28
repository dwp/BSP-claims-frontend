'use strict';

require('marko/node-require').install();

const test = require('ava');
const nock = require('nock');
const FakeRequest = require('../../helpers/fake-request');
const FakeResponse = require('../../helpers/fake-response');
const {stopClaim} = require('../../../src/pages/stop/functions');
const {API_URL, API_END_POINT_CLAIMS, API_END_POINT_STOP} = require('../../../src/lib/constants');

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
  schedule: {
    scheduleId: '10'
  }
};

const testData = {
  reason: 'prison',
  deathDateDay: '10',
  deathDateMonth: '10',
  deathDateYear: '2018',
  prisonDateDay: '11',
  prisonDateMonth: '11',
  prisonDateYear: '2018'
};

test('should be a function', t => {
  t.is(typeof stopClaim, 'function');
});

test('should stop claim with new data from res.locals if dataPresent is yes', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.params.claimId = 1;
  res.locals.values = {...testData};
  req.claim = claimResponse;

  const revisionRequest = {reason: 'prison', effectiveDate: '2018-11-11', claimId: 1, scheduleId: '10'};

  const mock = nock(API_URL)
    .put(API_END_POINT_CLAIMS + '/' + req.params.claimId + API_END_POINT_STOP, revisionRequest)
    .reply(200);

  await stopClaim(req, res);
  t.true(mock.isDone());
});

test('should redirect to payment schedule', async t => {
  const req = new FakeRequest();
  const res = new FakeResponse(req);

  req.params.claimId = 1;
  res.locals.values = {...testData};
  req.claim = {...claimResponse};

  const revisionRequest = {reason: 'prison', effectiveDate: '2018-11-11', claimId: 1, scheduleId: '10'};

  const mock = nock(API_URL)
    .put(API_END_POINT_CLAIMS + '/' + req.params.claimId + API_END_POINT_STOP, revisionRequest)
    .reply(200);

  await stopClaim(req, res);
  t.is(res.redirectedTo, `/claim/${req.params.claimId}/payment-schedule`);
  t.true(mock.isDone());
});
